import axios from "axios";

// ✅ Dev Mode Flag (optional, no longer used)
const isDevMode =
  process.env.REACT_APP_DEV_MODE === "true" ||
  localStorage.getItem("devMode") === "true";

// ✅ Create Axios Instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Automatically attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =============================
// ✅ AUTH ENDPOINTS
// =============================
export const loginUser = async (email, password) => {
  const { data } = await axiosInstance.post("/auth/login", { email, password });
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await axiosInstance.post("/register", userData);
  return data;
};

export const resetPasswordRequest = async (email) => {
  const { data } = await axiosInstance.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (token, newPassword) => {
  const { data } = await axiosInstance.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return data;
};

export const verifyEmail = async (token) => {
  const response = await axiosInstance.get(`/auth/verify-email?token=${token}`);
  return response.data;
};

// =============================
// ✅ JOBS ENDPOINTS
// =============================
export const createJob = async (jobData) => {
  try {
    const response = await axiosInstance.post("/jobs", jobData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating job:", error);
    throw new Error(error.response?.data?.message || "Failed to create job.");
  }
};

export const fetchRecruiterJobs = async () => {
  const { data } = await axiosInstance.get("/jobs/recruiter");
  return data;
};

export const deleteJob = async (jobId) => {
  const { data } = await axiosInstance.delete(`/jobs/${jobId}`);
  return data;
};

export const migrateRecruiterJobTemplates = async () => {
  const { data } = await axiosInstance.post("/recruiters/migrate-job-templates");
  return data;
};

export const fetchJobs = async () => {
  const { data } = await axiosInstance.get("/jobs");
  return data;
};

export const addJobToFavorites = async (jobId) => {
  const { data } = await axiosInstance.post(`/candidate/favorites/${jobId}`);
  return data;
};

export const toggleWatchlistJob = async (jobId) => {
  const { data } = await axiosInstance.post(`/candidate/watchlist/${jobId}`);
  return data;
};

export const applyToJob = async (jobId) => {
  const { data } = await axiosInstance.post(`/candidate/apply/${jobId}`);
  return data;
};

// =============================
// ✅ ADMIN ENDPOINTS
// =============================
export const fetchAdminDashboard = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard");
    return response.data;
  } catch (error) {
    console.error("❌ Error in fetchAdminDashboard:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch admin dashboard data");
  }
};

// =============================
// ✅ NOTIFICATIONS ENDPOINT
// =============================
export const fetchNotifications = async () => {
  const { data } = await axiosInstance.get("/notifications");
  return data.notifications || data;
};

export default axiosInstance;
