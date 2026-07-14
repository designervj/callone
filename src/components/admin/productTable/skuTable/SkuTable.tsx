'use client';

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Minus, Package2, Pencil, Plus, Trash2, Box, ShieldCheck } from "lucide-react";
import { ProductImage } from "../../ProductImage";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { SelectionFilter, FloatingFilterPopup, ColumnFilterData } from "../../../sheet/travismethew/ColumnFilters";

import { CartItem } from "@/store/slices/cart/cartSlice";
import { ExtensionTable } from "./ExtensionTable";
import { SkuQuantityInput } from "./SkuQuantityInput";
import { AttributeField } from "@/store/slices/attributeSlice/attributeType";

interface SkuTableProps {
  visibleRows: any[];
  selectedIds: string[];
  setSelectedIds: (fn: (curr: string[]) => string[]) => void;
  allVisibleSelected: boolean;
  isSourceReadonly: boolean;
  handleDelete: (id: string) => void;
  deletingId: string;
  statusClasses: (status: string) => string;
  skuQuantities: Record<string, CartItem>;
  setSkuQuantities: React.Dispatch<React.SetStateAction<Record<string, CartItem>>>;
  onOpenPreview: (images: string[], index: number) => void;
  appliedFilters: any[];
  clearAllFilters: () => void;
  showImage?: boolean;
  isCompact?: boolean;
  attributeFilters?: Record<string, string[]>;
  setAttributeFilters?: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  columnTextFilters?: Record<string, { operator: string; searchValue: string }>;
  setColumnTextFilters?: React.Dispatch<React.SetStateAction<Record<string, { operator: string; searchValue: string }>>>;
}

