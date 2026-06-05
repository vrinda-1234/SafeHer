import axios from "axios";

const API = axios.create({
  baseURL: process.env.PORT || "http://localhost:5001",
  withCredentials: true, // 🔥 IMPORTANT (sends cookies)
});

export default API;