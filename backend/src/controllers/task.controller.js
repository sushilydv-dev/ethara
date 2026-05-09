const { Op } = require("sequelize");
const { User, Task, Project, ProjectMember } = require("../models");
const { getMyRole } = require("../utils/rbac");

function isOverdue(task) {
  if (!task.due_date) return false;
  if (task.status === "DONE") return false;
  const now = new Date();
  return now > new Date(task.due_date);
}

async function listTasks(req, res) {
  try {
    const userId = req.user.id;
    const projectId = Number(req.query.projectId);

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    const role = await getMyRole(userId, projectId);
    if (!role) {
      return res.status(403).json({ message: "Not a member of this project" });
    }

    const tasks = await Task.findAll({
      where: { project_id: projectId },
      include: [
        { model: User, as: "assignee", attributes: ["id", "fullname", "username", "email"] },
        { model: Project, attributes: ["id", "title"] },
      ],
      order: [["id", "DESC"]],
    });

    const data = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      due_date: t.due_date,
      overdue: isOverdue(t),
      project_id: t.project_id,
      assigned_to: t.assigned_to,
      assignee: t.assignee,
      created_by: t.created_by,
    }));

    return res.json({ tasks: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function createTask(req, res) {
  try {
    const userId = req.user.id;
    const { project_id, title, description, due_date, assigned_to, priority } = req.body;

    if (!project_id || !title) {
      return res.status(400).json({ message: "project_id and title required" });
    }

    const role = await getMyRole(userId, Number(project_id));
    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Only ADMIN can create tasks" });
    }

    // If assigned_to exists, check that user is a member
    if (assigned_to) {
      const member = await ProjectMember.findOne({
        where: { project_id, user_id: assigned_to },
      });
      if (!member) {
        return res.status(400).json({ message: "Assignee is not in this project" });
      }
    }

    const task = await Task.create({
      project_id,
      title,
      description: description || null,
      due_date: due_date || null,
      assigned_to: assigned_to || null,
      priority: priority || "MEDIUM",
      created_by: userId,
    });

    return res.status(201).json({ message: "Task created", task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getTaskById(req, res) {
  try {
    const userId = req.user.id;
    const taskId = Number(req.params.taskId);

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const role = await getMyRole(userId, task.project_id);
    if (!role) {
      return res.status(403).json({ message: "Not a member of this project" });
    }

    return res.json({ task: { ...task.toJSON(), overdue: isOverdue(task) } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function updateTaskStatus(req, res) {
  try {
    const userId = req.user.id;
    const taskId = Number(req.params.taskId);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }
    if (status !== "TODO" && status !== "IN_PROGRESS" && status !== "DONE") {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const role = await getMyRole(userId, task.project_id);
    if (!role) {
      return res.status(403).json({ message: "Not a member of this project" });
    }

    if (role !== "ADMIN" && task.assigned_to !== userId) {
      return res.status(403).json({ message: "Only assignee can update status" });
    }

    task.status = status;
    await task.save();

    return res.json({ message: "Status updated", task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function updateTask(req, res) {
  try {
    const userId = req.user.id;
    const taskId = Number(req.params.taskId);

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const role = await getMyRole(userId, task.project_id);
    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Only ADMIN can update task details" });
    }

    const { title, description, due_date, assigned_to, priority, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (due_date !== undefined) task.due_date = due_date || null;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    if (assigned_to !== undefined) {
      if (!assigned_to) {
        task.assigned_to = null;
      } else {
        const member = await ProjectMember.findOne({
          where: { project_id: task.project_id, user_id: assigned_to },
        });
        if (!member) {
          return res.status(400).json({ message: "Assignee is not in this project" });
        }
        task.assigned_to = assigned_to;
      }
    }

    await task.save();
    return res.json({ message: "Task updated", task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function deleteTask(req, res) {
  try {
    const userId = req.user.id;
    const taskId = Number(req.params.taskId);

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const role = await getMyRole(userId, task.project_id);
    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Only ADMIN can delete task" });
    }

    await task.destroy();
    return res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  listTasks,
  createTask,
  getTaskById,
  updateTaskStatus,
  updateTask,
  deleteTask,
};

