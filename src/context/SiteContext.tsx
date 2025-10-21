"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

/* Short title: Global site UI context */
type SiteContextValue = {
	isMobileNavOpen: boolean;
	setMobileNavOpen: (open: boolean) => void;
	isDebugOpen: boolean;
	setDebugOpen: (open: boolean) => void;
	lastError: string | null;
	setLastError: (msg: string | null) => void;
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const [isDebugOpen, setIsDebugOpen] = useState(false);
	const [lastError, setLastError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const setMobileNavOpen = useCallback((open: boolean) => setIsMobileNavOpen(open), []);
	const setDebugOpen = useCallback((open: boolean) => setIsDebugOpen(open), []);
	const setError = useCallback((msg: string | null) => setLastError(msg), []);
	const setLoading = useCallback((loading: boolean) => setIsLoading(loading), []);

	const value = useMemo(
		() => ({ isMobileNavOpen, setMobileNavOpen, isDebugOpen, setDebugOpen, lastError, setLastError: setError, isLoading, setIsLoading: setLoading }),
		[isMobileNavOpen, setMobileNavOpen, isDebugOpen, setDebugOpen, lastError, setError, isLoading, setLoading]
	);

	return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
	const ctx = useContext(SiteContext);
	if (!ctx) throw new Error("useSite must be used within SiteProvider");
	return ctx;
}


