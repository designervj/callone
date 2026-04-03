import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HardGoodType } from '@/components/products/HardGood/HardGoodType';
import { fetchHardGoods, fetchHardGoodById, createHardGood, updateHardGood, deleteHardGood } from './hardgoodThunks';

export interface HardGoodState {
  hardgoods: HardGoodType[];
  selectedHardGoods: HardGoodType[];
  currentHardGood: HardGoodType | null;
  isFetchedHardGoods: boolean;
  error: string | null;
}

const initialState: HardGoodState = {
  hardgoods: [],
  selectedHardGoods: [],
  currentHardGood: null,
  isFetchedHardGoods: false,
  error: null,
};

export const hardgoodSlice = createSlice({
  name: 'hardgoods',
  initialState,
  reducers: {
    setHardGoods: (state, action: PayloadAction<HardGoodType[]>) => {
      state.hardgoods = action.payload;
    },
    setSelectedHardGoods: (state, action: PayloadAction<HardGoodType[]>) => {
      state.selectedHardGoods = action.payload;
    },
    setCurrentHardGood: (state, action: PayloadAction<HardGoodType | null>) => {
      state.currentHardGood = action.payload;
    },
    setIsFetchedHardGoods: (state, action: PayloadAction<boolean>) => {
      state.isFetchedHardGoods = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearSelectedHardGoods: (state) => {
      state.selectedHardGoods = [];
    },
  },
  extraReducers: (builder) => {
    // fetchHardGoods
    builder.addCase(fetchHardGoods.pending, (state) => {
      state.isFetchedHardGoods = false;
      state.error = null;
    });
    builder.addCase(fetchHardGoods.fulfilled, (state, action) => {
      state.isFetchedHardGoods = true;
      state.hardgoods = action.payload;
    });
    builder.addCase(fetchHardGoods.rejected, (state, action) => {
      state.isFetchedHardGoods = false;
      state.error = action.payload as string;
    });

    // fetchHardGoodById
    builder.addCase(fetchHardGoodById.pending, (state) => {
      state.error = null;
    });
    builder.addCase(fetchHardGoodById.fulfilled, (state, action) => {
      state.currentHardGood = action.payload;
    });
    builder.addCase(fetchHardGoodById.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // createHardGood
    builder.addCase(createHardGood.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        state.hardgoods.push(...(action.payload as HardGoodType[]));
      } else {
        state.hardgoods.push(action.payload as HardGoodType);
      }
    });
    builder.addCase(createHardGood.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // updateHardGood
    builder.addCase(updateHardGood.fulfilled, (state, action) => {
      const updated = action.payload as HardGoodType;
      const index = state.hardgoods.findIndex((item) => item.sku === updated.sku);
      if (index !== -1) {
        state.hardgoods[index] = updated;
      }
      if (state.currentHardGood?.sku === updated.sku) {
        state.currentHardGood = updated;
      }
    });
    builder.addCase(updateHardGood.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // deleteHardGood
    builder.addCase(deleteHardGood.fulfilled, (state, action) => {
      const deletedSku = action.payload;
      state.hardgoods = state.hardgoods.filter((item) => String(item.sku) !== String(deletedSku));
      state.selectedHardGoods = state.selectedHardGoods.filter(
        (item) => String(item.sku) !== String(deletedSku)
      );
      if (String(state.currentHardGood?.sku) === String(deletedSku)) {
        state.currentHardGood = null;
      }
    });
    builder.addCase(deleteHardGood.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const {
  setHardGoods,
  setSelectedHardGoods,
  setCurrentHardGood,
  setIsFetchedHardGoods,
  setError,
  clearSelectedHardGoods,
} = hardgoodSlice.actions;

export default hardgoodSlice.reducer;
