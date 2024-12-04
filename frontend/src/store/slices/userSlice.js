import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://nichenest-8hga.onrender.com";

// Async actions using createAsyncThunk
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async ({ city, niche, searchKeyword = "" }, { rejectWithValue }) => {
    try {
      let link = `${FRONTEND_URL}/api/v1/job/getall?`; // Updated to use BACKEND_URL
      let queryParams = [];
      if (searchKeyword) queryParams.push(`searchKeyword=${searchKeyword}`);
      if (city) queryParams.push(`city=${city}`);
      if (niche) queryParams.push(`niche=${niche}`);
      link += queryParams.join("&");

      const response = await axios.get(link, { withCredentials: true });
      return response.data.jobs;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchSingleJob = createAsyncThunk(
  "jobs/fetchSingleJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${FRONTEND_URL}/api/v1/job/get/${jobId}`,
        {
          // Updated API endpoint
          withCredentials: true,
        }
      );
      return response.data.job;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const postJob = createAsyncThunk(
  "jobs/postJob",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${FRONTEND_URL}/api/v1/job/post`, // Updated API endpoint
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getMyJobs = createAsyncThunk(
  "jobs/getMyJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${FRONTEND_URL}/api/v1/job/getmyjobs`, // Updated API endpoint
        { withCredentials: true }
      );
      return response.data.myJobs;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${FRONTEND_URL}/api/v1/job/delete/${id}`, // Updated API endpoint
        { withCredentials: true }
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Slice
const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
    message: null,
    singleJob: {},
    myJobs: [],
  },
  reducers: {
    clearAllErrors: (state) => {
      state.error = null;
      state.message = null;
    },
    resetJobSlice: (state) => {
      state.loading = false;
      state.message = null;
      state.myJobs = [];
      state.singleJob = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchJobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchSingleJob
      .addCase(fetchSingleJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleJob.fulfilled, (state, action) => {
        state.loading = false;
        state.singleJob = action.payload;
        state.error = null;
      })
      .addCase(fetchSingleJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // postJob
      .addCase(postJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postJob.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(postJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getMyJobs
      .addCase(getMyJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs = action.payload;
        state.error = null;
      })
      .addCase(getMyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteJob
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAllErrors, resetJobSlice } = jobSlice.actions;

export default jobSlice.reducer;
