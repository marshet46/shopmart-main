// src/features/sellStocks/sellStockSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  sellStocks: [],
  selectedSellStock: null,
  status: 'idle',
  error: null,
};

export const fetchSellStocks = createAsyncThunk('sellStocks/fetchSellStocks', async () => {
  const response = await axios.get('https://aksion.abyssiniasoftware.com/api/sell-stocks');
  console.log(response.data);
  return response.data;
});

export const fetchSellStockById = createAsyncThunk('sellStocks/fetchSellStockById', async (sellStockId) => {
  const response = await axios.get(`https://aksion.abyssiniasoftware.com/api/sell-stocks/${sellStockId}`);
  return response.data;
});

export const addSellStock = createAsyncThunk('sellStocks/addSellStock', async (sellStock) => {
  const response = await axios.post('https://aksion.abyssiniasoftware.com/api/sell-stocks', sellStock);
  console.log(sellStock);
  return response.data;
});

export const updateSellStock = createAsyncThunk('sellStocks/updateSellStock', async (sellStock) => {
  const response = await axios.put(`https://aksion.abyssiniasoftware.com/api/sell-stocks/${sellStock.id}`, sellStock);
  return response.data;
});

export const deleteSellStock = createAsyncThunk('sellStocks/deleteSellStock', async (sellStockId) => {
  await axios.delete(`https://aksion.abyssiniasoftware.com/api/sell-stocks/${sellStockId}`);
  return sellStockId;
});

const sellStockSlice = createSlice({
  name: 'sellStocks',
  initialState,
  reducers: {
    setSelectedSellStock(state, action) {
      state.selectedSellStock = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellStocks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSellStocks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sellStocks = action.payload;
      })
      .addCase(fetchSellStocks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchSellStockById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSellStockById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedSellStock = action.payload;
      })
      .addCase(fetchSellStockById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addSellStock.fulfilled, (state, action) => {
        state.sellStocks.push(action.payload);
      })
      .addCase(updateSellStock.fulfilled, (state, action) => {
        state.sellStocks = state.sellStocks.map((sellStock) =>
          sellStock.id === action.payload.id ? action.payload : sellStock
        );
      })
      .addCase(deleteSellStock.fulfilled, (state, action) => {
        state.sellStocks = state.sellStocks.filter((sellStock) => sellStock.id !== action.payload);
      });
  },
});

export const { setSelectedSellStock } = sellStockSlice.actions;

export default sellStockSlice.reducer;
