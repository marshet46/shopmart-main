// src/features/orders/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  orders: [],
  selectedOrder: null,
  status: 'idle',
  error: null,
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await axios.get('https://aksion.abyssiniasoftware.com/api/stock-orders');
  return response.data;
});

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (orderId) => {
  const response = await axios.get(`https://aksion.abyssiniasoftware.com/api/stock-orders/${orderId}`);
  return response.data;
});

export const addOrder = createAsyncThunk('orders/addOrder', async (order) => {
  const response = await axios.post('https://aksion.abyssiniasoftware.com/api/stock-orders', order);
  console.log(order);
  return response.data;
});

export const updateOrder = createAsyncThunk('orders/updateOrder', async (order) => {
  const response = await axios.put(`https://aksion.abyssiniasoftware.com/api/stock-orders/${order.id}`, order);
  return response.data;
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (orderId) => {
  await axios.delete(`https://aksion.abyssiniasoftware.com/api/stock-orders/${orderId}`);
  return orderId;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setSelectedOrder(state, action) {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order.id !== action.payload);
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions;

export default orderSlice.reducer;
