"use client";

import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const useCreateAPI = () => {
  const router = useRouter();
  const pathname = usePathname();
  const apiInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api`,
    timeout: 15000,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token") || "";
    apiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log(pathname);
      if (
        error.response &&
        error.response.status === 401 &&
        pathname !== "/auth"
      ) {
        localStorage.removeItem("token");
        toast.error("You are not authenticated");
        router.push("/auth");
      }
      return Promise.reject(error);
    }
  );

  return apiInstance;
};

export default useCreateAPI;
