import {FileSpreadsheet} from "lucide-react";
import {AdminCommandItem, HERO_BANNERS} from "./types";

export const ADMIN_PRODUCTS_SHEET_MENU_ITEMS: AdminCommandItem[] = [
  {
    id: "sheet-travis-mathew",
    label: "Travis Mathew Sheet",
    description: "View and manage Travis Mathew product sheets.",
    href: "/admin/products/sheet/travis-mathew",
    icon: FileSpreadsheet,
    group: "Navigate",
    keywords: ["travis mathew", "sheet", "catalog"],
    roles: ["super_admin", "admin", "manager", "sales_rep"],
    heroImage: HERO_BANNERS.iron,
  },
  {
    id: "sheet-callaway",
    label: "Callaway Sheet",
    description: "View and manage Callaway product sheets.",
    href: "/admin/products/sheet/callaway",
    icon: FileSpreadsheet,
    group: "Navigate",
    keywords: ["callaway", "sheet", "catalog"],
    roles: ["super_admin", "admin", "manager", "sales_rep"],
    heroImage: HERO_BANNERS.iron,
  },
];
