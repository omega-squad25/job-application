import dotenv from 'dotenv';
import sequelize from '../../services/db.js';
import JobSeekerDetail from '../../models/JobSeekerDetails.js';
import Experience from '../../models/Experience.js';
import Joi from 'joi';
dotenv.config();

const addExperienceSchema = Joi.object({
 jobTitle: Joi.string().optional(),
 company: Joi.string().optional(),
 responsibility: Joi.string().optional(),
 startMonth: Joi.number().integer().min(1).max(12).optional(),
 startYear: Joi.number().integer().min(1900).max(2100).optional(),
 endMonth: Joi.number().integer().min(1).max(12).allow(null),
 endYear: Joi.number().integer().min(1900).max(2100).allow(null),
 isCurrentlyWorkingOnRole: Joi.boolean().optional(),
}).custom((value, helpers) => {
 
 if ((value.endMonth && !value.endYear) || (!value.endMonth && value.endYear)) {
  return helpers.error('object.endDateIncomplete');
 }

 
 if (value.endMonth && value.endYear) {
  const startDate = new Date(value.startYear, value.startMonth - 1);
  const endDate = new Date(value.endYear, value.endMonth - 1);
  if (endDate < startDate) {
   return helpers.error('date.endBeforeStart');
  }
 }

 return value;
});
const editExperienceSchema = Joi.object({
 jobTitle: Joi.string().optional(),
 company: Joi.string().optional(),
 responsibility: Joi.string().optional(),
 startMonth: Joi.number().integer().min(1).max(12).optional(),
 startYear: Joi.number().integer().min(1900).max(2100).optional(),
 endMonth: Joi.number().integer().min(1).max(12).allow(null),
 endYear: Joi.number().integer().min(1900).max(2100).allow(null),
 isCurrentlyWorkingOnRole: Joi.boolean().optional(),
}).custom((value, helpers) => {
 
 if ((value.endMonth && !value.endYear) || (!value.endMonth && value.endYear)) {
  return helpers.error('object.endDateIncomplete');
 }

 // Validate that end date is after start date if provided
 if (value.endMonth && value.endYear) {
  const startDate = new Date(value.startYear, value.startMonth - 1);
  const endDate = new Date(value.endYear, value.endMonth - 1);
  if (endDate < startDate) {
   return helpers.error('date.endBeforeStart');
  }
 }

 return value;
});
const ExperienceController = {
 addExperience: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  const { error, value } = addExperienceSchema.validate(req.body);
  if (error) {
   return res.status(400).json({ message: error.details[0].message });
  }

  const {
   jobTitle,
   company,
   responsibility,
   startMonth,
   endMonth,
   startYear,
   endYear,
   isCurrentlyWorkingOnRole,
  } = value;

  const userId = req.user.id;
  let experience;
  try {
   await sequelize.transaction(async (t) => {
    // Find the user's JobSeekerDetail
    const jobSeekerDetail = await JobSeekerDetail.findOne({
     where: { userId },
     transaction: t,
    });
    if (!jobSeekerDetail) {
     throw new Error('JobSeekerDetail not found for this user');
    }
    const startDate = `${startYear}-${String(startMonth).padStart(2, '0')}-01`;

    
    const endDate =
     endYear && endMonth
      ? `${endYear}-${String(endMonth).padStart(2, '0')}-01`
      : null;

    experience = await Experience.create(
     {
      jobSeekerDetailId: jobSeekerDetail.id,
      jobTitle,
      company,
      responsibility,
      startDate,

      endDate,
      isCurrentlyWorkingOnRole,
     },
     { transaction: t }
    );
   });
   return res
    .status(201)
    .json({ message: 'Experience added successfully', experience });
  } catch (error) {
   console.error('Error adding experience:', error);
   return res.status(500).json({ message: 'Internal server error' });
  }
 },

 editExperience: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  const { error, value } = editExperienceSchema.validate(req.body);
  if (error) {
   return res.status(400).json({ message: error.details[0].message });
  }

  const {
   jobTitle,
   company,
   responsibility,
   startMonth,
   endMonth,
   startYear,
   endYear,
   isCurrentlyWorkingOnRole,
  } = value;
  const userId = req.user.id;
  let { experienceId } = req.params;
  if (!experienceId) {
   return res.status(400).json({ message: 'Experience ID is required' });
  }
  // Validate that educationId is a valid UUID
  const experienceIdRegex =
   /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!experienceIdRegex.test(experienceId)) {
   return res.status(400).json({ message: 'Invalid ID format' });
  }
  try {
   let experience;
   await sequelize.transaction(async (t) => {
   
    const jobSeekerDetail = await JobSeekerDetail.findOne({
     where: { userId },
     transaction: t,
    });
    if (!jobSeekerDetail) {
     throw new Error('JobSeekerDetail not found for this user');
    }

    // Find the existing experience record
    experience = await Experience.findOne({
     where: {
      id: experienceId,
      jobSeekerDetailId: jobSeekerDetail.id,
     },
     transaction: t,
    });

    if (!experience) {
     throw new Error('Experience record not found or does not belong to user');
    }

    // Prepare update object with only provided fields
    const updateData = {};

    if (jobTitle) updateData.jobTitle = jobTitle;
    if (company) updateData.comapny = company;
    if (responsibility) updateData.responsibility = responsibility;
    if (isCurrentlyWorkingOnRole)
     updateData.isCurrentlyWorkingOnRole = isCurrentlyWorkingOnRole;
   
    if (startMonth && startYear) {
     updateData.startDate = `${startYear}-${String(startMonth).padStart(
      2,
      '0'
     )}-01`;
    }

    
    if (endMonth && endYear) {
     updateData.endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;
    } else if (endMonth === null && endYear === null) {
    
     updateData.endDate = null;
    }
    await Experience.update(updateData, {
     where: { id: experienceId },
     transaction: t,
    });
    const updatedExperience = await Experience.findOne({
     where: { id: experienceId },
     transaction: t,
    });
    experience = updatedExperience.toJSON();
   });

   return res.status(200).json({
    message: 'Experience updated successfully',
    experience,
   });
  } catch (error) {
   console.error('Error updating experience:', error);
   if (error.message.includes('not found')) {
    return res.status(404).json({ message: error.message });
   }
   return res.status(500).json({ message: 'Internal server error' });
  }
 },
 deleteExperience: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  const { experienceId } = req.params;
  const userId = req.user.id;

  try {
   await sequelize.transaction(async (t) => {
    // Find the user's JobSeekerDetail and verify ownership
    const jobSeekerDetail = await JobSeekerDetail.findOne({
     where: { userId },
     transaction: t,
    });
    if (!jobSeekerDetail) {
     throw new Error('JobSeekerDetail not found for this user');
    }

    // Find the existing experience record
    const existingExperience = await Experience.findOne({
     where: {
      id: experienceId,
      jobSeekerDetailId: jobSeekerDetail.id,
     },
     transaction: t,
    });

    if (!existingExperience) {
     throw new Error('Experience record not found or does not belong to user');
    }

    // Delete the experience record
    await existingExperience.destroy({ transaction: t });
   });

   return res.status(200).json({
    message: 'Experience deleted successfully',
   });
  } catch (error) {
   console.error('Error deleting experience:', error);
   if (error.message.includes('not found')) {
    return res.status(404).json({ message: error.message });
   }
   return res.status(500).json({ message: 'Internal server error' });
  }
 },
};
export default ExperienceController;
