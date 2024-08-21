import React, { useEffect, useState } from "react";
import DeckTile from "./DeckTile";
import {
  useTransition,
  animated,
  useSpring,
  config,
  useChain,
  useSpringRef,
} from "@react-spring/web";
import { useGameContext } from "./GameProvider";
import useDistributor, { requestType } from "@/hooks/useDistributor";

function PlayerDeck() {
  const { permits } = useGameContext();
  const [hand, setHand, from, boundRef, requestTile] = useDistributor(
    requestType.MAIN_DECK
  );

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
      transform: from
        ? `translate(${-from[0]}px, ${-from[1]}px) scale(0.5)`
        : "",
    },
    enter: {
      width: "100%",
      transform: `translate(0px, 0px) scale(1)`,
    },
    leave: { width: "0%" },
    config: config.stiff,
  });

  useChain([springRef, transRef], [0, 0]);

  const onDropComplete = ({ id }: { id: number }) => {
    return setHand((prevArr) => prevArr.filter((tile) => tile.id !== id));
  };

  useEffect(() => {
    const needTile =
    hand.length &&
    !hand.some(({ tile }) => permits.some((item) => tile.includes(item)));
    
    if (needTile) {
      requestTile();
    }
  }, [permits]);

  return (
    <animated.div
      ref={boundRef}
      style={springProp}
      className="absolute flex left-[50%] translate-x-[-50%] items-center self-end gap-1 h-[120px]"
    >
      {transitions((style, tile) => (
        <animated.div key={tile.id} style={style}>
          <DeckTile {...{ tile, onDropComplete }} />
        </animated.div>
      ))}
    </animated.div>
  );
}

export default PlayerDeck;
