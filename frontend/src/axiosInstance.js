// // import axios from "axios";

// // const axiosInstance = axios.create({
// //   baseURL: "http://localhost:5000",
// // });

// // axiosInstance.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("token");
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }
// //   return config;
// // });

// // export default axiosInstance;

// import axios from "axios";

// // Check if you're in development mode (you can use `devMode` from localStorage or state)
// const isDevMode = process.env.REACT_APP_DEV_MODE === "true" || localStorage.getItem("devMode") === "true";

// // Create an Axios instance with the base URL
// const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000", // Your backend API base URL
// });

// // Add request interceptor to conditionally include the Authorization header
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Only add Authorization header if NOT in dev mode
//     if (!isDevMode) {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
