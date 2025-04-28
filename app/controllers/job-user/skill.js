import dotenv from 'dotenv';
import sequelize from '../../services/db.js';
import Skill from '../../models/Skills.js';
import JobSeekerDetail from '../../models/JobSeekerDetails.js';
import JobSeekerSkill from '../../models/JobSeekerSkill.js';
import Joi from 'joi';

dotenv.config();

const addSkillSchema = Joi.object({
 name: Joi.string().max(100).required(),
 yearsOfExperience: Joi.number().integer().min(0).optional(),
});
const editSkillSchema = Joi.object({
 name: Joi.string().max(100).optional(),
 yearsOfExperience: Joi.number().integer().min(0).optional(),
});
const SkillController = {
 addSkill: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  const { error, value } = addSkillSchema.validate(req.body);
  if (error) {
   return res.status(400).json({ message: error.details[0].message });
  }

  const { name, yearsOfExperience } = value;
  const userId = req.user.id;
  let skill;
  try {
   await sequelize.transaction(async (t) => {
    const jobSeekerDetail = await JobSeekerDetail.findOne({
     where: { userId },
     transaction: t,
    });
    if (!jobSeekerDetail) {
     throw new Error('JobSeekerDetail not found for this user');
    }

    // Find or create the skill with name and yearsOfExperience
    skill = await Skill.findOne({
     where: {
      name,
     },
     attributes: ['id', 'name'],
     transaction: t,
    });
    if (!skill) {
     skill = await Skill.create(
      {
       name,
       yearsOfExperience,
      },
      { transaction: t }
     );
    }

    // Check if the skill is already linked to this JobSeekerDetail
    const existingLink = await JobSeekerSkill.findOne({
     where: {
      jobSeekerDetailId: jobSeekerDetail.id,
      skillId: skill.id,
     },
     transaction: t,
    });
    if (existingLink) {
     throw new Error('This skill already exists for your profile');
    }

    // Link the skill to JobSeekerDetail
    await JobSeekerSkill.create(
     {
      jobSeekerDetailId: jobSeekerDetail.id,
      skillId: skill.id,
     },
     { transaction: t }
    );
   });

   res.status(201).json({
    message: 'Skill added successfully',
    skill,
   });
  } catch (error) {
   console.error('Error adding skill:', error);
   if (
    error.message === 'This skill already exists for your profile' ||
    error.message === 'JobSeekerDetail not found for this user'
   ) {
    return res.status(409).json({ message: error.message });
   }
   res.status(500).json({
    message: 'Error adding skill',
    error: error.message,
   });
  }
 },

 editSkill: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  const { error, value } = editSkillSchema.validate(req.body);
  if (error) {
   return res.status(400).json({ message: error.details[0].message });
  }

  const { name, yearsOfExperience } = value;
  const { skillId } = req.params;
  if (!skillId) {
   return res.status(400).json({
    message: 'Skill ID is required',
   });
  }
  const userId = req.user.id;
  let skill;
  try {
   await sequelize.transaction(async (t) => {
    const jobSeekerDetail = await JobSeekerDetail.findOne({
     where: { userId },
     transaction: t,
    });
    if (!jobSeekerDetail) {
     throw new Error('JobSeekerDetail not found for this user');
    }

    // Verify the skill is linked to this JobSeekerDetail
    const skillLink = await JobSeekerSkill.findOne({
     where: {
      jobSeekerDetailId: jobSeekerDetail.id,
      skillId,
     },
     transaction: t,
    });
    if (!skillLink) {
     throw new Error('Skill not found or not associated with your profile');
    }

    // Find the skill to edit
    skill = await Skill.findByPk(skillId, {
     attributes: ['id', 'name', 'yearsOfExperience'],
     transaction: t,
    });
    if (!skill) {
     throw new Error('Skill not found');
    }
    // Update the skill
    await skill.update(
     {
      name,
      yearsOfExperience:
       yearsOfExperience !== undefined
        ? yearsOfExperience
        : skill.yearsOfExperience,
     },
     { transaction: t }
    );
   });
   res.status(200).json({
    message: 'Skill updated successfully',
    skill,
   });
  } catch (error) {
   console.error('Error editing skill:', error);
   if (
    error.message === 'JobSeekerDetail not found for this user' ||
    error.message === 'Skill not found or not associated with your profile' ||
    error.message === 'Skill not found'
   ) {
    return res.status(404).json({ message: error.message });
   }
   res.status(500).json({
    message: 'Error editing skill',
    error: error.message,
   });
  }
 },
 deleteSkill: async (req, res) => {
  if (!req.user) {
   return res.status(401).json({ message: 'User not authenticated' });
  }

  const { skillId } = req.params;
  const userId = req.user.id;

  try {
   await sequelize.transaction(async (t) => {
    const jobSeekerDetail = await JobSeekerDetail.findOne({
     where: { userId },
     transaction: t,
    });
    if (!jobSeekerDetail) {
     throw new Error('JobSeekerDetail not found for this user');
    }

    const skillLink = await JobSeekerSkill.findOne({
     where: {
      jobSeekerDetailId: jobSeekerDetail.id,
      skillId,
     },
     transaction: t,
    });
    if (!skillLink) {
     throw new Error('Skill not found or not associated with your profile');
    }

    await skillLink.destroy({ transaction: t });
   });

   res.status(200).json({
    message: 'Skill deleted successfully',
   });
  } catch (error) {
   console.error('Error deleting skill:', error);
   if (
    error.message === 'JobSeekerDetail not found for this user' ||
    error.message === 'Skill not found or not associated with your profile'
   ) {
    return res.status(404).json({ message: error.message });
   }
   res.status(500).json({
    message: 'Error deleting skill',
    error: error.message,
   });
  }
 },
};

export default SkillController;
