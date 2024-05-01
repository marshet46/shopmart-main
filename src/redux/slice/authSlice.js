// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
  error: null
};

export const login = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('authToken'); // Clear authentication token from storage
    },
    setSession: (state, action) => {
      const { token, expiresIn } = action.payload;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem('authToken', token); // Store authentication token in localStorage
      setTimeout(() => {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('authToken'); // Clear authentication token after expiration time
      }, expiresIn * 1000); // Convert expiresIn to milliseconds
    }
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload.message;
      });
  }
});

export const { logout, setSession } = authSlice.actions;

export default authSlice.reducer;
