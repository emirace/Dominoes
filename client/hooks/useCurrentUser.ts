// src/hooks/useCurrentUser.ts
import { useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import createAPI from "@/utils/api";
import { usePathname } from "next/navigation";

const useCurrentUser = () => {
  const API = createAPI();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/user/me");
      setUser(response.data.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return { user, loading, error, refetch: fetchCurrentUser };
};

export default useCurrentUser;
