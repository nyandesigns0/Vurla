import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { listProjects, listServices, getSiteConfig } from "@/content/testing";
const baseline = JSON.parse(
  readFileSync(
    "src/content/testing/fixtures/redesign-baseline.json",
    "utf8",
  ),
);
describe("checkpoint preservation", () => {
  it("retains every project field, gallery ordering and approved site destinations", () => {
    expect(listProjects()).toEqual(
      baseline.records.projects.map((project: { location: string }) => ({
        ...project,
        location: project.location.replace(/, USA$/, ""),
      })),
    );
    const siteConfig = getSiteConfig();
    const { navigation, socialLinks, ...siteDetails } = siteConfig;
    const { navigation: baselineNavigation, socialLinks: baselineSocialLinks, ...baselineDetails } = baseline.records.siteConfig;
    expect(siteDetails).toEqual(baselineDetails);
    expect([...navigation].sort((a, b) => a.href.localeCompare(b.href)))
      .toEqual([...baselineNavigation].sort((a, b) => a.href.localeCompare(b.href)));
    expect(navigation.map(({ href }) => href)).toEqual(["/", "/services", "/projects", "/contact"]);
    expect(socialLinks).toEqual([
      ...baselineSocialLinks,
      { label: "Facebook", href: "https://www.facebook.com/vurlaliving1111/" },
    ]);
  });
  it("retains authored service specifications except the approved AI Integration rename", () =>
    expect(
      listServices().map(({ title, icon, subItems }) => ({
        title,
        icon,
        subItems: subItems.map(({ name, icon }) => ({ name, icon })),
      })),
    ).toEqual(baseline.records.services.map((service: { title: string; icon: string; subItems: { name: string; icon: string }[] }) => ({
      ...service,
      subItems: service.subItems.map(item => ({
        ...item,
        name: service.title === "Digital Solutions" && item.name === "Parametric Design" ? "AI Integration" : item.name,
      })),
    }))));
  it("retains original media bytes and brand SVG content across platforms", () => {
    for (const [file, hash] of Object.entries(baseline.hashes)) {
      const bytes = readFileSync(file);
      // Git may check text assets out with CRLF on Windows; compare canonical SVG content.
      const content = file.endsWith(".svg") ? bytes.toString("utf8").replaceAll("\r\n", "\n") : bytes;
      expect(createHash("sha256").update(content).digest("hex"), file).toBe(hash);
    }
  });
  it("ships six unique reference-grounded service images with valid dimensions and recorded actual inputs", () => {
    const services = listServices();
    expect(new Set(services.map((s) => s.image.src)).size).toBe(6);
    const records = JSON.parse(
      readFileSync(
        "docs/imagery/services-generation.json",
        "utf8",
      ),
    );
    for (const service of services) {
      expect(service.image.width).toBeGreaterThan(1000);
      expect(service.image.height).toBeGreaterThan(700);
      expect(service.image.alt.length).toBeGreaterThan(15);
      const record = records.find((r: { id: string }) => r.id === service.id);
      expect(
        record.args.referenced_image_paths.some((p: string) =>
          p.includes("/media/projects/"),
        ),
      ).toBe(true);
      expect(
        createHash("sha256")
          // Preserve the original default bytes even when Services has an approved replacement.
          .update(readFileSync("public" + (service.id === "construction" ? "/media/services/construction.webp" : service.image.src)))
          .digest("hex"),
      ).toBe(record.sha256);
    }
  });
});
