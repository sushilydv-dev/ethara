const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ProjectMember = sequelize.define(
  "ProjectMember",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    role: { type: DataTypes.ENUM("ADMIN", "MEMBER"), allowNull: false, defaultValue: "MEMBER" },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "project_members",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "project_id"],
      },
    ],
  },
);

module.exports = ProjectMember;
