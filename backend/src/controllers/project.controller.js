const { Op } = require("sequelize");
const { User, Project, ProjectMember } = require("../models");
const { getMyRole } = require("../utils/rbac");

async function getMyProjects(req, res) {
  try {
    const userId = req.user.id;

    const memberships = await ProjectMember.findAll({
      where: { user_id: userId },
      include: [{ model: Project }],
      order: [["id", "DESC"]],
    });

    const projects = memberships.map((m) => {
      return {
        id: m.Project.id,
        title: m.Project.title,
        description: m.Project.description,
        role: m.role,
      };
    });

    return res.json({ projects });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function createProject(req, res) {
  try {
    const userId = req.user.id;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Project title is required" });
    }

    const project = await Project.create({
      title,
      description: description || null,
    });

    await ProjectMember.create({
      user_id: userId,
      project_id: project.id,
      role: "ADMIN",
    });

    return res.status(201).json({ message: "Project created", project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getProjectById(req, res) {
  try {
    const userId = req.user.id;
    const projectId = Number(req.params.projectId);

    const role = await getMyRole(userId, projectId);
    if (!role) {
      return res.status(403).json({ message: "Not a member of this project" });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json({ project, role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function updateProject(req, res) {
  try {
    const userId = req.user.id;
    const projectId = Number(req.params.projectId);
    const { title, description } = req.body;

    const role = await getMyRole(userId, projectId);
    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Only ADMIN can update project" });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    await project.save();

    return res.json({ message: "Project updated", project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function deleteProject(req, res) {
  try {
    const userId = req.user.id;
    const projectId = Number(req.params.projectId);

    const role = await getMyRole(userId, projectId);
    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Only ADMIN can delete project" });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await ProjectMember.destroy({ where: { project_id: projectId } });
    await project.destroy();

    return res.json({ message: "Project deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getProjectMembers(req, res) {
  try {
    const userId = req.user.id;
    const projectId = Number(req.params.projectId);

    const role = await getMyRole(userId, projectId);
    if (!role) {
      return res.status(403).json({ message: "Not a member of this project" });
    }

    const members = await ProjectMember.findAll({
      where: { project_id: projectId },
      include: [{ model: User, attributes: ["id", "fullname", "username", "email"] }],
      order: [["id", "ASC"]],
    });

    const list = members.map((m) => ({
      id: m.id,
      role: m.role,
      user: m.User,
    }));

    return res.json({ members: list });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function inviteMember(req, res) {
  try {
    const userId = req.user.id;
    const projectId = Number(req.params.projectId);
    const { email, username } = req.body;

    const role = await getMyRole(userId, projectId);
    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Only ADMIN can invite members" });
    }

    if (!email && !username) {
      return res.status(400).json({ message: "Provide email or username" });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: email || "" }, { username: username || "" }],
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const already = await ProjectMember.findOne({
      where: { user_id: user.id, project_id: projectId },
    });
    if (already) {
      return res.status(409).json({ message: "User already in project" });
    }

    const member = await ProjectMember.create({
      user_id: user.id,
      project_id: projectId,
      role: "MEMBER",
    });

    return res.status(201).json({ message: "Member added", member });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function removeMember(req, res) {
  try {
    const userId = req.user.id;
    const projectId = Number(req.params.projectId);
    const targetUserId = Number(req.params.userId);

    const role = await getMyRole(userId, projectId);
    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Only ADMIN can remove members" });
    }

    if (targetUserId === userId) {
      return res.status(400).json({ message: "Admin cannot remove self here" });
    }

    const count = await ProjectMember.destroy({
      where: { project_id: projectId, user_id: targetUserId },
    });
    if (!count) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.json({ message: "Member removed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function changeMemberRole(req, res) {
  try {
    const userId = req.user.id;
    const projectId = Number(req.params.projectId);
    const targetUserId = Number(req.params.userId);
    const { role } = req.body;

    const myRole = await getMyRole(userId, projectId);
    if (myRole !== "ADMIN") {
      return res.status(403).json({ message: "Only ADMIN can change roles" });
    }

    if (role !== "ADMIN" && role !== "MEMBER") {
      return res.status(400).json({ message: "Role must be ADMIN or MEMBER" });
    }

    const member = await ProjectMember.findOne({
      where: { project_id: projectId, user_id: targetUserId },
    });
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.role = role;
    await member.save();

    return res.json({ message: "Role updated", member });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getMyProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectMembers,
  inviteMember,
  removeMember,
  changeMemberRole,
};

