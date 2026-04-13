import type {LucideIcon} from "lucide-react";

export type AdminCommandGroup = "Navigate" | "Create" | "Operations";

export type AdminCommandItem = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: AdminCommandGroup;
  keywords: string[];
  roles?: string[];
  heroImage?: string;
};

export const HERO_BANNERS = {
  graphite:
    "https://callawaytech.s3.ap-south-1.amazonaws.com/omsimages/uploads/18_b3b08ebc11.png",
  iron:
    "https://callawaytech.s3.ap-south-1.amazonaws.com/omsimages/uploads/19_582a243868.png",
  orange:
    "https://callawaytech.s3.ap-south-1.amazonaws.com/omsimages/uploads/24_8d8dd65fde.png",
};
