const User = require("./User");
const Project = require("./Project");
const ProjectMember = require("./ProjectMember");
const Task = require("./Task");

// Users ↔ Projects (many-to-many) through ProjectMember
User.belongsToMany(Project, {
  through: ProjectMember,
  foreignKey: "user_id",
  otherKey: "project_id",
});
Project.belongsToMany(User, {
  through: ProjectMember,
  foreignKey: "project_id",
  otherKey: "user_id",
});

ProjectMember.belongsTo(User, { foreignKey: "user_id" });
ProjectMember.belongsTo(Project, { foreignKey: "project_id" });
User.hasMany(ProjectMember, { foreignKey: "user_id" });
Project.hasMany(ProjectMember, { foreignKey: "project_id" });

// Project → Tasks
Project.hasMany(Task, { foreignKey: "project_id" });
Task.belongsTo(Project, { foreignKey: "project_id" });

// User → Tasks (assigned)
User.hasMany(Task, { foreignKey: "assigned_to", as: "assignedTasks" });
Task.belongsTo(User, { foreignKey: "assigned_to", as: "assignee" });

module.exports = {
  User,
  Project,
  ProjectMember,
  Task,
};

