"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Building2, ArrowRight, Sparkles, ChevronDown, Home as HomeIcon, Palette, Wrench, Monitor, TreePine, FileText, Layout, Paintbrush, Lightbulb, MapPin, HardHat, Settings, Hammer, Zap, Code, Box, Layers, Eye, Users, Calendar, CheckCircle } from "lucide-react";
import { projects } from "@/lib/data/projects";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RippleCanvas } from "@/components/ui/ripple-canvas";

const stats = [
	{ number: 50, suffix: "+", label: "Projects Completed" },
	{ number: 10, suffix: "+", label: "Years of Excellence" },
	{ number: 5, suffix: "+", label: "Awards Won" },
	{ number: 100, suffix: "%", label: "Client Satisfied" },
];

export default function Home() {
	const [animatedNumbers, setAnimatedNumbers] = useState([0, 0, 0, 0]);
	const statsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!statsRef.current) return;
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) {
				// Animate counters only when section is visible
				const duration = 800; // Reduced to 0.8 seconds for faster loading
				const startTime = performance.now();
				
				const animate = (currentTime: number) => {
					const elapsed = currentTime - startTime;
					const progress = Math.min(elapsed / duration, 1);
					
					// Use easeOutCubic for smooth deceleration
					const easeOutCubic = 1 - Math.pow(1 - progress, 3);
					
					setAnimatedNumbers(prev => {
						const newNumbers = [...prev];
						stats.forEach((stat, index) => {
							newNumbers[index] = Math.floor(stat.number * easeOutCubic);
						});
						return newNumbers;
					});
					
					if (progress < 1) {
						requestAnimationFrame(animate);
					}
				};
				
				requestAnimationFrame(animate);
				obs.disconnect();
			}
		}, {
			threshold: 0.3, // Reduced threshold for faster trigger (30% visible)
			rootMargin: '0px 0px -5% 0px' // Reduced margin for earlier trigger
		});
		obs.observe(statsRef.current);
		return () => obs.disconnect();
	}, []);

	const services = [
		{
			icon: Building2,
			title: "Architecture",
			headline: "From Concept to Reality",
			subItems: [
				{ name: "Conceptual Design", icon: FileText },
				{ name: "Space Programming", icon: Layout },
				{ name: "Schematic Design", icon: Building2 },
				{ name: "Design Development", icon: Settings },
				{ name: "Construction Documents", icon: FileText },
				{ name: "Building Permits", icon: CheckCircle }
			],
			projectCount: 24
		},
		{
			icon: Palette,
			title: "Interior",
			headline: "Spaces That Inspire",
			subItems: [
				{ name: "Space Planning", icon: Layout },
				{ name: "Material Selection", icon: Paintbrush },
				{ name: "FF&E Specification", icon: HomeIcon },
				{ name: "Interior Styling", icon: Palette },
				{ name: "Color Consultation", icon: Paintbrush },
				{ name: "Lighting Design", icon: Lightbulb }
			],
			projectCount: 18
		},
		{
			icon: TreePine,
			title: "Landscape",
			headline: "Nature Meets Design",
			subItems: [
				{ name: "Site Planning", icon: MapPin },
				{ name: "Hardscape Design", icon: Settings },
				{ name: "Planting Design", icon: TreePine },
				{ name: "Playground Design", icon: Users },
				{ name: "Irrigation Systems", icon: Zap },
				{ name: "Sustainable Landscapes", icon: TreePine }
			],
			projectCount: 15
		},
		{
			icon: Wrench,
			title: "Construction",
			headline: "Building Excellence",
			subItems: [
				{ name: "Project Management", icon: Calendar },
				{ name: "Quality Control", icon: CheckCircle },
				{ name: "Site Supervision", icon: HardHat },
				{ name: "Cost Estimation", icon: Users },
				{ name: "Construction Documentation", icon: FileText },
				{ name: "Contract Administration", icon: Settings }
			],
			projectCount: 32
		},
		{
			icon: HomeIcon,
			title: "Fabrication",
			headline: "Crafted to Perfection",
			subItems: [
				{ name: "Custom Furniture", icon: HomeIcon },
				{ name: "Millwork", icon: Hammer },
				{ name: "Metalwork", icon: Wrench },
				{ name: "Joinery", icon: Settings },
				{ name: "Prototyping", icon: Box },
				{ name: "Finishing & Installation", icon: CheckCircle }
			],
			projectCount: 12
		},
		{
			icon: Monitor,
			title: "Digital Solutions",
			headline: "Innovation Through Technology",
			subItems: [
				{ name: "BIM Services", icon: Layers },
				{ name: "3D Visualization", icon: Eye },
				{ name: "VR Walkthroughs", icon: Monitor },
				{ name: "Custom Scripting", icon: Code },
				{ name: "Parametric Design", icon: Settings },
				{ name: "Digital Fabrication", icon: Zap }
			],
			projectCount: 8
		},
	];

	// Get projects by category for featured section
	const getProjectByCategory = (category: string) => {
		return projects.find(project => project.category === category) || projects[0];
	};

	const categoryProjects = [
		{ category: "residential", label: "Residential", project: getProjectByCategory("residential") },
		{ category: "commercial", label: "Commercial", project: getProjectByCategory("commercial") },
		{ category: "public", label: "Urban Planning", project: getProjectByCategory("public") },
		{ category: "interior", label: "Interior", project: getProjectByCategory("interior") },
		{ category: "fabrication", label: "Fabrication", project: getProjectByCategory("fabrication") },
		{ category: "digital", label: "Digital", project: getProjectByCategory("digital") },
	];

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative h-screen flex items-center justify-center overflow-hidden">
				{/* RippleCanvas Background - Full Coverage */}
				<RippleCanvas 
					autoRippleInterval={2500}
					rippleSpeed={3}
					imageUrl="https://plus.unsplash.com/premium_photo-1679559272162-5f7173f155f5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=892"
					className="absolute inset-0 z-0"
				/>
				
				{/* Subtle overlay for text readability */}
				<div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/30 z-[1]" />

				<div className="relative z-10 section-container text-center">
					<div className="flex flex-col items-center justify-center gap-3 max-w-5xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
							className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background/90 border border-primary/30 mb-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
						>
							<Sparkles className="w-5 h-5 text-primary animate-pulse" />
							<span className="text-body-sm-semibold text-gradient">Award-Winning Design</span>
						</motion.div>
						<motion.h1
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
								className="heading-hero text-foreground mb-8 hero-title"
								style={{ 
									textShadow: `
										-1px -1px 0 white,
										1px -1px 0 white,
										-1px 1px 0 white,
										1px 1px 0 white,
										-1px 0 0 white,
										1px 0 0 white,
										0 -1px 0 white,
										0 1px 0 white
									`
								}}
						>
								Architecture that
								<br />
								<span className="hero-title-highlight" style={{ 
									textShadow: `
										-1px -1px 0 white,
										1px -1px 0 white,
										-1px 1px 0 white,
										1px 1px 0 white,
										-1px 0 0 white,
										1px 0 0 white,
										0 -1px 0 white,
										0 1px 0 white
									`,
									color: '#FF9D1B'
								}}>elevates space.</span>
						</motion.h1>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
							className="flex flex-col sm:flex-row gap-4 justify-center mt-16"
						>
							<Button asChild size="lg" variant="premium" className="group">
								<Link href="/projects">
									Explore Our Work.
									<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">Start Your Project</Link>
							</Button>
						</motion.div>
					</div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
					className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
				>
					<ChevronDown className="w-8 h-8 text-primary animate-bounce" />
				</motion.div>
			</section>

			{/* Stats Section */}
			<section ref={statsRef} className="py-32 bg-background border-y border-border/30">
				<div className="section-container">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-12">
						{stats.map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, scale: 0.5 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ 
									duration: 0.4, // Reduced from 0.6 to 0.4 seconds
									delay: index * 0.05, // Reduced from 0.1 to 0.05 seconds
									type: "spring",
									stiffness: 120 // Increased stiffness for snappier animation
								}}
								className="text-center group"
							>
								<div className="text-stat text-gradient mb-3 group-hover:scale-110 transition-transform duration-300">
									{animatedNumbers[index]}{stat.suffix}
								</div>
								<div className="text-body-medium text-muted-foreground">{stat.label}</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Featured Projects by Category */}
			<section className="py-32 bg-background">
				<div className="section-container">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-center mb-20"
					>
							<h2 className="heading-section mb-6">
								Featured <span className="text-gradient">Projects</span>
						</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
							Explore our portfolio across different categories of architectural excellence.
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
						{categoryProjects.map((categoryData, index) => (
							<motion.div
								key={categoryData.category}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								whileHover={{ y: -8 }}
								className="group bg-background border-2 border-border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
							>
								{/* Category Name */}
								<div className="p-6 pb-4">
									<h3 className="heading-card text-gradient mb-4">
										{categoryData.label}
									</h3>
								</div>

								{/* Project Image */}
								<div className="relative h-48 overflow-hidden">
									<Image
										src={categoryData.project.image}
										alt={categoryData.project.title}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-500"
									/>
								</div>

								{/* Project Details */}
								<div className="p-6 pt-4">
									<h4 className="heading-card-sm mb-2 group-hover:text-gradient transition-colors duration-300">
										{categoryData.project.title}
									</h4>
									<p className="text-body-sm text-muted-foreground mb-4 line-clamp-2">
										{categoryData.project.description}
									</p>
									<Button asChild variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-foreground transition-colors duration-300">
										<Link href={`/projects?category=${categoryData.category}`}>
											See More
											<ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
										</Link>
									</Button>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section className="py-32 relative overflow-hidden bg-muted/30">
				<div className="absolute inset-0 mesh-gradient opacity-30" />
				
				<div className="section-container relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-center mb-20"
					>
							<h2 className="heading-section mb-6">
								Our <span className="text-gradient">Services</span>
						</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
							Comprehensive design and construction services tailored to your vision.
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
						{services.map((service, index) => {
							const Icon = service.icon;
							return (
								<motion.div
									key={service.title}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									whileHover={{ y: -8 }}
									className="group bg-background border-2 border-border rounded-2xl p-4 md:p-5 lg:p-6 shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-500 service-card-hover"
								>
									{/* Header with Icon, Title, and Project Count */}
									<div className="flex items-start justify-between mb-3 md:mb-4">
										<div className="flex items-start gap-3 md:gap-4">
											<div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" style={{ backgroundColor: "var(--primary)" }}>
												<Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
											</div>
											<div className="pt-0.5">
												<h3 className="heading-card-sm group-hover:text-gradient transition-all duration-300">
													{service.title}
												</h3>
											</div>
										</div>
										<div className="bg-primary/15 text-primary px-2 md:px-3 py-1 rounded-full text-caption-semibold border border-primary/20">
											{service.projectCount} Projects
										</div>
									</div>

									{/* Headline */}
									<h4 className="heading-sub text-gradient" style={{ marginBottom: "1rem" }}>
										{service.headline}
									</h4>


									{/* Services Grid */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-5">
										{service.subItems.map((item, itemIndex) => {
											const ItemIcon = item.icon;
											return (
												<div key={itemIndex} className="flex items-center gap-2 text-body-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 py-0.5">
													<ItemIcon className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" />
													<span className="truncate font-medium">{item.name}</span>
												</div>
											);
										})}
									</div>

									{/* CTA Button */}
									<Button asChild variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-foreground transition-all duration-300 py-2 font-semibold">
										<Link href={`/projects?category=${service.title.toLowerCase()}`}>
											Learn More
											<ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
										</Link>
									</Button>
								</motion.div>
							);
						})}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-32 relative overflow-hidden bg-gradient-to-br from-secondary via-primary to-accent">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_50%)]" />
				</div>
				
				<div className="section-container text-center relative z-10">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="max-w-4xl mx-auto"
					>
							<h2 className="heading-section mb-8 text-white">
							Ready to Start Your Project?
						</h2>
						<p className="text-xl mb-10 text-white/90 leading-relaxed max-w-2xl mx-auto">
							Let&apos;s discuss how we can bring your vision to life with innovative, sustainable design solutions that exceed expectations.
						</p>
						<Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl">
							<Link href="/contact">Get in Touch</Link>
						</Button>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
