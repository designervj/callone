'use client';

import React, { useMemo } from "react";
import { SkuQuantityInput } from "./SkuQuantityInput";

interface ExtensionTableProps {
  parentRow: any;
  variationSkus: string[] | string;
  allData: any[];
  items: any[];
}

export function ExtensionTable({
  parentRow,
  variationSkus,
  allData,
  items
}: ExtensionTableProps) {
  const variationRows = useMemo(() => {
    const skus = Array.isArray(variationSkus)
      ? variationSkus
      : (typeof variationSkus === 'string' ? variationSkus.split(',').map(s => s.trim()) : []);

    // Filter allData to find rows whose SKU is in the variation list
    return allData.filter(row => skus.includes(row.sku));
  }, [variationSkus, allData]);

  if (variationRows.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950">
      <table className="min-w-full border-separate border-spacing-0 text-left">
        <thead>
          <tr className="bg-zinc-900 text-zinc-100 text-xs font-bold uppercase tracking-wider">
            <th className="px-4 py-2 w-14 border-b border-r border-zinc-200 dark:border-zinc-800">
              <input type="checkbox" className="h-4 w-4 rounded border-zinc-700 bg-transparent accent-primary" />
            </th>
            <th className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800">SKU</th>
            <th className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800">Style</th>
            <th className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800">Size</th>
            <th className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800">Qty88</th>
            <th className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800">Qty90</th>
            <th className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800">Qty</th>
            <th className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800">MRP</th>
            <th className="px-4 py-2 text-right border-b border-zinc-200 dark:border-zinc-800">Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-900/40">
          {variationRows.map((vRow: any) => {
            const cartItem = items.find(item => item.sku === vRow.sku);
            const totalQty = (cartItem?.qty88 || 0) + (cartItem?.qty90 || 0);
            const price = Number(vRow.amount || vRow.mrp || 0);
            const amount = totalQty * price;

            return (
              <tr key={vRow.sku} className="group transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04]">
                <td className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800">
                  <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 accent-primary" />
                </td>
                <td className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">{vRow.sku}</span>
                </td>
                <td className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">{vRow.style_id || vRow.baseSku || "Standard"}</td>
                <td className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800">
                   <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 uppercase">
                     {(() => {
                       if (vRow.size && vRow.size.toUpperCase() !== "OS") return vRow.size;
                       const parts = (vRow.sku || "").split("_");
                       const extracted = parts.length >= 3 ? parts[parts.length - 1] : "";
                       return extracted.toUpperCase() === "OS" ? "" : extracted;
                     })()}
                   </span>
                </td>
                <td className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800">
                  <div className="w-[74px]">
                    <SkuQuantityInput
                      row={vRow}
                      qty={"qty88"}
                      value={cartItem?.qty88 || 0}
                      maxStock={Number(vRow.stock_88) || 0}
                    />
                  </div>
                </td>
                <td className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800">
                  <div className="w-[74px]">
                    <SkuQuantityInput
                      row={vRow}
                      qty={"qty90"} 
                      value={cartItem?.qty90 || 0}
                      maxStock={Number(vRow.stock_90) || 0}
                    />
                  </div>
                </td>
             
                <td className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{totalQty}</span>
                </td>
                <td className="px-4 py-2 border-b border-r border-zinc-200 dark:border-zinc-800">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">₹{price.toLocaleString()}</span>
                </td>
                <td className="px-4 py-2 text-right border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">₹{amount.toLocaleString()}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

