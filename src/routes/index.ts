import { Router } from "express";
import { docsRoutes } from "./docs.route.js";
import { healthRoutes } from "./health.route.js";
import { taskRoutes } from "./tasks.route.js";

const router = Router();

router.use("/docs", docsRoutes);
router.use("/health", healthRoutes);
router.use("/tasks", taskRoutes);

export { router as routes };
