
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { OrderRow } from "./OrderRow";
import { Search, Filter, ChevronRight, ChevronLeft, Users as UsersIcon, CheckCircle2, Clock } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "pending" | "completed" | "users";

export const OrderList = () => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  const { allOrders, isLoadingOrders } = useSelector((state: RootState) => state.order);
  const { allRetailer, allManager } = useSelector((state: RootState) => state.user);

  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const statusMatch = activeTab === "pending" 
        ? order.status !== "complete-order" 
        : activeTab === "completed" 
          ? order.status === "complete-order"
          : true; // "users" tab might have different logic or just show all

      const query = searchQuery.toLowerCase();
      const searchMatch = !query || 
        (order.id?.toString().includes(query)) ||
        (order.orderNumber?.toLowerCase().includes(query)) ||
        (order.retailer_id?.toLowerCase().includes(query));

      return statusMatch && searchMatch;
    });
  }, [allOrders, activeTab, searchQuery]);

  // Pagination logic
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    if (totalPages === 0) {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);

    return Array.from(
      { length: end - adjustedStart + 1 },
      (_, index) => adjustedStart + index
    );
  }, [currentPage, totalPages]);

  const tabs = [
    { id: "pending", label: "Pending Orders", icon: Clock },
    { id: "completed", label: "Completed Orders", icon: CheckCircle2 },
    { id: "users", label: "Users", icon: UsersIcon },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Command Hub Navigation */}
      <div className="flex w-fit items-center rounded-2xl border border-white/8 bg-[#111111] p-1.5 backdrop-blur-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={clsx(
                "group relative flex items-center gap-3 rounded-xl px-6 py-2.5 transition-all duration-300",
                isActive ? "text-white" : "text-foreground/62 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPod"
                  className="absolute inset-0 z-0 rounded-xl bg-[#1d1d1d] ring-1 ring-white/8 shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}

              <Icon 
                size={16} 
                className={clsx(
                  "relative z-10 transition-colors duration-300",
                  isActive ? "text-white" : "text-foreground/40 group-hover:text-white"
                )} 
              />
              <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.15em]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-[32px] border border-white/8 bg-[#0b0b0b] shadow-[0_15px_60px_rgba(0,0,0,0.35)] transition-all duration-500">
        {/* Header / Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 bg-[#111111] px-8 py-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black uppercase tracking-widest text-foreground">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <div className="h-6 w-px bg-white/10" />
            <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/72">
              {totalItems} total items
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/34 transition-colors group-focus-within:text-white" size={16} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-64 rounded-xl border border-white/8 bg-[#0d0d0d] pl-11 pr-4 text-[13px] font-medium text-foreground outline-none transition-all focus:border-white/18 focus:bg-[#111111] placeholder:text-foreground/28"
              />
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1 || totalPages <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-foreground/62 transition-all hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1.5 px-2">
                {pageNumbers.map((p) => {
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={clsx(
                        "h-8 w-8 rounded-lg text-xs font-black transition-all",
                        currentPage === p 
                          ? "bg-white text-background shadow-[0_8px_20px_rgba(0,0,0,0.35)]" 
                          : "text-foreground/62 hover:bg-white/[0.05] hover:text-white"
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button 
                disabled={currentPage === totalPages || totalPages <= 1}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages || 1, prev + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-foreground/62 transition-all hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
              
              <div className="relative ml-2">
                <select 
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="h-10 rounded-xl border border-white/8 bg-white/[0.03] px-3 pr-8 text-[10px] font-black uppercase tracking-widest text-foreground/72 outline-none hover:bg-white/[0.06] cursor-pointer appearance-none"
                >
                  <option value={25}>25 Items</option>
                  <option value={50}>50 Items</option>
                  <option value={100}>100 Items</option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/34">
                   <ChevronRight size={12} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="relative overflow-x-auto">
          {activeTab === "users" ? (
            <table className="w-full text-left ">
              <thead>
                <tr className="border-b border-white/8 bg-[#111111] text-white">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 italic">Name</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 italic">Role</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 italic">Email</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 italic">Phone</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 italic">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {[...allRetailer, ...allManager].map((user) => (
                  <tr key={user._id || user.id} className="group hover:bg-white/[0.04] transition-all">
                    <td className="px-6 py-4 text-sm font-black text-foreground">{user.name}</td>
                    <td className="px-6 py-4 lowercase">
                      <span className="inline-flex rounded-lg border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[10px] font-black text-foreground/72 first-letter:uppercase">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground/80">{user.email || "—"}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground/80">{user.phone || "—"}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/72 hover:text-white transition-colors">
                        Inspect Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
          
              <thead>
                <tr className="border-b border-white/8 bg-[#111111] text-white">
                  <th className="px-6 py-5"></th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 italic">Order Id</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 italic">Retailer Name</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 italic">Order Date</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 italic">Last Update</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 italic">Discount</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 italic">Amount</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 italic">Status</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 italic">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {isLoadingOrders ? (
                  <tr>
                    <td colSpan={9} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/12 border-t-white" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/62">Syncing database...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <OrderRow 
                      key={order._id || order.id?.toString()} 
                      order={order} 
                      retailers={allRetailer}
                      managers={allManager}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Clock size={48} className="text-foreground/20" />
                        <div className="space-y-1">
                          <p className="text-lg font-black text-foreground/72 uppercase tracking-[0.1em]">No records identified</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/62">Adjust filters to re-scan</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
