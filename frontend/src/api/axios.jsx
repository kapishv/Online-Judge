import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export default axios.create({
  baseURL: baseURL,
});

export const axiosPrivate = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
