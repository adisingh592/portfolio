export type ProjectCategory = "web" | "ai-ml" | "mobile" | "design";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  year: number;
  category: ProjectCategory;
  tags: string[];
  cover?: string;
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
}
