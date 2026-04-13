import { createAsyncThunk } from '@reduxjs/toolkit';
import { ITravisMethewSheetItem } from './TravisMethewSheetType';

const API_URL = '/api/admin/sheets/travismethew';

export const fetchTravisSheet = createAsyncThunk<ITravisMethewSheetItem[], void, { rejectValue: string }>(
  'travisSheet/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}?limit=5000`);
      if (!response.ok) throw new Error('Failed to fetch TravisMathew sheets');
      const data = await response.json();
      return data.data as ITravisMethewSheetItem[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching TravisMathew sheets');
    }
  }
);

export const createTravisSheet = createAsyncThunk<
  ITravisMethewSheetItem | ITravisMethewSheetItem[],
  ITravisMethewSheetItem | ITravisMethewSheetItem[],
  { rejectValue: string }
>(
  'travisSheet/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to create TravisMathew sheet(s)');
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while creating TravisMathew sheet(s)');
    }
  }
);
