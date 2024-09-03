import React, { useEffect } from "react";
import Image from "next/image";
import { useGameContext } from "./GameProvider";
import useDistributor from "@/hooks/useDistributor";
import {
  animated,
  config,
  useChain,
  useSpring,
  useSpringRef,
  useTransition,
} from "@react-spring/web";
import DominoesTile from "./DominoesTile";
import { numberPair } from "@/types";

function OpponentDeck() {
  const {oppenentPullFrom, opponentPlay} = useGameContext();
  const [hand, setHand, from, boundRef] = useDistributor();

  const springRef = useSpringRef();
  const springProp = useSpring({
    ref: springRef,
    width: hand.length * 64 - 4,
    config: config.stiff,
  });

  const transRef = useSpringRef();
  const transitions = useTransition(hand, {
    ref: transRef,
    from: {
      transform: from ? `translate(${-from[0]}px, ${-from[1]}px)` : "",
    },
    enter: {
      width: "100%",
      transform: `translate(0px, 0px)`,
    },
    leave: { width: "0%" },
    config: config.stiff,
  });

  useChain([springRef, transRef], [0, 0]);

  useEffect(() => {
    const selectLastTile = () => {
      const parent = boundRef.current;
      if (parent) {
        const children = parent.children;
        const lastChild = children[children.length - 1];

        setHand((prevArr) => {
          const newArr = [...prevArr];
          newArr.pop();
          return newArr;
        });

        if (lastChild) {
          const rect = lastChild.getBoundingClientRect();
          return [rect.x, rect.y] as numberPair;
        }
      }
    };

    if (opponentPlay) {
      const lastTilecoor = selectLastTile();
      if (lastTilecoor) oppenentPullFrom.current = lastTilecoor;
      console.log("opponent played a new tile", lastTilecoor);
    }
  }, [boundRef, oppenentPullFrom, opponentPlay, setHand]);

  return (
    <div
      id="other-player"
      className="absolute gap-2 top-0 bg-main-gray w-[260px] rounded-b-9 flex p-2 items-center z-50"
    >
      <div className="w-[60px] h-[60px]">
        <Image
          src="/default-avatar.png"
          width={60}
          height={60}
          alt="avatar"
          className="rounded-lg"
        />
      </div>
      <div
        ref={boundRef}
        className="relative flex-1 flex self-start items-center w-full h-[60px]"
      >
        {transitions((style) => (
          <div className="relative h-full w-6 overflow-x-visible">
            <animated.div style={style} className="h-full drop-shadow-2xl">
              {" "}
              <DominoesTile
                tile={{
                  id: 0,
                  tile: [0, 0],
                }}
                size="small"
              />
            </animated.div>
          </div>
        ))}
      </div>
      <div className="text-center ml-auto">
        <p>0</p>
        <p className="text-xs text-[#afb7c1]">points</p>
      </div>
    </div>
  );
}

export default OpponentDeck;
