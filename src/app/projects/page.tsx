import { projects } from "@/lib/data/projects";
import { ProjectsPageClient } from "./projects-page-client";

export default function ProjectsPage() {
  return <ProjectsPageClient projects={projects} />;
}
