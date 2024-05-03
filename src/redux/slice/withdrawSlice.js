// src/features/withdraws/withdrawSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  withdraws: [],
  selectedWithdraw: null,
  status: 'idle',
  error: null,
};

export const fetchWithdraws = createAsyncThunk('withdraws/fetchWithdraws', async () => {
  const response = await axios.get('https://aksion.abyssiniasoftware.com/api/withdrawals/request');
  console.log(response.data);
  return response.data;
});

export const fetchWithdrawById = createAsyncThunk('withdraws/fetchWithdrawById', async (withdrawId) => {
  const response = await axios.get(`https://aksion.abyssiniasoftware.com/api/withdrawals/request/${withdrawId}`);
  return response.data;
});

export const addWithdraw = createAsyncThunk('withdraws/addWithdraw', async (withdraw) => {
  const response = await axios.post('https://aksion.abyssiniasoftware.com/api/withdrawals/request', withdraw);
  console.log(withdraw);
  return response.data;
});

export const updateWithdraw = createAsyncThunk('withdraws/updateWithdraw', async (withdraw) => {
  const response = await axios.put(`https://aksion.abyssiniasoftware.com/api/withdrawals/requests/${withdraw.id}`, withdraw);
  return response.data;
});

export const deleteWithdraw = createAsyncThunk('withdraws/deleteWithdraw', async (withdrawId) => {
  await axios.delete(`https://aksion.abyssiniasoftware.com/api/withdrawals/request/${withdrawId}`);
  return withdrawId;
});

const withdrawSlice = createSlice({
  name: 'withdraws',
  initialState,
  reducers: {
    setSelectedWithdraw(state, action) {
      state.selectedWithdraw = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdraws.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWithdraws.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.withdraws = action.payload;
      })
      .addCase(fetchWithdraws.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchWithdrawById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWithdrawById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedWithdraw = action.payload;
      })
      .addCase(fetchWithdrawById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addWithdraw.fulfilled, (state, action) => {
        state.withdraws.push(action.payload);
      })
      .addCase(updateWithdraw.fulfilled, (state, action) => {
        state.withdraws = state.withdraws.map((withdraw) =>
          withdraw.id === action.payload.id ? action.payload : withdraw
        );
      })
      .addCase(deleteWithdraw.fulfilled, (state, action) => {
        state.withdraws = state.withdraws.filter((withdraw) => withdraw.id !== action.payload);
      });
  },
});

export const { setSelectedWithdraw } = withdrawSlice.actions;

export default withdrawSlice.reducer;
