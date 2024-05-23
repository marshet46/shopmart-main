import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const createCompany = createAsyncThunk(
  'company/createCompany',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://aksion.abyssiniasoftware.com/api/companies', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState: {
    companies: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.companies.push(action.payload.company);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create company';
        state.success = false;
      });
  },
});

export default companySlice.reducer;
