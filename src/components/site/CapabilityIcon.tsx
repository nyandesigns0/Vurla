import type { CapabilityIconId } from "@/content/contracts";

const capabilityIconPaths: Record<CapabilityIconId, string> = {
  "architecture-conceptual-design": "M5 8.5 12 4l7 4.5v8L12 21l-7-4.5v-8Zm0 0 7 4.5 7-4.5M12 13v8M5 16.5l14-8",
  "architecture-space-programming": "M4 5h7v4h9v10H4V5Zm7 4v10m0-5h9M7 8h1m6 4h3",
  "architecture-schematic-design": "M4 4h16v16H4V4Zm4 0v5m0 3v3m0 3v2m0-5h5m3 0h4m-5-4h5v9h-5v-9Z",
  "architecture-design-development": "M4 7h15l1 3H5L4 7Zm1 5h14l1 3H6l-1-3Zm1 5h13l1 3H7l-1-3ZM8 4v16",
  "architecture-construction-documents": "M5 3h10l4 4v14H5V3Zm10 0v5h4M8 12h8m-8 3h8m-8 3h5M15 18h1",
  "architecture-building-permits": "M4 9h16M5 19h14M7 9v8m3-8v8m4-8v8m3-8v8M3 21h18M6 7l6-4 6 4M18 4l2 2 2-3",
  "interior-space-planning": "M4 4h16v16H4V4Zm6 0v9h10M10 13H7m3 0v7m5-4h5M7 7v2m10 7v2",
  "interior-material-selection": "M5 5h10v10H5V5Zm4 4h10v10H9V9M6 13l7-7m-3 12 8-8m-3 8 3-3",
  "interior-ffe-specification": "M5 14h10v4H5v-4Zm2 4v3m6-3v3M7 14V8h6v6m4-9h3v13h-3M17 8h3",
  "interior-interior-styling": "M4 19h16M5 12h14M7 12V7h4v5m3 0V5h3v7M6 19v-4h6v4m3 0v-5h3v5",
  "interior-color-consultation": "M4 5h10v10H4V5Zm5 4h10v10H9V9Zm5 5h6v6h-6v-6ZM17 16h3m-1-2v4",
  "interior-lighting-design": "M4 5h16M7 5v4m10-4v4M5 15l2-6 2 6m6 0 2-6 2 6M3 19h18M7 9h10",
  "landscape-site-planning": "M4 6 18 4l2 14-14 2L4 6Zm4 3h7v6H8V9Zm7 6 4 3M6 20l2-5M18 7V2m-2 2 2-2 2 2",
  "landscape-hardscape-design": "M4 5h16v14H4V5Zm0 5h16M4 15h16M9 5v5m6-5v5m-8 0v5m6-5v5m5-5v5M9 15v4m6-4v4",
  "landscape-planting-design": "M4 18h16M7 18v-5m5 5V9m5 9v-4M4 10a3 3 0 1 0 6 0 3 3 0 1 0-6 0Zm5-5a3 3 0 1 0 6 0 3 3 0 1 0-6 0Zm5 6a3 3 0 1 0 6 0 3 3 0 1 0-6 0Z",
  "landscape-playground-design": "M3 19h18M6 19V8h9v5m-9-5 4-4 5 4M10 8v11m5-6h4l-4 6m0-6-2 6",
  "landscape-irrigation-systems": "M3 12h18M7 12V7m5 5V5m5 7V8M5 7h4m1-2h4m1 3h4M6 16l1-2 1 2m3 0 1-2 1 2m3 0 1-2 1 2",
  "landscape-sustainable-landscapes": "M3 7h7v3H6v3h7v3h8M13 16c2-5 5-6 8-6-1 4-3 7-8 7m0 0v4M8 21h10",
  "construction-project-management": "M4 6h4v4H4V6Zm6 4h4v4h-4v-4Zm6 4h4v4h-4v-4ZM8 8h4v4m2 0h4v4M4 20h16",
  "construction-quality-control": "M5 5h14v14H5V5Zm-2 3h4m10 0h4M8 3v4m8-4v4M3 16h4m10 0h4M8 17v4m8-4v4M8 12l3 3 6-7",
  "construction-site-supervision": "M4 19h16M6 19V8h12v11M6 12h12M10 8v11m4-11v11M3 5h12m0 0 5 4m-5-4 5-1",
  "construction-cost-estimation": "M4 18h16M5 14h4v4H5v-4Zm5-4h4v8h-4v-8Zm5-5h4v13h-4V5ZM4 21h16M5 7h6m-6 3h4",
  "construction-construction-documentation": "M5 3h14v18H5V3Zm3 3v12m0-7h8M11 6h5v5h-5V6Zm0 8h5m-5 3h3M3 8h4m-4 7h4",
  "construction-contract-administration": "M3 5h8v14H3V5Zm10 0h8v14h-8V5ZM6 9h2m8 0h2M6 13h2m8 0h2M9 16h6m-2-2 2 2-2 2",
  "fabrication-custom-furniture": "M5 12h12v5H5v-5Zm2 5v4m8-4v4M7 12V7l5-3 5 3v5m-10-3h10",
  "fabrication-millwork": "M5 3h14v18H5V3Zm3 3h8v12H8V6Zm4 0v12M8 11h8M10 13h.5m3.5 0h.5",
  "fabrication-metalwork": "M4 6h7l3 4h6v8h-8l-3-4H4V6Zm7 0v8m3-4v8M7 10h.01m10 4h.01M3 4h9",
  "fabrication-joinery": "M3 7h8v3h3V7h7v5h-7v5h-3v-5H3V7Zm0 12h7m4 0h7M8 17v4m8-4v4",
  "fabrication-prototyping": "M3 8l4-2 4 2v5l-4 2-4-2V8Zm7 2 4-2 4 2v5l-4 2-4-2v-5Zm7 2 4-2v5l-4 2m-14-9 4 2 4-2m-4 2v5m3-5 4 2 4-2m-4 2v5",
  "fabrication-finishing-installation": "M4 5h10v4H4V5Zm0 6h10v8H4v-8Zm12-6h4v16m-4-2h6M14 9l2 2M7 14h4",
  "digital-bim-services": "M4 7h13l3 3H7L4 7Zm1 5h12l3 3H8l-3-3Zm1 5h11l3 3H9l-3-3ZM10 4v16",
  "digital-3d-visualization": "M3 6h6l4 5-4 7H3V6Zm10 5 8-5v12l-8-7Zm2 0 4-2v4l-4-2ZM9 6v12",
  "digital-vr-walkthroughs": "M3 5h7v14H3V5Zm11 0h7v14h-7V5ZM10 8l4 3m0 2-4 3M6 9h1m10 6h1M7 19l5-7 5 7",
  "digital-custom-scripting": "M3 6h4v4H3V6Zm7 7h4v4h-4v-4Zm7-7h4v4h-4V6ZM7 8h4v7h-1m4 0h3V8m-8 3 2 2m4-2 2 2M4 19h16",
  "digital-ai-integration": "M4 18h16M5 15l4-8 5 5 5-8M5 15h.01M9 7h.01M14 12h.01M19 4h.01M5 12h4m0-2h5m0-3h5",
  "digital-digital-fabrication": "M4 6h14v12H4V6Zm3 9V9h4v3h4V8h3M7 15h8v3M18 8h3v5l-3 2M6 3h12",
};

export function CapabilityIcon({
  id,
  className,
}: {
  id: CapabilityIconId;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d={capabilityIconPaths[id]} />
    </svg>
  );
}
