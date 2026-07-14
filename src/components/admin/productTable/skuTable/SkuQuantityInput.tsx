'use client';

import { calculateValues } from "@/components/order/util/OrderUtil";
import { AppDispatch, RootState } from "@/store";
import { addToCart, CartItem } from "@/store/slices/cart/cartSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";

interface SkuQuantityInputProps {
  row: any;
  value: number;
  maxStock: number;
  qty: string;
  // onChange: (val: number) => void;
}

export function SkuQuantityInput({
  row,
  value,
  maxStock,
  qty,
  // onChange,
}: SkuQuantityInputProps) {
  const isError = value > maxStock || value < 0;
  const [inputvalue, setInputValue] = useState(value);

  const { currentBrand } = useSelector((state: RootState) => state.brand);
  // console.log("row---->",row)
  
  // console.log("maxStock---->",maxStock)
  // console.log("value---->",value)
  // console.log("inputvalue---->",inputvalue)

  // Sync from prop if Redux updates
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const dispatch = useDispatch<AppDispatch>();

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    handleChange(val);
  };

  const handleChange = React.useCallback(
    (val: number) => {
      const clampedVal = Math.max(0, Math.min(val, maxStock));
      setInputValue(clampedVal); // Immediate local update

      const data: CartItem = {
        sku: row.sku,
        brand: currentBrand?.name,
        description: row.description,
        image: row.primary_image_url,
        [qty]: clampedVal,
        mrp: Number(row.mrp) || 0,
        gst: Number(row.gst) || 0,
        amount: Number(row.mrp) || 0,
        discount: 0,
        lessDiscount: 0,
        netBilling: 0,
        finalAmount: 0,
        isIndividualDiscount:false
      };
      const updateData = calculateValues(data, 22, "inclusive");
      // console.log("updateData---->",updateData)
      dispatch(addToCart(updateData));
    },
    [maxStock, row, currentBrand, qty, dispatch]
  );

  // Sync from maxStock if needed
  useEffect(() => {
    if (inputvalue > maxStock) {
      handleChange(maxStock);
    }
  }, [maxStock, inputvalue, handleChange]);


  //add the project into the DB

  return (
    <div
      className={clsx(
        "inline-flex items-stretch overflow-hidden rounded-lg border transition-all duration-300 bg-white dark:bg-zinc-950",
        isError
          ? "border-red-500/30 ring-1 ring-red-500/20"
          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
      )}
      style={{ height: "30px" }}
    >
      {/* Stock Display (Left indicator) */}
      <div
        className={clsx(
          "flex items-center justify-center px-1.5 text-[9px] font-bold transition-colors",
          isError ? "bg-red-500/10 text-red-500" : "border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500"
        )}
        style={{ minWidth: "22px" }}
        title="Physical Inventory Limit"
      >
        {maxStock}
      </div>

      {/* Input Field */}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputvalue}
        onChange={handleManualChange}
        className={clsx(
          "w-8 bg-transparent px-0.5 text-center text-xs font-semibold focus:outline-none transition-colors text-zinc-900 dark:text-zinc-100"
        )}
      />

      {/* Stepper Controls */}
      <div className="flex flex-col border-l border-zinc-200 dark:border-zinc-800">
        <button
          disabled={inputvalue >= maxStock}
          onClick={() => handleChange(inputvalue + 1)}
          className="flex flex-1 items-center justify-center border-b border-zinc-200 dark:border-zinc-800 px-1 text-[8px] text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-20"
          aria-label="Increase level"
        >
          <span className="mb-0.5 scale-75">▲</span>
        </button>
        <button
          disabled={inputvalue <= 0}
          onClick={() => handleChange(Math.max(0, inputvalue - 1))}
          className="flex flex-1 items-center justify-center px-1 text-[8px] text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-20"
          aria-label="Decrease level"
        >
          <span className="mt-0.5 scale-75">▼</span>
        </button>
      </div>
    </div>
  );
}

