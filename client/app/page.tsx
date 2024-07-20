"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import RoomPreviewCard from "../components/RoomPreviewCard";
import { ArrowLeft, Mail } from "react-feather";
import { Icons } from "@/components/icons";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useSocket } from "@/components/SocketProvider";
import { toast } from "react-toastify";
import { Game } from "@/types";
import createAPI from "@/utils/api";

const truncateAddress = (address?: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function Home() {
  const { user } = useCurrentUser();
  const { socket } = useSocket();
  const API = createAPI();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    if (socket) {
      API.get(`/game/all`)
        .then(({ data }) => {
          console.log(data);
          setGames(data.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error("An error occurred");
          setTimeout(() => router.push("/"), 2000);
        });

      socket.on("gameCreated", ({ gameId }) => {
        router.push(`/room/${gameId}`);
      });
      socket.on("newGameCreated", ({ game }) => {
        setGames((prevGames) => [game, ...prevGames]);
      });
      socket.on("createGameError", () => {
        toast.error("An error occurred while creating a game");
      });

      return () => {
        socket.off("gameCreated");
        socket.off("newGameCreated");
        socket.off("createGameError");
      };
    }
    // socket?.connect();
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   router.push("/auth");
    // }
  }, [socket]);

  const handleClick = () => {
    console.log("handle", socket);
    socket?.emit("createGame");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  return (
    <div className="">
      <div className="absolute left-0 top-0 h-[35%] w-full ">
        <Image
          fill={true}
          alt="dominios"
          src={"/home-header-backdrop-kRKY7btX.png"}
          className="object-cover absolute"
        />
        <div className=" absolute h-full w-full bg-gradient-radial-at-top from-main-blue/40 to-dark-blue" />
      </div>

      <main className="relative w-full px-6 sm:px-9 xl:px-28 z-10">
        <header className="flex justify-between py-6">
          <ArrowLeft />

          <div className="flex gap-6 items-center">
            <p>{truncateAddress(user?.address)}</p>
            <button onClick={handleLogout}>Logout</button>
            <Mail />
          </div>
        </header>

        <h1 className="pt-6 text-white font-bold font-poppins text-[2rem] text-nowrap sm:text-[2.5rem] xl:text-[2.9rem]">
          Hey there,{" "}
          <span className="font-medium text-2xl sm:text-3xl md:text-4xl  text-nowrap block">
            {" "}
            Let&apos;s play Dominoes
          </span>
        </h1>

        <div className="pt-11 flex gap-3">
          <button
            onClick={handleClick}
            className="bg-main-orange rounded-2xl py-2 px-6 w-fit h-auto flex gap-3 text-nowrap items-center"
          >
            New game <Icons.gamepad />
          </button>

          <div className="bg-transparen rounded-2xl  border border-blue-600 shadow-none w-fit p-2 hover:bg-blue-600/5">
            <Icons.refresh />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 pt-12">
          {games.map((game, i) => (
            <RoomPreviewCard game={game} key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
