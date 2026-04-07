"use client";

import React, { useDeferredValue, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchTravisMathew, deleteTravisMathew } from "@/store/slices/travisMathewSlice/travisMathewThunks";

import ImportFile from "../importFile/ImportFile";
import { TravisMathewHeader } from "./TravisMathewHeader";
import { TravisMathewFilterBar } from "./TravisMathewFilterBar";
import { TravisMathewStats } from "./TravisMathewStats";
import { TravisMathewTable } from "./TravisMathewTable";
import { TravisMathewPagination } from "./TravisMathewPagination";
import { ImageSliderModal } from "../../admin/ImageSliderModal";

export function TravisMathewCatalogWorkspace() {
  const dispatch = useDispatch<AppDispatch>();
  const { travismathew, isFetchedTravismathew } = useSelector((state: RootState) => state.travisMathew);

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    if (!isFetchedTravismathew) {
      dispatch(fetchTravisMathew());
    }
  }, [isFetchedTravismathew, dispatch]);

  const filteredProducts = travismathew.filter((product) => {
    if (!deferredQuery) return true;
    const haystack = [
      product.description,
      product.sku,
      product.category,
      product.family,
      product.color,
      product.size,
    ].join(" ").toLowerCase();
    return haystack.includes(deferredQuery);
  });

  const sortedProducts = [...filteredProducts].sort((left, right) => {
    switch (sortBy) {
      case "name-asc":
        return (left.description || "").localeCompare(right.description || "");
      case "stock-desc":
        return Number(right.stock_90 || right.stock_88 || 0) - Number(left.stock_90 || left.stock_88 || 0);
      case "latest":
      default:
        const tLeft = left.createdAt ? new Date(left.createdAt).getTime() : 0;
        const tRight = right.createdAt ? new Date(right.createdAt).getTime() : 0;
        return tRight - tLeft;
    }
  });

  const pageCount = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * pageSize;
  const visibleProducts = sortedProducts.slice(pageStart, pageStart + pageSize);

  const totalStock = sortedProducts.reduce((sum, p) => sum + Number(p.stock_90 || p.stock_88 || 0), 0);
  const activeFilterCount = 0; // Stub for further feature development if needed

  useEffect(() => {
    setPage(1);
  }, [deferredQuery, sortBy, pageSize]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(Array.from(new Set([...selectedIds, ...visibleProducts.map(p => p.sku || p._id || '')])));
    } else {
      setSelectedIds(selectedIds.filter(id => !visibleProducts.some(p => (p.sku || p._id) === id)));
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(v => v !== id));
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;
    setDeletingId(id);
    try {
      await dispatch(deleteTravisMathew(id)).unwrap();
      setSelectedIds((current) => current.filter((sid) => sid !== id));
    } catch (error) {
      console.error(error);
      window.alert("Failed to delete product.");
    } finally {
      setDeletingId("");
    }
  };

  const handleOpenPreview = (images: string[], index: number = 0) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <section className="premium-card overflow-hidden rounded-[28px] border border-border/20">
          <TravisMathewHeader 
            totalCount={travismathew.length}
            onImport={() => setIsImportOpen(true)}
            onExportVisible={() => {
              console.log("Exporting", visibleProducts);
            }}
          />

          <div className="space-y-4 px-4 py-4 bg-[#111111] bg-opacity-50">
            <TravisMathewFilterBar
              query={query}
              setQuery={setQuery}
              activeFilterCount={activeFilterCount}
              onToggleFilters={() => setFilterPanelOpen(!filterPanelOpen)}
              sortBy={sortBy}
              setSortBy={setSortBy}
              pageSize={pageSize}
              setPageSize={setPageSize}
            />

            <TravisMathewStats
              visibleCount={sortedProducts.length}
              availableStock={totalStock}
              selectedCount={selectedIds.length}
              activeFilterCount={activeFilterCount}
            />
          </div>
        </section>

        <section className="premium-card overflow-clip rounded-[28px] border border-border/20">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-4 py-3 bg-[#111111]">
            <div>
              <h3 className="text-base font-semibold text-foreground">Product List</h3>
              <p className="text-sm text-foreground/56">
                Select products to perform bulk actions or export data.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/48">
              <span>
                SHOWING {sortedProducts.length === 0 ? 0 : pageStart + 1}-{Math.min(pageStart + pageSize, sortedProducts.length)}
              </span>
              <span>OF {sortedProducts.length}</span>
            </div>
          </div>

          <div className="bg-[#111111] bg-opacity-50">
            <TravisMathewTable 
              products={visibleProducts}
              selectedIds={selectedIds}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
              onDelete={handleDelete}
              deletingId={deletingId}
              onOpenPreview={handleOpenPreview}
            />

            <TravisMathewPagination 
              currentPage={currentPage}
              pageCount={pageCount}
              onPageChange={setPage}
            />
          </div>

        </section>
      </div>

      <ImportFile isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />

      <ImageSliderModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        images={previewImages}
        currentIndex={previewIndex}
        onIndexChange={setPreviewIndex}
      />
    </>
  );
}
