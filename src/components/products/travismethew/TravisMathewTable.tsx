import React from 'react';
import Link from 'next/link';
import { Package2, Trash2 } from 'lucide-react';
import { TravisMathewType } from './TravisMethewType';
import { ProductImage } from '../../admin/ProductImage';

export interface TravisMathewTableProps {
  products: TravisMathewType[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  deletingId?: string;
  onOpenPreview: (images: string[], index: number) => void;
}

export function TravisMathewTable({
  products,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onDelete,
  deletingId,
  onOpenPreview
}: TravisMathewTableProps) {
  const allSelected = products.length > 0 && products.every((p) => {
    const id = p.sku || p._id;
    return id ? selectedIds.includes(id) : false;
  });

  const handleProductClick = (product: TravisMathewType) => {
    const s3_url = `https://callaways3bucketcc001-prod.s3.ap-south-1.amazonaws.com/public/productimg/TRAVIS-Images`;
    const skuValue = product.sku;
    const fam = skuValue?.replace(/_[^_]*$/, '') || '';
    
    const resolveUrl = (url: string) => {
      if (!url) return '';
      if (url.startsWith('http') || url.startsWith('/')) return url;
      return `${s3_url}/${fam}/${url}`;
    };

    const primary = resolveUrl(product.primary_image_url || '');
    const gallery = product.gallery_images_url 
      ? product.gallery_images_url.split(',').map((url: string) => resolveUrl(url.trim())) 
      : [];
    
    onOpenPreview([primary, ...gallery].filter(Boolean), 0);
  };

  //const s3_url = `https://callaways3bucketcc001-prod.s3.ap-south-1.amazonaws.com/public/productimg/TRAVIS-Images`;
  return (
    <div className="w-full max-h-[calc(100vh-250px)] overflow-auto rounded-b-[24px]">
      <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr className="bg-[#111111] text-white">
            <th className="sticky top-0 z-10 bg-[#111111] w-12 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
            </th>
            <th className="sticky top-0 z-10 bg-[#111111] min-w-[320px] px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-foreground/50">Product</th>
            <th className="sticky top-0 z-10 bg-[#111111] min-w-[150px] px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-foreground/50">Brand</th>
            <th className="sticky top-0 z-10 bg-[#111111] min-w-[180px] px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-foreground/50">Category</th>
            <th className="sticky top-0 z-10 bg-[#111111] min-w-[260px] px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-foreground/50">Attributes</th>
            <th className="sticky top-0 z-10 bg-[#111111] min-w-[180px] px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-foreground/50">Variants</th>
            <th className="sticky top-0 z-10 bg-[#111111] min-w-[140px] px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-foreground/50">Stock</th>
            <th className="sticky top-0 z-10 bg-[#111111] min-w-[130px] px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-foreground/50">Status</th>
            <th className="sticky top-0 z-10 bg-[#111111] min-w-[120px] px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-foreground/50">Actions</th>

          </tr>
        </thead>
        <tbody className="bg-transparent">
          {products.length > 0 ? (
            products.map((product) => {
              const id = product.sku || product._id || Math.random().toString();
              const isSelected = selectedIds.includes(id);

              return (
                <tr key={id} className="border-b border-border/60 transition-colors hover:bg-white/5">
                  <td className="border-b border-white/5 px-4 py-4 align-top">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectOne(id, e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border/80"
                    />
                  </td>

                  {/* show image  */}

                  <td 
                    className="border-b border-white/5 px-4 py-4 align-top cursor-pointer group hover:bg-white/5 transition-colors"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="flex gap-3">
                      <ProductImage 
                        brandName="Travis Mathew"
                        rowData={product}
                        alt={product.description}
                        className="h-11 w-11 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                           <p className="truncate font-semibold text-foreground group-hover:text-[#4b8df8] transition-colors">
                            {product.description || 'Untitled product'}
                          </p>
                          <span className="rounded-full border border-border/70 bg-background/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/48">
                            {product.sku || 'N/A'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-foreground/52">
                          {product.gender || 'Mens'} · {product.line || 'apparel'}
                        </p>
                        <p className="mt-2 line-clamp-1 text-xs text-foreground/45 group-hover:text-foreground/60">
                          {product.variation_sku || ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-white/5 px-4 py-4 align-top">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">Travis Mathew</p>
                      <p className="text-xs text-foreground/52">TM</p>
                    </div>
                  </td>
                  <td className="border-b border-white/5 px-4 py-4 align-top">
                    <p className="font-medium text-foreground">{product.category || 'No category'}</p>
                    <p className="mt-1 text-xs text-foreground/52">{product.family || 'No subcategory'}</p>
                  </td>
                  <td className="border-b border-white/5 px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      {product.color && (
                        <span className="rounded-2xl border border-border/70 bg-transparent px-2.5 py-1.5 text-xs text-foreground/66">
                          <span className="font-semibold text-foreground/74">Color:</span> {product.color}
                        </span>
                      )}
                      {product.size && (
                        <span className="rounded-2xl border border-border/70 bg-transparent px-2.5 py-1.5 text-xs text-foreground/66">
                          <span className="font-semibold text-foreground/74">Size:</span> {product.size}
                        </span>
                      )}
                      {!product.color && !product.size && (
                        <span className="text-xs text-foreground/45">No variant attributes</span>
                      )}
                    </div>
                  </td>
                  <td className="border-b border-white/5 px-4 py-4 align-top">
                    <p className="font-semibold text-foreground">
                      {product.variation_sku ? product.variation_sku.split(',').length : 0}
                    </p>
                    <p className="mt-1 text-xs text-foreground/52 truncate max-w-[150px]">
                      {product.variation_sku || ''}
                    </p>
                  </td>
                  <td className="border-b border-white/5 px-4 py-4 align-top">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{product.stock_90 || product.stock_88 || 0}</p>
                      <p className="text-xs text-foreground/52">
                        {Number(product.stock_90 || product.stock_88 || 0) > 0 ? "Available" : "Awaiting stock"}
                      </p>
                    </div>
                  </td>
                  <td className="border-b border-white/5 px-4 py-4 align-top">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${Number(product.stock_90 || product.stock_88 || 0) > 0 ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' : 'border-amber-500/20 bg-amber-500/10 text-amber-500'}`}>
                      {Number(product.stock_90 || product.stock_88 || 0) > 0 ? 'ACTIVE' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="border-b border-white/5 px-4 py-4 align-top">
                    <div className="flex flex-col items-start gap-2">
                      <Link
                        href={`/admin/products/${id}/edit`}
                        className="text-sm font-semibold text-[#4b8df8] hover:text-[#3b7de8]"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => onDelete(id)}
                        disabled={deletingId === id}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 disabled:opacity-60 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deletingId === id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                  <td className="border-b border-white/5 px-4 py-4 align-top">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{product.stock_90 || product.stock_88 || 0}</p>
                      <p className="text-xs text-foreground/52">
                        {Number(product.stock_90 || product.stock_88 || 0) > 0 ? "Available" : "Awaiting stock"}
                      </p>
                    </div>
                  </td>
                  <td className="border-b border-white/5 px-4 py-4 align-top">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${Number(product.stock_90 || product.stock_88 || 0) > 0 ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' : 'border-amber-500/20 bg-amber-500/10 text-amber-500'}`}>
                      {Number(product.stock_90 || product.stock_88 || 0) > 0 ? 'ACTIVE' : 'DRAFT'}
                    </span>
                  </td>
                 
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={12} className="px-6 py-14 text-center">
                <div className="mx-auto flex max-w-md flex-col items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[#1a1a1a] text-white">
                    <Package2 className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">No products found</h3>
                  <p className="mt-2 text-sm text-foreground/56">
                    Try adjusting your search terms or clearing active filters.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
