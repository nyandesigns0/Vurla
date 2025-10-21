import Link from "next/link";
import { SiLinkedin, SiX } from "react-icons/si";

export function Footer() {
	return (
		<footer className="mt-20 border-t transition-all duration-300" style={{ borderColor: "var(--border)" }}>
			<div className="max-w-6xl mx-auto px-6 py-12">
				{/* Footer grid with company info and links */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 stagger-children">
					{/* Brand and description */}
					<div className="animate-slide-in-up">
						<h3 className="text-body-lg-semibold mb-2 transition-colors duration-300 hover:text-primary">Vurla</h3>
						<p className="text-body-sm opacity-70 mb-4 transition-opacity duration-300">Architecture that elevates space. Thoughtful, resilient environments for living, working, and gathering.</p>
						<a href="mailto:hello@vurla.com" className="text-body-sm opacity-80 hover:opacity-100 transition-all duration-300 hover:translate-x-1 inline-block">hello@vurla.com</a>
					</div>

					{/* Quick links */}
					<div className="animate-slide-in-up animate-delay-1">
						<h4 className="text-body-sm-semibold uppercase tracking-wider mb-4 transition-colors duration-300" style={{ color: "var(--secondary)" }}>Services</h4>
						<nav className="flex flex-col gap-2">
							<Link href="/projects" className="text-body-sm opacity-80 hover:opacity-100 transition-all duration-300 hover:translate-x-1 inline-block">Residential</Link>
							<Link href="/projects" className="text-body-sm opacity-80 hover:opacity-100 transition-all duration-300 hover:translate-x-1 inline-block">Commercial</Link>
							<Link href="/projects" className="text-body-sm opacity-80 hover:opacity-100 transition-all duration-300 hover:translate-x-1 inline-block">Public Realm</Link>
						</nav>
					</div>

					{/* Resources and CTA */}
					<div className="animate-slide-in-up animate-delay-2">
						<h4 className="text-body-sm-semibold uppercase tracking-wider mb-4 transition-colors duration-300" style={{ color: "var(--secondary)" }}>Get in Touch</h4>
						<p className="text-body-sm opacity-80 mb-4 transition-opacity duration-300">Ready to start your next project?</p>
						<Link href="/contact" className="inline-block px-4 py-2 rounded-md text-button transition-all duration-300 hover:opacity-90 button-hover active:scale-95" style={{ background: "var(--primary)", color: "white" }}>
							Start a project
						</Link>
					</div>
				</div>

				{/* Bottom bar with copyright and socials */}
				<div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in" style={{ borderColor: "var(--border)" }}>
					<p className="text-caption opacity-60 transition-opacity duration-300">© {new Date().getFullYear()} Vurla. All rights reserved.</p>
					<div className="flex items-center gap-6">
						<a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer" className="opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-125">
							<SiLinkedin size={18} />
						</a>
						<a href="https://x.com" aria-label="X" target="_blank" rel="noreferrer" className="opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-125">
							<SiX size={18} />
						</a>
						<Link href="/contact" className="text-caption opacity-60 hover:opacity-100 transition-all duration-300 hover:translate-x-1">Work with us</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}


