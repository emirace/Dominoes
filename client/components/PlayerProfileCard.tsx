import { User } from "@/types";
import Image from "next/image";
import { Icons } from "./icons";
import { useEffect, useRef, useState } from "react";
import { Check } from "react-feather";

function PlayerProfileCard({
  player,
  isReady,
}: {
  player: User;
  isReady: boolean;
}) {
  const [dropdownToggle, setDropdownToggle] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdownClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDropdownToggle((prevState) => !prevState);
  };

  useEffect(() => {
    const handleMousedown = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLDivElement).contains(e.target as Node)
      ) {
        setDropdownToggle(false);
      }
    };

    document.addEventListener("mousedown", handleMousedown);
    return () => document.removeEventListener("mousedown", handleMousedown);
  }, []);

  return (
    <div className="relative p-6 bg-main-blue shadow-card-shadow rounded-3xl min-w-60 md:w-60 ">
      <div>
        <div
          className="relative"
          onClick={handleDropdownClick}
          ref={dropdownRef}
        >
          <div className="absolute cursor-pointer right-0 top-0">
            <Icons.menu />
          </div>
          {dropdownToggle && (
            <div className=" absolute right-0 top-10 bg-main-blue rounded-xl w-28  drop-shadow-2xl  shadow-button-shadow">
              <ul className="*:h-10 *:  py-0">
                <li
                  className=" capitalize text-white px-4 py-2 flex items-center hover:bg-white/15 rounded-xl"
                  // onClick={add a function to handle kick}
                >
                  kick
                </li>
                {/* add more list item and use stopPropagation on event handlers to prevent the dropdown from closing whenever a list item is clicked*/}
              </ul>
            </div>
          )}
        </div>

        <Image
          src="/default-avatar.png"
          alt="profile"
          width={72}
          height={72}
          className="h-[72px] w-[72px] bg-green-400 rounded-2xl"
        ></Image>

        <div className="pt-6 pb-3 flex items-center gap-2">
          <h3 className="text-xl font-[6  00]">{player?.username}</h3>
          {isReady && (
            <div className="bg-green-500 p-0.5 rounded-full flex items-center justify-center">
              <Check size={12} color="#fff" />{" "}
            </div>
          )}
        </div>

        <div className="bg-transparent border border-gray-500 rounded-full px-3  w-fit flex gap-1 items-center">
          <svg
            className="fill-gray-100 h-4"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
            data-testid="SportsEsportsIcon"
          >
            <path d="m21.58 16.09-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91M11 11H9v2H8v-2H6v-1h2V8h1v2h2zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1"></path>
          </svg>
          <span className="text-gray-200">{player.games.length}</span>
        </div>
      </div>
    </div>
  );
}

export default PlayerProfileCard;
