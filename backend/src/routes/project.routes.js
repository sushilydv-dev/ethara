const express = require("express");
const { auth } = require("../middlewares/auth.middleware");
const projectController = require("../controllers/project.controller");

const router = express.Router();

router.use(auth);

router.get("/", projectController.getMyProjects);
router.post("/", projectController.createProject);

router.get("/:projectId", projectController.getProjectById);
router.put("/:projectId", projectController.updateProject);
router.delete("/:projectId", projectController.deleteProject);

router.get("/:projectId/members", projectController.getProjectMembers);
router.post("/:projectId/members/invite", projectController.inviteMember);
router.delete("/:projectId/members/:userId", projectController.removeMember);
router.patch("/:projectId/members/:userId/role", projectController.changeMemberRole);

module.exports = router;

