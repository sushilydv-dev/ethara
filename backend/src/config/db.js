const { Sequelize } = require("sequelize");

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_NAME = process.env.DB_NAME || "ethara";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  logging: false,
});

async function initDb() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    // Models are loaded here so associations exist before sync.
    require("../models");

    await sequelize.sync();
    console.log("Database synced");
  } catch (err) {
    console.error("Database connection failed");
    throw err;
  }
}

module.exports = { sequelize, initDb };
