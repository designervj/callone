import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITravisMethewSheetItem, getTravisSheetKey } from './TravisMethewSheetType';
import { createTravisSheet, fetchTravisSheet } from './TravisSheetThunks';

interface TravisSheetState {
  allTravisSheet: ITravisMethewSheetItem[];
  isFetchedTravisSheet: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: TravisSheetState = {
  allTravisSheet: [],
  isFetchedTravisSheet: false,
  isLoading: false,
  error: null,
};

const travisSheetSlice = createSlice({
  name: 'travisSheet',
  initialState,
  reducers: {
    setAllTravisSheet: (state, action: PayloadAction<ITravisMethewSheetItem[]>) => {
      state.allTravisSheet = action.payload;
    },
    setIsFetchedTravisSheet: (state, action: PayloadAction<boolean>) => {
      state.isFetchedTravisSheet = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearTravisSheet: (state) => {
      state.allTravisSheet = [];
      state.isFetchedTravisSheet = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchTravisSheet
    builder.addCase(fetchTravisSheet.pending, (state) => {
      state.isLoading = true;
      state.isFetchedTravisSheet = false;
      state.error = null;
    });
    builder.addCase(fetchTravisSheet.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isFetchedTravisSheet = true;
      state.allTravisSheet = action.payload;
    });
    builder.addCase(fetchTravisSheet.rejected, (state, action) => {
      state.isLoading = false;
      state.isFetchedTravisSheet = false;
      state.error = action.payload as string;
    });

    // createTravisSheet
    builder.addCase(createTravisSheet.fulfilled, (state, action) => {
      const payload = action.payload as
        | { data?: ITravisMethewSheetItem | ITravisMethewSheetItem[] }
        | ITravisMethewSheetItem
        | ITravisMethewSheetItem[];

      const incoming = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as { data?: ITravisMethewSheetItem | ITravisMethewSheetItem[] }).data)
          ? (payload as { data: ITravisMethewSheetItem[] }).data
          : (payload as { data?: ITravisMethewSheetItem }).data
            ? [(payload as { data: ITravisMethewSheetItem }).data]
            : [payload as ITravisMethewSheetItem];

      incoming.forEach((item) => {
        const incomingKey = getTravisSheetKey(item);
        const index = state.allTravisSheet.findIndex((sheetRow) => getTravisSheetKey(sheetRow) === incomingKey);
        if (index === -1) {
          state.allTravisSheet.push(item);
          return;
        }

        state.allTravisSheet[index] = item;
      });
    });
    builder.addCase(createTravisSheet.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const {
  setAllTravisSheet,
  setIsFetchedTravisSheet,
  setError,
  clearTravisSheet,
} = travisSheetSlice.actions;

export default travisSheetSlice.reducer;
