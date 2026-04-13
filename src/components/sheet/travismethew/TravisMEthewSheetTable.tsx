"use client";

import { Loader2, Package2 } from "lucide-react";
import { useSelector } from "react-redux";
import { DataTable } from "@/components/admin/DataTable";
import { RootState } from "@/store";
import { ITravisMethewSheetItem } from "@/store/slices/sheet/travismethew/TravisMethewSheetType";
import { usePathname } from "next/navigation";

type SheetColumnKey = keyof ITravisMethewSheetItem | "index";

const TRAVIS_SHEET_COLUMNS: Array<{ label: string; key: SheetColumnKey }> = [
  { label: "#", key: "index" },
  { label: "SKU", key: "SKU" },
  { label: "Option", key: "Option" },
  { label: "Desc", key: "desc" },
  { label: "SZ", key: "SZ" },
  { label: "Category", key: "category" },
  { label: "Season", key: "season" },
  { label: "Line", key: "line" },
  { label: "Color", key: "color" },
  { label: "MRP", key: "mrp" },
  { label: "Image", key: "image" },
  { label: "TTL Qty", key: "TTL Qty" },
  { label: "Line status", key: "Line status" },
  { label: "Size Roll", key: "Size Roll" },
  { label: "KAPIL", key: "KAPIL" },
  { label: "MOHIT", key: "MOHIT" },
  { label: "PUNITH", key: "PUNITH" },
  { label: "SANDEEP", key: "SANDEEP" },
  { label: "SHASHI", key: "SHASHI" },
  { label: "SHIVAM", key: "SHIVAM" },
  { label: "Blk", key: "Blk" },
  { label: "Avl", key: "Avl" },
  { label: "UPC", key: "UPC" },
  { label: "TTL", key: "TTL" },
  { label: "ATJ", key: "ATJ" },
  { label: "B CLB", key: "B CLB" },
  { label: "Overall", key: "Overall" },
  { label: "ATJ_1", key: "ATJ_1" },
  { label: "Created", key: "createdAt" },
  { label: "Updated", key: "updatedAt" },
];

function formatSheetValue(key: SheetColumnKey, value: unknown) {
  if (key === "index") {
    return "";
  }

  if (key === "createdAt" || key === "updatedAt") {
    if (!value) return "—";

    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
  }

  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

export default function TravisMEthewSheetTable() {
  const { allTravisSheet, isLoading, error } = useSelector((state: RootState) => state.travisSheet);
const {allAttribute}= useSelector((state:RootState)=>state.attribute)

const pathname= usePathname()


  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-border/60 bg-[color:var(--surface)] px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Travis Mathew Sheet</h2>
          <p className="mt-1 text-sm text-foreground/56">
            Showing rows from the <span className="font-medium text-foreground">sheet_travismethew</span> collection.
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm text-foreground/56">
          {isLoading ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/60">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading
            </span>
          ) : (
            <span className="rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/60">
              {allTravisSheet.length} Rows
            </span>
          )}
        </div>
      </div>

      {error ? (
        <div className="rounded-[20px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <DataTable headers={TRAVIS_SHEET_COLUMNS.map((column) => column.label)}>
        {isLoading && allTravisSheet.length === 0 ? (
          <tr>
            <td colSpan={TRAVIS_SHEET_COLUMNS.length} className="px-6 py-14 text-center">
              <div className="mx-auto flex max-w-md flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[#1a1a1a] text-white">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">Loading Travis Mathew sheet</h3>
                <p className="mt-2 text-sm text-foreground/56">
                  Fetching all rows from the collection.
                </p>
              </div>
            </td>
          </tr>
        ) : allTravisSheet.length > 0 ? (
          allTravisSheet.map((row, index) => {
            const rowKey = row.SKU || row.Option || String(index);

            return (
              <tr key={rowKey}>
                {TRAVIS_SHEET_COLUMNS.map((column) => {
                  if (column.key === "index") {
                    return (
                      <td key={`${rowKey}-index`} className="whitespace-nowrap border-b border-border/40 px-4 py-3 align-top text-xs font-semibold text-foreground/60">
                        {index + 1}
                      </td>
                    );
                  }

                  const value = row[column.key as keyof ITravisMethewSheetItem];
                  const cellValue = formatSheetValue(column.key, value);
                  const isDescription = column.key === "desc";

                  return (
                    <td
                      key={`${rowKey}-${column.key}`}
                      className="whitespace-nowrap border-b border-border/40 px-4 py-3 align-top text-sm text-foreground/80"
                    >
                      <span
                        className={isDescription ? "block max-w-[260px] truncate" : "block"}
                        title={cellValue}
                      >
                        {cellValue}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={TRAVIS_SHEET_COLUMNS.length} className="px-6 py-14 text-center">
              <div className="mx-auto flex max-w-md flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[#1a1a1a] text-white">
                  <Package2 className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">No Travis Mathew rows found</h3>
                <p className="mt-2 text-sm text-foreground/56">
                  Upload the Excel sheet to populate this collection.
                </p>
              </div>
            </td>
          </tr>
        )}
      </DataTable>
    </section>
  );
}
