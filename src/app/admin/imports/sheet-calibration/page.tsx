import dbConnect from "@/lib/db/connection";
import {SheetDataset} from "@/lib/db/models/SheetDataset";
import {loadCalibrationLookup} from "@/lib/sheets/load-calibration-lookup";
import {toPlainObject} from "@/lib/utils/serialization";
import {SheetCalibrationWorkspace} from "@/components/admin/SheetCalibrationWorkspace";

export const dynamic = "force-dynamic";

export default async function SheetCalibrationPage() {
  await dbConnect();

  const [datasetsRaw, lookup] = await Promise.all([
    SheetDataset.find().sort({createdAt: -1}).lean(),
    loadCalibrationLookup(),
  ]);

  const datasets = toPlainObject(datasetsRaw).map((dataset) => ({
    id: dataset._id.toString(),
    name: dataset.name,
    slug: dataset.slug,
    type: dataset.type,
    sourceFileName: dataset.sourceFileName,
    description: dataset.description,
    columns: dataset.columns,
    rowCount: dataset.rowCount,
    summary: dataset.summary,
    createdAt: dataset.createdAt ? new Date(dataset.createdAt).toISOString() : new Date(0).toISOString(),
  }));

  return (
    <SheetCalibrationWorkspace
      initialDatasets={datasets}
      lookupSummary={{
        brands: lookup.brands.length,
        products: lookup.products.length,
        variants: lookup.variants.length,
        warehouses: lookup.warehouses.length,
      }}
    />
  );
}
