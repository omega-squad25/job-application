import dotenv from 'dotenv';
import sequelize from '../../services/db.js';
import Job from '../../models/Job.js';
dotenv.config();
import Joi from 'joi';

const jobSchema = Joi.object({
 title: Joi.string().required(),
 description: Joi.string().required(),
 company: Joi.string().required(),
 location: Joi.string().required(),
});

const createJobController = {
 createJob: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  // Check if the user has the admin role
  if (req.user.role !== 'admin') {
   return res.status(403).json({ message: 'Admin access required' });
  }

  // Validate request body
  const { error, value } = jobSchema.validate(req.body);
  if (error) {
   return res.status(400).json({ message: error.details[0].message });
  }

  const { title, description, location, company } = value;
  const userId = req.user.id;

  try {
   let job;
   await sequelize.transaction(async (t) => {
    //create job(admin)
    job = await Job.create(
     {
      title: title,
      description: description,
      location: location,

      company: company,
      createdBy: userId,
     },
     { transaction: t }
    );
   });

   res.status(201).json({
    message: 'Job created successfully',
    job,
   });
  } catch (error) {
   console.error(error);
   res
    .status(500)
    .json({ message: 'Error creating job', error: error.message });
  }
 },
};

export default createJobController;
