import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import sequelize from '../services/db.js';
import User from './User.js';

const Job = sequelize.define(
 'Job',
 {
  id: {
   type: DataTypes.UUID,
   primaryKey: true,
   defaultValue: () => uuidv4(),
  },
  title: {
   type: DataTypes.STRING(255),
   allowNull: false,
  },
  description: {
   type: DataTypes.TEXT,
   allowNull: false,
  },
  requirements: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  benefitsPayRange: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  company: {
   type: DataTypes.STRING(255),
   allowNull: false, // New: e.g., "Best Technologies Ltd"
  },
  location: {
   type: DataTypes.STRING(255),
   allowNull: false,
  },
  status: {
   type: DataTypes.ENUM('draft', 'pending', 'approved', 'closed'),
   allowNull: false,
   defaultValue: 'pending',
  },
  approvedAt: { type: DataTypes.DATE, allowNull: true },

  createdBy: {
   type: DataTypes.UUID,
   allowNull: false,
   references: {
    model: User,
    key: 'id',
   },
  },
 },
 {
  tableName: 'Jobs',
  timestamps: true,
 }
);

export default Job;
