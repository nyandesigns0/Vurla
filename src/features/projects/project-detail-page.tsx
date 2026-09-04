/* Short title: Project detail route */
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/content/server";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <div className="relative w-full h-[40vh] md:h-[50vh]">
        <Image src={project.image} alt={project.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="heading-section-sm">{project.title}</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/projects" className="link-underline mb-4 inline-block">
          Back to projects
        </Link>
        <p className="opacity-80 mb-6">{project.description}</p>
        {project.gallery && project.gallery.length > 0 && (
          <section aria-label={`${project.title} gallery`} className="mt-10 grid gap-4 md:grid-cols-2">
            {project.gallery.map((image) => (
              <a
                key={image.src}
                href={image.src}
                target="_blank"
                rel="noreferrer"
                aria-label={`View full-size image: ${image.alt} (opens in a new tab)`}
                className="relative block aspect-[4/3] overflow-hidden border focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ borderColor: "var(--border)" }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 896px) 424px, (min-width: 768px) 50vw, 100vw"
                  className={image.presentation === "document" ? "object-contain" : "object-cover"}
                />
              </a>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
