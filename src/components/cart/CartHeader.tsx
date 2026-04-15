import React from 'react';
import { Edit2, Check, User, ShieldCheck, Briefcase, ShoppingBag } from 'lucide-react';
import { UserInterface } from '@/store/slices/users/userSlice';
import clsx from 'clsx';
import { PremiumSelect, SelectOption } from '@/components/ui/PremiumSelect';
import { motion, AnimatePresence } from 'framer-motion';

interface CartHeaderProps {
  selectedRetailer: UserInterface | null;
  selectedManager: UserInterface | null;
  selectedSalesRep: UserInterface | null;
  allRetailer: UserInterface[];
  allManager: UserInterface[];
  allSaleRep: UserInterface[];
  isEditingRetailer: boolean;
  setIsEditingRetailer: (val: boolean) => void;
  isEditingManager: boolean;
  setIsEditingManager: (val: boolean) => void;
  isEditingSalesRep: boolean;
  setIsEditingSalesRep: (val: boolean) => void;
  onUpdateRetailer: (id: string) => void;
  onUpdateManager: (id: string) => void;
  onUpdateSalesRep: (id: string) => void;
  setSelectedRetailer: (val: UserInterface | null) => void;
  setSelectedManager: (val: UserInterface | null) => void;
  setSelectedSalesRep: (val: UserInterface | null) => void;
}

export const CartHeader: React.FC<CartHeaderProps> = ({
  selectedRetailer,
  selectedManager,
  selectedSalesRep,
  allRetailer,
  allManager,
  allSaleRep,
  isEditingRetailer,
  setIsEditingRetailer,
  isEditingManager,
  setIsEditingManager,
  isEditingSalesRep,
  setIsEditingSalesRep,
  onUpdateRetailer,
  onUpdateManager,
  onUpdateSalesRep,
  setSelectedRetailer,
  setSelectedManager,
  setSelectedSalesRep,
}) => {
  const retailerOptions: SelectOption[] = allRetailer.map(r => ({
    value: r._id || "",
    label: r.name || "Unnamed Retailer",
    subLabel: r.address || "No address provided"
  }));

  const managerOptions: SelectOption[] = allManager.map(m => ({
    value: m._id || "",
    label: m.name || "Unnamed Manager",
    subLabel: "Administrative Lead"
  }));

  const salesRepOptions: SelectOption[] = [
    { value: "self", label: "Internal - Self", subLabel: "Active Account Lead" },
    ...allSaleRep.map(s => ({
      value: s._id || "",
      label: s.name || "Unnamed Representative",
      subLabel: "Active Account Lead"
    }))
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Retailer Section */}
      <div className={clsx(
        "group relative z-10 rounded-[24px] border border-white/8 bg-white/[0.03] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.05] focus-within:z-50",
        selectedRetailer ? "border-white/14" : "border-white/8"
      )}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={clsx(
              "flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-500",
              selectedRetailer ? "bg-white text-background" : "bg-white/[0.04] text-foreground/30"
            )}>
              <ShoppingBag size={14} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground/32">Authorized Account</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/68">Retailer</span>
            </div>
          </div>
          {selectedRetailer && !isEditingRetailer && (
            <button
              onClick={() => setIsEditingRetailer(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-foreground/30 transition-all hover:bg-white hover:text-background"
            >
              <Edit2 size={14} />
            </button>
          )}
        </div>

        {!selectedRetailer || isEditingRetailer ? (
          <div className="space-y-4">
            <PremiumSelect
              options={retailerOptions}
              value={selectedRetailer?._id || ""}
              placeholder="Select Retailer Warehouse"
              searchable
              onChange={(val) => {
                const retailer = allRetailer.find(r => r._id === val);
                setSelectedRetailer(retailer || null);
                setIsEditingRetailer(false);
                onUpdateRetailer(retailer?._id || "");
              }}
            />
            {!selectedRetailer && (
               <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-foreground/54">
                 <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                 <span className="text-[10px] font-semibold uppercase tracking-widest">Awaiting Verification</span>
               </div>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">{selectedRetailer?.name}</h3>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5">
                <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-foreground/24">GSTIN</span>
                <span className="text-[10px] font-semibold text-foreground/72">{selectedRetailer?.gstin || "VERIFIED"}</span>
                <Check size={10} className="text-white/70" strokeWidth={4} />
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5">
                <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-foreground/24">NODE</span>
                <span className="max-w-[120px] truncate text-[10px] font-semibold text-foreground/72">{selectedRetailer?.address || "Global HQ"}</span>
              </div>
            </div>
            
            {/* Structural accent */}
            <div className="absolute -bottom-1 -right-1 opacity-5">
               <ShoppingBag size={80} strokeWidth={1} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Manager Section */}
      <div className={clsx(
        "group relative z-10 rounded-[24px] border border-white/8 bg-white/[0.03] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.05] focus-within:z-50",
        selectedManager ? "border-white/14" : "border-white/8"
      )}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={clsx(
              "flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-500",
              selectedManager ? "bg-white text-background" : "bg-white/[0.04] text-foreground/30"
            )}>
              <ShieldCheck size={14} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground/32">Operational Lead</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/68">Manager</span>
            </div>
          </div>
          {selectedManager && !isEditingManager && (
            <button
              onClick={() => setIsEditingManager(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-foreground/30 transition-all hover:bg-white hover:text-background"
            >
              <Edit2 size={14} />
            </button>
          )}
        </div>

        {!selectedManager || isEditingManager ? (
          <PremiumSelect
            options={managerOptions}
            value={selectedManager?._id || ""}
            placeholder="Select Manager"
            searchable
            onChange={(val) => {
              const manager = allManager.find(m => m._id === val);
              setSelectedManager(manager || null);
              setIsEditingManager(false);
              onUpdateManager(manager?._id || "");
            }}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h3 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">{selectedManager?.name}</h3>
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.25)]" />
               <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/32">Active Administrative Access</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Sales Rep Section */}
      <div className={clsx(
        "group relative z-10 rounded-[24px] border border-white/8 bg-white/[0.03] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.05] focus-within:z-50",
        selectedSalesRep ? "border-white/14" : "border-white/8"
      )}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={clsx(
              "flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-500",
              selectedSalesRep ? "bg-white text-background" : "bg-white/[0.04] text-foreground/30"
            )}>
              <Briefcase size={14} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground/32">Account Director</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/68">Representative</span>
            </div>
          </div>
          {selectedSalesRep && !isEditingSalesRep && (
            <button
              onClick={() => setIsEditingSalesRep(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-foreground/30 transition-all hover:bg-white hover:text-background"
            >
              <Edit2 size={14} />
            </button>
          )}
        </div>

        {!selectedSalesRep || isEditingSalesRep ? (
          <PremiumSelect
            options={salesRepOptions}
            value={selectedSalesRep?._id || (selectedSalesRep?.name === "Internal (Self)" ? "self" : "")}
            placeholder="Select Representative"
            searchable
            onChange={(val) => {
              if (val === "self") {
                setSelectedSalesRep({ name: "Internal (Self)" } as UserInterface);
              } else {
                const rep = allSaleRep.find(s => s._id === val);
                setSelectedSalesRep(rep || null);
              }
              setIsEditingSalesRep(false);
              onUpdateSalesRep(val === "self" ? "" : val);
            }}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h3 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">{selectedSalesRep?.name || "Internal (Self)"}</h3>
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.25)]" />
               <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/32">Verified Account Lead</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
