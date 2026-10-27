export interface DesignSection {
  id: string;
  title: string;
  body: string;
}
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export function parseMarkdownSections(body: string): DesignSection[] {
  return body
    .split(/^## /m)
    .slice(1)
    .map((part) => {
      const [title, ...lines] = part.split(/\r?\n/);
      return {
        id: slugify(title.trim()),
        title: title.trim(),
        body: lines.join("\n").trim(),
      };
    });
}
export function parseDesignSpec(source: string) {
  const match = source
    .replace(/^\uFEFF/, "")
    .match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("Design document requires JSON frontmatter.");
  const tokens: unknown = JSON.parse(match[1]);
  if (!tokens || typeof tokens !== "object" || Array.isArray(tokens))
    throw new Error("Design frontmatter must be an object.");
  return {
    tokens,
    markdown: match[2],
    sections: parseMarkdownSections(match[2]),
  };
}
export type ProseBlock =
  | { type: "h3" | "p"; text: string }
  | { type: "ul"; items: string[] };
export function parseProseBlocks(markdown: string): ProseBlock[] {
  return markdown
    .split(/(?:\r?\n){2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      if (chunk.startsWith("### ")) return { type: "h3", text: chunk.slice(4) };
      const lines = chunk.split(/\r?\n/);
      if (lines.every((line) => /^[-*] /.test(line)))
        return { type: "ul", items: lines.map((line) => line.slice(2)) };
      return { type: "p", text: lines.join(" ") };
    });
}
