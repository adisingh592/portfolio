// Projects shown on Home, Work and the case-study pages.
// Names, years, tags and one-line descriptions come from the approved design board.
// Longer case-study text is a starting draft built from those facts: edit it to match what you did.
// No metrics are included because none were provided. Add real numbers to `results` when you have them.

export type ProjectCategory = "ai-ml" | "computer-vision" | "web" | "edge-ai" | "creative-tech";

export type ProjectImage = { src: string; alt: string; width: number; height: number };

export type Project = {
  slug: string;
  title: string;
  year?: number;
  summary: string;
  tagline: string;
  categories: ProjectCategory[];
  tags: string[];
  cover: ProjectImage;
  featured?: boolean;
  links?: { live?: string; repo?: string; video?: string };
  overview?: string;
  problem?: string;
  solution?: string;
  architecture?: string[];
  process?: { title: string; body: string }[];
  features?: { title: string; body: string }[];
  results?: { value: string; label: string }[];
  stack?: string[];
  gallery?: ProjectImage[];
};

export const projectFilters: { key: "all" | ProjectCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ai-ml", label: "AI / ML" },
  { key: "computer-vision", label: "Computer Vision" },
  { key: "web", label: "Web" },
  { key: "edge-ai", label: "Edge AI" },
  { key: "creative-tech", label: "Creative Tech" },
];

const img = (name: string, alt: string): ProjectImage => ({ src: `/images/projects/${name}.webp`, alt, width: 852, height: 639 });

export const projects: Project[] = [
  {
    slug: "drishti-guard",
    title: "Drishti Guard",
    year: 2026,
    summary: "AI video intelligence for threat detection.",
    tagline: "AI-powered video intelligence platform for threat detection and women empowerment.",
    categories: ["ai-ml", "computer-vision"],
    tags: ["Computer Vision", "YOLO", "Tracking"],
    cover: img("drishti-guard", "Busy railway station concourse seen from a high camera angle"),
    featured: true,
    overview:
      "Drishti Guard is an AI-powered video intelligence platform designed to detect potential threats and suspicious activities in real-time video, enhancing safety in public spaces.",
    problem:
      "Public spaces are covered by many cameras, but footage is usually reviewed by people, often after something has already happened. Following several live feeds at once and noticing a threat as it develops is hard to do by eye.",
    solution:
      "Drishti Guard watches live video for them. YOLO-based detection finds people and objects in each frame, tracking follows them across frames, and suspicious activity is surfaced on a web dashboard that covers multiple cameras at once.",
    architecture: ["Camera feeds", "YOLO detection", "Multi-object tracking", "Threat flagging", "Web dashboard"],
    process: [
      { title: "Define the threats", body: "Decide which situations the system should flag and what a useful alert looks like." },
      { title: "Detection", body: "Run YOLO models on incoming frames to find people and objects in real time." },
      { title: "Tracking", body: "Follow each detection across frames so behaviour can be judged over time, not frame by frame." },
      { title: "Dashboard", body: "Bring every camera and every alert into one web dashboard for review." },
      { title: "Test and refine", body: "Run it on real footage and tune what gets flagged." },
    ],
    features: [
      { title: "Real-time detection", body: "Flags activity while it happens." },
      { title: "YOLO models", body: "Fast object detection on live video." },
      { title: "Multi-camera support", body: "Several feeds monitored together." },
      { title: "Web dashboard", body: "One place to watch feeds and review alerts." },
    ],
    stack: ["Computer Vision", "YOLO", "Object tracking", "Web dashboard"],
    gallery: [
      img("drishti-guard", "Commuters crossing a sunlit station concourse"),
      img("drishti-dashboard", "Monitoring room with screens and desks in warm light"),
    ],
  },
  {
    slug: "edge-voice",
    title: "Edge Voice",
    year: 2026,
    summary: "Low-latency KWS + ASR for edge devices.",
    tagline: "Low-latency keyword spotting and speech recognition for edge devices.",
    categories: ["edge-ai", "ai-ml"],
    tags: ["ESP32", "KWS", "ASR"],
    cover: img("edge-voice", "Cylindrical smart speaker on a wooden table"),
    featured: true,
    overview: "Edge Voice brings keyword spotting and speech recognition onto small edge devices such as the ESP32, so voice control works without sending audio to the cloud.",
    features: [
      { title: "Keyword spotting", body: "Listens for a wake word on the device." },
      { title: "Speech recognition", body: "Turns short commands into text." },
      { title: "Runs on ESP32", body: "Built for low-power microcontrollers." },
    ],
    stack: ["ESP32", "Keyword spotting", "Speech recognition"],
  },
  {
    slug: "study-sphere",
    title: "Study Sphere",
    summary: "An intelligent student productivity platform.",
    tagline: "An intelligent student productivity platform.",
    categories: ["web"],
    tags: ["React", "Node.js", "MongoDB"],
    cover: img("study-sphere", "Student desk with notebooks and a planner in morning light"),
    featured: true,
    overview: "Study Sphere is a productivity platform that helps students organise their study time and coursework in one place.",
    stack: ["React", "Node.js", "MongoDB"],
  },
  {
    slug: "gym-management-system",
    title: "Gym Management System",
    summary: "Member management and tracking system.",
    tagline: "Member management and tracking system.",
    categories: ["web"],
    tags: ["React", "Firebase", "Dashboard"],
    cover: img("gym-management", "Sunlit empty gym with a dumbbell rack"),
    overview: "A web system for managing gym members and tracking their activity from a single dashboard.",
    stack: ["React", "Firebase"],
  },
  {
    slug: "railway-inspection",
    title: "Railway Inspection (SIH)",
    year: 2024,
    summary: "Narcotics and explosive detection for railway security.",
    tagline: "Narcotics and explosive detection for railway security, built for Smart India Hackathon.",
    categories: ["computer-vision", "ai-ml"],
    tags: ["Computer Vision", "YOLO", "OCR"],
    cover: img("railway-inspection", "Railway platform and train at golden hour"),
    overview: "A computer-vision system built for Smart India Hackathon to help detect narcotics and explosives as part of railway security checks.",
    stack: ["Computer Vision", "YOLO", "OCR"],
  },
  {
    slug: "3d-environment",
    title: "3D Environment",
    year: 2024,
    summary: "Creative 3D renders and assets using Blender and Unreal.",
    tagline: "Creative 3D renders and assets using Blender and Unreal.",
    categories: ["creative-tech"],
    tags: ["Blender", "Unreal Engine", "3D"],
    cover: img("3d-environment", "Rendered desert dunes and distant mountains at dusk"),
    overview: "A set of 3D environments, renders and assets made in Blender and Unreal Engine.",
    stack: ["Blender", "Unreal Engine"],
  },
  {
    slug: "multi-disease-prediction",
    title: "Multi-Disease Prediction",
    summary: "Machine-learning models that predict several diseases.",
    tagline: "Machine-learning models that predict the likelihood of several diseases.",
    categories: ["ai-ml"],
    tags: ["Machine Learning", "Healthcare"],
    cover: img("multi-disease", "Medical chart on a table in warm window light"),
    overview: "A machine-learning project that predicts the likelihood of several diseases from patient data.",
    stack: ["Machine Learning"],
  },
];

export const featuredProjects = projects.filter(p => p.featured);

export const getProject = (slug: string) => projects.find(p => p.slug === slug);

export function getNextProject(slug: string) {
  const i = projects.findIndex(p => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
