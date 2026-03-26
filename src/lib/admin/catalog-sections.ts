export type CatalogSection = {
  slug: string;
  label: string;
  description: string;
  brandCodes: string[];
};

export const CATALOG_SECTIONS: CatalogSection[] = [
  {
    slug: "callaway-softgoods",
    label: "Callaway Softgoods",
    description: "Performance apparel and softgoods ready for ordering.",
    brandCodes: ["CG-SG", "CG-APP"],
  },
  {
    slug: "callaway-hardgoods",
    label: "Callaway Hardgoods",
    description: "Clubs, balls, and performance hardgoods inventory.",
    brandCodes: ["CG-HW"],
  },
  {
    slug: "ogio",
    label: "Ogio",
    description: "Travel and bag assortment from the Ogio range.",
    brandCodes: ["OG"],
  },
  {
    slug: "travis-mathew",
    label: "Travis Mathew",
    description: "Lifestyle apparel and layers from Travis Mathew.",
    brandCodes: ["TM"],
  },

];

export function getCatalogSection(slug: string) {
  return CATALOG_SECTIONS.find((section) => section.slug === slug);
}
