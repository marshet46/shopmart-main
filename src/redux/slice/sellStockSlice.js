// src/features/sellSellStocks/sellSellStockSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  sellSellStocks: [],
  selectedSellStock: null,
  status: 'idle',
  error: null,
};

export const fetchSellStocks = createAsyncThunk('sellSellStocks/fetchSellStocks', async () => {
  const response = await axios.get('https://aksion.abyssiniasoftware.com/api/sell-stocks');
  return response.data;
});

export const fetchSellStockById = createAsyncThunk('sellSellStocks/fetchSellStockById', async (sellSellStockId) => {
  const response = await axios.get(`https://aksion.abyssiniasoftware.com/api/sell-stocks/${sellSellStockId}`);
  return response.data;
});

export const addSellStock = createAsyncThunk('sellSellStocks/addSellStock', async (sellSellStock) => {
  const response = await axios.post('https://aksion.abyssiniasoftware.com/api/sell-stocks', sellSellStock);
  console.log(sellSellStock);
  return response.data;
});

export const updateSellStock = createAsyncThunk('sellSellStocks/updateSellStock', async (sellSellStock) => {
  const response = await axios.put(`https://aksion.abyssiniasoftware.com/api/sell-stocks/${sellSellStock.id}`, sellSellStock);
  return response.data;
});

export const deleteSellStock = createAsyncThunk('sellSellStocks/deleteSellStock', async (sellSellStockId) => {
  await axios.delete(`https://aksion.abyssiniasoftware.com/api/sell-stocks/${sellSellStockId}`);
  return sellSellStockId;
});

const sellSellStockSlice = createSlice({
  name: 'sellSellStocks',
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
        state.sellSellStocks = action.payload;
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
        state.sellSellStocks.push(action.payload);
      })
      .addCase(updateSellStock.fulfilled, (state, action) => {
        state.sellSellStocks = state.sellSellStocks.map((sellSellStock) =>
          sellSellStock.id === action.payload.id ? action.payload : sellSellStock
        );
      })
      .addCase(deleteSellStock.fulfilled, (state, action) => {
        state.sellSellStocks = state.sellSellStocks.filter((sellSellStock) => sellSellStock.id !== action.payload);
      });
  },
});

export const { setSelectedSellStock } = sellSellStockSlice.actions;

export default sellSellStockSlice.reducer;
