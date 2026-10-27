"use client";
import { StatePanel } from "@/components/ui/StatePanel";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Field } from "@/components/ui/Field";
import { Card } from "@/components/ui/Card";
import { Badge, Select, Checkbox, Accordion } from "@/components/ui/controls";
import { ActionLink } from "@/components/ui/ActionLink";
import { SurfaceStateSpecimens } from "./surface-state-specimens";
export function ComponentSpecimens() {
  const [status, setStatus] = useState("");
  return (
    <div className="specimens">
      <SurfaceStateSpecimens />
      <h3>Buttons and navigation</h3>
      <div className="actions">
        <Button onClick={() => setStatus("Primary action selected")}>
          Primary action
        </Button>
        <Button
          variant="outline"
          onClick={() => setStatus("Secondary action selected")}
        >
          Secondary action
        </Button>
        <Button
          variant="secondary"
          onClick={() => setStatus("Supporting action selected")}
        >
          Supporting action
        </Button>
        <Button
          variant="destructive"
          onClick={() => setStatus("Error appearance specimen")}
        >
          Error appearance
        </Button>
        <Button disabled>Disabled</Button>
        <Button disabled aria-busy>
          Processing…
        </Button>
        <Button
          variant="link"
          onClick={() => setStatus("Local action selected")}
        >
          Local action
        </Button>
      </div>
      <p role="status">{status || "Activate a specimen to see its state."}</p>
      <div className="actions">
        <ActionLink href="/projects">Explore projects</ActionLink>
        <a className="text-action" href="/contact">
          Text navigation
        </a>
      </div>
      <div className="specimen-grid">
        <Card>
          <h3>Card and badge</h3>
          <Badge>Practice / Vurla</Badge>
          <p>
            Structural surfaces have fine rules. Standalone controls and cards
            use square corners.
          </p>
        </Card>
        <Card>
          <h3>Fields</h3>
          <div className="specimen-fields">
            <Field label="Name" htmlFor="spec-name">
              <Input id="spec-name" placeholder="Your name" />
            </Field>
            <Field label="Email — error state" htmlFor="spec-email">
              <Input
                id="spec-email"
                defaultValue="name@"
                aria-invalid
                aria-describedby="spec-email-error"
              />
              <span id="spec-email-error" className="field-error">
                Enter a valid email address.
              </span>
            </Field>
            <Field label="Disabled field">
              <Input disabled value="Unavailable" readOnly />
            </Field>
            <Field label="Message">
              <Textarea rows={3} placeholder="Tell us about your project" />
            </Field>
            <Field label="Service">
              <Select defaultValue="architecture">
                <option value="architecture">Architecture</option>
                <option value="interior">Interior</option>
              </Select>
            </Field>
            <Checkbox label="Keep the current selection" defaultChecked />
          </div>
        </Card>
      </div>
      <Accordion title="Accordion — expand for details">
        <p>
          Native disclosure works with keyboard and touch. The answer remains
          semantic content, with no animation required.
        </p>
      </Accordion>
      <Accordion title="Open disclosure specimen" open>
        <p>
          Visible expanded content uses the same production primitive as Contact
          FAQs.
        </p>
      </Accordion>
      <h3>Shared state fixtures</h3>
      <p>
        These specimens render production state panels and loading cards for
        review.
      </p>
      <div className="state-fixtures">
        <StatePanel
          level={3}
          title="Something went wrong"
          description="An unexpected error occurred. You can try again."
        >
          <Button onClick={() => setStatus("Retry action selected")}>
            Try again
          </Button>
        </StatePanel>
        <StatePanel
          level={3}
          title="No projects found"
          description="Try adjusting your search criteria or clear all filters to see all projects."
        >
          <Button
            variant="outline"
            onClick={() => setStatus("Filters cleared in specimen")}
          >
            Clear All Filters
          </Button>
        </StatePanel>
        <StatePanel
          level={3}
          title="Project not found"
          description="The page you are looking for could not be found."
        >
          <ActionLink href="/projects">Explore projects</ActionLink>
        </StatePanel>
        <div role="img" aria-label="Loading content specimen">
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
