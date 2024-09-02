import React from "react";
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

function OpponentDeck() {
  const {} = useGameContext();
  const [hand, _, from, boundRef] = useDistributor();

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
        className="relative flex-1 flex justify-cente self-start items-center w-full h-[60px]"
      >
        {transitions((style) => (
          <div className="relative h-full w-6 overflow-x-visible">
            <animated.div style={style} className='h-full drop-shadow-2xl'>
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
