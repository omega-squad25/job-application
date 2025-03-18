import { DataTypes } from "sequelize";
import sequelize from "../services/db.js";
import JobSeekerDetail from "./jobSeekerDetail.js";
import Skill from "./Skill.js";

const JobSeekerSkill = sequelize.define(
 "JobSeekerSkill",
 {
  jobSeekerDetailId: {
   type: DataTypes.UUID,
   primaryKey: true,
   references: { model: JobSeekerDetail, key: "id" },
  },
  skillId: {
   type: DataTypes.UUID,

   references: { model: Skill, key: "id" },
  },
  yearsOfExperience: {
   type: DataTypes.INTEGER,
   allowNull: true,
  },
 },
 {
  tableName: "JobSeekerSkills",
  timestamps: false,
 }
);

JobSeekerDetail.belongsToMany(Skill, {
 through: JobSeekerSkill,
 foreignKey: "jobSeekerDetailId",
});
Skill.belongsToMany(JobSeekerDetail, {
 through: JobSeekerSkill,
 foreignKey: "skillId",
});

export default JobSeekerSkill;
