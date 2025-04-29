import { DataTypes } from 'sequelize';
import sequelize from '../services/db.js';
import JobSeekerDetail from './JobSeekerDetails.js';
import Skill from './Skills.js';
const JobSeekerSkill = sequelize.define(
 'JobSeekerSkill',
 {
  jobSeekerDetailId: {
   type: DataTypes.UUID,
   allowNull: false,
   primaryKey: true,
   references: {
    model: JobSeekerDetail,
    key: 'id',
   },
  },
  skillId: {
   type: DataTypes.UUID,
   allowNull: false,
   primaryKey: true,
   references: {
    model: Skill,
    key: 'id',
   },
  },
 },
 {
  tableName: 'JobSeekerSkills',
  timestamps: false,
 }
);

export default JobSeekerSkill;
