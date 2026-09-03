import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";
import { Input } from "./Input";
describe("core primitives", () => { it("renders semantic accessible controls", () => { render(<><Button>Send</Button><label htmlFor="email">Email</label><Input id="email" /></>); expect(screen.getByRole("button", { name: "Send" })).toBeEnabled(); expect(screen.getByLabelText("Email")).toBeInTheDocument(); }); });
