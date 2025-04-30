import { createSlice } from "@reduxjs/toolkit";

// Safely load user from localStorage
const storedUser = localStorage.getItem("user");
const rawUser = storedUser ? JSON.parse(storedUser) : null;

const initialState = {
  token: localStorage.getItem("token") || null,
  userRole: localStorage.getItem("userRole") || null,
  user: rawUser || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { token, userRole, user } = action.payload;
      state.token = token;
      state.userRole = userRole;
      state.user = user;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Dispatched user data:", { token, userRole, user });
    },
    logout(state) {
      state.token = null;
      state.userRole = null;
      state.user = null;

      // Remove from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
