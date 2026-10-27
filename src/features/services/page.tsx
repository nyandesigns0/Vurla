import { listServices } from "@/content/server";
import { ServicesPageClient } from "./services-page-client";
export default function ServicesPage() { return <ServicesPageClient services={listServices()} />; }
