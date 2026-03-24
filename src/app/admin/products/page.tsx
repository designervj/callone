import {ProductCatalogWorkspace, type ProductCatalogRecord} from "@/components/admin/ProductCatalogWorkspace";
import dbConnect from "@/lib/db/connection";
import {Brand} from "@/lib/db/models/Brand";
import {InventoryLevel} from "@/lib/db/models/InventoryLevel";
import {Product} from "@/lib/db/models/Product";
import {Variant} from "@/lib/db/models/Variant";
import {toPlainObject} from "@/lib/utils/serialization";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await dbConnect();

  const [productsRaw, brandsRaw, variantsRaw, inventoryLevelsRaw] = await Promise.all([
    Product.find().sort({updatedAt: -1}).lean(),
    Brand.find().lean(),
    Variant.find().lean(),
    InventoryLevel.find().lean(),
  ]);

  const products = toPlainObject(productsRaw);
  const brands = toPlainObject(brandsRaw);
  const variants = toPlainObject(variantsRaw);
  const inventoryLevels = toPlainObject(inventoryLevelsRaw);

  const brandMap = new Map(
    brands.map((brand) => [
      brand._id.toString(),
      {
        id: brand._id.toString(),
        name: brand.name,
        code: brand.code,
      },
    ])
  );

  const inventoryByVariantId = new Map<string, number>();
  for (const inventory of inventoryLevels) {
    const variantId = inventory.variantId.toString();
    inventoryByVariantId.set(
      variantId,
      (inventoryByVariantId.get(variantId) ?? 0) + Number(inventory.available ?? 0)
    );
  }

  const variantsByProductId = new Map<string, typeof variants>();
  for (const variant of variants) {
    const productId = variant.productId.toString();
    const existing = variantsByProductId.get(productId) ?? [];
    existing.push(variant);
    variantsByProductId.set(productId, existing);
  }

  const catalog: ProductCatalogRecord[] = products.map((product) => {
    const brand = brandMap.get(product.brandId.toString()) ?? {
      id: "unknown",
      name: "Unknown brand",
      code: "NA",
    };
    const productVariants = variantsByProductId.get(product._id.toString()) ?? [];
    const attributeGroups = (product.optionDefinitions ?? []).map((group) => ({
      key: group.key,
      label: group.label,
      values: Array.from(new Set(group.values ?? [])).sort((left, right) => left.localeCompare(right)),
    }));

    return {
      id: product._id.toString(),
      name: product.name ?? "Untitled product",
      slug: product.slug ?? "",
      baseSku: product.baseSku ?? "",
      brand,
      category: product.category ?? "",
      subcategory: product.subcategory ?? "",
      productType: product.productType ?? "",
      status: product.status ?? "draft",
      availableStock: productVariants.reduce(
        (sum, variant) => sum + (inventoryByVariantId.get(variant._id.toString()) ?? 0),
        0
      ),
      variantCount: productVariants.length,
      variantSkus: productVariants.map((variant) => variant.sku ?? ""),
      variantTitles: productVariants.map((variant) => variant.title ?? ""),
      variants: productVariants.map((variant) => ({
        id: variant._id.toString(),
        sku: variant.sku ?? "",
        title: variant.title ?? "",
        optionValues: Object.fromEntries(
          Object.entries(variant.optionValues ?? {}).map(([key, value]) => [key, String(value)])
        ),
        availableStock: inventoryByVariantId.get(variant._id.toString()) ?? 0,
      })),
      attributeGroups,
      updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date(0).toISOString(),
    };
  });

  return <ProductCatalogWorkspace products={catalog} />;
}
