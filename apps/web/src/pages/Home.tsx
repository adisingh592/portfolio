import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { Capabilities } from "@/components/sections/Capabilities";
import { ContactPreview } from "@/components/sections/ContactPreview";
import { Hero } from "@/components/sections/Hero";
import { LabPreview } from "@/components/sections/LabPreview";
import { Process } from "@/components/sections/Process";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Stats } from "@/components/sections/Stats";
import { TechnologyMarquee } from "@/components/sections/TechnologyMarquee";

export default function Home() {
  useDocumentTitle();
  return (
    <>
      <Hero />
      <AboutPreview />
      <Stats />
      <Capabilities />
      <SelectedWork />
      <LabPreview />
      <Process />
      <TechnologyMarquee />
      <ContactPreview />
    </>
  );
}
