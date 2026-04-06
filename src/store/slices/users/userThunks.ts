import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserInterface } from './userSlice';

const API_URL = '/api/admin/users';

export const fetchUsersByRole = createAsyncThunk<
  { role: string; users: UserInterface[] },
  string,
  { rejectValue: string }
>(
  'user/fetchByRole',
  async (role, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}?role=${role}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch users for role: ${role}`);
      }
      const data = await response.json();
      return { role, users: data.data as UserInterface[] };
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching users');
    }
  }
);
