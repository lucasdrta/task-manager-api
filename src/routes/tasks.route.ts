import { Router } from "express";
import { TaskController } from "../controllers/task.controller.js";

export const taskRoutes = Router();

const taskController = new TaskController();

taskRoutes.get("/", taskController.list);
taskRoutes.post("/", taskController.create);
taskRoutes.patch("/:id/status", taskController.updateStatus);
taskRoutes.delete("/:id", taskController.delete);
