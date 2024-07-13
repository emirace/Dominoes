import axios from "axios";

const token =
  typeof window !== undefined ? window.localStorage.getItem("token") : "";
const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api`,
  timeout: 15000,
  headers: {
    Accept: "application/json, text/plain, */*",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json; charset=utf-8",
  },
});

export default API;
