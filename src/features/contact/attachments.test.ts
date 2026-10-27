import { describe, expect, it } from "vitest";
import { MAX_IMAGE_BYTES, validateImages } from "./attachments";

describe("contact image limits", () => {
  const image = { name: "room.png", type: "image/png", size: 100 };
  it("accepts five valid images and rejects excess, oversized, empty, or unsupported files", () => {
    expect(validateImages(Array(5).fill(image))).toBeNull();
    expect(validateImages(Array(6).fill(image))).toMatch(/up to 5/);
    expect(validateImages([{ ...image, size: MAX_IMAGE_BYTES + 1 }])).toMatch(/5 MB/);
    expect(validateImages([{ ...image, size: 0 }])).toMatch(/empty/);
    expect(validateImages([{ ...image, type: "image/svg+xml" }])).toMatch(/choose a JPG/);
  });
});
