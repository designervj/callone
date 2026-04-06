'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Trash2, Plus, Minus, Tag, Calculator, ChevronRight, Check } from 'lucide-react';
import { removeFromCart, updateCartItemQty, setDiscount, clearCart } from '@/store/slices/cart/cartSlice';
import { PageHeader } from '@/components/admin/PageHeader';
import Image from 'next/image';

const STEPS = [
  { id: 1, label: 'Submit Order' },
  { id: 2, label: 'Check Availability' },
  { id: 3, label: 'Approve Order' },
  { id: 4, label: 'Complete Order' },
];

export default function CartPage() {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const [activeStep] = useState(1);

  const subtotal = cart.items.reduce((sum, item) => sum + ((item?.mrp ?? 0) * ((item?.qty88 ?? 0) + (item?.qty90 ?? 0))), 0);
  const discountAmount = cart.discountType === 'flat'
    ? cart.discountValue
    : (subtotal * cart.discountValue) / 100;

  const totalNetBill = subtotal - discountAmount;

  if (!cart.selectedRetailer) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-foreground/5 p-6 text-foreground/40">
          <Calculator size={48} />
        </div>
        <h2 className="text-xl font-bold">No Retailer Selected</h2>
        <p className="text-foreground/60 text-center max-w-md">Please go back to the catalog and select a retailer to start an order.</p>
        <button onClick={() => window.history.back()} className="rounded-2xl bg-primary px-8 py-3 font-bold text-white shadow-lg">
          Go to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Order Id:#${Math.floor(1000 + Math.random() * 9000)}`}
          description=""
          backHref="/admin/products"
        />
        <button className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-4 py-2 text-sm font-bold text-foreground/70 shadow-sm">
          <Tag size={16} />
          Add a Note
        </button>
      </div>

      {/* Header Info Card */}
      <div className="grid gap-6 rounded-[32px] border border-border/50 bg-background p-8 shadow-sm md:grid-cols-3">
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 block mb-1">Retailer</span>
            <h3 className="text-lg font-bold text-primary">{cart.selectedRetailer?.name}</h3>
          </div>
          <div className="flex items-center gap-6 text-xs font-semibold text-foreground/60">
            <div>
              <span className="opacity-50 block">Address City</span>
              <span>New Delhi, India</span>
            </div>
            <div>
              <span className="opacity-50 block">GSTIN NO.</span>
              <span className="flex items-center gap-1 uppercase">GSTIN123456 <Check size={12} className="text-emerald-500" /></span>
            </div>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 block mb-1">Manager</span>
          <h3 className="text-lg font-bold text-foreground/80">{cart.selectedManager?.name || 'Not assigned'}</h3>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 block mb-1">SalesRepresentative</span>
          <h3 className="text-lg font-bold text-foreground/80">{cart.selectedSalesRep?.name || 'Self'}</h3>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between px-12 py-4">
        {STEPS.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center space-y-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all ${activeStep >= step.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-foreground/5 text-foreground/40'
                }`}>
                {step.id}
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-bold uppercase tracking-tighter text-foreground/30">Step {step.id}</span>
                <span className={`text-xs font-bold ${activeStep >= step.id ? 'text-foreground' : 'text-foreground/40'}`}>{step.label}</span>
              </div>
              {step.id === 1 && (
                <button className="mt-2 rounded-xl bg-black px-4 py-2 text-[10px] font-bold uppercase text-white shadow-lg">Submit Order</button>
              )}
            </div>
            {idx < STEPS.length - 1 && (
              <div className="h-[2px] flex-1 bg-border/40 mx-4 mt-[-40px]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Cart Table */}
      <div className="overflow-hidden rounded-[32px] border border-border/50 bg-background shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/[0.02] text-[10px] font-bold uppercase tracking-wider text-foreground/45">
              <th className="px-6 py-4">S.No</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-center">Qty88</th>
              <th className="px-6 py-4 text-center">Qty90</th>
              <th className="px-6 py-4 text-center">Qty</th>
              <th className="px-6 py-4">MRP</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">GST</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {cart.items.map((item, index) => (
              <tr key={item.id} className="group hover:bg-foreground/[0.01] transition-colors">
                <td className="px-6 py-4 text-xs font-bold text-foreground/40">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-border/40 bg-foreground/[0.02]">
                    {/* {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] uppercase font-bold opacity-20">IMG</div>
                    )} */}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-foreground/70">{item.brand}</td>
                <td className="px-6 py-4 text-xs font-black tracking-tight">{item.sku}</td>
                <td className="px-6 py-4 text-[10px] font-semibold text-foreground/60 max-w-[200px] leading-relaxed">
                  {item.description??""}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    <input
                      type="number"
                      value={item.qty88}
                      // onChange={(e) => dispatch(updateCartItemQty({ id: item.id, qty88: parseInt(e.target.value) || 0 }))}
                      className="w-14 rounded-lg border border-border/60 bg-foreground/5 py-1 text-center text-xs font-bold outline-none focus:border-primary"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    <input
                      type="number"
                      value={item.qty90}
                      // onChange={(e) => dispatch(updateCartItemQty({ id: item.id, qty90: parseInt(e.target.value) || 0 }))}
                      className="w-14 rounded-lg border border-border/60 bg-foreground/5 py-1 text-center text-xs font-bold outline-none focus:border-primary"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-xs font-bold text-primary">{(item?.qty88 ?? 0) + (item?.qty90 ?? 0)}</td>
                <td className="px-6 py-4 text-xs font-bold text-foreground/70">₹{item.mrp??0 }</td>
                {/* <td className="px-6 py-4 text-xs font-black">₹{(item.mrp * ((item?.qty88 ?? 0) + (item?.qty90 ?? 0))).toLocaleString()}</td> */}
                <td className="px-6 py-4 text-xs font-bold text-foreground/40">{item.gst}%</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center px-4 py-1 text-xs font-bold text-foreground/60 bg-foreground/5 rounded-lg border border-border/40">
                    22
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    // onClick={() => dispatch(removeFromCart(item.id))}
                    className="rounded-xl p-2 text-foreground/30 hover:bg-red-500/10 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer / Summary Section */}
        <div className="flex flex-wrap items-start justify-between gap-8 bg-foreground/[0.02] p-8">
          <div className="flex items-center gap-4 bg-background p-3 rounded-[24px] border border-border/60 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 block">Discount Mode</span>
              <select
                value={cart.discountType}
                onChange={(e) => dispatch(setDiscount({ type: e.target.value as any, value: cart.discountValue }))}
                className="rounded-lg border-none bg-foreground/5 px-3 py-1.5 text-xs font-bold outline-none"
              >
                <option value="inclusive">Inclusive</option>
                <option value="exclusive">Exclusive</option>
              </select>
            </div>
            <div className="h-10 w-[1px] bg-border/40" />
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={cart.discountValue}
                onChange={(e) => dispatch(setDiscount({ type: cart.discountType, value: parseInt(e.target.value) || 0 }))}
                className="w-12 rounded-lg bg-foreground/5 px-2 py-1.5 text-center text-sm font-bold outline-none"
              />
              <span className="text-xs font-bold text-foreground/40">%</span>
            </div>
          </div>

          <div className="w-full max-w-[320px] space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-foreground/60">
              <span>Sub Total:</span>
              <span className="text-foreground font-black">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-foreground/60">
              <span>Discount:</span>
              <span className="text-red-500">₹{discountAmount.toLocaleString()}</span>
            </div>
            <div className="h-[1px] bg-border/60" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground/80">Total Net Bill:</span>
              <span className="text-xl font-black text-primary">₹{totalNetBill.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
