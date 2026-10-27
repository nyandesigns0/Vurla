"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { designTokens } from "@/lib/design-system/tokens";
export function ColorCopyButton({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Copied " + name);
    } catch {
      setStatus("Copy unavailable. Select the value " + value + " manually.");
    }
  }
  return (
    <div className="color-copy">
      <Button
        variant="outline"
        style={{
          background: designTokens.color.night,
          color: designTokens.color.paper,
        }}
        onClick={copy}
        aria-label={"Copy " + name + " " + value}
      >
        <span
          aria-hidden="true"
          className="color-swatch-fill"
          style={{ background: value }}
        />
        <span>{name}</span>
        <span>{value}</span>
      </Button>
      <span className="sr-only" role="status">
        {status}
      </span>
    </div>
  );
}
