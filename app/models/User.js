import { v4 as uuidv4 } from "uuid";
import { DataTypes } from "sequelize";
import sequelize from "../services/db.js";

const User = sequelize.define(
 "User",
 {
  id: {
   type: DataTypes.UUID,
   primaryKey: true,
   defaultValue: () => uuidv4(),
  },
  fullName: {
   type: DataTypes.STRING,
   allowNull: false,
  },

  email: {
   type: DataTypes.STRING,
   allowNull: false,
   unique: true,
  },
  password: {
   type: DataTypes.STRING,
   allowNull: false,
  },

  role: {
   type: DataTypes.ENUM("user", "admin"),
  },
  provider: {
   type: DataTypes.ENUM("google", "email"),
   allowNull: false,
  },
  profilePhoto: {
   type: DataTypes.STRING(255),
   allowNull: true,
  },
  isAdmin: {
   type: DataTypes.BOOLEAN,
   defaultValue: false,
  },
  createdAt: {
   type: DataTypes.DATE,
   defaultValue: DataTypes.NOW,
  },
 },
 { tableName: "Users", timestamps: true }
);

export default User;
