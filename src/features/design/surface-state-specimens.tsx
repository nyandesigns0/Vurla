"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { designTokens } from "@/lib/design-system/tokens";

/** Actual production controls, with native interaction states on each local surface. */
export function SurfaceStateSpecimens() {
  return <section className="surface-state-specimens" aria-labelledby="surface-states-heading">
    <h3 id="surface-states-heading">Controls on local surfaces</h3>
    <p>Use Tab, hover, or press to inspect real states. Disabled controls do not activate. Texture sits behind content, never over text.</p>
    <div className="surface-state-grid">
      {Object.keys(designTokens.color).map((surface) => <div key={surface} data-surface={surface} className="surface-state-panel print-surface">
        <h4>{surface}</h4>
        <div className="actions">
          <Button type="button" aria-label={`${surface} primary action`}>Primary action</Button>
          <Button type="button" variant="outline" aria-label={`${surface} secondary action`}>Secondary action</Button>
          <Button type="button" disabled aria-label={`${surface} disabled action`}>Unavailable</Button>
        </div>
        <label htmlFor={`surface-${surface}-field`}>Project name</label>
        <Input id={`surface-${surface}-field`} placeholder="Your project" />
        <label htmlFor={`surface-${surface}-invalid`}>Email — invalid state</label>
        <Input id={`surface-${surface}-invalid`} defaultValue="name@" aria-invalid="true" aria-describedby={`surface-${surface}-error`} />
        <p className="field-error" id={`surface-${surface}-error`}>Enter a valid email address.</p>
      </div>)}
    </div>
  </section>;
}
