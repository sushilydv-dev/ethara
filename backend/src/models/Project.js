const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Project = sequelize.define(
  "Project",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(120), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "projects",
    timestamps: false,
  },
);

module.exports = Project;
