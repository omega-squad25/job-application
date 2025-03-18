import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../services/db.js";
import User from "./User.js";

const JobSeekerDetail = sequelize.define(
 "JobSeeker",
 {
  id: {
   type: DataTypes.UUID,
   primaryKey: true,

   defaultValue: () => uuidv4(),
  },
  userId: {
   type: DataTypes.INTEGER,
   allowNull: false,
   unique: true,
   references: {
    model: User,
    key: "id",
   },
  },
  fullName: {
   type: DataTypes.STRING(255),
   allowNull: false,
  },

  resume: {
   type: DataTypes.STRING(255), // Path/URL to uploaded resume
  },
 },
 {
  tableName: "JobSeekerDetails",
  timestamps: false,
 }
);

User.hasOne(JobSeekerDetail, { foreignKey: "userId" });
JobSeekerDetail.belongsTo(User, { foreignKey: "userId" });

export default JobSeeker;
