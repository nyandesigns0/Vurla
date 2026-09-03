import { listProjects } from "@/content/server";
import { HomePageClient } from "./home-page-client";
export default function HomePage() { return <HomePageClient featured={listProjects().slice(0, 5)} />; }
