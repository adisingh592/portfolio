// Lab experiments. Titles and the first three descriptions come from the design board.
// None link anywhere yet: add `href` when an experiment has a repo, demo or write-up.

export type LabCategory = "ai" | "audio" | "3d" | "edge" | "vision";

export type LabItem = {
  slug: string;
  title: string;
  body: string;
  category: LabCategory;
  tags: string[];
  image: { src: string; alt: string; width: number; height: number };
  href?: string;
  featured?: boolean;
};

export const labFilters: { key: "all" | LabCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ai", label: "AI Models" },
  { key: "vision", label: "Vision" },
  { key: "audio", label: "Audio" },
  { key: "3d", label: "3D Graphics" },
  { key: "edge", label: "Edge Devices" },
];

const img = (name: string, alt: string) => ({ src: `/images/lab/${name}.webp`, alt, width: 852, height: 639 });

export const labItems: LabItem[] = [
  { slug: "3d-render-studies", title: "3D Render Studies", body: "Blender experiments in light, material and composition.", category: "3d", tags: ["Blender"], image: img("3d-render", "Sculpted sphere resting on a small plinth"), featured: true },
  { slug: "audio-experiments", title: "Audio Experiments", body: "Speech and sound models.", category: "audio", tags: ["Speech", "Audio ML"], image: img("audio", "Microphone in a warm home recording studio"), featured: true },
  { slug: "model-playground", title: "Model Playground", body: "LLMs, vision and edge models.", category: "ai", tags: ["LLMs", "Vision", "Edge"], image: img("model-playground", "Abstract carved sphere in terracotta tones"), featured: true },
  { slug: "esp32-experiments", title: "ESP32 Experiments", body: "Microcontroller prototypes: sensors, audio and on-device inference.", category: "edge", tags: ["ESP32", "Embedded"], image: img("esp32", "Circuit board with wires on a desk") },
  { slug: "computer-vision", title: "Computer Vision", body: "Detection, tracking and OCR experiments.", category: "vision", tags: ["YOLO", "OCR"], image: img("computer-vision", "Aerial view of a sunny pedestrian street") },
  { slug: "generative-ai", title: "Generative AI", body: "Trying out LLM tools and image generation.", category: "ai", tags: ["LLMs", "Generative"], image: img("generative-ai", "Abstract swirling sculpted form") },
];

export const featuredLab = labItems.filter(i => i.featured);
