const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Task = sequelize.define(
  "Task",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM("TODO", "IN_PROGRESS", "DONE"),
      allowNull: false,
      defaultValue: "TODO",
    },
    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
      allowNull: false,
      defaultValue: "MEDIUM",
    },
    due_date: { type: DataTypes.DATE, allowNull: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    assigned_to: { type: DataTypes.INTEGER, allowNull: true },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "tasks",
    timestamps: false,
  },
);

module.exports = Task;
