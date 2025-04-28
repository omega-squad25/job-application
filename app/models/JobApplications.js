import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import sequelize from '../services/db.js';
import User from './User.js';
import Job from './Job.js';
import JobSeekerDetail from './JobSeekerDetails.js';

const JobApplication = sequelize.define(
 'JobApplication',
 {
  id: {
   type: DataTypes.UUID,
   primaryKey: true,
   defaultValue: () => uuidv4(),
  },
  jobId: {
   type: DataTypes.UUID,
   allowNull: false,
   references: {
    model: Job,
    key: 'id',
   },
  },
  userId: {
   type: DataTypes.UUID,
   allowNull: false,
   references: {
    model: User,
    key: 'id',
   },
  },
  jobSeekerDetailId: {
   type: DataTypes.UUID,
   allowNull: false,
   references: {
    model: JobSeekerDetail,
    key: 'id',
   },
  },
  resumePath: {
   type: DataTypes.STRING(255),
   allowNull: false,
  },
  resumeFilename: {
   type: DataTypes.STRING(255),
   allowNull: false,
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
  contactForFutureOpportunities: {
   type: DataTypes.BOOLEAN,
   defaultValue: false,
  },
  status: {
   type: DataTypes.ENUM(
    'submitted',
    'pending',
    'reviewed',
    'accepted',
    'rejected'
   ),
   defaultValue: 'submitted',
  },
  submittedAt: {
   type: DataTypes.DATE,
   allowNull: false,
   defaultValue: DataTypes.NOW,
  },
  isAgreeToPrivacyPolicy: {
   type: DataTypes.BOOLEAN,
  },
 },
 {
  tableName: 'JobApplications',
  timestamps: true,
  indexes: [{ unique: true, fields: ['jobId', 'userId'] }],
 }
);

export default JobApplication;
