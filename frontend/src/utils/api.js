import axios from "axios";

// ✅ Dev Mode Flag (optional)
const isDevMode = process.env.REACT_APP_DEV_MODE === "true" || localStorage.getItem("devMode") === "true";

// ✅ Create Axios Instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend API URL prefix
});

// ✅ Add Authorization Header unless in dev mode
axiosInstance.interceptors.request.use(
  (config) => {
    if (!isDevMode) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const verifyEmail = async (token) => {
  try {
    const response = await axiosInstance.get(`/auth/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Email verification failed.");
  }
};

// ✅ Get all jobs created by recruiter (authenticated)
export const fetchRecruiterJobs = async () => {
  try {
    const response = await axiosInstance.get("/jobs/recruiter");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch recruiter jobs.");
  }
};

// ✅ Delete a job by ID
export const deleteJob = async (jobId) => {
  try {
    const response = await axiosInstance.delete(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete job.");
  }
};

// ✅ Migrate job templates for recruiter
export const migrateRecruiterJobTemplates = async () => {
  try {
    const response = await axiosInstance.post("/recruiters/migrate-job-templates");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to migrate job templates.");
  }
};

// ✅ Fetch Admin Dashboard data
export const fetchAdminDashboard = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch admin dashboard data.");
  }
};


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
  const { data } = await axiosInstance.post("/auth/reset-password", { token, newPassword });
  return data;
};

// =============================
// ✅ JOBS ENDPOINTS (JobList.jsx will use these!)
// =============================

export const fetchJobs = async () => {
  const { data } = await axiosInstance.get("/jobs");
  return data;
};

// Favorites
export const addJobToFavorites = async (jobId) => {
  const { data } = await axiosInstance.post(`/candidate/favorites/${jobId}`);
  return data;
};

// Watchlist
export const toggleWatchlistJob = async (jobId) => {
  const { data } = await axiosInstance.post(`/candidate/watchlist/${jobId}`);
  return data;
};

// Apply
export const applyToJob = async (jobId) => {
  const { data } = await axiosInstance.post(`/candidate/apply/${jobId}`);
  return data;
};

export default axiosInstance;
