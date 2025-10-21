/* Short title: Project detail route */
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/data/projects";

type Params = { params: Promise<{ slug: string }> };

async function getProject(slug: string) {
    return projects.find((p) => p.slug === slug) ?? null;
}

export default async function ProjectDetailPage({ params }: Params) {
	try {
		const { slug } = await params;
		const project = await getProject(slug);
		if (!project) return <div className="max-w-4xl mx-auto px-4 py-8">Project not found</div>;
        return (
            <div>
                <div className="relative w-full h-[40vh] md:h-[50vh]">
                    <Image src={project.image} alt={project.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-6 left-6 text-white">
									<h1 className="heading-section-sm">{project.title}</h1>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <Link href="/projects" className="link-underline mb-4 inline-block">Back to projects</Link>
                    <p className="opacity-80 mb-6">{project.description}</p>
                    <div className="aspect-video w-full border rounded" style={{ borderColor: "var(--border)" }} />
                </div>
            </div>
        );
	} catch (err) {
		console.error("[projects:detail]", err);
		return <div className="max-w-4xl mx-auto px-4 py-8">Error loading project.</div>;
	}
}


