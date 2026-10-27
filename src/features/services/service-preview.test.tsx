import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { listServices, getHomeContent } from "@/content/testing";
import { ServiceSheet } from "./service-sheet";
import { createPreviewImageLoader } from "./preview-image-loader";

const architecture = listServices()[0];
let downloads: FakeImage[];
const originalObserver = globalThis.IntersectionObserver;
class FakeImage {
  src = "";
  onload: (() => Promise<void>) | null = null;
  onerror: (() => void) | null = null;
  decode = vi.fn(() => Promise.resolve());
  constructor() { downloads.push(this); }
}
const pointer = (target: Element | Window, type: string, pointerType = "mouse") => {
  const event = new Event(type, { bubbles: true });
  Object.defineProperties(event, { pointerType: { value: pointerType }, clientX: { value: 100 }, clientY: { value: 150 } });
  fireEvent(target, event);
};
const settle = async (src: string) => {
  const image = downloads.find(item => item.src === src);
  expect(image).toBeDefined();
  await act(async () => { await image!.onload?.(); });
};
const current = (container: HTMLElement) => container.querySelector(".service-preview-layer--current img");
beforeEach(() => { downloads = []; vi.stubGlobal("Image", FakeImage); });
afterEach(() => { globalThis.IntersectionObserver = originalObserver; vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("Architecture capability previews", () => {
  it("maps exactly the six approved assets without changing homepage projections or other services", () => {
    const versions = ["v4", "v3", "v1", "v1", "v1", "v2"];
    architecture.subItems.forEach((item, index) => {
      expect(item.previewImage?.src).toBe(`/media/services/capabilities/${item.capabilityIcon}-${versions[index]}.webp`);
      expect(existsSync(`public${item.previewImage!.src}`)).toBe(true);
      expect(item.previewImage).toMatchObject({ width: 1536, height: 1024 });
      expect(item.previewImage!.alt.length).toBeGreaterThan(50);
    });
    expect(listServices().every(service => service.subItems.every(item => item.previewImage))).toBe(true);
    expect(JSON.stringify(getHomeContent())).not.toContain("/media/services/capabilities/");
  });

  it("starts with the original image, six named buttons and hidden three-band decorative copies", () => {
    const { container } = render(<ServiceSheet service={architecture} index={0} active />);
    expect(current(container)).toHaveAttribute("src", architecture.image.src);
    expect(screen.getAllByRole("link")).toHaveLength(6);
    expect(screen.getByRole("link", { name: "Conceptual Design" })).toHaveAttribute("data-preview-selected", "false");
    expect(container.querySelectorAll('.service-preview-scan[aria-hidden="true"] .footer-scan-band')).toHaveLength(18);
    expect(downloads).toHaveLength(0);
  });

  it("keeps the current image until load AND decode, then retains it over the section", async () => {
    const { container } = render(<ServiceSheet service={architecture} index={0} active />);
    pointer(screen.getByRole("link", { name: "Conceptual Design" }), "pointermove");
    let decoded!: () => void;
    downloads[0].decode.mockReturnValue(new Promise<void>(resolve => { decoded = resolve; }));
    let loading!: Promise<void>;
    act(() => { loading = downloads[0].onload!(); });
    expect(current(container)).toHaveAttribute("src", architecture.image.src);
    await act(async () => { decoded(); await loading; });
    expect(current(container)).toHaveAttribute("src", architecture.subItems[0].previewImage!.src);
    pointer(container.querySelector("h2")!, "pointermove");
    expect(screen.getByRole("link", { name: "Conceptual Design" })).toHaveAttribute("data-preview-selected", "true");
    pointer(document.body, "pointermove");
    await settle(architecture.image.src);
    expect(current(container)).toHaveAttribute("src", architecture.image.src);
  });

  it("ignores stale loads when switching quickly", async () => {
    const { container } = render(<ServiceSheet service={architecture} index={0} active />);
    fireEvent.click(screen.getByRole("link", { name: "Conceptual Design" }));
    fireEvent.click(screen.getByRole("link", { name: "Space Programming" }));
    await settle(architecture.subItems[1].previewImage!.src);
    await settle(architecture.subItems[0].previewImage!.src);
    expect(current(container)).toHaveAttribute("src", architecture.subItems[1].previewImage!.src);
  });

  it("supports focus, Escape and focus leaving the section", async () => {
    const { container } = render(<ServiceSheet service={architecture} index={0} active />);
    act(() => screen.getByRole("link", { name: "Schematic Design" }).focus());
    await settle(architecture.subItems[2].previewImage!.src);
    fireEvent.keyDown(window, { key: "Escape" });
    await settle(architecture.image.src);
    expect(current(container)).toHaveAttribute("src", architecture.image.src);
    act(() => screen.getByRole("link", { name: "Building Permits" }).focus());
    await settle(architecture.subItems[5].previewImage!.src);
    act(() => (document.activeElement as HTMLElement).blur());
    await waitFor(() => expect(current(container)).toHaveAttribute("src", architecture.image.src));
  });

  it("retains touch selection until outside interaction", async () => {
    const { container } = render(<ServiceSheet service={architecture} index={0} active />);
    const button = screen.getByRole("link", { name: "Design Development" });
    pointer(button, "pointerdown", "touch");
    await settle(architecture.subItems[3].previewImage!.src);
    pointer(container.querySelector("article")!, "pointerleave", "touch");
    expect(button).toHaveAttribute("data-preview-selected", "true");
    pointer(document.body, "pointerdown", "touch");
    await settle(architecture.image.src);
    expect(current(container)).toHaveAttribute("src", architecture.image.src);
  });

  it("falls back to default after a failed preview", async () => {
    const { container } = render(<ServiceSheet service={architecture} index={0} active />);
    fireEvent.click(screen.getByRole("link", { name: "Conceptual Design" }));
    await settle(architecture.subItems[0].previewImage!.src);
    fireEvent.click(screen.getByRole("link", { name: "Space Programming" }));
    await act(async () => { downloads[1].onerror!(); });
    await settle(architecture.image.src);
    expect(current(container)).toHaveAttribute("src", architecture.image.src);
    expect(screen.getAllByRole("link").every(button => button.getAttribute("data-preview-selected") === "false")).toBe(true);
  });

  it("rechecks a stationary pointer on scroll", async () => {
    const { container } = render(<ServiceSheet service={architecture} index={0} active />);
    const first = screen.getByRole("link", { name: "Conceptual Design" });
    const second = screen.getByRole("link", { name: "Space Programming" });
    Object.defineProperty(document, "elementFromPoint", { configurable: true, value: vi.fn(() => second) });
    pointer(first, "pointermove");
    fireEvent.scroll(window);
    await waitFor(() => expect(second).toHaveAttribute("data-preview-selected", "true"));
    await settle(architecture.subItems[1].previewImage!.src);
    expect(current(container)).toHaveAttribute("src", architecture.subItems[1].previewImage!.src);
  });

  it("warms only nearby previews with two loads at a time and resets touch offscreen", async () => {
    const observers: { callback: IntersectionObserverCallback; options?: IntersectionObserverInit; target?: Element }[] = [];
    globalThis.IntersectionObserver = class {
      record: (typeof observers)[number];
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.record = { callback, options };
        observers.push(this.record);
      }
      observe(target: Element) { this.record.target = target; }
      disconnect() {} unobserve() {} takeRecords() { return []; }
      root = null; rootMargin = "0px"; thresholds = [0];
    };
    const { container } = render(<ServiceSheet service={architecture} index={0} active />);
    expect(downloads).toHaveLength(0);
    const near = observers.find(item => item.options?.rootMargin === "300px")!;
    act(() => near.callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(downloads).toHaveLength(2);
    pointer(screen.getByRole("link", { name: "Building Permits" }), "pointerdown", "touch");
    await settle(architecture.subItems[0].previewImage!.src);
    expect(downloads[2].src).toBe(architecture.subItems[5].previewImage!.src);
    await settle(architecture.subItems[5].previewImage!.src);
    const visible = observers.find(item => !item.options && item.target === container.querySelector("article"))!;
    act(() => visible.callback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(container.querySelector('[data-preview-selected="true"]')).toBeNull();
  });

  it("slides previews upward, restores downward and removes the outgoing layer", async () => {
    const matchMedia = window.matchMedia;
    vi.spyOn(window, "matchMedia").mockImplementation(query => ({ ...matchMedia(query), matches: false }));
    const { container } = render(<ServiceSheet service={architecture} index={0} active />);
    fireEvent.click(screen.getByRole("link", { name: "Conceptual Design" }));
    await settle(architecture.subItems[0].previewImage!.src);
    expect(container.querySelector(".service-preview-stage")).toHaveAttribute("data-direction", "up");
    expect(container.querySelector(".service-preview-layer--previous")).toHaveAttribute("aria-hidden", "true");
    fireEvent.keyDown(window, { key: "Escape" });
    await settle(architecture.image.src);
    expect(container.querySelector(".service-preview-stage")).toHaveAttribute("data-direction", "down");
    await waitFor(() => expect(container.querySelector(".service-preview-layer--previous")).toBeNull());
  });

  it("uses immediate reduced-motion swaps and a vertical slide otherwise", async () => {
    const { container } = render(<ServiceSheet service={architecture} index={0} active />);
    fireEvent.click(screen.getByRole("link", { name: "Conceptual Design" }));
    await settle(architecture.subItems[0].previewImage!.src);
    expect(container.querySelector(".service-preview-layer--previous")).toBeNull();
    const css = readFileSync("src/features/services/services-page.css", "utf8");
    expect(css).toContain("animation: service-preview-enter 320ms");
    expect(css).toContain("transform: translateY(var(--preview-travel))");
    expect(css).toContain(".service-preview-stage[data-changing] .service-preview-layer { animation: none; }");
  });
});

describe("Interior approved capability previews", () => {
  const interior = listServices().find(service => service.id === "interior")!;
  it("maps exactly the approved review pixels and versions, preserving the default and homepage", () => {
    const versions = ["v1", "v4", "v2", "v1", "v2", "v2"];
    // Frozen checksums of the approved review assets; no dependency on local review output.
    const approvedHashes = [
      "bcc1156d5ae93139256add853abc2eb3a222c7507fa67899272cba7a1157f2bb",
      "616af3e19f8b17b8009684dd37bd251abda09e171736e3c920e164967ea42385",
      "a6d7ecb7a0adcb16a3a2f1af0ab0f9c376d21a58d06e1f086f3ec40bd42e2bef",
      "0831884f02314f1293eecc8bf078b5f3b75953efa34f27a784c85280fec87e81",
      "752cf19f22feb020b8ca3088645b7d23c7dc19168271bb10741f452fa43a0885",
      "ccd68e1e813ed00d310c31325f197f488c1589fa4f06c965f67b4c2b15c4c2a9",
    ];
    interior.subItems.forEach((item, index) => {
      expect(item.previewImage?.src).toBe(`/media/services/capabilities/${item.capabilityIcon}-${versions[index]}.webp`);
      expect(item.previewImage).toMatchObject({ width: 1536, height: 1024 });
      expect(item.previewImage!.alt.length).toBeGreaterThan(50);
      expect(createHash("sha256").update(readFileSync(`public${item.previewImage!.src}`)).digest("hex")).toBe(approvedHashes[index]);
    });
    expect(interior.image.src).toBe("/media/services/interior.webp");
    expect(JSON.stringify(getHomeContent())).not.toContain("/media/services/capabilities/");
  });
  it.each(interior.subItems)("previews $name with scan labels and restores the default on Escape", async item => {
    const { container } = render(<ServiceSheet service={interior} index={1} active />);
    expect(current(container)).toHaveAttribute("src", interior.image.src);
    expect(container.querySelectorAll('.service-preview-scan[aria-hidden="true"] .footer-scan-band')).toHaveLength(18);
    const link = screen.getByRole("link", { name: item.name });
    expect(link).toHaveAttribute("href", "#services-closing-heading");
    fireEvent.focusIn(link);
    await settle(item.previewImage!.src);
    expect(current(container)).toHaveAttribute("src", item.previewImage!.src);
    expect(link).toHaveAttribute("data-preview-selected", "true");
    fireEvent.keyDown(window, { key: "Escape" });
    await settle(interior.image.src);
    expect(current(container)).toHaveAttribute("src", interior.image.src);
  });
});

describe("Landscape approved capability previews", () => {
  const landscape = listServices().find(service => service.id === "landscape")!;
  it("maps exactly the approved review pixels and versions, preserving the default and homepage", () => {
    const versions = ["v2", "v1", "v3", "v2", "v2", "v2"];
    // Frozen checksums of the approved review assets; no dependency on local review output.
    const approvedHashes = [
      "66e36046d3d8cf699f407530a17d8fe588739a3d06575d6f282ca91f0ed720cb",
      "5e7e97de1df1b5a20e739660213a0009f7437f0bc3fdba6bde154a05070202fa",
      "1f8cae74ec5a352d5bdcaa764ab44f11fa7244af459136db9c1e3c4f4f2c97e7",
      "4cacef1229ecc848a57ea3c4db3ecf567a518ee331b1384c1058e3c0435f2f85",
      "4ebf31ac0f535f9b1df13fe49e897be610a7a0016e188a1ea813f5db21ea91dc",
      "7a10940210b05d17a9e997c7e3fff72f9aee3d9c3040135d7d18575b03e4c94e"
];
    landscape.subItems.forEach((item, index) => {
      expect(item.previewImage?.src).toBe(`/media/services/capabilities/${item.capabilityIcon}-${versions[index]}.webp`);
      expect(item.previewImage).toMatchObject({ width: 1536, height: 1024 });
      expect(item.previewImage!.alt.length).toBeGreaterThan(50);
      expect(createHash("sha256").update(readFileSync(`public${item.previewImage!.src}`)).digest("hex")).toBe(approvedHashes[index]);
    });
    expect(landscape.image.src).toBe("/media/services/landscape.webp");
    expect(JSON.stringify(getHomeContent())).not.toContain("/media/services/capabilities/");
  });
  it.each(landscape.subItems)("previews $name with scan labels and restores the default on Escape", async item => {
    const { container } = render(<ServiceSheet service={landscape} index={2} active />);
    expect(current(container)).toHaveAttribute("src", landscape.image.src);
    expect(container.querySelectorAll('.service-preview-scan[aria-hidden="true"] .footer-scan-band')).toHaveLength(18);
    const link = screen.getByRole("link", { name: item.name });
    expect(link).toHaveAttribute("href", "#services-closing-heading");
    fireEvent.focusIn(link);
    await settle(item.previewImage!.src);
    expect(current(container)).toHaveAttribute("src", item.previewImage!.src);
    expect(link).toHaveAttribute("data-preview-selected", "true");
    fireEvent.keyDown(window, { key: "Escape" });
    await settle(landscape.image.src);
    expect(current(container)).toHaveAttribute("src", landscape.image.src);
  });
});

describe("Construction approved capability previews", () => {
  const construction = listServices().find(service => service.id === "construction")!;
  it("ships round-two approved pixels, including the new default, without changing the homepage", () => {
    const versions = ["v2","v3","v1","v2","v2","v2"];
    const hashes = ["308b0e556e84fa11f148df88ea7a27698bb43666cbf279ad13747e2914612660","f1e25806c374dad77df9a1f680011341c0ff04bbdb0d35bed0c1f0af5a1dcb06","fdeb71a10848e8a847db1cc987e5c4615f7e9796bbcaa4f5e9f91290210db183","5b490f23f6c90f7e881806922635a267176a6b101b302a82b74721b4744c0031","344ecd8233f133bca60a027cee4d5c6b58b4ff11b4a5a2696f944a9f9871d7be","d06ba73cda80dabb9664f1b484afb1d9dd626ad400420b87e8a1b04699c0859f"];
    expect(construction.image.src).toBe("/media/services/construction-default-v2.webp");
    expect(createHash("sha256").update(readFileSync("public" + construction.image.src)).digest("hex")).toBe("9e631f6f5a19c7cbb2c44177c300559423a8188d5d9c494b04ec2a3da6e95386");
    expect(construction.image).toMatchObject({ width: 1536, height: 1024 });
    construction.subItems.forEach((item, index) => {
      expect(item.previewImage?.src).toBe(`/media/services/capabilities/${item.capabilityIcon}-${versions[index]}.webp`);
      expect(item.previewImage).toMatchObject({ width: 1536, height: 1024 });
      expect(item.previewImage!.alt.length).toBeGreaterThan(50);
      expect(createHash("sha256").update(readFileSync("public" + item.previewImage!.src)).digest("hex")).toBe(hashes[index]);
    });
    expect(getHomeContent().services.find(service => service.id === "construction")!.imageSrc).toBe("/media/services/construction.webp");
    expect(JSON.stringify(getHomeContent())).not.toContain("/media/services/capabilities/");
  });
  it.each(construction.subItems)("previews $name, retains conversation links and restores the approved default", async item => {
    const { container } = render(<ServiceSheet service={construction} index={3} active />);
    expect(current(container)).toHaveAttribute("src", construction.image.src);
    expect(container.querySelectorAll('.service-preview-scan[aria-hidden="true"] .footer-scan-band')).toHaveLength(18);
    const link = screen.getByRole("link", { name: item.name });
    expect(link).toHaveAttribute("href", "#services-closing-heading");
    fireEvent.focusIn(link);
    await settle(item.previewImage!.src);
    expect(current(container)).toHaveAttribute("src", item.previewImage!.src);
    fireEvent.keyDown(window, { key: "Escape" });
    await settle(construction.image.src);
    expect(current(container)).toHaveAttribute("src", construction.image.src);
  });
});


describe("Complete Services preview set", () => {
  it("provides 36 unique local previews while keeping homepage projections separate", () => {
    const items = listServices().flatMap(service => service.subItems);
    expect(items).toHaveLength(36);
    expect(new Set(items.map(item => item.previewImage?.src)).size).toBe(36);
    expect(items.every(item => item.previewImage && existsSync("public" + item.previewImage.src))).toBe(true);
    expect(JSON.stringify(getHomeContent())).not.toContain("/media/services/capabilities/");
  });
});

describe.each([
  { id: "fabrication", index: 4 },
  { id: "digital-solutions", index: 5 },
])("Final $id capability previews", ({ id, index }) => {
  const service = listServices().find(service => service.id === id)!;
  const approved = [
  {
    "id": "fabrication-custom-furniture",
    "src": "/media/services/capabilities/fabrication-custom-furniture-v1.webp",
    "sha256": "5133b341e48871ac243f2eb1408d9ef5981584ec871abf378921c9a85acfb6bb"
  },
  {
    "id": "fabrication-millwork",
    "src": "/media/services/capabilities/fabrication-millwork-v1.webp",
    "sha256": "0f90044ed92c44969d8408ddb2d25acdbe4369b26d95e96aeef3430b22ec5d4a"
  },
  {
    "id": "fabrication-metalwork",
    "src": "/media/services/capabilities/fabrication-metalwork-v1.webp",
    "sha256": "b1ad055e18ced1170c79785e3dda4bcca5fdb1f3e1deff7fc7d1d775ae4f5786"
  },
  {
    "id": "fabrication-joinery",
    "src": "/media/services/capabilities/fabrication-joinery-v4.webp",
    "sha256": "123ecc26ab91102c533557141a7ecb815728eddc5ca68e7b4329dff8616b663b"
  },
  {
    "id": "fabrication-prototyping",
    "src": "/media/services/capabilities/fabrication-prototyping-v1.webp",
    "sha256": "e84ec1d3ab1a8369227cd0e76c0a39de6ac2fd149e8e6aa8d0ebed76aba0baa5"
  },
  {
    "id": "fabrication-finishing-installation",
    "src": "/media/services/capabilities/fabrication-finishing-installation-v1.webp",
    "sha256": "bd6c74a56fa62677d737095a1e3bf2df0cfa5d1c149e760a1ae8fdf4f9948fa8"
  },
  {
    "id": "digital-bim-services",
    "src": "/media/services/capabilities/digital-bim-services-v1.webp",
    "sha256": "61c5f7c14f567ed1ef0624bada2e954e0c42483db8ef4564ea15b1c128579096"
  },
  {
    "id": "digital-3d-visualization",
    "src": "/media/services/capabilities/digital-3d-visualization-v3.webp",
    "sha256": "aef96cdd4d2ec5de22204c56a9b0e2cf4dc634ba416b68e90d3638abcfb80b94"
  },
  {
    "id": "digital-vr-walkthroughs",
    "src": "/media/services/capabilities/digital-vr-walkthroughs-v1.webp",
    "sha256": "1934a052c33195c18f263aae9285bc04c7c1395631ab73185ced9d7f335f22d3"
  },
  {
    "id": "digital-custom-scripting",
    "src": "/media/services/capabilities/digital-custom-scripting-v2.webp",
    "sha256": "1e62898927c7f86785ff672ab5baf9c245271c4e6d68a616ab4433a046a4992f"
  },
  {
    "id": "digital-ai-integration",
    "src": "/media/services/capabilities/digital-ai-integration-v2.webp",
    "sha256": "4f4b2e778eb1d70a3e4f4ee24d0bd70ecbc798cee87b40ad0b967e07419c9f86"
  },
  {
    "id": "digital-digital-fabrication",
    "src": "/media/services/capabilities/digital-digital-fabrication-v3.webp",
    "sha256": "d180a2a7a07dfed27cbbb09a0d08abaa3e762c899eca3bac181363b1654fe913"
  }
];
  it("ships the selected versions and exact final pixels, retaining the existing default", () => {
    expect(service.image.src).toBe(`/media/services/${id}.webp`);
    service.subItems.forEach(item => {
      const asset = approved.find(asset => asset.id === item.capabilityIcon)!;
      expect(item.previewImage?.src).toBe(asset.src);
      expect(item.previewImage).toMatchObject({ width: 1536, height: 1024 });
      expect(item.previewImage!.alt.length).toBeGreaterThan(50);
      expect(createHash("sha256").update(readFileSync("public" + asset.src)).digest("hex")).toBe(asset.sha256);
    });
  });
  it.each(service.subItems)("previews $name, retains scan labels and conversation links, and restores on Escape", async item => {
    const { container } = render(<ServiceSheet service={service} index={index} active />);
    expect(current(container)).toHaveAttribute("src", service.image.src);
    expect(container.querySelectorAll('.service-preview-scan[aria-hidden="true"] .footer-scan-band')).toHaveLength(18);
    const link = screen.getByRole("link", { name: item.name });
    expect(link).toHaveAttribute("href", "#services-closing-heading");
    fireEvent.focusIn(link);
    await settle(item.previewImage!.src);
    expect(current(container)).toHaveAttribute("src", item.previewImage!.src);
    expect(link).toHaveAttribute("data-preview-selected", "true");
    fireEvent.keyDown(window, { key: "Escape" });
    await settle(service.image.src);
    expect(current(container)).toHaveAttribute("src", service.image.src);
  });
});

describe("preview loader", () => {
  it("deduplicates requests, handles timeout and disposes queued work", async () => {
    vi.useFakeTimers();
    try {
      const loader = createPreviewImageLoader();
      const first = loader.load("one.webp");
      expect(loader.load("one.webp")).toBe(first);
      const second = loader.load("two.webp");
      const third = loader.load("three.webp");
      expect(downloads).toHaveLength(2);
      await vi.advanceTimersByTimeAsync(12000);
      expect(await first).toBe(false);
      expect(await second).toBe(false);
      loader.dispose();
      expect(await third).toBe(false);
    } finally { vi.useRealTimers(); }
  });
});
