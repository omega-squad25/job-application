import { v4 as uuidv4 } from "uuid";

import { DataTypes } from "sequelize";

import sequelize from "../services/db.js";
import JobSeekerDetail from "./JobSeekerDetails.js";

const Experience = sequelize.define(
  "Experience",
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
    jobTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    isCurrentlyWorkingOnRole: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "Experience",
    timestamps: false,
  }
);

export default Experience;