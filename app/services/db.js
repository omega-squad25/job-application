// require("dotenv").config();

// const mysql = require('mysql2/promise');

// const config = {
//   db: { /* do not put password or any sensitive info here, done only for demo */
//     host: process.env.DB_CONTAINER,
//     port: process.env.DB_PORT,
//     user: process.env.MYSQL_ROOT_USER,
//     password: process.env.MYSQL_ROOT_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
//     waitForConnections: true,
//     connectionLimit: 2,
//     queueLimit: 0,
//   },
// };

// const pool = mysql.createPool(config.db);

// // Utility function to query the database
// async function query(sql, params) {
//   const [rows, fields] = await pool.execute(sql, params);

//   return rows;
// }

// module.exports = {
//   query,
// }



import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.DB_CONTAINER);
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_CONTAINER, // e.g., 'db' from docker-compose
  port: process.env.DB_PORT || 3306,
  username: process.env.MYSQL_ROOT_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0,
  pool: {
    max: 2,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
  retry: {
    max: 5,
    backoffBase: 1000,
  },
});

// Test the connection and sync models
const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log("Database tables synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    // Retry connection after 5 seconds
    setTimeout(initDB, 5000);
  }
};

initDB();
export default sequelize;
