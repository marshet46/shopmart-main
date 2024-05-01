// src/features/newss/newsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  newss: [],
  selectedNews: null,
  status: 'idle',
  error: null,
};

export const fetchNewss = createAsyncThunk('newss/fetchNewss', async () => {
  const response = await axios.get('http://localhost:3000/api/news');
  return response.data;
});

export const fetchNewsById = createAsyncThunk('newss/fetchNewsById', async (newsId) => {
  const response = await axios.get(`http://localhost:3000/api/news/${newsId}`);
  return response.data;
});

export const addNews = createAsyncThunk('newss/addNews', async (news) => {
  const response = await axios.post('http://localhost:3000/api/news', news);
  console.log(news);
  return response.data;
});

export const updateNews = createAsyncThunk('newss/updateNews', async (news) => {
  const response = await axios.put(`http://localhost:3000/api/news/${news.id}`, news);
  return response.data;
});

export const deleteNews = createAsyncThunk('newss/deleteNews', async (newsId) => {
  await axios.delete(`http://localhost:3000/api/news/${newsId}`);
  return newsId;
});

const newsSlice = createSlice({
  name: 'newss',
  initialState,
  reducers: {
    setSelectedNews(state, action) {
      state.selectedNews = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewss.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNewss.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.newss = action.payload;
      })
      .addCase(fetchNewss.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchNewsById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNewsById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedNews = action.payload;
      })
      .addCase(fetchNewsById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNews.fulfilled, (state, action) => {
        state.newss.push(action.payload);
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.newss = state.newss.map((news) =>
          news.id === action.payload.id ? action.payload : news
        );
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.newss = state.newss.filter((news) => news.id !== action.payload);
      });
  },
});

export const { setSelectedNews } = newsSlice.actions;

export default newsSlice.reducer;
