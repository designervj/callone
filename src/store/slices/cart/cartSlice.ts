import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInterface } from '../users/userSlice';

export interface CartItem {
  id?: string; // This will be the SKU or variant ID
  sku?: string;
  brand?: string;
  description?: string;
  image?: string;
  qty88?: number;
  qty90?: number;
  qty?: number;
  mrp?: number;
  gst?: number;
  amount?: number;
  discount?: number;
  lessDiscount?: number;
  netBilling?: number;
  finalAmount?: number;
}



interface CartState {
  selectedRetailer: UserInterface | null;
  selectedManager: UserInterface | null;
  selectedSalesRep: UserInterface | null;
  items: CartItem[];
  discountType: 'inclusive' | 'exclusive' | 'flat' | 'none';
  discountValue: number;
}

const initialState: CartState = {
  selectedRetailer: null,
  selectedManager: null,
  selectedSalesRep: null,
  items: [],
  discountType: 'inclusive',
  discountValue: 22,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setSelectedRetailer(state, action: PayloadAction<UserInterface | null>) {
      state.selectedRetailer = action.payload;
    },
    setSelectedManager(state, action: PayloadAction<UserInterface | null>) {
      state.selectedManager = action.payload;
    },
    setSelectedSalesRep(state, action: PayloadAction<UserInterface | null>) {
      state.selectedSalesRep = action.payload;
    },
    addToCart(state, action: PayloadAction<CartItem[]>) {
      action.payload.forEach((newItem) => {
        const existingItemIndex = state.items.findIndex(
          (item) => item.id === newItem.id
        );

        if (existingItemIndex !== -1) {
          const existingItem = state.items[existingItemIndex];
          state.items[existingItemIndex] = {
            ...existingItem,
            ...newItem,
            qty88: (existingItem.qty88 || 0) + (newItem.qty88 || 0),
            qty90: (existingItem.qty90 || 0) + (newItem.qty90 || 0),
            qty: (existingItem.qty || 0) + (newItem.qty || 0),
            amount: (existingItem.amount || 0) + (newItem.amount || 0),
            finalAmount: (existingItem.finalAmount || 0) + (newItem.finalAmount || 0),
            netBilling: (existingItem.netBilling || 0) + (newItem.netBilling || 0),
          };
        } else {
          state.items.push(newItem);
        }
      });
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateCartItemQty(state, action: PayloadAction<{ id: string, qty88?: number, qty90?: number }>) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        if (action.payload.qty88 !== undefined) item.qty88 = action.payload.qty88;
        if (action.payload.qty90 !== undefined) item.qty90 = action.payload.qty90;
      }
    },
    clearCart(state) {
      state.items = [];
    },
    setDiscount(state, action: PayloadAction<{ type: CartState['discountType'], value: number }>) {
      state.discountType = action.payload.type;
      state.discountValue = action.payload.value;
    }
  },
});

export const {
  setSelectedRetailer,
  setSelectedManager,
  setSelectedSalesRep,
  addToCart,
  removeFromCart,
  updateCartItemQty,
  clearCart,
  setDiscount
} = cartSlice.actions;

export default cartSlice.reducer;
