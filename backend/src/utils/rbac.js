const { ProjectMember } = require("../models");

async function getMyRole(userId, projectId) {
  const member = await ProjectMember.findOne({
    where: { user_id: userId, project_id: projectId },
  });
  if (!member) return null;
  return member.role;
}

async function requireProjectRole(userId, projectId) {
  const role = await getMyRole(userId, projectId);
  return role;
}

module.exports = { getMyRole, requireProjectRole };

