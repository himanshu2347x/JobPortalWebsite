import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://nichenest-8hga.onrender.com"; // For frontend
export const fetchEmployerApplications = createAsyncThunk(
  "applications/fetchEmployerApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${FRONTEND_URL}/api/v1/application/employer/getall`, // Updated to use BACKEND_URL
        { withCredentials: true }
      );
      return response.data.applications;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const fetchJobSeekerApplications = createAsyncThunk(
  "applications/fetchJobSeekerApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${FRONTEND_URL}/api/v1/application/jobseeker/getall`, // Updated to use BACKEND_URL
        { withCredentials: true }
      );
      return response.data.applications;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const postApplication = createAsyncThunk(
  "applications/postApplication",
  async ({ formData, jobId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${FRONTEND_URL}/api/v1/application/post/${jobId}`, // Updated to use BACKEND_URL
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const deleteApplication = createAsyncThunk(
  "applications/deleteApplication",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${FRONTEND_URL}/api/v1/application/delete/${id}`, // Updated to use BACKEND_URL
        { withCredentials: true }
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// Slice
const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearAllErrors: (state) => {
      state.error = null;
      state.message = null;
    },
    resetApplicationSlice: (state) => {
      state.loading = false;
      state.message = null;
      state.applications = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchEmployerApplications
      .addCase(fetchEmployerApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployerApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchEmployerApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchJobSeekerApplications
      .addCase(fetchJobSeekerApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobSeekerApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchJobSeekerApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // postApplication
      .addCase(postApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(postApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(postApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteApplication
      .addCase(deleteApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAllErrors, resetApplicationSlice } =
  applicationSlice.actions;

export default applicationSlice.reducer;
