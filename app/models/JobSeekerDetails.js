import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../services/db.js';
import User from './User.js';
import Profile from './Profile.js';
const JobSeekerDetail = sequelize.define(
 'JobSeekerDetail',
 {
  id: {
   type: DataTypes.UUID,
   primaryKey: true,

   defaultValue: () => uuidv4(),
  },
  userId: {
   type: DataTypes.UUID,
   allowNull: false,
   unique: true,
   references: {
    model: User,
    key: 'id',
   },
  },
  profileId: {
   type: DataTypes.UUID,
   allowNull: false,
   unique: true,
   references: {
    model: Profile,
    key: 'id',
   },
  },
  fullName: {
   type: DataTypes.STRING(255),
   allowNull: false,
  },

  resume: {
   type: DataTypes.STRING(255), // Path/URL to uploaded resume
  },
  phone: {
   type: DataTypes.STRING(20),
   allowNull: true,
  },
  // Add these new fields for file uploads
  resumePath: {
   type: DataTypes.STRING(255),
   allowNull: true,
  },
  resumeFilename: {
   type: DataTypes.STRING(255),
   allowNull: true,
  },
  additionalFilePath: {
   type: DataTypes.STRING(255),
   allowNull: true,
  },
  additionalFilename: {
   type: DataTypes.STRING(255),
   allowNull: true,
  },
  coverLetter: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
 },
 {
  tableName: 'JobSeekerDetails',
  timestamps: false,
 }
);

export default JobSeekerDetail;
