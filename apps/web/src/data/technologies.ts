import {
  siBlender, siDocker, siFigma, siGithub, siMongodb, siNodedotjs, siPython, siPytorch,
  siReact, siTensorflow, siTypescript, siUnrealengine, type SimpleIcon,
} from "simple-icons";

export type Technology = { name: string; icon: SimpleIcon; tone: "accent" | "fg" | "olive"; italic?: boolean };

// Logos are drawn in muted theme tones, never their bright brand colours.
export const technologies: Technology[] = [
  { name: "React", icon: siReact, tone: "fg" },
  { name: "TypeScript", icon: siTypescript, tone: "accent", italic: true },
  { name: "Node.js", icon: siNodedotjs, tone: "olive" },
  { name: "Python", icon: siPython, tone: "fg", italic: true },
  { name: "PyTorch", icon: siPytorch, tone: "accent" },
  { name: "TensorFlow", icon: siTensorflow, tone: "olive", italic: true },
  { name: "MongoDB", icon: siMongodb, tone: "fg" },
  { name: "Docker", icon: siDocker, tone: "accent", italic: true },
  { name: "Blender", icon: siBlender, tone: "olive" },
  { name: "Unreal Engine", icon: siUnrealengine, tone: "fg", italic: true },
  { name: "Figma", icon: siFigma, tone: "accent" },
  { name: "Git & GitHub", icon: siGithub, tone: "olive", italic: true },
];

export const skillGroups = [
  { title: "AI & vision", items: ["PyTorch", "TensorFlow", "YOLO", "OCR"] },
  { title: "Web", items: ["React", "TypeScript", "Node.js", "MongoDB", "Firebase"] },
  { title: "Edge", items: ["ESP32", "Keyword spotting", "Speech recognition"] },
  { title: "Creative", items: ["Blender", "Unreal Engine", "Figma"] },
  { title: "Tools", items: ["Python", "Docker", "Git & GitHub"] },
];
