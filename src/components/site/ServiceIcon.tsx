import * as Icons from "lucide-react";
import type { ServiceIconName } from "@/content/contracts";

const iconMap: Record<ServiceIconName, React.ComponentType<{ className?: string }>> = {
  "building-2": Icons.Building2, palette: Icons.Palette, "tree-pine": Icons.TreePine, wrench: Icons.Wrench, home: Icons.Home,
  monitor: Icons.Monitor, "file-text": Icons.FileText, layout: Icons.Layout, settings: Icons.Settings, "check-circle": Icons.CheckCircle,
  paintbrush: Icons.Paintbrush, lightbulb: Icons.Lightbulb, "map-pin": Icons.MapPin, users: Icons.Users, zap: Icons.Zap,
  calendar: Icons.Calendar, "hard-hat": Icons.HardHat, hammer: Icons.Hammer, box: Icons.Box, layers: Icons.Layers, eye: Icons.Eye, code: Icons.Code,
};

export function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  const Icon = iconMap[name];
  return <Icon className={className} aria-hidden="true" />;
}
