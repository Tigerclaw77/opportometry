import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/api";

// ✅ GET all notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/notifications");
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error fetching notifications");
    }
  }
);

// ✅ PATCH one notification as read
export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue("Error marking notification as read");
    }
  }
);

// ✅ DELETE one notification
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue("Error deleting notification");
    }
  }
);

// ✅ PATCH all as read
export const markAllRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.patch(`/notifications/read-all`);
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue("Error marking all as read");
    }
  }
);

// ✅ DELETE all
export const deleteAllNotifications = createAsyncThunk(
  "notifications/deleteAllNotifications",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.delete(`/notifications`);
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue("Error deleting all notifications");
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    loading: false,
    error: null,
    hasUnreadNotifications: false,
  },
  reducers: {
    clearNotifications(state) {
      state.items = [];
      state.hasUnreadNotifications = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.hasUnreadNotifications = action.payload.some((n) => !n.isRead);
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load notifications";
      })

      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const id = action.payload;
        const notification = state.items.find((n) => n._id === id);
        if (notification) notification.isRead = true;
        state.hasUnreadNotifications = state.items.some((n) => !n.isRead);
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((n) => n._id !== id);
        state.hasUnreadNotifications = state.items.some((n) => !n.isRead);
      })

      .addCase(markAllRead.fulfilled, (state) => {
        state.items.forEach((n) => (n.isRead = true));
        state.hasUnreadNotifications = false;
      })

      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.items = [];
        state.hasUnreadNotifications = false;
      });
  },
});

export const { clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
