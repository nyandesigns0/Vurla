export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MAX_IMAGES = 5;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_CONTACT_BYTES = MAX_IMAGES * MAX_IMAGE_BYTES + 64 * 1024;

export function validateImages(files: ReadonlyArray<{ name: string; type: string; size: number }>) {
  if (files.length > MAX_IMAGES) return "You can attach up to 5 images.";
  for (const file of files) {
    if (!IMAGE_TYPES.includes(file.type)) return `${file.name}: choose a JPG, PNG, WebP, or GIF image.`;
    if (!file.size) return `${file.name}: this file is empty.`;
    if (file.size > MAX_IMAGE_BYTES) return `${file.name}: images must be 5 MB or smaller.`;
  }
  return null;
}

export function matchesImageType(bytes: Uint8Array, type: string) {
  const starts = (signature: number[]) => signature.every((value, index) => bytes[index] === value);
  if (type === "image/jpeg") return starts([0xff, 0xd8, 0xff]);
  if (type === "image/png") return starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (type === "image/gif") return starts([0x47, 0x49, 0x46, 0x38]) && [0x37, 0x39].includes(bytes[4]) && bytes[5] === 0x61;
  return type === "image/webp" && starts([0x52, 0x49, 0x46, 0x46]) && [0x57, 0x45, 0x42, 0x50].every((value, index) => bytes[index + 8] === value);
}
