'use client';

import React, { useEffect, useState } from 'react';
import { Package2 } from 'lucide-react';
import Image from 'next/image';

interface ProductImageProps {
  brandName: string;
  rowData: any;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

export function ProductImage({ brandName, rowData, alt = "Product Image", className = "", onClick }: ProductImageProps) {
  const [error, setError] = useState(false);
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);

  const s3_url = `https://callaways3bucketcc001-prod.s3.ap-south-1.amazonaws.com/public/productimg/TRAVIS-Images`;
  const s3_url_ogio = `https://callaways3bucketcc001-prod.s3.ap-south-1.amazonaws.com/public/productimg/OGIO-Images`;
 
  useEffect(() => {
    // Get the raw image source and filename

    const rawUrl = rowData?.primary_url || rowData?.primary_image_url;
    const skuValue = rowData?.sku || rowData?.baseSku;

    if (!rawUrl) return;

    // 1. If it's already an absolute URL or starts with /, use it directly
    if (typeof rawUrl === "string" && (rawUrl.startsWith('http') || rawUrl.startsWith('/'))) {
      setPrimaryImage(rawUrl);
      return;
    }

    // 2. Otherwise treatment as a filename and construct S3 URL based on brand
    if (brandName === "Travis Mathew" && typeof skuValue === "string") {
      // If we have a specific SKU, we strip the last part to get the family.
      // If we only have baseSku (likely Group View), the baseSku itself IS the family.
      const fam = rowData?.sku ? skuValue.replace(/_[^_]*$/, '') : skuValue;
      const path = `${s3_url}/${fam}/${rawUrl}`;
      setPrimaryImage(path);
    } else if (brandName === "Ogio" && typeof skuValue === "string") {
      const path = `${s3_url_ogio}/${skuValue}/${rawUrl}`;
      setPrimaryImage(path);
    } else {
      setPrimaryImage(rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`);
    }
  }, [brandName, rowData, s3_url, s3_url_ogio]);

  const displaySrc = primaryImage;


  if (!displaySrc || error) {
    return (
      <div className={`flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 ${className}`}>
        <Package2 className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-sm transition-all hover:border-zinc-400 dark:hover:border-zinc-600 ${className}`}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <img
        src={displaySrc}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={() => setError(true)}
      />
      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
    </div>
  );
}

