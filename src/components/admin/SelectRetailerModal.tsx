'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { setSelectedRetailer, setSelectedManager, setSelectedSalesRep } from '@/store/slices/cart/cartSlice';
import { getUsersByRole } from '@/lib/actions/users';

interface UserOption {
  _id: string;
  name: string;
  email?: string;
  managerId?: string;
}

interface SelectRetailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SelectRetailerModal({ isOpen, onClose, onConfirm }: SelectRetailerModalProps) {
  const dispatch = useDispatch();
  const [retailers, setRetailers] = useState<UserOption[]>([]);
  const [managers, setManagers] = useState<UserOption[]>([]);
  const [salesReps, setSalesReps] = useState<UserOption[]>([]);

  const [localRetailerId, setLocalRetailerId] = useState('');
  const [localManagerId, setLocalManagerId] = useState('');
  const [localSalesRepId, setLocalSalesRepId] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        const [r, m, s] = await Promise.all([
          getUsersByRole('retailer'),
          getUsersByRole('manager'),
          getUsersByRole('sales_rep'),
        ]);
        setRetailers(r as any);
        setManagers(m as any);
        setSalesReps(s as any);
      };
      fetchData();
    }
  }, [isOpen]);

  // Handle auto-selection of manager when retailer is selected
  useEffect(() => {
    const retailer = retailers.find(r => r._id === localRetailerId);
    if (retailer?.managerId) {
      setLocalManagerId(retailer.managerId);
    }
  }, [localRetailerId, retailers]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const retailer = retailers.find(r => r._id === localRetailerId);
    const manager = managers.find(m => m._id === localManagerId);
    const salesRep = salesReps.find(s => s._id === localSalesRepId);

    if (!retailer) {
      alert("Please select a retailer");
      return;
    }

    dispatch(setSelectedRetailer(retailer ? { id: retailer._id, name: retailer.name, email: retailer.email } : null));
    dispatch(setSelectedManager(manager ? { id: manager._id, name: manager.name } : null));
    dispatch(setSelectedSalesRep(salesRep ? { id: salesRep._id, name: salesRep.name } : null));

    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-[28px] bg-background shadow-2xl transition-all animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <h2 className="text-xl font-bold text-foreground">Select Retailer</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-foreground/5 transition-colors">
            <X size={20} className="text-foreground/40" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary block">Select Retailer</label>
            <select
              value={localRetailerId}
              onChange={(e) => setLocalRetailerId(e.target.value)}
              className="w-full rounded-2xl border border-border/70 bg-background px-4 py-3.5 text-sm outline-none focus:border-primary transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.67%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat pr-12"
            >
              <option value="">Select Retailer</option>
              {retailers.map((r) => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-primary block">Select Manager</label>
            <select
              value={localManagerId}
              onChange={(e) => setLocalManagerId(e.target.value)}
              className="w-full rounded-2xl border border-border/70 bg-background px-4 py-3.5 text-sm outline-none focus:border-primary transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.67%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat pr-12"
            >
              <option value="">Select Manager</option>
              {managers.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-primary block">Select SalesRepresentative</label>
            <select
              value={localSalesRepId}
              onChange={(e) => setLocalSalesRepId(e.target.value)}
              className="w-full rounded-2xl border border-border/70 bg-background px-4 py-3.5 text-sm outline-none focus:border-primary transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.67%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat pr-12"
            >
              <option value="">Select SalesRepresentative</option>
              {salesReps.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border/60 px-6 py-5 bg-foreground/[0.02]">
          <button
            onClick={onClose}
            className="rounded-2xl border border-border/70 bg-background px-6 py-3 text-sm font-bold text-foreground/70 hover:bg-foreground/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="rounded-2xl bg-black px-8 py-3 text-sm font-bold text-white shadow-lg hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
