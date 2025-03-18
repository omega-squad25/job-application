import { v4 as uuidv4 } from "uuid";
import { DataTypes } from "sequelize";
import sequelize from "../services/db.js";
import User from "./User.js";
import Job from "./Job.js";

const SavedJob = sequelize.define(
 "SavedJob",
 {
  id: {
   type: DataTypes.UUID,
   primaryKey: true,
   defaultValue: () => uuidv4(),
  },
  userId: {
   type: DataTypes.UUID,
   allowNull: false,
   references: {
    model: User,
    key: "id",
   },
  },
  jobId: {
   type: DataTypes.UUID,
   allowNull: false,
   references: {
    model: Job,
    key: "id",
   },
  },
 },
 {
  tableName: "SavedJobs",
  timestamps: true,
  indexes: [{ unique: true, fields: ["userId", "jobId"] }], 
 }
);

// Relationships
User.hasMany(SavedJob, { foreignKey: "userId" });
Job.hasMany(SavedJob, { foreignKey: "jobId" });
SavedJob.belongsTo(User, { foreignKey: "userId" });
SavedJob.belongsTo(Job, { foreignKey: "jobId" });

export default SavedJob;
