// All personal content in one place. Components read from here; nothing is duplicated.
// Source for these details: the approved design board (image/a5a5bc6c-….png). Edit freely.
import { ROUTES } from "@portfolio/shared";

export const profile = {
  name: "Aditya Pratap Singh",
  shortName: "Aditya",
  roles: "CSE Student · Developer · Creative Technologist",
  heroLines: ["CODE.", "MODELS.", "IMPACT."],
  heroSummary: "Building intelligent systems and digital products at the intersection of AI, engineering and design.",
  intro: "A CSE student, developer and creative technologist who enjoys turning ideas into real products.",
  aboutLead: "A CSE student, developer and creative technologist.",
  aboutBody:
    "I enjoy building AI systems, full-stack products and immersive experiences at the intersection of engineering, intelligence and design.",
  // Written from the facts below. Rewrite in your own voice.
  story: [
    "I'm studying Computer Science and Engineering at SRM University – AP. Most of what I build sits where models meet real products: computer vision that watches live video, speech recognition small enough to run on an ESP32, and web apps people use every day.",
    "Outside coursework I co-lead the HackShastra × SRM – AP chapter, where we organise events and workshops. I've also worked as a web developer intern at Codex and as a graphic designer at Purple Bean Agro Limited, which is where my eye for layout and detail comes from.",
  ],
  availability: "Open to internships and collaborations",
  // From the repository's git author. Change if you prefer another address.
  email: "prtapaditya592@gmail.com",
  /** Path under /public, e.g. "/images/portrait.jpg". Leave empty until you add your photo. */
  portrait: "",
  /** Path under /public, e.g. "/resume/Aditya-Pratap-Singh.pdf". Leave empty until the PDF exists. */
  resumePdf: "",
};

export const socials = {
  // From the repository's git author name. Verify this is your GitHub username.
  github: "https://github.com/adisingh592",
  // Add your LinkedIn URL to show it on the Contact and Resume pages.
  linkedin: "",
};

export const navLinks = [
  { to: ROUTES.work, label: "Work" },
  { to: ROUTES.lab, label: "Lab" },
  { to: ROUTES.about, label: "About" },
  { to: ROUTES.contact, label: "Contact" },
] as const;

export const stats = [
  { value: 100, suffix: "+", label: "LeetCode problems" },
  { value: 10, suffix: "+", label: "Competitions" },
  { value: 4, suffix: "", label: "Core domains" },
  { value: Infinity, suffix: "", label: "Ideas to build" },
];

export const education = [
  {
    school: "SRM University – AP",
    degree: "B.Tech in Computer Science and Engineering",
    start: 2023,
    end: 2027,
    // Academic years run July to June.
    startDate: "2023-07-01",
    endDate: "2027-06-30",
  },
];

export const experience = [
  { org: "HackShastra × SRM – AP Chapter", role: "Co-lead", note: "Organised events and workshops", period: "2024 – Present", current: true },
  { org: "Codex", role: "Web Developer Intern", note: "", period: "2025", current: false },
  { org: "Purple Bean Agro Limited", role: "Graphic Designer", note: "", period: "2024 – 2025", current: false },
];

export const capabilities = [
  { key: "ai", title: "AI / ML", body: "Models and intelligent systems." },
  { key: "fullstack", title: "Full Stack", body: "Web applications and APIs." },
  { key: "vision", title: "Computer Vision", body: "Video intelligence and detection." },
  { key: "creative", title: "Creative Tech", body: "3D, design and interactive experiences." },
] as const;

export const processSteps = [
  { key: "think", title: "Think", body: "Understand the problem and who it's for." },
  { key: "design", title: "Design", body: "Sketch flows, interfaces and system shape." },
  { key: "build", title: "Build", body: "Train models, write the API, wire the UI." },
  { key: "test", title: "Test", body: "Measure, break things, fix what matters." },
  { key: "ship", title: "Ship", body: "Deploy, document and keep improving." },
] as const;
