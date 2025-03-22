import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Replace with your actual backend URL
const BASE_URL = "http://localhost:5000/api/candidates";

// Async Thunks (backend syncing)
export const fetchUserJobData = createAsyncThunk(
  "jobs/fetchUserJobData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.get(`${BASE_URL}/job-data`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleFavoriteJob = createAsyncThunk(
  "jobs/toggleFavoriteJob",
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.post(
        `${BASE_URL}/favorites/${jobId}`,
        {},
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return res.data.favorites;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleWatchlistJob = createAsyncThunk(
  "jobs/toggleWatchlistJob",
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.post(
        `${BASE_URL}/watchlist/${jobId}`,
        {},
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return res.data.watchlistJobs;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const applyToJob = createAsyncThunk(
  "jobs/applyToJob",
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.post(
        `${BASE_URL}/applied/${jobId}`,
        {},
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return res.data.appliedJobs;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    favorites: [],
    watchlistJobs: [],
    appliedJobs: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetJobState(state) {
      state.favorites = [];
      state.watchlistJobs = [];
      state.appliedJobs = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all user job data on login
      .addCase(fetchUserJobData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserJobData.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload.favorites;
        state.watchlistJobs = action.payload.watchlistJobs;
        state.appliedJobs = action.payload.appliedJobs;
      })
      .addCase(fetchUserJobData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Favorites
      .addCase(toggleFavoriteJob.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })

      // Watchlist
      .addCase(toggleWatchlistJob.fulfilled, (state, action) => {
        state.watchlistJobs = action.payload;
      })

      // Applied
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.appliedJobs = action.payload;
      });
  },
});

export const { resetJobState } = jobSlice.actions;
export default jobSlice.reducer;
