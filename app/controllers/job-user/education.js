import dotenv from 'dotenv';
import sequelize from '../../services/db.js';
import Skill from '../../models/Skills.js';
import JobSeekerDetail from '../../models/JobSeekerDetails.js';
import Education from '../../models/Education.js';
import JobSeekerSkill from '../../models/JobSeekerSkill.js';
import Joi from 'joi';
dotenv.config();

const addEducationSchema = Joi.object({
 degree: Joi.string().max(100).required(),
 institution: Joi.string().max(100).required(),
 fieldOfStudy: Joi.string().max(100).required(),
 startMonth: Joi.number().integer().min(1).max(12).required(),
 startYear: Joi.number().integer().min(1900).max(2100).required(),
 endMonth: Joi.number().integer().min(1).max(12).allow(null),
 endYear: Joi.number().integer().min(1900).max(2100).allow(null),
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
const editEducationSchema = Joi.object({
 
 degree: Joi.string().max(100).optional(),
 institution: Joi.string().max(100).optional(),
 fieldOfStudy: Joi.string().max(100).optional(),
 startMonth: Joi.number().integer().min(1).max(12).optional(),
 startYear: Joi.number().integer().min(1900).max(2100).optional(),
 endMonth: Joi.number().integer().min(1).max(12).allow(null),
 endYear: Joi.number().integer().min(1900).max(2100).allow(null),
});
const EducationController = {
 addEducation: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  const { error, value } = addEducationSchema.validate(req.body);
  if (error) {
   return res.status(400).json({ message: error.details[0].message });
  }

  const {
   degree,
   institution,
   fieldOfStudy,
   startMonth,
   endMonth,
   startYear,
   endYear,
  } = value;
  const userId = req.user.id;

  let education;
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

    // If end date is provided,else set to null
    const endDate =
     endYear && endMonth
      ? `${endYear}-${String(endMonth).padStart(2, '0')}-01`
      : null;

    education = await Education.create(
     {
      jobSeekerDetailId: jobSeekerDetail.id,
      degree,
      institution,
      fieldOfStudy,
      startDate,
      endDate,
     },
     { transaction: t }
    );
   });
   return res
    .status(201)
    .json({ message: 'Education added successfully', education });
  } catch (error) {
   console.error('Error adding education:', error);
   return res.status(500).json({ message: 'Internal server error' });
  }
 },

 editEducation: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  const { error, value } = editEducationSchema.validate(req.body);
  if (error) {
   return res.status(400).json({ message: error.details[0].message });
  }

  const {
   degree,
   institution,
   fieldOfStudy,
   startMonth,
   endMonth,
   startYear,
   endYear,
  } = value;
  const userId = req.user.id;
  let { educationId } = req.params;
  if (!educationId) {
   return res.status(400).json({ message: 'Education ID is required' });
  }
  // Validate that educationId is a valid UUID
  const educationIdRegex =
   /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!educationIdRegex.test(educationId)) {
   return res.status(400).json({ message: 'Invalid Education ID format' });
  }
  try {
   let education;
   await sequelize.transaction(async (t) => {
    // Find the user's JobSeekerDetail and verify ownership
    const jobSeekerDetail = await JobSeekerDetail.findOne({
     where: { userId },
     transaction: t,
    });
    if (!jobSeekerDetail) {
     throw new Error('JobSeekerDetail not found for this user');
    }

    // Find the existing education record
    education = await Education.findOne({
     where: {
      id: educationId,
      jobSeekerDetailId: jobSeekerDetail.id,
     },
     transaction: t,
    });

    if (!education) {
     throw new Error('Education record not found or does not belong to user');
    }

    // Prepare update object with only provided fields
    const updateData = {};

    if (degree) updateData.degree = degree;
    if (institution) updateData.institution = institution;
    if (fieldOfStudy) updateData.fieldOfStudy = fieldOfStudy;

    // Update start date only if both month and year are provided
    if (startMonth && startYear) {
     updateData.startDate = `${startYear}-${String(startMonth).padStart(
      2,
      '0'
     )}-01`;
    }

    // Update end date only if both month and year are provided
    if (endMonth && endYear) {
     updateData.endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;
    } else if (endMonth === null && endYear === null) {
    
     updateData.endDate = null;
    }
    await Education.update(updateData, {
     where: { id: educationId },
     transaction: t,
    });
    const updatedEducation = await Education.findOne({
     where: { id: educationId },
     transaction: t,
    });
    education = updatedEducation.toJSON();
   });

   return res.status(200).json({
    message: 'Education updated successfully',
    education,
   });
  } catch (error) {
   console.error('Error updating education:', error);
   if (error.message.includes('not found')) {
    return res.status(404).json({ message: error.message });
   }
   return res.status(500).json({ message: 'Internal server error' });
  }
 },
 deleteEducation: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  const { educationId } = req.params;
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

    // Find the existing education record
    const existingEducation = await Education.findOne({
     where: {
      id: educationId,
      jobSeekerDetailId: jobSeekerDetail.id,
     },
     transaction: t,
    });

    if (!existingEducation) {
     throw new Error('Education record not found or does not belong to user');
    }

    // Delete the education record
    await existingEducation.destroy({ transaction: t });
   });

   return res.status(200).json({
    message: 'Education deleted successfully',
   });
  } catch (error) {
   console.error('Error deleting education:', error);
   if (error.message.includes('not found')) {
    return res.status(404).json({ message: error.message });
   }
   return res.status(500).json({ message: 'Internal server error' });
  }
 },
};
export default EducationController;
