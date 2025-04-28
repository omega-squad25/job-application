import dotenv from 'dotenv';
import sequelize from '../../services/db.js';
import Job from '../../models/Job.js';
dotenv.config();
import Joi from 'joi';

const statusSchema = Joi.object({
 status: Joi.string().valid('approved').required(),
});

const jobDetailsSchema = Joi.object({
 title: Joi.string().optional(),
 description: Joi.string().optional(),
 company: Joi.string().optional(),
 location: Joi.string().optional(),
}).min(1);

const updateJobController = {
 updateJobStatus: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  // Check if the user has the admin role
  if (req.user.role !== 'admin') {
   return res.status(403).json({ message: 'Admin access required' });
  }

  // Validate request body
  const { error, value } = statusSchema.validate(req.body);
  if (error) {
   return res.status(400).json({ message: error.details[0].message });
  }

  const { id } = req.params;

  const { status } = value;

  try {
   let job;

   await sequelize.transaction(async (t) => {
    job = await Job.findByPk(id, { transaction: t });

    if (!job) {
     throw new Error('Job does not exist.');
    }
    job.status = status;
    job.approvedAt = new Date();
    await job.save({ transaction: t });
   });

   res.status(201).json({
    message: 'Job status updated successfully',
    job,
   });
  } catch (error) {
   console.error(error);
   res
    .status(500)
    .json({ message: 'Error updating job', error: error.message });
  }
 },

 editJobDetails: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  // Check if the user has the admin role
  if (req.user.role !== 'admin') {
   return res.status(403).json({ message: 'Admin access required' });
  }

  // Validate request body
  const { error, value } = jobDetailsSchema.validate(req.body);
  if (error) {
   return res.status(400).json({ message: error.details[0].message });
  }

  const { id } = req.params;

  const { title, location, description, company } = value;
  try {
   let job;

   await sequelize.transaction(async (t) => {
    job = await Job.findByPk(id, { transaction: t });

    if (!job) {
     throw new Error('Job does not exist.');
    }

    if (title) job.title = title;
    if (description) job.description = description;
    if (company) job.company = company;
    if (location) job.location = location;

    await job.save({ transaction: t });

    res.status(200).json({
     message: 'Job details updated successfully',
     job: {
      id: job.id,
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
     },
    });
   });
  } catch (error) {
   res
    .status(500)
    .json({ message: 'Error editing job details', error: error.message });
  }
 },
};

export default updateJobController;
