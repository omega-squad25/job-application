import SavedJob from '../../models/SavedJobs.js';
import Job from '../../models/Job.js';
import Joi from 'joi';

const saveJobSchema = Joi.object({
 jobId: Joi.string().uuid().required(),
});

const SavedJobsController = {
 saveJob: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  const { error, value } = saveJobSchema.validate(req.body);
  if (error) {
   return res.status(400).json({ message: error.details[0].message });
  }

  const { jobId } = value;
  const userId = req.user.id;

  try {
   // Check if job exists
   const job = await Job.findByPk(jobId);
   if (!job) {
    return res.status(404).json({ message: 'Job not found' });
   }

   // Check if already saved
   const existingSave = await SavedJob.findOne({
    where: { userId, jobId },
   });

   if (existingSave) {
    return res.status(400).json({ message: 'Job already saved' });
   }

   // Save the job
   const savedJob = await SavedJob.create({
    userId,
    jobId,
   });

   return res.status(201).json({
    message: 'Job saved successfully',
    savedJob,
   });
  } catch (error) {
   console.error('Error saving job:', error);
   return res.status(500).json({ message: 'Internal server error' });
  }
 },

 getSavedJobs: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
   const savedJobs = await SavedJob.findAll({
    attributes: ['jobId', ['createdAt', 'savedAt']],
    where: { userId: req.user.id },
    include: [
     {
      model: Job,
      attributes: [
       'title',
       'description',
       'location',
       'company',
       ['approvedAt', 'postedAt'],
      ],
     },
    ],
    order: [['createdAt', 'DESC']],
   });

   return res.status(200).json({
    savedJobs: savedJobs,
    count: savedJobs.length,
   });
  } catch (error) {
   console.error('Error fetching saved jobs:', error);
   return res.status(500).json({ message: 'Internal server error' });
  }
 },

 toggleSaveJob: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  const jobId = req.params.jobId;
  const userId = req.user.id;

  try {
   // Check if job exists
   const job = await Job.findByPk(jobId);
   if (!job) {
    return res.status(404).json({ message: 'Job not found' });
   }

   const existingSave = await SavedJob.findOne({
    where: { userId, jobId },
   });

   if (!existingSave) {
    // Save the job
    const savedJob = await SavedJob.create({
     userId,
     jobId,
    });

    return res.status(201).json({
     message: 'Job saved successfully',
     savedJob,
    });
   } else {
    // Remove the saved job
    await existingSave.destroy();
    return res.status(200).json({
     message: 'Job removed from saved jobs',
    });
   }
  } catch (error) {
   console.error('Error toggling saved job:', error);
   return res.status(500).json({ message: 'Internal server error' });
  }
 },
};

export default SavedJobsController;
