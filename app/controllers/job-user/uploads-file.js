import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import sequelize from '../../services/db.js';
import JobSeekerDetail from '../../models/JobSeekerDetails.js';
import Joi from 'joi';

dotenv.config();

// Create uploads directory if it doesn't exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
 fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
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

const uploadResumeController = {
 uploadResume: async (req, res) => {
  upload.single('resume')(req, res, async function (err) {
   if (err) {
    if (err instanceof multer.MulterError) {
     return res
      .status(400)
      .json({ message: `File upload error: ${err.message}` });
    } else {
     return res.status(400).json({ message: err.message });
    }
   }

   if (!req.file) {
    return res.status(400).json({ message: 'Please upload a resume file' });
   }

   const userId = req.user.id;

   try {
    await sequelize.transaction(async (t) => {
     // Find the user's JobSeekerDetail
     let jobSeekerDetail = await JobSeekerDetail.findOne({
      where: { userId },
      transaction: t,
     });

     if (!jobSeekerDetail) {
      throw new Error('JobSeekerDetail not found for this user');
     }

     // Update the resumePath in JobSeekerDetail
     await jobSeekerDetail.update(
      {
       resumePath: req.file.path,
       resumeFilename: req.file.originalname,
      },
      { transaction: t }
     );
    });

    res.status(201).json({
     message: 'Resume uploaded successfully',
     filename: req.file.originalname,
    });
   } catch (error) {
    console.error('Error uploading resume:', error);
    // Delete the uploaded file if the database update fails
    if (req.file && req.file.path) {
     fs.unlinkSync(req.file.path);
    }

    if (error.message === 'JobSeekerDetail not found for this user') {
     return res.status(404).json({ message: error.message });
    }

    res.status(500).json({
     message: 'Error uploading resume',
     error: error.message,
    });
   }
  });
 },

 uploadAdditionalFile: async (req, res) => {
  upload.single('additionalFile')(req, res, async function (err) {
   if (err) {
    if (err instanceof multer.MulterError) {
     return res
      .status(400)
      .json({ message: `File upload error: ${err.message}` });
    } else {
     return res.status(400).json({ message: err.message });
    }
   }

   if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
   }

   const userId = req.user.id;

   try {
    await sequelize.transaction(async (t) => {
     let jobSeekerDetail = await JobSeekerDetail.findOne({
      where: { userId },
      transaction: t,
     });

     if (!jobSeekerDetail) {
      throw new Error('JobSeekerDetail not found for this user');
     }

     await jobSeekerDetail.update(
      {
       additionalFilePath: req.file.path,
       additionalFilename: req.file.originalname,
      },
      { transaction: t }
     );
    });

    res.status(201).json({
     message: 'Additional file uploaded successfully',
     filename: req.file.originalname,
    });
   } catch (error) {
    console.error('Error uploading additional file:', error);
    if (req.file && req.file.path) {
     fs.unlinkSync(req.file.path);
    }

    if (error.message === 'JobSeekerDetail not found for this user') {
     return res.status(404).json({ message: error.message });
    }

    res.status(500).json({
     message: 'Error uploading additional file',
     error: error.message,
    });
   }
  });
 },
};

export default uploadResumeController;
