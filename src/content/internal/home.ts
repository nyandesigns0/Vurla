import type { ChapterId, ServiceId, StatisticMetric } from "@/content/contracts";

// Services-page imagery approvals do not replace the homepage dossier photographs.
export const homeServiceImageOverrides: Partial<Record<ServiceId, string>> = {
  construction: "/media/services/construction.webp",
};

export const homeChapters = ["hero", "projects", "services", "new-work"] as const satisfies readonly ChapterId[];
export const homeHeroSlugs = ["storyworks-campus", "baker-house", "terraced-garden-retreat", "la-puente-residence-renewal", "circular-energy-exchange", "lunar-habitat-immersion", "boba-friend-pop-up"] as const;
export const homeSelectedSlugs = ["baker-house", "terraced-garden-retreat", "storyworks-campus", "stitching-west-baltimore", "la-puente-residence-renewal", "lunar-habitat-immersion"] as const;
export const homeStatistics: StatisticMetric[] = [
  { id: "projects", value: 50, suffix: "+", label: "Projects completed", iconId: "plan" },
  { id: "experience", value: 10, suffix: "+", label: "Years of excellence", iconId: "axis" },
  { id: "awards", value: 5, suffix: "+", label: "Awards won", iconId: "award" },
  { id: "satisfaction", value: 100, suffix: "%", label: "Client satisfaction", iconId: "signal" },
];
export const servicePositioning = {
  architecture: ["From concept to permit", "Spatial clarity shaped into buildable direction."],
  interior: ["Spaces that support daily life", "Material, light and function resolved as one interior system."],
  landscape: ["Grounded in site and season", "Outdoor rooms that connect ecology, use and long-term care."],
  construction: ["Building with accountable craft", "Documentation and field coordination carried through delivery."],
  fabrication: ["Made at the scale of touch", "Custom objects and assemblies developed through direct making."],
  "digital-solutions": ["Tools for seeing what comes next", "Digital models and immersive workflows that clarify decisions."],
} as const;
