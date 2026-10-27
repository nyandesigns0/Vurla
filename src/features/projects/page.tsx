import { listProjects } from "@/content/server";
import { ProjectsPageClient } from "./projects-page-client";

export default function ProjectsPage() {
  return <ProjectsPageClient projects={listProjects()} />;
}
