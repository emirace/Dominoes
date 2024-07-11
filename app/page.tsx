"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
    }
  }, []);

  return (
    <div className="h-screen w-screen bg-white p-16">
      <p className="text-black text-4xl">Welcome to DOMINOES</p>
    </div>
  );
}
