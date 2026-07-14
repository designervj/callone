'use client';

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, ImageOff, Minimize, Maximize } from "lucide-react";
import { ProductTable } from "./productTable/groupView/ProductTable";
import { SkuTable } from "./productTable/skuTable/SkuTable";
import { EmptyState } from "./EmptyState";
import { CartItem } from "@/store/slices/cart/cartSlice";
import ShowAppliedfilter from "./productTable/ShowAppliedfilter";
import clsx from "clsx";

interface CatalogTableProps {
  visibleRows: any[];
  viewMode: "product" | "sku";
  selectedIds: string[];
  setSelectedIds: (fn: (curr: string[]) => string[]) => void;
  allVisibleSelected: boolean;
  pageStart: number;
  pageSize: number;
  currentPage: number;
  pageCount: number;
  setPage: (fn: (curr: number) => number) => void;
  isSourceReadonly: boolean;
  handleDelete: (id: string) => void;
  deletingId: string;
  sortedProductsCount: number;
  statusClasses: (status: string) => string;
  skuQuantities: Record<string, CartItem>;
  setSkuQuantities: React.Dispatch<React.SetStateAction<Record<string, CartItem>>>;
  onOpenPreview: (images: string[], index: number) => void;
  appliedFilters: any[];
  clearAllFilters: () => void;
  attributeFilters?: Record<string, string[]>;
  setAttributeFilters?: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  columnTextFilters?: Record<string, { operator: string; searchValue: string }>;
  setColumnTextFilters?: React.Dispatch<React.SetStateAction<Record<string, { operator: string; searchValue: string }>>>;
}

