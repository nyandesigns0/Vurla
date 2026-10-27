"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/ui/StatePanel";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app:error]", error);
  }, [error]);
  return (
    <div className="page shell state-page">
      <p className="kicker">Vurla / Recovery</p>
      <StatePanel
        level={1}
        title="Something went wrong"
        description="An unexpected error occurred. You can try again."
      >
        <Button onClick={reset}>Try again</Button>
      </StatePanel>
    </div>
  );
}
