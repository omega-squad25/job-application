import dotenv from 'dotenv';
import sequelize from '../../services/db.js';
import JobSeekerDetail from '../../models/JobSeekerDetails.js';
import JobApplication from '../../models/JobApplications.js';
import Profile from '../../models/Profile.js';
import Joi from 'joi';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

dotenv.config();

// Create uploads directory if it doesn't exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
 fs.mkdirSync(uploadsDir, { recursive: true });
}

// multer storage config
const storage = multer.diskStorage({
 destination: function (req, file, cb) {
  cb(null, uploadsDir);
 },
 filename: function (req, file, cb) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname);
  cb(null, `${req.user.id}-${uniqueSuffix}${ext}`);
 },
});

// File filter for PDF files
const fileFilter = (req, file, cb) => {
 if (file.mimetype === 'application/pdf') {
  cb(null, true);
 } else {
  cb(new Error('Only PDF files are allowed'), false);
 }
};

const upload = multer({
 storage: storage,
 fileFilter: fileFilter,
 limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const uploadFiles = upload.fields([
 { name: 'resume', maxCount: 1 },
 { name: 'additionalFile', maxCount: 1 },
]);

const applicationSchema = Joi.object({
 firstName: Joi.string().max(50).required(),
 lastName: Joi.string().max(50).required(),
 email: Joi.string().email().required(),
 phone: Joi.string().max(20).required(),
 coverLetter: Joi.string().allow('', null),
 isAgreeToPrivacyPolicy: Joi.boolean().required(),
 contactForFutureOpportunities: Joi.boolean().default(false).optional(),
});

const applicationSubmissionController = {
 submitApplication: async (req, res) => {
  uploadFiles(req, res, async (err) => {
   if (err) {
    if (err instanceof multer.MulterError) {
     return res
      .status(400)
      .json({ message: `File upload error: ${err.message}` });
    } else {
     return res.status(400).json({ message: err.message });
    }
   }

   if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
   }

   // Check if resume file was uploaded
   if (!req.files || !req.files.resume || !req.files.resume[0]) {
    return res
     .status(400)
     .json({ message: 'A resume is required to apply for this job' });
   }

   const resumeFile = req.files.resume[0];
   const additionalFile = req.files.additionalFile
    ? req.files.additionalFile[0]
    : null;

   const { error, value } = applicationSchema.validate(req.body);
   const { jobId } = req.params;
   if (error) {
    // Delete uploaded files on validation error
    if (resumeFile && resumeFile.path) fs.unlinkSync(resumeFile.path);
    if (additionalFile && additionalFile.path)
     fs.unlinkSync(additionalFile.path);

    return res.status(400).json({ message: error.details[0].message });
   }

   const {
    firstName,
    lastName,
    email,
    phone,
    coverLetter,
    isAgreeToPrivacyPolicy,
    contactForFutureOpportunities,
   } = value;

   const userId = req.user.id;

   try {
    await sequelize.transaction(async (t) => {
     // Find or create the JobSeekerDetail
     let jobSeekerDetail = await JobSeekerDetail.findOne({
      where: { userId },
      transaction: t,
     });

     //get profileId from the user
     const profile = await Profile.findOne({
      where: { userId },
      transaction: t,
     });
     if (!profile) {
      throw new Error('Profile not found for this user');
     }
     const profileId = profile.id;

     // If JobSeekerDetail doesn't exist, create it
     if (!jobSeekerDetail) {
      jobSeekerDetail = await JobSeekerDetail.create(
       {
        userId,
        profileId,
        fullName: `${firstName} ${lastName}`,
        phone,
        coverLetter,
        resumePath: resumeFile.path,
        resumeFilename: resumeFile.originalname,
        additionalFilePath: additionalFile ? additionalFile.path : null,
        additionalFilename: additionalFile ? additionalFile.originalname : null,
       },
       { transaction: t }
      );
     } else {
      // Update the existing JobSeekerDetail
      await jobSeekerDetail.update(
       {
        fullName: `${firstName} ${lastName}`,
        phone,
        coverLetter,
        resumePath: resumeFile.path,
        resumeFilename: resumeFile.originalname,
        additionalFilePath: additionalFile ? additionalFile.path : null,
        additionalFilename: additionalFile ? additionalFile.originalname : null,
       },
       { transaction: t }
      );
     }

     // Create the job application
     await JobApplication.create(
      {
       userId,
       jobId,
       jobSeekerDetailId: jobSeekerDetail.id,
       resumePath: resumeFile.path,
       resumeFilename: resumeFile.originalname,
       additionalFilePath: additionalFile ? additionalFile.path : null,
       additionalFilename: additionalFile ? additionalFile.originalname : null,
       coverLetter,
       isAgreeToPrivacyPolicy: isAgreeToPrivacyPolicy,
       contactForFutureOpportunities: contactForFutureOpportunities || false,
       status: 'submitted',
       submittedAt: new Date(),
      },
      { transaction: t }
     );
    });

    res.status(201).json({
     message: 'Application submitted successfully',
    });
   } catch (error) {
    console.error('Error submitting application:', error);

    // Delete uploaded files on error
    if (resumeFile && resumeFile.path) fs.unlinkSync(resumeFile.path);
    if (additionalFile && additionalFile.path)
     fs.unlinkSync(additionalFile.path);

    if (error.message === 'Profile not found for this user') {
     return res.status(404).json({ message: error.message });
    }

    res.status(500).json({
     message: 'Error submitting application',
     error: error.message,
    });
   }
  });
 },
};

export default applicationSubmissionController;
