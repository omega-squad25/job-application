import { v4 as uuidv4 } from "uuid";
import { DataTypes } from "sequelize";
import sequelize from "../services/db.js";

const Skill = sequelize.define(
 "Skill",
 {
  id: {
   type: DataTypes.INTEGER,
   autoIcrement: true,
   primaryKey: true,
   defaultValue: () => uuidv4(),
  },
  name: {
   type: DataTypes.STRING(100),
   allowNull: false,
   unique: true,
  },
 },
 {
  tableName: "Skills",
  timestamps: false,
 }
);

export default Skill;
