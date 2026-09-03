"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Service } from "@/content/contracts";
import { ServiceIcon } from "@/components/site/ServiceIcon";

export function ServicesPageClient({ services }: { services: Service[] }) {
	return (
		<div className="min-h-screen bg-background">
			<section className="relative overflow-hidden py-32">
				<div className="absolute inset-0 mesh-gradient opacity-30" />
				<div className="section-container relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="mx-auto max-w-3xl text-center"
					>
						<p className="text-body-sm-semibold mb-5 uppercase tracking-[0.2em] text-primary">What we do</p>
						<h1 className="heading-section mb-6">
							Designing spaces with <span className="text-gradient">purpose</span>
						</h1>
						<p className="text-xl leading-relaxed text-muted-foreground">
							From first ideas to final installation, Vurla brings every part of the design process together.
						</p>
					</motion.div>
				</div>
			</section>

			<section className="border-y border-border bg-muted/30 py-20">
				<div className="section-container">
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
						{services.map((service, index) => {
							return (
								<motion.article
									key={service.title}
									initial={{ opacity: 0, y: 24 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: index * 0.08 }}
									className="rounded-2xl border-2 border-border bg-background p-7 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl"
								>
									<div className="mb-6 flex items-center gap-4">
										<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-[var(--background)]">
											<ServiceIcon name={service.icon} className="h-6 w-6" />
										</div>
										<h2 className="heading-card-sm">{service.title}</h2>
									</div>
									<ul className="space-y-3">
										{service.subItems.map((item) => (
											<li key={item.name} className="flex items-center gap-3 text-body-sm text-muted-foreground">
												<CheckCircle className="h-4 w-4 shrink-0 text-primary" />
												{item.name}
											</li>
										))}
									</ul>
								</motion.article>
							);
						})}
					</div>
				</div>
			</section>

			<section
				className="relative overflow-hidden py-28 text-white"
				style={{ background: "linear-gradient(135deg, #171717 0%, #3d3d3d 55%, #141414 100%)" }}
			>
				<div className="section-container relative z-10 text-center">
					<h2 className="heading-section mb-6">Have a project in mind?</h2>
					<p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-white/90">
						Tell us about your vision and we&apos;ll help find the right way forward.
					</p>
					<Button asChild size="lg" className="bg-white text-primary shadow-xl transition-transform hover:scale-105 hover:bg-white/90">
						<Link href="/contact">Start a conversation <ArrowRight className="ml-2 h-4 w-4" /></Link>
					</Button>
				</div>
			</section>
		</div>
	);
}
