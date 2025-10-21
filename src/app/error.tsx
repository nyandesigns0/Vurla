"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app:error]", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
		<h1 className="heading-card mb-3">Something went wrong</h1>
      <p className="opacity-70 mb-6">An unexpected error occurred. You can try again.</p>
		<button onClick={reset} className="px-5 py-2 rounded-md text-button button-hover" style={{ background: "var(--primary)", color: "white" }}>Try again</button>
    </div>
  );
}


