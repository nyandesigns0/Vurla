"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSite } from "@/context/SiteContext";

/* Short title: Dev-only debug overlay panel */
export function DebugPanel() {
	const { isDebugOpen, lastError } = useSite();
	const pathname = usePathname();
	const [size, setSize] = useState({ w: 0, h: 0 });

	useEffect(() => {
		function onResize() {
			setSize({ w: window.innerWidth, h: window.innerHeight });
		}
		onResize();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	if (process.env.NODE_ENV === "production" || !isDebugOpen) return null;

	return (
		<div style={{ position: "fixed", bottom: 8, right: 8, zIndex: 9999 }}>
			<div style={{ background: "var(--background)", color: "var(--foreground)", border: "2px solid var(--border)", padding: 12, borderRadius: 8, maxWidth: 360 }}>
				<div style={{ fontWeight: 700, marginBottom: 6 }}>Debug</div>
				<div>Route: {pathname}</div>
				<div>Window: {size.w} × {size.h}</div>
				{lastError ? <div style={{ marginTop: 6, color: "var(--accent)" }}>Last error: {lastError}</div> : null}
			</div>
		</div>
	);
}


