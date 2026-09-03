import { getSiteConfig } from "@/content/server";
import { NavbarClient } from "./navbar-client";
export function Navbar() { return <NavbarClient links={getSiteConfig().navigation} />; }
