"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { NavigationLink } from "@/content/contracts";
import { BrandMark } from "./BrandMark";
export function NavbarClient({ links }: { links: NavigationLink[] }) {
 const [open, setOpen] = useState(false); const pathname = usePathname();
 useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; addEventListener("keydown", close); return () => removeEventListener("keydown", close); }, []);
 return <header className="fixed inset-x-4 top-4 z-50"><div className="mx-auto max-w-7xl border border-black/20 bg-[#f8f8f6]/95 px-5 py-3 backdrop-blur"><div className="flex items-center justify-between"><Link href="/" aria-label="Vurla home"><BrandMark className="h-8" showWordmark /></Link><nav className="hidden gap-8 md:flex">{links.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href ? "font-semibold" : ""}>{link.label}</Link>)}</nav><button className="min-h-11 min-w-11 md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>{open && <nav className="flex flex-col gap-2 border-t pt-3 md:hidden">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</nav>}</div></header>;
}
