import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/api";
import { fetchUserJobData } from "./jobSlice";

// 🔄 Load from localStorage safely
const storedUser = localStorage.getItem("user");
let rawUser = null;

try {
  const parsed = storedUser ? JSON.parse(storedUser) : null;
  rawUser = parsed && Object.keys(parsed).length > 0 ? parsed : null;
} catch {
  rawUser = null;
}


const initialState = {
  token: localStorage.getItem("token") || null,
  userRole: localStorage.getItem("userRole") || null,
  user: rawUser || null,
  status: "idle",
  error: null,
};

/**
 * ✅ Thunk to fetch current session (used on App load or refresh)
 */
export const fetchUserSession = createAsyncThunk(
  "auth/fetchUserSession",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return thunkAPI.rejectWithValue("No token found");

      const res = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data;
      const {
        savedJobs = [],
        appliedJobs = [],
        recruiterJobs = [],
        hiddenJobs = [],
      } = user;

      // ✅ Load jobs and interactions into jobSlice
      thunkAPI.dispatch(
        fetchUserJobData({ savedJobs, appliedJobs, recruiterJobs, hiddenJobs })
      );

      return { user, token };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Session expired"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { token, userRole, user } = action.payload;
      state.token = token;
      state.userRole = userRole;
      state.user = user;
      state.isAuthenticated = true;

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout(state) {
      state.token = null;
      state.userRole = null;
      state.user = null;
      state.status = "idle";
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.userRole = action.payload.user?.userRole || null;
        state.isAuthenticated = true;

        // Persist on success
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("userRole", action.payload.user?.userRole || "");
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(fetchUserSession.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.token = null;
        state.user = null;
        state.userRole = null;
        state.isAuthenticated = false;

        // Clean up on error
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
