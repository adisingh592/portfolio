import { Router } from "express";
import { projects } from "../data/projects";

export const projectsRouter = Router();

projectsRouter.get("/", (_req, res) => {
  res.json(projects);
});

projectsRouter.get("/:slug", (req, res) => {
  const project = projects.find(p => p.slug === req.params.slug);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(project);
});
