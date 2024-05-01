// src/features/stocks/stockSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  stocks: [],
  selectedStock: null,
  status: 'idle',
  error: null,
};

export const fetchStocks = createAsyncThunk('stocks/fetchStocks', async () => {
  const response = await axios.get('http://localhost:3000/api/stocks');
  return response.data;
});

export const fetchStockById = createAsyncThunk('stocks/fetchStockById', async (stockId) => {
  const response = await axios.get(`http://localhost:3000/api/stocks/${stockId}`);
  return response.data;
});

export const addStock = createAsyncThunk('stocks/addStock', async (stock) => {
  const response = await axios.post('http://localhost:3000/api/stocks', stock);
  console.log(stock);
  return response.data;
});

export const updateStock = createAsyncThunk('stocks/updateStock', async (stock) => {
  const response = await axios.put(`http://localhost:3000/api/stocks/${stock.id}`, stock);
  return response.data;
});

export const deleteStock = createAsyncThunk('stocks/deleteStock', async (stockId) => {
  await axios.delete(`http://localhost:3000/api/stocks/${stockId}`);
  return stockId;
});

const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setSelectedStock(state, action) {
      state.selectedStock = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchStockById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStockById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedStock = action.payload;
      })
      .addCase(fetchStockById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addStock.fulfilled, (state, action) => {
        state.stocks.push(action.payload);
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.stocks = state.stocks.map((stock) =>
          stock.id === action.payload.id ? action.payload : stock
        );
      })
      .addCase(deleteStock.fulfilled, (state, action) => {
        state.stocks = state.stocks.filter((stock) => stock.id !== action.payload);
      });
  },
});

export const { setSelectedStock } = stockSlice.actions;

export default stockSlice.reducer;
