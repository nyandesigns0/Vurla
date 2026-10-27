import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { MAX_CONTACT_BYTES } from "@/features/contact/attachments";
function multipart(images: Array<{ type: string; bytes: number[] }>) {
 const boundary = "contact-test-boundary";
 const encoder = new TextEncoder();
 const chunks: Uint8Array[] = [];
 for (const [name, value] of Object.entries({ name: "Test", contactType: "email", contact: "test@example.com", message: "Image inquiry" })) {
  chunks.push(encoder.encode(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`));
 }
 for (const image of images) {
  chunks.push(encoder.encode(`--${boundary}\r\nContent-Disposition: form-data; name="images"; filename="reference.png"\r\nContent-Type: ${image.type}\r\n\r\n`), new Uint8Array(image.bytes), encoder.encode("\r\n"));
 }
 chunks.push(encoder.encode(`--${boundary}--\r\n`));
 const bytes = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
 let offset = 0;
 for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
 return new NextRequest("http://localhost/api/contact", { method: "POST", headers: { "content-type": `multipart/form-data; boundary=${boundary}` }, body: bytes });
}
const request = (body: unknown) => new NextRequest("http://localhost/api/contact", { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } });
describe("POST /api/contact", () => {
 it("accepts multipart contact details with multiple image files", async () => {
  const response = await POST(multipart([{ type: "image/png", bytes: [137,80,78,71,13,10,26,10] }, { type: "image/jpeg", bytes: [255,216,255] }]));
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ success: true });
 });
 it("rejects files whose contents do not match their image type", async () => {
  expect((await POST(multipart([{ type: "image/png", bytes: [1,2,3] }]))).status).toBe(400);
 });
 it("rejects unsupported attachments and more than five images", async () => {
  expect((await POST(multipart([{ type: "text/plain", bytes: [1] }]))).status).toBe(400);
  expect((await POST(multipart(Array.from({ length: 6 }, () => ({ type: "image/jpeg", bytes: [255,216,255] }))))).status).toBe(400);
 });
 it("rejects oversized uploads before parsing them", async () => {
  const upload = multipart([]);
  upload.headers.set("content-length", String(MAX_CONTACT_BYTES + 1));
  expect((await POST(upload)).status).toBe(413);
 });
 it.each(["phone", "sms"])("accepts %s as the only contact method", async (contactType) => {
  const response = await POST(request({ name: "Test", contactType, contact: "+1 (626) 555-0100", message: "Hello" }));
  expect(response.status).toBe(200);
 });
 it.each([
  { contactType: "email", contact: "6265550100" },
  { contactType: "phone", contact: "test@example.com" },
  { contactType: "sms", contact: "123" },
  { contactType: "unsupported", contact: "contact" },
 ])("rejects invalid contact details: $contactType / $contact", async (details) => {
  const response = await POST(request({ name: "Test", message: "Hello", ...details }));
  expect(response.status).toBe(400);
 });
 it("accepts a valid request while explicitly disclosing simulated-only processing", async () => {
  const response = await POST(request({ name: "A", contactType: "email", contact: "a@example.com", message: "Hello" }));
  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body).toEqual({
   success: true,
   message: "Submitted for simulated processing. No message was sent and no contact data or images were stored.",
  });
  expect(body.message).not.toMatch(/delivered|we(?:'|’)ll|get back|follow.?up/i);
 });
 it("rejects invalid input with issues", async () => { const response = await POST(request({ name: "", contactType: "email", contact: "bad", message: "" })); expect(response.status).toBe(400); expect(await response.json()).toMatchObject({ success: false, message: "Invalid input" }); });
 it("returns a safe failure for malformed JSON", async () => { const response = await POST(new NextRequest("http://localhost/api/contact", { method: "POST", body: "{" })); expect(response.status).toBe(500); expect(await response.json()).toMatchObject({ success: false, message: "Server error" }); });
});
