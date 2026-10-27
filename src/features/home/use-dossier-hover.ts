"use client";

import { useStationaryHover } from "./use-stationary-hover";

const DOSSIER_HOVER_SELECTORS = [".service-dossier", ".dossier-statement"] as const;

export function useDossierHover() {
  return useStationaryHover<HTMLDivElement>(DOSSIER_HOVER_SELECTORS);
}
