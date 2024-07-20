// components/SocketProvider.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });
export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/auth") {
      return;
    }
    const token = window.localStorage.getItem("token");
    if (!token) {
      return router.push("/auth");
    }

    const URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
    const newSocket = io(URL, {
      autoConnect: true,
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });

    newSocket.onAny((event, ...args) => {
      console.log(event, args);
    });

    newSocket.on("connect_error", (err) => {
      if (window.location.pathname !== "/auth") {
        console.log(err.message, window.location.href);
        // router.push("/auth");
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
