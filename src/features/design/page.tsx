import type { ReactNode, CSSProperties } from "react";
import {
  loadDesignSpec,
  designTokens,
  parseProseBlocks,
  colorFamilies,
  contrastRatio,
  inkOn,
} from "@/lib/design-system";
import { ColorCopyButton } from "./color-copy-button";
import { ComponentSpecimens } from "./component-specimens";
function Inline({ text }: { text: string }): ReactNode {
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
    .map((part, i) => {
      if (part.startsWith("**"))
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (part.startsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link && /^(https?:\/\/|\/(?!\/)|#)/.test(link[2]))
        return (
          <a key={i} href={link[2]}>
            {link[1]}
          </a>
        );
      return part;
    });
}
function Prose({ text }: { text: string }) {
  return (
    <div className="guide-prose">
      {parseProseBlocks(text).map((b, i) =>
        b.type === "ul" ? (
          <ul key={i}>
            {b.items.map((item) => (
              <li key={item}>
                <Inline text={item} />
              </li>
            ))}
          </ul>
        ) : b.type === "h3" ? (
          <h3 key={i}>
            <Inline text={b.text} />
          </h3>
        ) : (
          <p key={i}>
            <Inline text={b.text} />
          </p>
        ),
      )}
    </div>
  );
}
export default function DesignGuidePage() {
  const spec = loadDesignSpec();
  const t = designTokens;
  return (
    <article className="page shell design-guide">
      <header className="page-intro">
        <p className="kicker">Vurla / Living design system</p>
        <h1 className="display">A practice in intention.</h1>
        <p className="body-large">
          The colors, type, proportions, and controls used across Vurla.
        </p>
      </header>
      <nav className="guide-nav" aria-label="Design guide chapters">
        {spec.sections.map((s, i) => (
          <a key={s.id} href={"#" + s.id}>
            {String(i + 1).padStart(2, "0")} {s.title}
          </a>
        ))}
      </nav>
      {spec.sections.map((s, i) => (
        <section className="guide-section" id={s.id} key={s.id}>
          <div className="section-intro">
            <p className="kicker">{String(i + 1).padStart(2, "0")} / Vurla</p>
            <h2 className="section-title">{s.title}</h2>
          </div>
          <Prose text={s.body} />
          {s.id === "colors" && (
            <>
              {colorFamilies.map((f) => (
                <div className="color-family" key={f.id}>
                  <h3>{f.id}</h3>
                  <div className="swatch-grid">
                    {f.tokens.map((key) => (
                      <div key={key}>
                        <ColorCopyButton name={key} value={t.color[key]} />
                        <p className="kicker">
                          {contrastRatio(
                            inkOn(t.color[key]),
                            t.color[key],
                          ).toFixed(2)}
                          :1 on fill ·{" "}
                          {contrastRatio(inkOn(t.color[key]), t.color[key]) >=
                          4.5
                            ? "AA text"
                            : "large text only"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
          {s.id === "colors" && (
            <div className="semantic-role-table">
              <h3>Semantic roles</h3>
              <p>Roles reference a physical primitive; they are not additional palette colors.</p>
              <dl>{Object.entries(t.semanticColor).map(([role, primitive]) => (
                <div key={role}><dt>{role}</dt><dd>{primitive}</dd></div>
              ))}</dl>
            </div>
          )}
          {s.id === "typography" && (
            <>
              <p>
                Desktop token metrics are listed below. Below 768px, heading
                specimens cap at 32px with a 1.2 line height; body and label
                specimens retain their token metrics.
              </p>
              <div className="type-rows">
                {Object.entries(t.typography).map(([role, metrics]) => (
                  <div key={role}>
                    <div className="kicker">
                      {role}
                      <br />
                      Desktop {metrics.size} / {metrics.leading}
                      <br />
                      {role.startsWith("body")
                        ? "Chakra Petch"
                        : "Share Tech Mono"}{" "}
                      · {metrics.weight}
                    </div>
                    <p
                      className={
                        role.startsWith("body") || role.startsWith("label")
                          ? "type-sample"
                          : "type-sample type-sample-heading"
                      }
                      style={
                        {
                          "--sample-size": metrics.size,
                          fontFamily: metrics.family,
                          fontSize: metrics.size,
                          lineHeight: metrics.leading,
                          fontWeight: metrics.weight,
                          letterSpacing: metrics.tracking,
                        } as CSSProperties
                      }
                    >
                      {role.startsWith("body")
                        ? "Spaces, objects, and environments made around real life."
                        : "Built with intention."}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
          {s.id === "layout" && (
            <>
              <div
                className="layout-specimen"
                aria-label="Twelve-column layout"
              >
                {Array.from({ length: 12 }, (_, n) => (
                  <span key={n}>{n + 1}</span>
                ))}
              </div>
              <div className="spacing-specimens">
                {Object.entries(t.space).map(([name, value]) => (
                  <div key={name}>
                    <span className="kicker">
                      {name} / {value}
                    </span>
                    <i style={{ width: value }} />
                  </div>
                ))}
              </div>
            </>
          )}
          {s.id === "elevation-and-depth" && (
            <>
              <div className="elevation-specimens">
                {Object.entries(t.elevation).map(([name, value]) => (
                  <div key={name} style={{ boxShadow: value }}>
                    <span className="kicker">{name}</span>
                  </div>
                ))}
              </div>
              <div className="texture-specimen print-surface">
                <span className="kicker">Toner grain / print surface</span>
                <p>
                  One restrained SVG texture softens large fields without
                  introducing another physical color.
                </p>
              </div>
            </>
          )}
          {s.id === "shapes" && (
            <div className="shape-specimens">
              {Object.entries(t.radius).map(([name, value]) => (
                <div key={name} style={{ borderRadius: value }}>
                  {name} / {value}
                </div>
              ))}
            </div>
          )}
          {s.id === "borders-and-outlines" && (
            <div className="border-specimens">
              <div>1px structural rule</div>
              <a
                href="#components"
                className="ui-button ui-button--outline"
                style={{
                  outline: "2px solid var(--ds-color-focus)",
                  outlineOffset: "3px",
                }}
                data-appearance="focus"
              >
                Focus appearance — 3px offset
              </a>
            </div>
          )}
          {s.id === "components" && (
            <>
              <ComponentSpecimens />
              <div className="behavior-specimens">
                <article>
                  <span className="kicker">Motion contract</span>
                  <h3>Purposeful and interruptible</h3>
                  <p>
                    Route plates use 320ms, glyph scans 260ms, hero
                    deceleration 200ms, and hero idle resume 1500ms. Native
                    scrolling remains available throughout.
                  </p>
                  <i className="motion-rail" aria-hidden="true" />
                </article>
                <article>
                  <span className="kicker">Fallback contract</span>
                  <h3>Complete without motion</h3>
                  <p>
                    Reduced motion, coarse pointers, narrow viewports, missing
                    canvas, and no JavaScript retain authored content, links,
                    hierarchy, and the two connected hero folds.
                  </p>
                  <div className="fallback-plate" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                </article>
              </div>
            </>
          )}
          {s.id === "dos-and-donts" && (
            <div className="comparison-grid">
              <div>
                <span className="kicker">Do</span>
                <p>
                  Natural image color. Clear hierarchy. Stable navigation. Full
                  specifications.
                </p>
              </div>
              <div>
                <span className="kicker">Don’t</span>
                <p>
                  Distort images. Hide essential details. Capture native scroll.
                  Invent project facts.
                </p>
              </div>
            </div>
          )}
        </section>
      ))}
    </article>
  );
}
