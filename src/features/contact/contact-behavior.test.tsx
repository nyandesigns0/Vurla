import { describe, it, expect, vi, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ContactPageClient } from "./contact-page-client";
import { getSiteConfig } from "@/content/testing";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
function mount() {
  render(<ContactPageClient site={getSiteConfig()} faqs={[]} />);
}
function fill() {
  fireEvent.change(screen.getByLabelText("Name *"), {
    target: { value: "Test Visitor" },
  });
  fireEvent.change(screen.getByLabelText("Email address *"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Message *"), {
    target: { value: "A local regression test" },
  });
}
describe("contact behavior", () => {
  it("previews and removes images, submits remaining files, and retains them after a failure", async () => {
    const revoke = vi.fn();
    vi.stubGlobal("URL", class extends URL {
      static createObjectURL = vi.fn(() => "blob:preview");
      static revokeObjectURL = revoke;
    });
    const request = vi.fn().mockRejectedValue(new Error("offline"));
    vi.stubGlobal("fetch", request);
    mount();
    fill();
    const one = new File(["one"], "room.png", { type: "image/png" });
    const two = new File(["two"], "plan.jpg", { type: "image/jpeg" });
    fireEvent.change(screen.getByLabelText("Add images"), { target: { files: [one, two] } });
    expect(screen.getByAltText("Attachment preview: room.png")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remove room.png" }));
    expect(screen.queryByAltText("Attachment preview: room.png")).not.toBeInTheDocument();
    expect(revoke).toHaveBeenCalledWith("blob:preview");
    fireEvent.click(screen.getByRole("button", { name: "Submit preview" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Submission failed"));
    expect(request.mock.calls[0][1].body.getAll("images")).toEqual([two]);
    expect(screen.getByAltText("Attachment preview: plan.jpg")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Add images"), { target: { files: [new File(["text"], "notes.txt", { type: "text/plain" })] } });
    expect(screen.getByRole("alert")).toHaveTextContent("choose a JPG, PNG, WebP, or GIF");
    expect(screen.queryByText("notes.txt")).not.toBeInTheDocument();
  });

  it("has four fields, adapts contact details to the method, and retains drafts while switching", () => {
    const { container } = render(<ContactPageClient site={getSiteConfig()} faqs={[]} />);
    expect(container.querySelectorAll('form input:not([type="file"]), form select, form textarea')).toHaveLength(4);
    expect(container.querySelector(".contact-project")).toBeNull();
    const method = screen.getByLabelText("Best way to contact *");
    const email = screen.getByLabelText("Email address *");
    fireEvent.change(email, { target: { value: "draft@example.com" } });
    fireEvent.change(method, { target: { value: "phone" } });
    const phone = screen.getByLabelText("Phone number *");
    expect(phone).toHaveAttribute("type", "tel");
    expect(phone).toHaveAttribute("autocomplete", "tel");
    expect(phone).toHaveValue("");
    fireEvent.change(phone, { target: { value: "+1 (626) 555-0100" } });
    fireEvent.change(method, { target: { value: "sms" } });
    expect(screen.getByLabelText("Phone number *")).toHaveValue("+1 (626) 555-0100");
    fireEvent.change(method, { target: { value: "email" } });
    expect(screen.getByLabelText("Email address *")).toHaveValue("draft@example.com");
  });

  it("validates and submits a phone-only inquiry without requiring an email", async () => {
    const request = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, message: "Preview accepted." }) });
    vi.stubGlobal("fetch", request);
    mount();
    fill();
    fireEvent.change(screen.getByLabelText("Best way to contact *"), { target: { value: "phone" } });
    fireEvent.change(screen.getByLabelText("Phone number *"), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit preview" }));
    expect(request).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByLabelText("Phone number *")).toHaveFocus());
    expect(screen.getByText(/Enter a valid phone number/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Phone number *"), { target: { value: "+1 (626) 555-0100" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit preview" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Preview accepted."));
    const payload = Object.fromEntries(request.mock.calls[0][1].body.entries());
    expect(payload).toEqual({ name: "Test Visitor", contactType: "phone", contact: "+1 (626) 555-0100", message: "A local regression test" });
    expect(screen.getByLabelText("Best way to contact *")).toHaveValue("email");
    expect(screen.getByLabelText("Email address *")).toHaveValue("");
  });

  it("uses matching full-width introductions and preserves descriptive copy and answers", () => {
    const faqs = [{ question: "How do we begin?", answer: "Tell us about your project." }];
    const { container } = render(<ContactPageClient site={getSiteConfig()} faqs={faqs} />);
    expect(screen.getByRole("heading", { level: 1, name: "Let’s shape what’s next" })).toBeInTheDocument();
    expect(screen.getByText("Get in touch")).toHaveClass("section-rail-label");
    expect(screen.getByText("Your questions")).toHaveClass("section-rail-label");
    expect(screen.getByRole("region", { name: "Clarity before we begin" })).toHaveClass("faq-section");
    expect(screen.getByRole("heading", { level: 2, name: "Clarity before we begin" })).toHaveAttribute("id", "faq-heading");
    expect(container.querySelectorAll(".page-plate--section")).toHaveLength(0);
    expect(container.querySelector(".faq-section")).not.toHaveClass("faq-section--split");
    expect(screen.queryByRole("link", { name: "Ask us directly" })).not.toBeInTheDocument();
    expect(container.querySelectorAll(".page-plate-index")[0]).toHaveTextContent("04");
    expect(container.querySelectorAll(".page-plate-index")[1]).toHaveTextContent("Q/A");
    expect(screen.getByText(/Ready to discuss your next project/)).toHaveTextContent("let's create something extraordinary together.");
    expect(screen.getByText(/Find answers to common questions/)).toHaveTextContent("when working with Vurla.");
    expect(screen.getByText(faqs[0].question)).toBeInTheDocument();
    expect(screen.getByText(faqs[0].answer)).toBeInTheDocument();
    expect(container.querySelector(".faq-cta")).toBeNull();
    expect(screen.queryByRole("link", { name: "Contact Us Today" })).not.toBeInTheDocument();
    const faq = container.querySelector(".faq-section")!;
    expect(faq.nextElementSibling).toHaveClass("chapter-scroll-bar");
    expect(container.querySelector(".closing-chapter-source")?.lastElementChild).toHaveClass("chapter-scroll-bar");
    expect(container.querySelector(".chapter-scroll-cue")).toHaveTextContent("Scroll to explore");
  });

  it("uses the shared opening, subtitle, crosshair and continuous page frame", () => {
    const { container } = render(<ContactPageClient site={getSiteConfig()} faqs={[]} />);
    expect(container.querySelectorAll(".page-plate--roomy")).toHaveLength(2);
    expect(container.querySelector(".contact-opening-frame .page-plate-crosshair")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".closing-chapter-source > .page-side-borders")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".closing-chapter-source > .contact-background-grain")).toBeInTheDocument();
  });

  it("retains readable contact details and dots when the decorative grain canvas is unavailable", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    const site = getSiteConfig();
    const { container } = render(<ContactPageClient site={site} faqs={[]} />);
    const information = container.querySelector(".contact-information")!;
    expect(information.querySelectorAll(":scope > .grain-texture")).toHaveLength(1);
    expect(information.querySelector(".contact-information-grain")).toHaveAttribute("aria-hidden", "true");
    expect(information.querySelector(":scope > .dot-texture")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: site.email })).toHaveAttribute("href", `mailto:${site.email}`);
    expect(screen.getByRole("link", { name: site.phone })).toBeInTheDocument();
    expect(readFileSync("src/features/contact/contact-page.css", "utf8")).toContain(".contact-information > .contact-information-grain { z-index: -1; }");
  });

  it("renders its sections without decorative page rails", () => {
    const { container } = render(
      <ContactPageClient site={getSiteConfig()} faqs={[]} />,
    );
    expect(container.querySelectorAll(".page-rail")).toHaveLength(0);
    expect(container.querySelector(".contact-columns")).toBeInTheDocument();
    expect(container.querySelector(".faq-section")).toBeInTheDocument();
    expect(container.querySelector(".closing-panel")).toBeInTheDocument();
    expect(container.querySelector(".closing-panel")).toHaveClass("closing-panel--chapter");
    expect(container.querySelector(".closing-chapter-plate > .closing-chapter-border")).toBeInTheDocument();
    expect(container.querySelector(".closing-panel-scroll-cue")).toBeNull();
    expect(container.querySelector(".contact-page")?.lastElementChild).toHaveClass("closing-chapter");
  });

  it("associates labels/errors, focuses the invalid field, and never submits invalid content", async () => {
    const request = vi.fn();
    vi.stubGlobal("fetch", request);
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Submit preview" }));
    await waitFor(() => expect(screen.getByLabelText("Name *")).toHaveFocus());
    expect(screen.getByText("Enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Tell us a little about your project.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address *")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(request).not.toHaveBeenCalled();
  });
  it("announces honest simulated success, pending state, and resets the form", async () => {
    let resolve!: (value: unknown) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((r) => {
            resolve = r;
          }),
      ),
    );
    mount();
    fill();
    fireEvent.click(screen.getByRole("button", { name: "Submit preview" }));
    expect(screen.getByRole("button", { name: "Submitting..." })).toBeDisabled();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    resolve({
      ok: true,
      json: async () => ({
        success: true,
        message: "Submitted for simulated processing. No email was sent.",
      }),
    });
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("No email was sent"),
    );
    expect(screen.getByLabelText("Name *")).toHaveValue("");
  });
  it("announces transport failure and keeps entered data", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    mount();
    fill();
    fireEvent.click(screen.getByRole("button", { name: "Submit preview" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Submission failed. Please try again.",
      ),
    );
    expect(screen.getByLabelText("Name *")).toHaveValue("Test Visitor");
  });

  it("removes the preview note while keeping direct contact available", () => {
    mount();
    expect(screen.queryByText(/Preview only — no message is sent/)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: getSiteConfig().email })).toHaveAttribute("href", `mailto:${getSiteConfig().email}`);

  });

  it("keeps entered data when the server rejects the submission", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ success: false, message: "Please try again." }) }));
    mount();
    fill();
    fireEvent.click(screen.getByRole("button", { name: "Submit preview" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Please try again."));
    expect(screen.getByLabelText("Message *")).toHaveValue("A local regression test");
    expect(screen.getByRole("button", { name: "Submit preview" })).toBeEnabled();
  });

  it("offers only Services and Projects as its closing actions", () => {
    const { container } = render(<ContactPageClient site={getSiteConfig()} faqs={[]} />);
    const actions = container.querySelectorAll(".closing-panel-actions a");
    expect(actions).toHaveLength(2);
    expect(actions[0]).toHaveTextContent("Explore Our Services");
    expect(actions[0]).toHaveAttribute("href", "/services");
    expect(actions[1]).toHaveTextContent("View Our Projects");
    expect(actions[1]).toHaveAttribute("href", "/projects");
    expect(container.querySelector(".contact-closing-links")).toBeNull();
  });
});
