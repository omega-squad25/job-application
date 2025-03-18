import { v4 as uuidv4 } from "uuid";

import { DataTypes } from "sequelize";
import sequelize from "../services/db.js";
import JobSeekerDetail from "./JobSeekerDetail.js";

const Education = sequelize.define(
 "Education",
 {
  id: {
   type: DataTypes.UUID,
   primaryKey: true,
   defaultValue: () => uuidv4(),
  },
  jobSeekerDetailId: {
   type: DataTypes.UUID,
   allowNull: false,
   references: { model: JobSeekerDetail, key: "id" },
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
  },
  endDate: {
   type: DataTypes.DATEONLY,
  },
 },
 {
  tableName: "Education",
  timestamps: false,
 }
);

JobSeekerDetail.hasMany(Education, { foreignKey: "jobSeekerDetailId" });
Education.belongsTo(JobSeekerDetail, { foreignKey: "jobSeekerDetailId" });

export default Education;