export function CatalogTable({
  visibleRows,
  viewMode,
  selectedIds,
  setSelectedIds,
  allVisibleSelected,
  pageStart,
  pageSize,
  currentPage,
  pageCount,
  setPage,
  isSourceReadonly,
  handleDelete,
  deletingId,
  sortedProductsCount,
  statusClasses,
  skuQuantities,
  setSkuQuantities,
  onOpenPreview,
  appliedFilters,
  clearAllFilters,
  attributeFilters,
  setAttributeFilters,
  columnTextFilters,
  setColumnTextFilters,
}: CatalogTableProps) {
  const [showImage, setShowImage] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isFullScreen) {
      document.body.classList.add('sheet-fullscreen');
    } else {
      document.body.classList.remove('sheet-fullscreen');
    }
    return () => document.body.classList.remove('sheet-fullscreen');
  }, [isFullScreen]);
  return (
    <section className={isFullScreen ? 'fixed inset-0 z-[2000] bg-white p-2.5 flex flex-col h-screen overflow-hidden gap-1.5' : 'flex flex-col gap-6'}>
      {/* Search/Filter Context is likely above this or handled elsewhere, 
          so we focus on the table container itself matching the OrderList style */}
      <div className={clsx(
        "overflow-hidden bg-card dark:bg-card border border-border/40 transition-all duration-500",
        isFullScreen ? "rounded-xl flex-1 flex flex-col min-h-0" : "rounded-[32px] shadow-[0_15px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_45px_100px_rgba(0,0,0,0.4)]"
      )}>
        <div className={clsx(
          "flex flex-wrap items-center justify-between gap-4 border-b border-border/40 bg-foreground/[0.01]",
          isFullScreen ? "px-4 py-1.5" : "px-8 py-6"
        )}>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h3 className={clsx("font-black uppercase tracking-widest text-foreground", isFullScreen ? "text-sm" : "text-xl")}>
                {viewMode === "product" ? "Product Workspace" : "SKU Manifest"}
              </h3>

              {!isFullScreen && (
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 italic">
                  {viewMode === "product"
                    ? "Operational Global Catalog"
                    : "Individual SKU Variant Tracking"}
                </p>
              )}
            </div>
            <div className="h-8 w-px bg-border/40" />
            <div className="rounded-full bg-foreground/[0.05] border border-border/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
              {sortedProductsCount === 0 ? "NO RECORDS" : `${pageStart + 1} - ${Math.min(pageStart + pageSize, sortedProductsCount)} OF ${sortedProductsCount}`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShowAppliedfilter  
              appliedFilters={appliedFilters}
              clearAllFilters={clearAllFilters}
            />
            
            <button
              onClick={() => setShowImage(!showImage)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                showImage
                  ? "border-blue-500/30 bg-blue-500 text-white hover:bg-blue-600"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
              }`}
            >
              {showImage ? <ImageOff className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
              {showImage ? "Hide Img" : "Show Img"}
            </button>
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                isFullScreen
                  ? "border-blue-500/30 bg-blue-500 text-white hover:bg-blue-600"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
              }`}
            >
              {isFullScreen ? <Minimize className="h-3 w-3" /> : <Maximize className="h-3 w-3" />}
              {isFullScreen ? "Exit" : "Full"}
            </button>
          </div>
          {/* Internal Search/Navigation would go here if needed, but it's handled in catalogue.tsx usually. 
              We'll keep the space optimized. */}
        </div>

        <div className={clsx(
          "w-full overflow-auto",
          isFullScreen ? "flex-1 min-h-0" : "max-h-[800px]"
        )}>
          {visibleRows.length === 0 ? (
            <EmptyState
              title="No records identified"
              description="Try adjusting your search terms or clearing active filters to re-scan the database."
            />
          ) : viewMode === "product" ? (
            <ProductTable
              visibleRows={visibleRows}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              allVisibleSelected={allVisibleSelected}
              isSourceReadonly={isSourceReadonly}
              handleDelete={handleDelete}
              deletingId={deletingId}
              statusClasses={statusClasses}
              onOpenPreview={onOpenPreview}
              showImage={showImage}
              isCompact={isFullScreen}
            />
          ) : (
            <SkuTable
              visibleRows={visibleRows}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              allVisibleSelected={allVisibleSelected}
              isSourceReadonly={isSourceReadonly}
              handleDelete={handleDelete}
              deletingId={deletingId}
              statusClasses={statusClasses}
              skuQuantities={skuQuantities}
              setSkuQuantities={setSkuQuantities}
              onOpenPreview={onOpenPreview}
              appliedFilters={appliedFilters}
              clearAllFilters={clearAllFilters}
              showImage={showImage}
              isCompact={isFullScreen}
              attributeFilters={attributeFilters}
              setAttributeFilters={setAttributeFilters}
              columnTextFilters={columnTextFilters}
              setColumnTextFilters={setColumnTextFilters}
            />
          )}
        </div>

        <div className={clsx(
          "flex flex-wrap items-center justify-between gap-4 border-t border-border/40 bg-foreground/[0.01] px-8",
          isFullScreen ? "py-1.5" : "py-5"
        )}>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 italic">
            Page {currentPage} <span className="mx-2">/</span> {pageCount} Indexed
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              className={clsx(
                "flex items-center justify-center rounded-xl border border-border/40 bg-foreground/[0.02] text-foreground/40 transition-all hover:bg-primary hover:text-foreground disabled:opacity-30",
                isFullScreen ? "h-7 w-7" : "h-10 w-10"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className={clsx(
              "flex items-center rounded-xl border border-border/40 bg-foreground/[0.02] px-6 text-[11px] font-black tracking-widest text-foreground",
              isFullScreen ? "h-7 px-3" : "h-10 px-6"
            )}>
              {currentPage}
            </div>
            <button
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              disabled={currentPage === pageCount}
              className={clsx(
                "flex items-center justify-center rounded-xl border border-border/40 bg-foreground/[0.02] text-foreground/40 transition-all hover:bg-primary hover:text-foreground disabled:opacity-30",
                isFullScreen ? "h-7 w-7" : "h-10 w-10"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

