"use client";

import { useSite } from "@/context/SiteContext";
import { LoadingSpinner } from "@/components/utils/LoadingSpinner";

export function LoadingOverlay() {
  const { isLoading } = useSite();

  return (
    <LoadingSpinner 
      isVisible={isLoading}
      spinnerSize="md"
      overlayOpacity={0.05}
      zIndex={50}
    />
  );
}
