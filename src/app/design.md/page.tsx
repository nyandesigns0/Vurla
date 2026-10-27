import type { Metadata } from "next";
import DesignGuidePage from "@/features/design/page";
export const metadata: Metadata = {
  title: "Vurla design system",
  description:
    "Vurla visual tokens, typography, layout and production components.",
  alternates: { canonical: "/design.md" },
  robots: { index: false, follow: false },
};
export default DesignGuidePage;
