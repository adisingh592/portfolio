import { useParams } from "react-router";
import { PagePlaceholder } from "@/components/sections/PagePlaceholder";

export default function CaseStudy() {
  const { slug } = useParams();
  return <PagePlaceholder label="Case study" title={slug ?? "Project"} />;
}
