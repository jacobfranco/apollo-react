// src/slices/lolScheduleSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from 'src/api'; // Your API utility
import { RootState } from 'src/store';
import { SeriesSchema, Series } from 'src/schemas/series';
import { ZodError } from 'zod';

interface LolScheduleState {
  series: Series[];
  loading: boolean;
  error: string | null;
}

const initialState: LolScheduleState = {
  series: [],
  loading: false,
  error: null,
};

// Async thunk to fetch LoL schedule data
export const fetchLolSchedule = createAsyncThunk<
  Series[],
  { timestamp?: number },
  { state: RootState; rejectValue: string }
>('lolSchedule/fetchSchedule', async ({ timestamp }, { getState, rejectWithValue }) => {
  try {
    const client = api(getState);
    const response = await client.get('/api/lolseries/week', {
      params: { timestamp },
    });

    console.log('API Response Data:', response.data);

    // Validate response data with Zod
    const parsedData = SeriesSchema.array().parse(response.data);

    return parsedData;
  } catch (error: any) {
    if (error instanceof ZodError) {
      // Handle validation errors
      console.error('Zod Validation Errors:', error.errors);
      return rejectWithValue('Invalid data format from API');
    }
    return rejectWithValue(error.message);
  }
});

const lolScheduleSlice = createSlice({
  name: 'lolSchedule',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLolSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLolSchedule.fulfilled, (state, action: PayloadAction<Series[]>) => {
        state.series = action.payload;
        state.loading = false;
      })
      .addCase(fetchLolSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default lolScheduleSlice.reducer;
