import { v4 as uuidv4 } from "uuid";
import { DataTypes } from "sequelize";
import sequelize from "../services/db.js";
import User from "./User.js";
import Job from "./Job.js";

const JobApplication = sequelize.define(
 "JobApplication",
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
    key: "id",
   },
  },
  userId: {
   type: DataTypes.UUID,
   allowNull: false,
   references: {
    model: User,
    key: "id",
   },
  },
  status: {
   type: DataTypes.ENUM("pending", "reviewed", "accepted", "rejected"),
   defaultValue: "pending",
  },
 },
 {
  tableName: "JobApplications",
  timestamps: true,
  indexes: [{ unique: true, fields: ["jobId", "userId"] }],
 }
);

// Relationships
User.hasMany(JobApplication, { foreignKey: "userId" });
Job.hasMany(JobApplication, { foreignKey: "jobId" });
JobApplication.belongsTo(User, { foreignKey: "userId" });
JobApplication.belongsTo(Job, { foreignKey: "jobId" });

export default JobApplication;
