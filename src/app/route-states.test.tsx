import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RouteError from "./error";
import { RouteLoading as Loading } from "@/components/site/RouteLoading";
import NotFound from "./not-found";
import { ComponentSpecimens } from "@/features/design/component-specimens";

describe("route recovery and loading", () => {
  it("offers the actual route reset callback after a rendering failure", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const reset = vi.fn();
    try {
      render(
        <RouteError error={new Error("Local regression")} reset={reset} />,
      );
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Something went wrong",
      );
      fireEvent.click(screen.getByRole("button", { name: "Try again" }));
      expect(reset).toHaveBeenCalledOnce();
    } finally {
      log.mockRestore();
    }
  });

  it("names the shared loading state without offering fake actions", () => {
    const page = render(<Loading />);
    expect(
      screen.getByRole("status", { name: "Loading content" }),
    ).toBeVisible();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(page.container.querySelector(".route-loading > .grain-texture")).toBeInTheDocument();
  });

  it("gives unknown routes an ordinary route back to the project catalog", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Project not found",
    );
    expect(
      screen.getByRole("link", { name: "Explore projects" }),
    ).toHaveAttribute("href", "/projects");
  });

  it("announces guide actions and keeps processing controls unavailable", () => {
    render(<ComponentSpecimens />);
    expect(screen.getByRole("button", { name: "Processing…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Processing…" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Primary action" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Primary action selected",
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Try again" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Retry action selected",
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Clear All Filters" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Filters cleared in specimen",
    );
  });
});
