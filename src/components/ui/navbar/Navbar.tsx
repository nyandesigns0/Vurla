"use client";

import Link from "next/link";
import { DynamicLink } from "@/components/site/DynamicLink";
import { usePathname } from "next/navigation";
import { useSite } from "@/context/SiteContext";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { useEffect, useState } from "react";

export function Navbar() {
	const pathname = usePathname();
	const { isMobileNavOpen, setMobileNavOpen } = useSite();
	const [isVisible, setIsVisible] = useState(false);

	const links = [
		{ href: "/", label: "Home" },
		{ href: "/projects", label: "Projects" },
		{ href: "/team", label: "Team" },
		{ href: "/contact", label: "Contact" },
	];

	useEffect(() => {
		// Trigger slide-in animation after component mounts
		const timer = setTimeout(() => setIsVisible(true), 100);
		return () => clearTimeout(timer);
	}, []);

	return (
		<header 
			className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ease-out ${
				isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
			}`}
		>
			<div className="max-w-6xl mx-auto">
				<div 
					className="flex items-center justify-between px-6 py-4 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:shadow-xl"
					style={{ 
						background: "rgba(var(--background-rgb, 255, 255, 255), 0.8)",
						borderColor: "var(--border)",
						boxShadow: "var(--shadow-lg)"
					}}
				>
					<DynamicLink 
						href="/" 
						className="text-nav-bold tracking-wide transition-all duration-300 hover:scale-105" 
						style={{ fontFamily: "var(--font-serif)", color: "var(--foreground)" }} 
						aria-label="Vurla home"
					>
						Vurla
					</DynamicLink>
					
					<nav className="hidden md:flex items-center gap-8">
						{links.map((l) => (
							<DynamicLink 
								key={l.href} 
								href={l.href} 
								className="text-nav relative group transition-colors duration-300 hover:text-opacity-80"
								style={{
									color: pathname === l.href ? "var(--primary)" : "var(--foreground)"
								}}
							>
								{l.label}
								<span 
									className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" 
									style={{ background: "var(--primary)" }} 
								/>
							</DynamicLink>
						))}
						<ThemeToggle />
					</nav>
					
					<div className="flex items-center gap-3 md:hidden">
						<ThemeToggle />
						<button 
							aria-label="Toggle menu" 
							onClick={() => setMobileNavOpen(!isMobileNavOpen)}
							className="p-2 hover:opacity-70 transition-all duration-300 hover:scale-110 active:scale-95 rounded-md"
						>
							{isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
						</button>
					</div>
				</div>
				
				{isMobileNavOpen && (
					<div 
						className="mt-2 rounded-2xl backdrop-blur-md border animate-slide-in-down"
						style={{ 
							borderColor: "var(--border)",
							background: "rgba(var(--background-rgb, 255, 255, 255), 0.8)",
							boxShadow: "var(--shadow-lg)"
						}}
					>
						<nav className="flex flex-col px-6 py-4 gap-2">
							{links.map((l, idx) => (
								<DynamicLink 
									key={l.href} 
									href={l.href} 
										className="py-2 text-nav rounded-md px-3 hover:bg-opacity-5 transition-all duration-300 hover:translate-x-1"
									style={{
										color: pathname === l.href ? "var(--primary)" : "var(--foreground)",
										animation: `slideInLeft 0.3s ease-out backwards`,
										animationDelay: `${idx * 50}ms`
									}}
									onClick={() => setMobileNavOpen(false)}
								>
									{l.label}
								</DynamicLink>
							))}
						</nav>
					</div>
				)}
			</div>
		</header>
	);
}
