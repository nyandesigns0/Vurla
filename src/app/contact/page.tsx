"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { FAQSection } from "@/components/site/FAQSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ContactPage() {
	const [status, setStatus] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		const form = new FormData(e.currentTarget);
		const payload = {
			name: String(form.get("name") || ""),
			email: String(form.get("email") || ""),
			phone: String(form.get("phone") || ""),
			message: String(form.get("message") || ""),
		};
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await res.json();
			setStatus(data.message || (data.success ? "Message sent successfully!" : "Submission failed"));
			if (data.success) {
				(e.target as HTMLFormElement).reset();
			}
		} catch (err) {
			console.error("[contact:submit]", err);
			setStatus("Submission failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative py-32 bg-background overflow-hidden">
				<div className="absolute inset-0 mesh-gradient opacity-30" />
				<div className="section-container relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center mb-16"
					>
						<h1 className="heading-section mb-6">
							Get in <span className="text-gradient">Touch</span>
						</h1>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
							Ready to discuss your next project? We'd love to hear from you. Reach out to our team and let's create something extraordinary together.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Contact Info and Form */}
			<section className="py-16 md:py-20 bg-background">
				<div className="section-container">
					<div className="grid lg:grid-cols-2 gap-16">
						{/* Contact Information */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
						>
							<h2 className="heading-section-sm mb-12">
								Contact <span className="text-gradient">Information</span>
							</h2>

							<div className="space-y-8">
								{/* Address */}
								<motion.div
									whileHover={{ scale: 1.02 }}
									className="group bg-background border-2 border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
								>
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
											<MapPin className="w-6 h-6 text-primary" />
										</div>
										<div>
											<h3 className="heading-card-sm mb-2">Address</h3>
											<p className="text-body text-muted-foreground leading-relaxed">
												123 Architecture Street<br />
												Design City, DC 12345
											</p>
										</div>
									</div>
								</motion.div>

								{/* Phone */}
								<motion.div
									whileHover={{ scale: 1.02 }}
									className="group bg-background border-2 border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
								>
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
											<Phone className="w-6 h-6 text-primary" />
										</div>
										<div>
											<h3 className="heading-card-sm mb-2">Phone</h3>
											<a href="tel:+1234567890" className="text-body text-muted-foreground hover:text-primary transition-colors duration-300">
												+1 (234) 567-890
											</a>
										</div>
									</div>
								</motion.div>

								{/* Email */}
								<motion.div
									whileHover={{ scale: 1.02 }}
									className="group bg-background border-2 border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
								>
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
											<Mail className="w-6 h-6 text-primary" />
										</div>
										<div>
											<h3 className="heading-card-sm mb-2">Email</h3>
											<a href="mailto:hello@vurla.com" className="text-body text-muted-foreground hover:text-primary transition-colors duration-300">
												hello@vurla.com
											</a>
										</div>
									</div>
								</motion.div>

								{/* Hours */}
								<motion.div
									whileHover={{ scale: 1.02 }}
									className="group bg-background border-2 border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
								>
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
											<Clock className="w-6 h-6 text-primary" />
										</div>
										<div>
											<h3 className="heading-card-sm mb-2">Office Hours</h3>
											<div className="space-y-1 text-body text-muted-foreground">
												<p>Monday - Friday: 9:00 AM - 6:00 PM</p>
												<p>Saturday: 10:00 AM - 4:00 PM</p>
												<p>Sunday: Closed</p>
											</div>
										</div>
									</div>
								</motion.div>
							</div>
						</motion.div>

						{/* Contact Form */}
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
						>
							<h2 className="heading-section-sm mb-12">
								Send us a <span className="text-gradient">Message</span>
							</h2>
							<form onSubmit={onSubmit} className="space-y-6">
								{/* Name */}
								<div className="space-y-2">
									<label className="text-body-semibold text-foreground">
										Name *
									</label>
									<input 
										name="name" 
										className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-0 transition-all duration-300 hover:border-primary/50" 
										required 
										placeholder="Your full name"
									/>
								</div>

								{/* Email */}
								<div className="space-y-2">
									<label className="text-body-semibold text-foreground">
										Email *
									</label>
									<input 
										type="email" 
										name="email" 
										className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-0 transition-all duration-300 hover:border-primary/50" 
										required 
										placeholder="your@email.com"
									/>
								</div>

								{/* Phone */}
								<div className="space-y-2">
									<label className="text-body-semibold text-foreground">
										Phone
									</label>
									<input 
										name="phone" 
										className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-0 transition-all duration-300 hover:border-primary/50" 
										placeholder="+1 (555) 123-4567"
									/>
								</div>

								{/* Message */}
								<div className="space-y-2">
									<label className="text-body-semibold text-foreground">
										Message *
									</label>
									<textarea 
										name="message" 
										rows={5} 
										className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-0 transition-all duration-300 hover:border-primary/50 resize-none" 
										required 
										placeholder="Tell us about your project..."
									/>
								</div>

								{/* Submit Button */}
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Button 
										type="submit"
										disabled={isLoading}
										size="lg"
										variant="premium"
										className="w-full"
									>
										{isLoading ? "Sending..." : "Send Message"}
									</Button>
								</motion.div>

								{/* Status Message */}
								<AnimatePresence>
									{status && (
										<motion.div 
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											aria-live="polite"
											className={`rounded-xl p-4 text-body text-center transition-all duration-300 ${
												status.includes("successfully") || status.includes("Submitted") 
													? "bg-success/10 text-success border border-success/20" 
													: "bg-error/10 text-error border border-error/20"
											}`}
										>
											{status}
										</motion.div>
									)}
								</AnimatePresence>
							</form>
						</motion.div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<FAQSection />

			{/* CTA Section */}
			<section className="py-32 relative overflow-hidden bg-gradient-to-br from-secondary via-primary to-accent">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_50%)]" />
				</div>
				
				<div className="section-container text-center relative z-10">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8 }}
						className="max-w-4xl mx-auto"
					>
						<h2 className="heading-section mb-8 text-white">
							Let's Build Your Vision
						</h2>
						<p className="text-xl mb-10 text-white/90 leading-relaxed max-w-2xl mx-auto">
							Whether you have a detailed project scope or just an idea, we're here to help bring it to life. Contact us today to get started.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl">
								<Link href="/projects">View Our Work</Link>
							</Button>
							<Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary transition-all duration-300">
								<Link href="/team">Meet Our Team</Link>
							</Button>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}


