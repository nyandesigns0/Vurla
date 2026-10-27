"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { NavigationLink } from "@/content/contracts";
import { BrandMark } from "./BrandMark";
import { Button } from "@/components/ui/button";
export function NavbarClient({ links }: { links: NavigationLink[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLElement>(null);
  const current = (href: string) =>
    pathname === href
      ? ("page" as const)
      : href !== "/" && pathname.startsWith(href + "/")
        ? ("location" as const)
        : undefined;
  useEffect(() => {
    if (!open) return;
    mobileNav.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    addEventListener("keydown", close);
    return () => removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header" role="banner">
      <div className="header-row">
        <Link className="brand-cell" href="/" aria-label="Vurla home">
          <BrandMark className="h-8" showWordmark inverse />
        </Link>
        <span className="header-note kicker">Built with intention</span>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={current(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button
          ref={toggle}
          type="button"
          variant="ghost"
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </Button>
      </div>
      {open && (
        <nav
          ref={mobileNav}
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={current(link.href)}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
