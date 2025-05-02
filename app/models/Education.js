import { v4 as uuidv4 } from 'uuid';

import { DataTypes } from 'sequelize';
import sequelize from '../services/db.js';
import JobSeekerDetail from './JobSeekerDetails.js';

const Education = sequelize.define(
 'Education',
 {
  id: {
   type: DataTypes.UUID,
   primaryKey: true,
   defaultValue: () => uuidv4(),
  },
  jobSeekerDetailId: {
   type: DataTypes.UUID,
   allowNull: false,
   references: { model: JobSeekerDetail, key: 'id' },
  },
  degree: {
   type: DataTypes.STRING(255),
   allowNull: false,
  },
  institution: {
   type: DataTypes.STRING(255),
   allowNull: false,
  },
  fieldOfStudy: {
   type: DataTypes.STRING(255),
   allowNull: false,
  },
  startDate: {
   type: DataTypes.DATEONLY,
   comment: 'Always set to first day of the month',
  },
  endDate: {
   type: DataTypes.DATEONLY,
   allowNull: true,
   comment: 'Always set to first day of the month',
  },
 },
 {
  tableName: 'Education',
  timestamps: false,
 }
);

export default Education;
