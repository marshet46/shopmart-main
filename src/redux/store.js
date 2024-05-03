// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import dashboardReducer from './slice/dashbaordSlice'; // Corrected import path

import dashboardDataReducer from './slice/dataSlice';
import stockReducer from './slice/stockSlice';
import companyReducer from './slice/companySlice';
import newsReducer from './slice/newsSlice';
import depostsReducer from './slice/depositSlice';
import orderReducer from './slice/OrderSlice';
import userReducer from './slice/userSlice';
import withdrawReducer from './slice/withdrawSlice';
import sellStockReducer from './slice/sellStockSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    dashboardData2: dashboardDataReducer,
    stocks: stockReducer,
    companies: companyReducer,
    news: newsReducer,
    deposits: depostsReducer,
    orders: orderReducer,
    users: userReducer,
    withdraws: withdrawReducer,
    sellStocks: sellStockReducer,

  }
});

export default store;
