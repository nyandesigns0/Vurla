import { ActionLink } from "@/components/ui/ActionLink";
import { StatePanel } from "@/components/ui/StatePanel";
export default function NotFound() {
  return (
    <div className="page shell state-page">
      <p className="kicker">Vurla / 404</p>
      <StatePanel
        level={1}
        title="Project not found"
        description="The page you are looking for could not be found."
      >
        <ActionLink href="/projects">Explore projects</ActionLink>
      </StatePanel>
    </div>
  );
}
