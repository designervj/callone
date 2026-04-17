import { createAsyncThunk } from '@reduxjs/toolkit';
import { AttributeType } from './attributeType';
import { IWareHouseInAtributeUpdate } from '@/components/warehouse/WareHouseType';

const API_URL = '/api/admin/attributeSet';

export const fetchAttributes = createAsyncThunk<AttributeType[], void, { rejectValue: string }>(
  'attribute/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch attributes');
      const data = await response.json();
      return data.data as AttributeType[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching attributes');
    }
  }
);

export const fetchAttributeById = createAsyncThunk<AttributeType, string, { rejectValue: string }>(
  'attribute/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch attribute');
      const data = await response.json();
      return data as AttributeType;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching the attribute');
    }
  }
);

export const createAttribute = createAsyncThunk<AttributeType, Partial<AttributeType>, { rejectValue: string }>(
  'attribute/create',
  async (attributeData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attributeData),
      });
      if (!response.ok) throw new Error('Failed to create attribute');
      const data = await response.json();
      return data as AttributeType;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while creating the attribute');
    }
  }
);

export const updateAttribute = createAsyncThunk<AttributeType, { id: string; data: Partial<AttributeType> }, { rejectValue: string }>(
  'attribute/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update attribute');
      const responseData = await response.json();
      return responseData as AttributeType;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while updating the attribute');
    }
  }
);

export const deleteAttribute = createAsyncThunk<string, string, { rejectValue: string }>(
  'attribute/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete attribute');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while deleting the attribute');
    }
  }
);


export const updateWarehouseAttribute = createAsyncThunk<
  AttributeType,
  Partial<IWareHouseInAtributeUpdate[]>,
  { rejectValue: string }
>(
  'attribute/updateWarehouseAttribute',
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        return rejectWithValue(responseData?.message || 'Failed to update warehouse attribute');
      }

      return responseData as AttributeType;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'An error occurred while updating the warehouse attribute'
      );
    }
  }
);