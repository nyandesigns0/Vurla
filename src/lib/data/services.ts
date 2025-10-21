import { 
  Building2, 
  Palette, 
  TreePine, 
  Wrench, 
  HomeIcon, 
  Monitor,
  FileText,
  Layout,
  Settings,
  CheckCircle,
  Paintbrush,
  Lightbulb,
  MapPin,
  Users,
  Zap,
  Calendar,
  HardHat,
  Hammer,
  Box,
  Layers,
  Eye,
  Code
} from "lucide-react";

export interface ServiceSubItem {
  name: string;
  icon: any;
}

export interface Service {
  title: string;
  icon: any;
  subItems: ServiceSubItem[];
}

export const services: Service[] = [
  {
    title: "Architecture",
    icon: Building2,
    subItems: [
      { name: "Conceptual Design", icon: FileText },
      { name: "Space Programming", icon: Layout },
      { name: "Schematic Design", icon: Building2 },
      { name: "Design Development", icon: Settings },
      { name: "Construction Documents", icon: FileText },
      { name: "Building Permits", icon: CheckCircle }
    ]
  },
  {
    title: "Interior",
    icon: Palette,
    subItems: [
      { name: "Space Planning", icon: Layout },
      { name: "Material Selection", icon: Paintbrush },
      { name: "FF&E Specification", icon: HomeIcon },
      { name: "Interior Styling", icon: Palette },
      { name: "Color Consultation", icon: Paintbrush },
      { name: "Lighting Design", icon: Lightbulb }
    ]
  },
  {
    title: "Landscape",
    icon: TreePine,
    subItems: [
      { name: "Site Planning", icon: MapPin },
      { name: "Hardscape Design", icon: Settings },
      { name: "Planting Design", icon: TreePine },
      { name: "Playground Design", icon: Users },
      { name: "Irrigation Systems", icon: Zap },
      { name: "Sustainable Landscapes", icon: TreePine }
    ]
  },
  {
    title: "Construction",
    icon: Wrench,
    subItems: [
      { name: "Project Management", icon: Calendar },
      { name: "Quality Control", icon: CheckCircle },
      { name: "Site Supervision", icon: HardHat },
      { name: "Cost Estimation", icon: Users },
      { name: "Construction Documentation", icon: FileText },
      { name: "Contract Administration", icon: Settings }
    ]
  },
  {
    title: "Fabrication",
    icon: HomeIcon,
    subItems: [
      { name: "Custom Furniture", icon: HomeIcon },
      { name: "Millwork", icon: Hammer },
      { name: "Metalwork", icon: Wrench },
      { name: "Joinery", icon: Settings },
      { name: "Prototyping", icon: Box },
      { name: "Finishing & Installation", icon: CheckCircle }
    ]
  },
  {
    title: "Digital Solutions",
    icon: Monitor,
    subItems: [
      { name: "BIM Services", icon: Layers },
      { name: "3D Visualization", icon: Eye },
      { name: "VR Walkthroughs", icon: Monitor },
      { name: "Custom Scripting", icon: Code },
      { name: "Parametric Design", icon: Settings },
      { name: "Digital Fabrication", icon: Zap }
    ]
  }
];

// Helper function to get all subItem names as a flat array
export const getAllServiceTags = (): string[] => {
  return services.flatMap(service => service.subItems.map(subItem => subItem.name));
};

// Helper function to get service by subItem name
export const getServiceByTag = (tagName: string): Service | undefined => {
  return services.find(service => 
    service.subItems.some(subItem => subItem.name === tagName)
  );
};
