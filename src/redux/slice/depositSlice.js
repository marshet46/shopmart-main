// src/features/deposits/depositSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  deposits: [],
  selectedDeposit: null,
  status: 'idle',
  error: null,
};

export const fetchDeposits = createAsyncThunk('deposits/fetchDeposits', async () => {
  const response = await axios.get('https://aksion.abyssiniasoftware.com/api/deposits/request');
  console.log(response.data);
  return response.data;
});

export const fetchDepositById = createAsyncThunk('deposits/fetchDepositById', async (depositId) => {
  const response = await axios.get(`https://aksion.abyssiniasoftware.com/api/deposits/request/${depositId}`);
  return response.data;
});

export const addDeposit = createAsyncThunk('deposits/addDeposit', async (deposit) => {
  const response = await axios.post('https://aksion.abyssiniasoftware.com/api/deposits/request', deposit);
  return response.data;
});

export const updateDeposit = createAsyncThunk('deposits/updateDeposit', async (deposit) => {
  const response = await axios.put(`https://aksion.abyssiniasoftware.com/api/deposits/request/${deposit.id}`, deposit);
  return response.data;
});

export const deleteDeposit = createAsyncThunk('deposits/deleteDeposit', async (depositId) => {
  await axios.delete(`https://aksion.abyssiniasoftware.com/api/deposits/request/${depositId}`);
  return depositId;
});

const depositSlice = createSlice({
  name: 'deposits',
  initialState,
  reducers: {
    setSelectedDeposit(state, action) {
      state.selectedDeposit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeposits.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeposits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deposits = action.payload;
      })
      .addCase(fetchDeposits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchDepositById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepositById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedDeposit = action.payload;
      })
      .addCase(fetchDepositById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addDeposit.fulfilled, (state, action) => {
        state.deposits.push(action.payload);
      })
      .addCase(updateDeposit.fulfilled, (state, action) => {
        state.deposits = state.deposits.map((deposit) =>
          deposit.id === action.payload.id ? action.payload : deposit
        );
      })
      .addCase(deleteDeposit.fulfilled, (state, action) => {
        state.deposits = state.deposits.filter((deposit) => deposit.id !== action.payload);
      });
  },
});

export const { setSelectedDeposit } = depositSlice.actions;

export default depositSlice.reducer;
