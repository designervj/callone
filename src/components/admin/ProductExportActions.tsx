'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, FileText, FileSpreadsheet, Presentation } from 'lucide-react';
import { buildExportRows, downloadCsv } from '../products/utils/ProductExcel';
import TravisPdf, { OtherSku, TravisPdfPrint } from './pdf/TravisPdf';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { BrandType } from '@/store/slices/brandSlice/brandType';
import { HardGoodType } from '../products/HardGood/HardGoodType';
import { OgioType } from '../products/Ogio/OgioType';
import { TravisMathewType } from '../products/travismethew/TravisMethewType';

interface ProductExportActionsProps {
  selectedProducts: any[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  viewMode: 'product' | 'sku';
  brandName?: string;
}

export function ProductExportActions({
  selectedProducts,
  selectedIds,
  setSelectedIds,
  viewMode,
  brandName
}: ProductExportActionsProps) {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [showTravisPdf, setShowTravisPdf] = useState(false);
   const {travismathew}=useSelector((state:RootState)=>state.travisMathew)
    const {ogio}=useSelector((state:RootState)=>state.ogio)
    const {hardgoods}=useSelector((state:RootState)=>state.hardgoods)
    const {currentBrand}=useSelector((state:RootState)=>state.brand)

    const [travisPdf, setTravisPdf] = useState<TravisPdfPrint[]>([]);
      // const fam = record.primary_image_url.replace(/_[^_]*$/, '');
 
    const allTravisItems = useMemo(() => {
      if (currentBrand?.name !== "Travis Mathew" || selectedIds.length === 0) return [];

      if (viewMode === "product") {
        const styleCodes = selectedIds.map(item => item.split(':')[1]);
        const filteredTravis = travismathew.filter((item: TravisMathewType) => 
          styleCodes.includes(item?.style_code ?? "")
        );

        return filteredTravis.map(item => ({
          sku: item.sku,
          description: item.description,
          primary_image_url: item.primary_image_url,
          gallery_images_url: item.gallery_images_url,
          category: item.category,
          gender: item.gender,
          season: item.season,
          color: item.color,
          style_code: item.style_code,
          mrp: Number(item.mrp),
          otherSku: []
        } as TravisPdfPrint));
      } else if (viewMode === "sku") {
        const filteredTravis = travismathew.filter((item: TravisMathewType) => 
          selectedIds.includes(item?._id ?? "")
        );

        return filteredTravis.map(fliteredItem => {
          const filterOther: OtherSku[] = [];
          const variationSkuStr = fliteredItem.variation_sku;
          
          // Handle variation_sku if it's a string or array
          const variationSkuArray = Array.isArray(variationSkuStr) 
            ? variationSkuStr 
            : typeof variationSkuStr === 'string' 
              ? variationSkuStr.split(',').map(s => s.trim()) 
              : [];

          variationSkuArray.forEach((fliteredSku: string) => {
            const variant = travismathew.find((item: TravisMathewType) => item.sku === fliteredSku);
            if (variant) {
              filterOther.push({
                sku: variant.sku,
                qty: Number(variant.stock_88 || 0) + Number(variant.stock_90 || 0),
                size: variant.size,
              });
            }
          });

          return {
            sku: fliteredItem.sku,
            description: fliteredItem.description,
            primary_image_url: fliteredItem.primary_image_url,
            gallery_images_url: fliteredItem.gallery_images_url,
            category: fliteredItem.category,
            gender: fliteredItem.gender,
            season: fliteredItem.season,
            color: fliteredItem.color,
            style_code: fliteredItem.style_code,
            mrp: Number(fliteredItem.mrp),
            otherSku: filterOther,
          } as TravisPdfPrint;
        });
      }
      return [];
    }, [currentBrand, travismathew, viewMode, selectedIds]);

    React.useEffect(() => {
      if (allTravisItems && allTravisItems.length > 0) {
        setTravisPdf(allTravisItems);
      }
    }, [allTravisItems]);

  const handleExportExcel = () => {
    downloadCsv("products-selected.csv", buildExportRows(selectedProducts as any));
    setExportMenuOpen(false);
  };

  const handleExportPdf = () => {
    if (brandName === "Travis Mathew") {
      setShowTravisPdf(true);
    } else {
      // Placeholder for general PDF export
      console.log("General PDF export not implemented yet");
      alert("PDF export is currently optimized for Travis Mathew. General export coming soon.");
    }
    setExportMenuOpen(false);
  };

  const handleExportPpt = () => {
    // Placeholder for PPT export
    console.log("PPT export not implemented yet");
    alert("PPT export coming soon.");
    setExportMenuOpen(false);
  };
   
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          onClick={() => setExportMenuOpen(!exportMenuOpen)}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/20"
        >
          <Presentation className="h-4 w-4 text-amber-500" />
          Export selected
          <ChevronDown className={`h-3 w-3 transition-transform ${exportMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {exportMenuOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1A] p-1 shadow-2xl z-50">
            <button
              onClick={handleExportPdf}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              <FileText className="h-4 w-4 text-primary" />
              Export to PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
              Export to Excel
            </button>
            <button
              onClick={handleExportPpt}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Presentation className="h-4 w-4 text-amber-500" />
              Export to PPT
            </button>
          </div>
        )}
      </div>

      {showTravisPdf && currentBrand?.name==="Travis Mathew" && (
        <TravisPdf 
          selectedRow={travisPdf}
          isduplicateMrp={false} // Default to false or pass as prop
          resetSelectedRow={() => {
            setShowTravisPdf(false);
            setSelectedIds([]);
          }}
          cancelRowSelected={() => setShowTravisPdf(false)}
        />
      )}
    </div>
  );
}


