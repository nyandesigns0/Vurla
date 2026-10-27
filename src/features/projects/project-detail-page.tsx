import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { getProjectBySlug, listProjects } from "@/content/server";
import { PagePlate } from "@/components/site/PagePlate";
import { PageSideBorders } from "@/components/site/PageSideBorders";
import { GrainTexture } from "@/components/site/GrainTexture";
import { DotTexture } from "@/components/site/DotTexture";
import { getRelatedProjects } from "./related-projects";
import { ProjectDetailClosing } from "./project-detail-closing";
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const projects = listProjects();
  const position = projects.findIndex((entry) => entry.slug === project.slug);
  const related = getRelatedProjects(project, projects);
  const plateIndex = String(position + 1).padStart(2, "0");
  const gallery = project.gallery ?? [];
  const relatedHeading = related.length > 0 ? (
    <h2
      className={`detail-related-heading${gallery.length === 0 ? " shell" : ""}`}
      id="detail-related-heading"
    >
      Explore other projects
      <span className="detail-related-arrow" aria-hidden="true">
        <ArrowDown size={22} strokeWidth={1.5} />
      </span>
    </h2>
  ) : null;
  return (
    <article className="page page-family project-detail">
      <ProjectDetailClosing>
        <div className="project-detail-body">
      <GrainTexture className="project-detail-grain" />
      <PageSideBorders className="project-detail-sides" />
      <nav className="detail-return shell" aria-label="Project navigation">
        <Link className="detail-return-link" href="/projects">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to projects
        </Link>
        <span className="detail-return-count" aria-hidden="true">
          {plateIndex} / {String(projects.length).padStart(2, "0")}
        </span>
      </nav>
      <PagePlate
        index="03"
        kicker={project.category}
        title={project.title}
        lead={
          <span className="detail-plate-facts">
            <span className="detail-plate-fact">
              <span className="detail-plate-label">Location</span>
              <span>{project.location}</span>
            </span>
            <span className="detail-plate-fact">
              <span className="detail-plate-label">Year</span>
              <span>{project.year}</span>
            </span>
          </span>
        }
        crosshair
        className="page-plate--roomy"
      />
      <div className="detail-layout shell">
        <div className="detail-cover">
          <DotTexture />
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="(min-width: 1280px) 850px, (min-width: 1024px) 66vw, 100vw"
            className="object-cover"
          />
          <span className="detail-cover-cross detail-cover-cross--tl" aria-hidden="true" />
          <span className="detail-cover-cross detail-cover-cross--br" aria-hidden="true" />
        </div>
        <dl className="detail-metadata">
          <div>
            <dt>Services</dt>
            <dd>
              <ul>
                {project.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt>Description</dt>
            <dd>{project.description}</dd>
          </div>
        </dl>
      </div>
      {gallery.length > 0 && (
        <section
          aria-label={project.title + " gallery"}
          className="detail-gallery shell"
        >
          {gallery.map((image) => (
            <figure
              key={image.src}
              className={
                image.presentation === "document"
                  ? "gallery-document"
                  : "gallery-photo"
              }
            >
              <div className="gallery-image">
                {image.presentation !== "document" && <DotTexture />}
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1280px) 1280px, 100vw"
                  className="object-cover"
                />
              </div>
            </figure>
          ))}
          {relatedHeading}
        </section>
      )}
      {gallery.length === 0 && relatedHeading}
      {related.length > 0 && (
        <section className="detail-related shell" aria-labelledby="detail-related-heading">
          <nav className="detail-pager" aria-label="Related projects">
            {related.map((entry) => (
              <Link
                key={entry.slug}
                className="detail-pager-link"
                href={`/projects/${entry.slug}`}
                aria-label={`View related project: ${entry.title}`}
              >
                <Image
                  src={entry.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="detail-pager-overlay" aria-hidden="true">
                  <span className="detail-pager-title">{entry.title}</span>
                  <ArrowRight size={20} />
                </span>
              </Link>
            ))}
          </nav>
        </section>
      )}
        </div>
      </ProjectDetailClosing>
    </article>
  );
}
