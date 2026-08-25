import axios from "axios";
import { auth } from "../config/firebase.js";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL, 
    // ||"http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken();

        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error("Failed to attach Firebase token:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
// api.interceptors.request.use(
//   async (config) => {
//     const user = auth.currentUser;

//     if (user) {
//       const token = await user.getIdToken();
//       // console.log(token);
//       config.headers.Authorization =
//         `Bearer ${token}`;
//       console.log(config.headers.Authorization);
//       }

//     return config;
//   }
// );
