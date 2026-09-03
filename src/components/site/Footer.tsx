import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiLinkedin, SiX } from "react-icons/si";
import { BrandMark } from "@/components/site/BrandMark";

export function Footer() {
  return (
    <footer className="mt-20 bg-[#080808] text-[#f8f8f6]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
          <div>
            <BrandMark className="mb-7 h-10" inverse showWordmark />
            <p className="mb-5 max-w-sm text-sm leading-relaxed text-white/60">A spatial practice for purposeful architecture, objects, and environments.</p>
            <a href="mailto:hello@vurla.com" className="text-sm text-white/80 transition hover:text-white">hello@vurla.com</a>
          </div>
          <div>
            <h2 className="mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/45">Practice</h2>
            <nav className="flex flex-col gap-2.5">
              <Link href="/projects" className="text-sm text-white/75 transition hover:translate-x-1 hover:text-white">Architecture</Link>
              <Link href="/projects" className="text-sm text-white/75 transition hover:translate-x-1 hover:text-white">Interiors</Link>
              <Link href="/projects" className="text-sm text-white/75 transition hover:translate-x-1 hover:text-white">Making</Link>
            </nav>
          </div>
          <div>
            <h2 className="mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/45">New work</h2>
            <p className="mb-5 text-sm leading-relaxed text-white/60">Bring us in early. We are listening.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-white/25 px-4 py-2 text-sm text-white transition hover:bg-white hover:text-black">
              Start a conversation <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 md:flex-row">
          <p className="text-xs text-white/45">© {new Date().getFullYear()} Vurla. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer" className="text-white/55 transition hover:text-white"><SiLinkedin size={18} /></a>
            <a href="https://x.com" aria-label="X" target="_blank" rel="noreferrer" className="text-white/55 transition hover:text-white"><SiX size={18} /></a>
            <Link href="/contact" className="text-xs text-white/55 transition hover:text-white">Work with us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
