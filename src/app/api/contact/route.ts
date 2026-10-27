import { NextRequest, NextResponse } from "next/server";
import { contactRequestSchema } from "@/features/contact/contract";
import { MAX_CONTACT_BYTES, matchesImageType, validateImages } from "@/features/contact/attachments";

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    let images: File[] = [];
    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      // Bound the streamed request as well as each file, including chunked uploads.
      if (Number(req.headers.get("content-length")) > MAX_CONTACT_BYTES) {
        return NextResponse.json({ success: false, message: "Attachments are too large." }, { status: 413 });
      }
      const reader = req.body?.getReader();
      if (!reader) return NextResponse.json({ success: false, message: "Missing form data." }, { status: 400 });
      const chunks: Uint8Array[] = [];
      let length = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > MAX_CONTACT_BYTES) {
          await reader.cancel();
          return NextResponse.json({ success: false, message: "Attachments are too large." }, { status: 413 });
        }
        chunks.push(value);
      }
      const bytes = new Uint8Array(length);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      const form = await new Response(bytes, { headers: { "content-type": req.headers.get("content-type")! } }).formData();
      body = Object.fromEntries(["name", "contactType", "contact", "message"].map((key) => [key, form.get(key)]));
      const entries = form.getAll("images");
      if (entries.some((entry) => typeof entry === "string")) {
        return NextResponse.json({ success: false, message: "Choose valid image files." }, { status: 400 });
      }
      images = entries as File[];
    } else {
      // Preserve JSON support for clients without attachments.
      body = await req.json();
    }
    const parsed = contactRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const issue = validateImages(images);
    if (issue) return NextResponse.json({ success: false, message: issue }, { status: 400 });
    for (const file of images) {
      if (!matchesImageType(new Uint8Array(await file.slice(0, 12).arrayBuffer()), file.type)) {
        return NextResponse.json({ success: false, message: `${file.name}: this file is not a valid image.` }, { status: 400 });
      }
    }
    // This endpoint validates the request only; no delivery or storage is configured.
    return NextResponse.json({
      success: true,
      message: "Submitted for simulated processing. No message was sent and no contact data or images were stored.",
    });
  } catch (err) {
    console.error("[contact:api]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
