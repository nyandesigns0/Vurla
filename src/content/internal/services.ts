import type { Service } from "@/content/contracts";

export const services: Service[] = [
  {
    title: "Architecture",
    icon: "building-2",
    subItems: [
      { name: "Conceptual Design", icon: "file-text" }, { name: "Space Programming", icon: "layout" }, { name: "Schematic Design", icon: "building-2" }, { name: "Design Development", icon: "settings" }, { name: "Construction Documents", icon: "file-text" }, { name: "Building Permits", icon: "check-circle" }
    ]
  },
  {
    title: "Interior",
    icon: "palette",
    subItems: [
      { name: "Space Planning", icon: "layout" }, { name: "Material Selection", icon: "paintbrush" }, { name: "FF&E Specification", icon: "home" }, { name: "Interior Styling", icon: "palette" }, { name: "Color Consultation", icon: "paintbrush" }, { name: "Lighting Design", icon: "lightbulb" }
    ]
  },
  {
    title: "Landscape",
    icon: "tree-pine",
    subItems: [
      { name: "Site Planning", icon: "map-pin" }, { name: "Hardscape Design", icon: "settings" }, { name: "Planting Design", icon: "tree-pine" }, { name: "Playground Design", icon: "users" }, { name: "Irrigation Systems", icon: "zap" }, { name: "Sustainable Landscapes", icon: "tree-pine" }
    ]
  },
  {
    title: "Construction",
    icon: "wrench",
    subItems: [
      { name: "Project Management", icon: "calendar" }, { name: "Quality Control", icon: "check-circle" }, { name: "Site Supervision", icon: "hard-hat" }, { name: "Cost Estimation", icon: "users" }, { name: "Construction Documentation", icon: "file-text" }, { name: "Contract Administration", icon: "settings" }
    ]
  },
  {
    title: "Fabrication",
    icon: "home",
    subItems: [
      { name: "Custom Furniture", icon: "home" }, { name: "Millwork", icon: "hammer" }, { name: "Metalwork", icon: "wrench" }, { name: "Joinery", icon: "settings" }, { name: "Prototyping", icon: "box" }, { name: "Finishing & Installation", icon: "check-circle" }
    ]
  },
  {
    title: "Digital Solutions",
    icon: "monitor",
    subItems: [
      { name: "BIM Services", icon: "layers" }, { name: "3D Visualization", icon: "eye" }, { name: "VR Walkthroughs", icon: "monitor" }, { name: "Custom Scripting", icon: "code" }, { name: "Parametric Design", icon: "settings" }, { name: "Digital Fabrication", icon: "zap" }
    ]
  }
];

// Helper function to get all subItem names as a flat array