export function SkuTable({
  visibleRows,
  selectedIds,
  setSelectedIds,
  allVisibleSelected,
  isSourceReadonly,
  handleDelete,
  deletingId,
  statusClasses,
  skuQuantities,
  setSkuQuantities,
  onOpenPreview,
  appliedFilters,
  clearAllFilters,
  showImage = true,
  isCompact = false,
  attributeFilters,
  setAttributeFilters,
  columnTextFilters,
  setColumnTextFilters,
}: SkuTableProps) {
  const { currentAttribute } = useSelector((state: RootState) => state.attribute);
  const { travismathew } = useSelector((state: RootState) => state.travisMathew);
  const { ogio } = useSelector((state: RootState) => state.ogio);
  const { hardgoods } = useSelector((state: RootState) => state.hardgoods);
  const { softgoods } = useSelector((state: RootState) => state.softgoods);
  const { items } = useSelector((state: RootState) => state.cart);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const {allWareHouse}= useSelector((state:RootState)=>state.warehouse)

  const brandwareHouse: AttributeField[] = useMemo(() => {
    const warehouseAttributes: AttributeField[] = [];
    if (
      currentAttribute?.name &&
      allWareHouse.length &&
      currentAttribute.attributes &&
      currentAttribute.attributes.length
    ) {
      allWareHouse.forEach((item: any) => {
        const warehouseCode = item.code?.toLowerCase();
        const filterData = currentAttribute?.attributes?.find(
          (attr: AttributeField) => {
            const attrKey = attr.key?.toLowerCase();
            return attrKey === warehouseCode || attrKey === `stock_${warehouseCode}`;
          }
        );
        if (filterData) {
          warehouseAttributes.push(filterData);
        }
      });
    }
    return warehouseAttributes;
  }, [allWareHouse, currentAttribute]);
  

 
  const allWareHouseKeys = useMemo(() => brandwareHouse.filter(wh => wh.isActive), [brandwareHouse]);

  const brandWareHouseKeys = useMemo(() => brandwareHouse.filter(wh => wh.isActive).map(wh => wh.key), [brandwareHouse]);

  const activeAttributes = useMemo(() => {
    return currentAttribute?.attributes?.filter(attr => 
      attr.show && !brandwareHouse.some(wh => wh.key === attr.key)
    ) || [];
  }, [currentAttribute, brandwareHouse]);

  const displayAttributes = useMemo(() => [...activeAttributes, ...allWareHouseKeys], [activeAttributes, allWareHouseKeys]);

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const renderHeaderFilter = (key: string, label: string, uniqueValues: string[]) => {
    const currentSel = attributeFilters?.[key] || [];
    const textFilter = columnTextFilters?.[key] || { operator: "contains", searchValue: "" };
    
    return (
      <div className="flex items-center gap-1.5 pt-1">
        <SelectionFilter
          columnKey={key}
          uniqueValues={uniqueValues}
          currentFilter={{
            selection: currentSel,
            operator: textFilter.operator as any,
            searchValue: textFilter.searchValue
          }}
          onFilterChange={(columnKey, data) => {
            if (data.selection !== undefined) {
              handleFilterChange(columnKey, data);
            }
            if (data.operator !== undefined || data.searchValue !== undefined) {
              setColumnTextFilters?.(prev => ({
                ...prev,
                [columnKey]: {
                  operator: data.operator ?? prev[columnKey]?.operator ?? "contains",
                  searchValue: data.searchValue ?? prev[columnKey]?.searchValue ?? ""
                }
              }));
            }
          }}
          columnLabel={label}
        />
        <FloatingFilterPopup
          columnKey={key}
          currentFilter={{
            selection: currentSel,
            operator: textFilter.operator as any,
            searchValue: textFilter.searchValue
          }}
          onFilterChange={(columnKey, data) => {
            if (data.operator !== undefined || data.searchValue !== undefined) {
              setColumnTextFilters?.(prev => ({
                ...prev,
                [columnKey]: {
                  operator: data.operator ?? prev[columnKey]?.operator ?? "contains",
                  searchValue: data.searchValue ?? prev[columnKey]?.searchValue ?? ""
                }
              }));
            }
          }}
        />
      </div>
    );
  };
  const allData =
    currentAttribute?.name === "Travis Mathew"
      ? travismathew
      : currentAttribute?.name === "Ogio"
        ? ogio
        : currentAttribute?.name === "Callaway Hardgoods"
          ? hardgoods
          : currentAttribute?.name === "Callaway Softgoods"
            ? softgoods
            : [];
  const uniqueValuesByAttribute = useMemo(() => {
    const result: Record<string, string[]> = {};
    if (!allData || !allData.length) return result;

    displayAttributes.forEach((attr) => {
      const key = attr.key || "";
      const set = new Set<string>();

      allData.forEach((row: any) => {
        const attributeGroup = row.attributeGroups?.find((g: any) => g.key === key);
        let val = row[key] !== undefined && row[key] !== null 
          ? row[key] 
          : (attributeGroup ? attributeGroup.values?.join(", ") : null);

        if (val !== undefined && val !== null) {
          val.toString().split(',').forEach((v: string) => {
            const trimmed = v.trim();
            if (trimmed) set.add(trimmed);
          });
        }
      });

      result[key] = Array.from(set).sort();
    });

    return result;
  }, [allData, displayAttributes]);

  const uniqueValuesForTravis = useMemo(() => {
    const result: Record<string, string[]> = {
      sku: [],
      description: [],
      category: [],
      season: [],
      style: [],
      color: [],
      size: []
    };
    if (!allData || !allData.length) return result;

    const skuSet = new Set<string>();
    const descSet = new Set<string>();
    const catSet = new Set<string>();
    const seasonSet = new Set<string>();
    const styleSet = new Set<string>();
    const colorSet = new Set<string>();
    const sizeSet = new Set<string>();

    allData.forEach((row: any) => {
      if (row.sku) skuSet.add(row.sku);
      if (row.name) descSet.add(row.name);
      if (row.category) catSet.add(row.category);
      if (row.season) seasonSet.add(row.season);
      if (row.style_code || row.baseSku) styleSet.add(row.style_code || row.baseSku);
      if (row.color) colorSet.add(row.color);
      if (row.size) sizeSet.add(row.size);
    });

    result.sku = Array.from(skuSet).sort();
    result.description = Array.from(descSet).sort();
    result.category = Array.from(catSet).sort();
    result.season = Array.from(seasonSet).sort();
    result.style = Array.from(styleSet).sort();
    result.color = Array.from(colorSet).sort();
    result.size = Array.from(sizeSet).sort();

    return result;
  }, [allData]);

  const handleFilterChange = (key: string, data: Partial<ColumnFilterData>) => {
    if (data.selection !== undefined && setAttributeFilters) {
      setAttributeFilters((current) => {
        const selections = current[key] || [];
        const selectionItem = data.selection as any;

        let newSelections: string[];
        if (selectionItem === null || selectionItem === undefined || (Array.isArray(selectionItem) && selectionItem.length === 0)) {
          newSelections = [];
        } else {
          newSelections = selections.includes(selectionItem)
            ? selections.filter((item) => item !== selectionItem)
            : [...selections, selectionItem];
        }

        const next = { ...current };
        if (newSelections.length > 0) {
          next[key] = newSelections;
        } else {
          delete next[key];
        }
        return next;
      });
    }
  };
  return (
    <table className={clsx("min-w-full border-separate border-spacing-0 text-left", isCompact && "is-compact")}>
      <thead>
        <tr className=" text-white">
          <StickyHeading className="w-14 px-4 py-3">
            <input
              type="checkbox"
              aria-label="Select visible products"
              checked={allVisibleSelected}
              onChange={() => {
                const visibleRowIds = visibleRows
                  .map((row: any) => String(row.rowKey ?? row.id ?? row?._id?.$oid ?? row?._id ?? row.sku ?? ""))
                  .filter(Boolean);
                if (allVisibleSelected) {
                  setSelectedIds((current) =>
                    current.filter((id) => !visibleRowIds.includes(id))
                  );
                } else {
                  setSelectedIds((current) =>
                    Array.from(new Set([...current, ...visibleRowIds]))
                  );
                }
              }}
              className="h-4 w-4 rounded border-white/20 bg-transparent accent-primary"
            />
          </StickyHeading>
          <StickyHeading className="w-14 px-4 py-3">{" "}</StickyHeading>
          {showImage && (
            <StickyHeading className="min-w-[80px] px-4 py-3">IMAGE</StickyHeading>
          )}
          {currentAttribute?.name === "Travis Mathew" ? (
            <>
              {/* SKU Header */}
              <StickyHeading className="min-w-[160px] px-4 py-3">
                {renderHeaderFilter("sku", "SKU", uniqueValuesForTravis.sku)}
              </StickyHeading>
              {/* Description Header */}
              <StickyHeading className="min-w-[210px] px-4 py-3">
                {renderHeaderFilter("description", "Description", uniqueValuesForTravis.description)}
              </StickyHeading>
              {/* Category Header */}
              <StickyHeading className="min-w-[160px] px-4 py-3">
                {renderHeaderFilter("category", "Category", uniqueValuesForTravis.category)}
              </StickyHeading>
              {/* Season Header */}
              <StickyHeading className="min-w-[110px] px-4 py-3">
                {renderHeaderFilter("Season", "SSN", uniqueValuesForTravis.season)}
              </StickyHeading>
              {/* Style Header */}
              <StickyHeading className="min-w-[120px] px-4 py-3">
                {renderHeaderFilter("Style Code", "Style", uniqueValuesForTravis.style)}
              </StickyHeading>
              {/* Color Header */}
              <StickyHeading className="min-w-[140px] px-4 py-3">
                {renderHeaderFilter("Color", "Color", uniqueValuesForTravis.color)}
              </StickyHeading>
              {/* Size Header */}
              <StickyHeading className="min-w-[100px] px-4 py-3">
                {renderHeaderFilter("Size", "Size", uniqueValuesForTravis.size)}
              </StickyHeading>
              {/* Quantities & Pricing Headers */}
              <StickyHeading className="min-w-[100px] px-4 py-3">Qty88</StickyHeading>
              <StickyHeading className="min-w-[100px] px-4 py-3">Qty90</StickyHeading>
              <StickyHeading className="min-w-[80px] px-4 py-3">Qty</StickyHeading>
              <StickyHeading className="min-w-[100px] px-4 py-3">MRP</StickyHeading>
              <StickyHeading className="min-w-[110px] px-4 py-3 text-right">Amt.</StickyHeading>
            </>
          ) : displayAttributes.length > 0 ? (
            displayAttributes.map((attr) => {
              const key = attr.key || "";
              const uniqueValues = uniqueValuesByAttribute[key] || [];
              return (
                <StickyHeading key={key} className="min-w-[160px] px-4 py-3">
                  {renderHeaderFilter(key, String(attr.label), uniqueValues)}
                </StickyHeading>
              );
            })
          ) : (
            <>
              {showImage && <StickyHeading className="min-w-[80px] px-4 py-3">IMAGE</StickyHeading>}
              <StickyHeading className="min-w-[320px] px-4 py-3">Product SKU</StickyHeading>
              <StickyHeading className="min-w-[150px] px-4 py-3">Brand</StickyHeading>
              <StickyHeading className="min-w-[180px] px-4 py-3">Category</StickyHeading>
              <StickyHeading className="min-w-[260px] px-4 py-3">Attributes</StickyHeading>
              <StickyHeading className="min-w-[140px] px-4 py-3">Inventory</StickyHeading>
              <StickyHeading className="min-w-[130px] px-4 py-3">Status</StickyHeading>
            </>
          )}
          <StickyHeading className="min-w-[120px] px-4 py-3 text-right">Actions</StickyHeading>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/20">
        {visibleRows && visibleRows.length ? (
          visibleRows.map((row: any) => {
            const rowId = String(row.rowKey ?? row.id ?? row?._id?.$oid ?? row?._id ?? row.sku ?? "");
            const isSelected = selectedIds.includes(rowId);

            const displayStock = Number(row.variantStock || row.availableStock || 0);
            const displayFamily = row.family || row.line || null;

            const varSkus = row.variantSkus && row.variantSkus.length > 0
              ? row.variantSkus
              : (row.variation_sku
                ? (typeof row.variation_sku === 'string'
                  ? row.variation_sku.split(',').map((s: string) => s.trim())
                  : row.variation_sku)
                : []);
            const hasVariants = varSkus.length > 0;

            return (
              <React.Fragment key={rowId}>
                <tr className={clsx(
                  "group border-b border-border/60 transition-all duration-300 hover:bg-white/[0.04]",
                  isSelected ? "bg-white/[0.04]" : "",
                  expandedRows.has(rowId) ? "bg-white/[0.04]" : ""
                )}>
                  <td className="px-4 py-3 align-middle border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        aria-label={`Select item`}
                        checked={isSelected}
                        onChange={() =>
                          setSelectedIds((current) =>
                            current.includes(rowId)
                              ? current.filter((id) => id !== rowId)
                              : [...current, rowId]
                          )
                        }
                        className="mt-1 h-4 w-4 rounded border-border/40 accent-white"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                    {hasVariants && (
                      <div className="flex justify-center">
                        <button
                          onClick={() => toggleRow(rowId)}
                          className={clsx(
                            "flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-500 active:scale-90",
                            expandedRows.has(rowId) 
                              ? "border-zinc-800 bg-zinc-900 text-zinc-100 shadow-sm" 
                              : "border-border/40 bg-foreground/[0.03] text-foreground/62 hover:border-foreground/20 hover:text-foreground"
                          )}
                        >
                          {expandedRows.has(rowId) ? (
                            <Minus size={14} strokeWidth={3} />
                          ) : (
                            <Plus size={14} strokeWidth={3} />
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                  {showImage && (
                    <td className="px-4 py-3 align-middle border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                      <div className="flex justify-center">
                        <ProductImage
                          brandName={currentAttribute?.name??""}
                          rowData={row}
                          alt={row.name}
                          className="h-12 w-12 rounded-xl object-cover shadow-sm ring-1 ring-border/20 transition-transform hover:scale-105 cursor-pointer"
                          onClick={() => {
                            const s3_url = `https://callaways3bucketcc001-prod.s3.ap-south-1.amazonaws.com/public/productimg/TRAVIS-Images`;
                            const s3_url_ogio = `https://callaways3bucketcc001-prod.s3.ap-south-1.amazonaws.com/public/productimg/OGIO-Images`;
                            const skuValue = row.sku || row.baseSku;

                            const resolveUrl = (url: string) => {
                              if (!url) return '';
                              if (url.startsWith('http') || url.startsWith('/')) return url;

                              if (currentAttribute?.name === "Travis Mathew") {
                                const fam = skuValue?.replace(/_[^_]*$/, '') || '';
                                return `${s3_url}/${fam}/${url}`;
                              } else if (currentAttribute?.name === "Ogio") {
                                return `${s3_url_ogio}/${skuValue}/${url}`;
                              }
                              return url.startsWith('/') ? url : `/${url}`;
                            };

                            const primary = resolveUrl(row.primary_url || row.primary_image_url);
                            const gallery = row.gallery_images_url
                              ? row.gallery_images_url.split(',').map((url: string) => resolveUrl(url.trim()))
                              : [];

                            onOpenPreview([primary, ...gallery].filter(Boolean), 0);
                          }}
                        />
                      </div>
                    </td>
                  )}
                  {currentAttribute?.name === "Travis Mathew" ? (
                    <>
                      {/* SKU */}
                      <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-sm font-semibold text-foreground uppercase tracking-tight">{row.sku}</span>
                      </td>
                      {/* Description */}
                      <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-sm font-semibold text-foreground uppercase tracking-tight">{row.name || row.description}</span>
                      </td>
                      {/* Category */}
                      <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-sm font-semibold text-foreground uppercase tracking-tight">{row.category}</span>
                      </td>
                      {/* SSN */}
                      <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-sm font-semibold text-foreground uppercase tracking-tight">{row.season}</span>
                      </td>
                      {/* Style */}
                      <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-sm font-semibold text-foreground uppercase tracking-tight">{row.style_code || row.baseSku || "Standard"}</span>
                      </td>
                      {/* Color */}
                      <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-sm font-semibold text-foreground uppercase tracking-tight">{row.color}</span>
                      </td>
                      {/* Size */}
                      <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-sm font-semibold text-foreground uppercase tracking-tight">
                          {(() => {
                            if (row.size && row.size.toUpperCase() !== "OS") return row.size;
                            const parts = (row.sku || "").split("_");
                            const extracted = parts.length >= 3 ? parts[parts.length - 1] : "";
                            return extracted.toUpperCase() === "OS" ? "" : extracted;
                          })()}
                        </span>
                      </td>
                      {/* Qty88 input */}
                      <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                        <div className="w-[74px]">
                          <SkuQuantityInput
                            row={row}
                            qty="qty88"
                            value={items?.find(item => item?.sku === row.sku)?.qty88 || 0}
                            maxStock={Number(row.stock_88) || 0}
                          />
                        </div>
                      </td>
                      {/* Qty90 input */}
                      <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                        <div className="w-[74px]">
                          <SkuQuantityInput
                            row={row}
                            qty="qty90"
                            value={items?.find(item => item?.sku === row.sku)?.qty90 || 0}
                            maxStock={Number(row.stock_90) || 0}
                          />
                        </div>
                      </td>
                      {/* Qty total */}
                      <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-sm font-semibold text-foreground">{((items?.find(item => item?.sku === row.sku)?.qty88 || 0) + (items?.find(item => item?.sku === row.sku)?.qty90 || 0))}</span>
                      </td>
                      {/* MRP */}
                      <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-sm font-semibold text-foreground">₹{Number(row.amount || row.mrp || 0).toLocaleString()}</span>
                      </td>
                      {/* Amount */}
                      <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-sm font-semibold text-foreground">₹{(((items?.find(item => item?.sku === row.sku)?.qty88 || 0) + (items?.find(item => item?.sku === row.sku)?.qty90 || 0)) * Number(row.amount || row.mrp || 0)).toLocaleString()}</span>
                      </td>
                    </>
                  ) : displayAttributes.length > 0 ? (
                    displayAttributes.map((attr) => {
                      const key = attr.key || "";

                      if (key === "sku") {
                        return (
                          <td key={key} className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-foreground">{row.sku}</p>
                            </div>
                          </td>
                        );
                      }

                      if (key === "status") {
                        return (
                          <td key={key} className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                            <span className={clsx(
                              "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
                              statusClasses(row.status)
                            )}>
                              {row.status}
                            </span>
                          </td>
                        );
                      }

                      if (key === "availableStock" || key === "stock" || key === "variantStock") {
                        return (
                          <td key={key} className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                            <div className="space-y-1">
                              <p className="font-semibold text-foreground">{displayStock}</p>
                              <p className="text-xs text-foreground/52">
                                {displayStock > 0 ? "In Stock" : "Awaiting stock"}
                              </p>
                            </div>
                          </td>
                        );
                      }

                      const isWarehouse = brandWareHouseKeys.includes(key);

                      if (isWarehouse) {
                        const warehouseCode = key.toLowerCase().replace("stock_", "");
                        const qtyKey = `qty${warehouseCode}`;
                        const stockKey = key; // Using the attribute key itself
                         const stockValue = row[key];
                        
                       
                        return (
                          <td key={key} className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                            <SkuQuantityInput
                              row={row}
                              qty={qtyKey}
                              value={items?.find(item => item?.sku === row.sku)?.[qtyKey] || 0}
                              maxStock={Number(stockValue) || 0}
                            />
                          </td>
                        );
                      }

                      // For any other attribute, match with object key
                      const attributeGroup = row.attributeGroups?.find((g: any) => g.key === key);
                      let val = row[key] !== undefined && row[key] !== null ? row[key] : (attributeGroup ? attributeGroup.values?.join(", ") : null);

                      // If it's a stock field and value is null/undefined or empty string, set to 0
                      if ((key.toLowerCase().includes("stock") || key.toLowerCase().startsWith("stock_")) && (val === null || val === undefined || val === "")) {
                        val = 0;
                      }

                      return (
                        <td key={key} className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                          <div className="flex flex-wrap gap-2">
                            {val !== undefined && val !== null ? (
                               ["description", "category", "season", "style_code", "color", "style code"].includes(key.toLowerCase()) ? (
                                 <span className="text-sm font-semibold text-foreground uppercase tracking-tight">{val.toString()}</span>
                               ) : (
                                 val.toString().split(',').map((v: string, i: number) => (
                                   <span key={i} className="rounded-2xl border border-border/70 bg-background px-2.5 py-1.5 text-xs text-foreground/66 shadow-sm">
                                     {/* {i === 0 && <span className="font-semibold text-foreground/74">{attr.label}:</span>} */}
                                     {v.trim()}
                                   </span>
                                 ))
                               )
                            ) : (
                              <span className="text-xs text-foreground/62">N/A</span>
                            )}
                          </div>
                        </td>
                      );
                    })
                  ) : (
                    <>
                      <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                        <div className="flex gap-4">
                          {showImage && (
                            <ProductImage
                              brandName={currentAttribute?.name ?? ""}
                              rowData={row}
                              alt={row.name}
                              className="h-12 w-12 rounded-xl object-cover shadow-sm ring-1 ring-border/20 transition-transform hover:scale-105 cursor-pointer"
                              onClick={() => {
                                const s3_url = `https://callaways3bucketcc001-prod.s3.ap-south-1.amazonaws.com/public/productimg/TRAVIS-Images`;
                                const s3_url_ogio = `https://callaways3bucketcc001-prod.s3.ap-south-1.amazonaws.com/public/productimg/OGIO-Images`;
                                const skuValue = row.sku || row.baseSku;

                                const resolveUrl = (url: string) => {
                                  if (!url) return '';
                                  if (url.startsWith('http') || url.startsWith('/')) return url;

                                  if (currentAttribute?.name === "Travis Mathew") {
                                    const fam = skuValue?.replace(/_[^_]*$/, '') || '';
                                    return `${s3_url}/${fam}/${url}`;
                                  } else if (currentAttribute?.name === "Ogio") {
                                    return `${s3_url_ogio}/${skuValue}/${url}`;
                                  }
                                  return url.startsWith('/') ? url : `/${url}`;
                                };

                                const primary = resolveUrl(row.primary_url || row.primary_image_url);
                                const gallery = row.gallery_images_url
                                  ? row.gallery_images_url.split(',').map((url: string) => resolveUrl(url.trim()))
                                  : [];

                                onOpenPreview([primary, ...gallery].filter(Boolean), 0);
                              }}
                            />
                          )}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate font-semibold text-foreground">{row.sku}</p>
                              <span className="rounded-full border border-white/8 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/72">
                                {row.sku}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-foreground/72">
                              {row.name} · {row.subcategory || row.family || "Softgoods"}
                            </p>
                            {row.baseSku && (
                              <p className="mt-2 line-clamp-1 text-xs text-foreground/62 italic">
                                {row.baseSku} · {row.variantTitle || "Standard Variant"}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                        <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-foreground/80">{row.brand?.name || "Private"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground uppercase tracking-tight">{row.category || "General"}</span>
                            <span className="text-xs text-foreground/62">{displayFamily || row.subcategory || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                          <div className="flex flex-wrap gap-2">
                            {row.attributeGroups?.length ? (
                              row.attributeGroups.slice(0, 3).map((group: any) => {
                                const label = group.label?.toLowerCase() || "";
                                const isStandard = ["description", "category", "season", "style_code", "color", "style code"].includes(label);
                                
                                if (isStandard) {
                                  return (
                                    <span key={group.key} className="text-sm font-semibold text-foreground uppercase tracking-tight">
                                      {group.values?.join(", ")}
                                    </span>
                                  );
                                }

                                return (
                                  <span key={group.key} className="rounded-2xl border border-border/70 bg-background px-2.5 py-1.5 text-xs text-foreground/66 shadow-sm">
                                    <span className="font-semibold text-foreground/74">{group.label}:</span>
                                    {group.values?.slice(0, 2).join(", ")}
                                    {group.values?.length > 2 ? ` +${group.values.length - 2}` : ""}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-xs text-foreground/62">No Attributes</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground">{displayStock}</p>
                            <p className="text-xs text-foreground/52">
                              {displayStock > 0 ? "In Stock" : "Awaiting stock"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top border-b border-r border-zinc-200/50 dark:border-zinc-800/50">
                          <span className={clsx(
                             "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
                             statusClasses(row.status)
                           )}>
                            {row.status}
                          </span>
                        </td>
                    </>
                  )}
                  <td className="px-4 py-3 align-top text-right border-b border-zinc-200/50 dark:border-zinc-800/50">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="group/action relative">
                        <Link
                          href={`/admin/products/${rowId}/edit`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-foreground transition-all hover:bg-white hover:text-background"
                        >
                          <Pencil size={16} />
                        </Link>
                        <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 transition-all group-hover/action:opacity-100">
                          Edit
                          <div className="absolute top-full left-1/2 h-1 w-1 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-black/80" />
                        </div>
                      </div>

                      <div className="group/action relative">
                        <button
                          onClick={() => handleDelete(rowId)}
                          disabled={deletingId === rowId}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-foreground transition-all hover:bg-white hover:text-background disabled:opacity-50"
                        >
                          {deletingId === rowId ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                        <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-background opacity-0 transition-all group-hover/action:opacity-100">
                          Delete
                          <div className="absolute top-full left-1/2 h-1 w-1 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-white/90" />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedRows.has(rowId) && hasVariants && (
                    <tr>
                      <td colSpan={100} className="bg-foreground/[0.01] p-0 bg-[#f9f9f9]">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mx-4 mb-4 mt-2 p-1 ">
                              <ExtensionTable
                                parentRow={row}
                                variationSkus={varSkus}
                                allData={allData}
                                items={items}
                              />
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            )
          })
        ) : (
          <tr>
            <td colSpan={8} className="px-6 py-14 text-center">
              <div className="mx-auto flex max-w-md flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-white text-background">
                  <Package2 className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">No products found</h3>
                <p className="mt-2 text-sm text-foreground/62">
                  Try adjusting your search terms or clearing active filters.
                </p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}



function StickyHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={clsx(
        "bg-zinc-900 text-zinc-100 border-b border-r border-zinc-800 font-bold uppercase tracking-wider text-xs px-5 py-4",
        className
      )}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div>
        {children}
      </div>
    </th>
  );
}
