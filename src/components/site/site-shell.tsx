"use client";
import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { RouteTransition } from "./route-transition";

const HomeShellSlots = createContext<{ footer: ReactNode }>({ footer: null });
export const useHomeShellSlots = () => useContext(HomeShellSlots);

/** Server-authored slots cross this boundary as elements, never content imports. */
export function SiteShell({ header, children, footer }: { header: ReactNode; children: ReactNode; footer: ReactNode }) {
  const home = usePathname() === "/";
  return <>
    <RouteTransition />
    {header}
    <main id="main" tabIndex={-1} className="min-h-screen">
      <HomeShellSlots.Provider value={home ? { footer } : { footer: null }}>
        {children}
      </HomeShellSlots.Provider>
    </main>
    {!home && footer}
  </>;
}
