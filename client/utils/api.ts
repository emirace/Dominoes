// lib/axiosInstance.ts
import axios from "axios";

const createAPI = () => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token") || "";
    return axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api`,
      timeout: 15000,
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }
  // Return a basic instance or handle server-side logic
  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api`,
    timeout: 15000,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export default createAPI;
