// src/features/companies/companySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  companies: [],
  selectedCompany: null,
  status: 'idle',
  error: null,
};

export const fetchCompanies = createAsyncThunk('companies/fetchCompanies', async () => {
  const response = await axios.get('https://aksion.abyssiniasoftware.com/api/companies');
  return response.data;
});

export const fetchCompanyById = createAsyncThunk('companies/fetchCompanyById', async (companyId) => {
  const response = await axios.get(`https://aksion.abyssiniasoftware.com/api/companies/${companyId}`);
  return response.data;
});

export const addCompany = createAsyncThunk('companies/addCompany', async (company) => {
  const response = await axios.post('https://aksion.abyssiniasoftware.com/api/companies', company);
  return response.data;
});

export const updateCompany = createAsyncThunk('companies/updateCompany', async (company) => {
  const response = await axios.put(`https://aksion.abyssiniasoftware.com/api/companies/${company.id}`, company);
  return response.data;
});

export const deleteCompany = createAsyncThunk('companies/deleteCompany', async (companyId) => {
  await axios.delete(`https://aksion.abyssiniasoftware.com/api/companies/${companyId}`);
  return companyId;
});

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setSelectedCompany(state, action) {
      state.selectedCompany = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCompanyById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedCompany = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.companies.push(action.payload);
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.companies = state.companies.map((company) =>
          company.id === action.payload.id ? action.payload : company
        );
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter((company) => company.id !== action.payload);
      });
  },
});

export const { setSelectedCompany } = companySlice.actions;

export default companySlice.reducer;
