import { v4 as uuidv4 } from "uuid";
import { DataTypes } from "sequelize";
import sequelize from "../services/db.js";
import User from "./User.js";

const Job = sequelize.define(
 "Job",
 {
  id: {
   type: DataTypes.UUID,
   primaryKey: true,
   defaultValue: () => uuidv4(),
  },
  title: {
   type: DataTypes.STRING(255),
   allowNull: false, // e.g., "Product Designer"
  },
  description: {
   type: DataTypes.TEXT,
   allowNull: false, // Detailed job description
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
   type: DataTypes.ENUM("draft", "approved", "closed"),
   allowNull: false,
   defaultValue: "draft",
  },
  createdBy: {
   type: DataTypes.UUID,
   allowNull: false,
   references: {
    model: User,
    key: "id",
   },
  },
 },
 {
  tableName: "Jobs",
  timestamps: true,
 }
);

// Relationships
User.hasMany(Job, { foreignKey: "createdBy" });
Job.belongsTo(User, { foreignKey: "createdBy" });

export default Job;
