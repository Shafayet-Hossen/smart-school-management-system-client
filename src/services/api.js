import axios from "axios";
import { auth } from "../config/firebase.js";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL, 
    // ||"http://localhost:5000/api",
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      // console.log(token);
      config.headers.Authorization =
        `Bearer ${token}`;
      console.log(config.headers.Authorization);
      }

    return config;
  }
);

export default api;