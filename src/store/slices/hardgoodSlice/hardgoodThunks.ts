import { createAsyncThunk } from '@reduxjs/toolkit';
import { HardGoodType } from '@/components/products/HardGood/HardGoodType';

const API_URL = '/api/admin/products/hardgoods';

export const fetchHardGoods = createAsyncThunk<HardGoodType[], void, { rejectValue: string }>(
  'hardgoods/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}?limit=5000`);
      if (!response.ok) throw new Error('Failed to fetch HardGood products');
      const data = await response.json();
      return data.data as HardGoodType[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching HardGood products');
    }
  }
);

export const fetchHardGoodById = createAsyncThunk<HardGoodType, string, { rejectValue: string }>(
  'hardgoods/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch HardGood product');
      const data = await response.json();
      return data.data as HardGoodType;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching the HardGood product');
    }
  }
);

export const createHardGood = createAsyncThunk<
  HardGoodType | HardGoodType[],
  HardGoodType | HardGoodType[],
  { rejectValue: string }
>(
  'hardgoods/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to create HardGood product(s)');
      const data = await response.json();
      return data as HardGoodType | HardGoodType[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while creating HardGood product(s)');
    }
  }
);

export const updateHardGood = createAsyncThunk<
  HardGoodType,
  { sku: string; data: Partial<HardGoodType> },
  { rejectValue: string }
>(
  'hardgoods/update',
  async ({ sku, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ ...data, sku }]),
      });
      if (!response.ok) throw new Error('Failed to update HardGood product');
      const responseData = await response.json();
      return responseData.data as HardGoodType;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while updating the HardGood product');
    }
  }
);

export const deleteHardGood = createAsyncThunk<string, string, { rejectValue: string }>(
  'hardgoods/delete',
  async (sku, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([sku]),
      });
      if (!response.ok) throw new Error('Failed to delete HardGood product');
      return sku;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while deleting the HardGood product');
    }
  }
);
