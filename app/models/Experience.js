import { v4 as uuidv4 } from "uuid";

import { DataTypes } from "sequelize";

import sequelize from "../services/db.js";
import JobSeekerDetail from "./JobSeekerDetail.js";

const Experience = sequelize.define(
 "Experience",
 {
  id: {
   type: DataTypes.INTEGER,
   primaryKey: true,
   defaultValue: () => uuidv4(),
  },
  jobSeekerDetailId: {
   type: DataTypes.UUID,
   allowNull: false,
   references: { model: JobSeekerDetail, key: "id" },
  },
  jobTitle: {
   type: DataTypes.STRING(255),
   allowNull: false, 
  },
  company: {
   type: DataTypes.STRING(255),
   allowNull: false, 
  },
  location: {
   type: DataTypes.STRING(255),
   allowNull: true, 
  },
  startDate: {
   type: DataTypes.DATEONLY, 
  },
  endDate: {
   type: DataTypes.DATEONLY, 
  },
  responsibility: {
   type: DataTypes.TEXT,
   allowNull: true, 
  },
 },
 {
  tableName: "Experience",
  timestamps: false,
 }
);

JobSeekerDetail.hasMany(Experience, { foreignKey: "jobSeekerDetailId" });
Experience.belongsTo(JobSeekerDetail, { foreignKey: "jobSeekerDetailId" });

export default Experience;
