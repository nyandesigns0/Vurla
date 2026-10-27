import ProjectDetailPage from "@/features/projects/project-detail-page";
import { listProjects } from "@/content/server";

// Authored projects are known at build time. Pre-render the complete page so
// visitors without JavaScript never remain inside the streamed loading shell.
export function generateStaticParams() {
  return listProjects().map(({ slug }) => ({ slug }));
}

export default ProjectDetailPage;
