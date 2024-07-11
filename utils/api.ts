import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api`,
  timeout: 15000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=utf-8",
  },
});

export default API;
