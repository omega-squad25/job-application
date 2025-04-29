import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../services/db.js';
import User from './User.js';

const Profile = sequelize.define(
 'Profile',
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
  fullName: {
   type: DataTypes.STRING(255),
   allowNull: true,
  },
  jobTitle: {
   type: DataTypes.STRING(255),
   allowNull: true,
  },
  location: {
   type: DataTypes.STRING(255),
   allowNull: true,
  },
 },
 {
  tableName: 'Profiles',
  timestamps: true,
 }
);

export default Profile;
