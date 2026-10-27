import { getHomeContent } from "@/content/server";
import { HomePageClient } from "./home-page-client";
export default function HomePage() { return <HomePageClient content={getHomeContent()} />; }
