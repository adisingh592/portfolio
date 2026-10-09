import { Router } from "express";
import { healthRouter } from "./health";
import { projectsRouter } from "./projects";
import { contactRouter } from "./contact";

export const router = Router();

router.use("/health", healthRouter);
router.use("/projects", projectsRouter);
router.use("/contact", contactRouter);
