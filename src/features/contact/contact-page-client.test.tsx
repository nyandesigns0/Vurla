import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getSiteConfig } from "@/content/testing";
import { ContactPageClient } from "./contact-page-client";

describe("ContactPageClient", () => {
  it("renders the migrated public contact details", () => {
    render(<ContactPageClient site={getSiteConfig()} faqs={[]} />);

    expect(screen.getByText("La Puente, CA")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "(626) 466-5346" })).toHaveAttribute("href", "tel:6264665346");
    expect(screen.getByRole("link", { name: "vurla.living@gmail.com" })).toHaveAttribute("href", "mailto:vurla.living@gmail.com");
  });
});
