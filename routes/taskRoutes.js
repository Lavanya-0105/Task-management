import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(protect);

router.post("/", authorize("Project Manager", "Admin"), createTask);
router.get("/all", authorize("Admin"), getAllTasks);
router.get("/my-tasks", getMyTasks);
router.put("/:id", updateTaskStatus);
router.delete("/:id", authorize("Admin"), deleteTask);

export default router;
