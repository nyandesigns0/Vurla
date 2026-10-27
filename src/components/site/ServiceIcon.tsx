import type { ServiceIconName } from "@/content/contracts";

const iconPaths: Record<ServiceIconName, string> = {
  "building-2": "M4 21V5h11v16M8 9h3m-3 4h3m-3 4h3m4-7h5v11",
  palette: "M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h8A9 9 0 0 0 12 3ZM7 10h.01M10 7h.01M15 7h.01M18 10h.01",
  "tree-pine": "m12 3-5 7h3l-5 7h6v4h2v-4h6l-5-7h3l-5-7Z",
  wrench: "M14 7a4 4 0 0 0-5 5L3 18l3 3 6-6a4 4 0 0 0 5-5l-3-3 3-3a4 4 0 0 0-3 3Z",
  home: "M3 11 12 4l9 7v9H3V11Zm6 9v-6h6v6",
  monitor: "M3 5h18v12H3V5Zm6 16h6m-3-4v4",
  "file-text": "M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6m-6 4h6",
  layout: "M3 4h18v16H3V4Zm6 0v16m0-9h12",
  settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1",
  "check-circle": "M21 11a9 9 0 1 1-3-6.7M8 12l3 3 9-10",
  paintbrush: "m14 4 6 6-8 8H6v-6l8-8ZM4 21c2 0 3-1 3-3",
  lightbulb: "M9 18h6m-5 3h4m-6-7a7 7 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z",
  "map-pin": "M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Zm-8-3v6m-3-3h6",
  users: "M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-1a3 3 0 1 0 0-6M2 21v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2m1-7h1a5 5 0 0 1 5 5v2",
  zap: "m13 2-9 12h7l-1 8 9-12h-7l1-8Z",
  calendar: "M4 6h16v15H4V6Zm0 5h16M8 3v6m8-6v6",
  "hard-hat": "M4 15a8 8 0 0 1 16 0m-18 0h20v4H2v-4Zm10-8v5",
  hammer: "m4 20 8-8m-3-3 4-4 6 6-4 4-6-6Z",
  box: "m4 7 8-4 8 4v10l-8 4-8-4V7Zm0 0 8 4 8-4m-8 4v10",
  layers: "m3 8 9-5 9 5-9 5-9-5Zm0 4 9 5 9-5m-18 4 9 5 9-5",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  code: "m9 7-5 5 5 5m6-10 5 5-5 5m-2-12-2 14",
};

export function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true"><path d={iconPaths[name]} /></svg>;
}
