import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
const request = (body: unknown) => new NextRequest("http://localhost/api/contact", { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } });
describe("POST /api/contact", () => {
 it("accepts a valid request without claiming delivery", async () => { const response = await POST(request({ name: "A", email: "a@example.com", message: "Hello" })); expect(response.status).toBe(200); expect(await response.json()).toMatchObject({ success: true }); });
 it("rejects invalid input with issues", async () => { const response = await POST(request({ name: "", email: "bad", message: "" })); expect(response.status).toBe(400); expect(await response.json()).toMatchObject({ success: false, message: "Invalid input" }); });
 it("returns a safe failure for malformed JSON", async () => { const response = await POST(new NextRequest("http://localhost/api/contact", { method: "POST", body: "{" })); expect(response.status).toBe(500); expect(await response.json()).toMatchObject({ success: false, message: "Server error" }); });
});
