const { Sequelize } = require("sequelize");

const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  logging: false,

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

async function initDb() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    require("../models");

    await sequelize.sync();

    console.log("Database synced");
  } catch (err) {
    console.error("Database connection failed:");
    console.error(err);
    process.exit(1);
  }
}

module.exports = { sequelize, initDb };
