const express = require("express");
const { auth } = require("../middlewares/auth.middleware");
const taskController = require("../controllers/task.controller");

const router = express.Router();

router.use(auth);

// List tasks for a project: /api/tasks?projectId=1
router.get("/", taskController.listTasks);
router.post("/", taskController.createTask);

router.get("/:taskId", taskController.getTaskById);
router.patch("/:taskId/status", taskController.updateTaskStatus);
router.put("/:taskId", taskController.updateTask);
router.delete("/:taskId", taskController.deleteTask);

module.exports = router;

