import { listProjects, listServices } from "@/content/server";
import { HomePageClient } from "./home-page-client";
export default function HomePage() { return <HomePageClient projects={listProjects()} services={listServices()} />; }
