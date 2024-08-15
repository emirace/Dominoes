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
import useMeasure from "react-use-measure";
import { numberPair } from "@/types";

function PlayerDeck() {
  const { playerDeck, setPlayerDeck, requestTile, permits } = useGameContext();
  const [addTile, setAddTile] = useState<number[]>([]);

  const [playerDeckBoundRef, playerDeckBound] = useMeasure();

  // console.log("addTile", addTile);

  const springRef = useSpringRef();
  const springProp = useSpring({
    ref: springRef,
    width: playerDeck.length * 64 - 4,
    config: config.gentle,
  });

  const transRef = useSpringRef();
  const transitions = useTransition(playerDeck, {
    ref: transRef,
    from: {
      transform: `translate(${-addTile[0]}px, ${-addTile[1]}px) scale{0.5}`,
      // width: "0%",
      opacity: 0,
    },
    enter: {
      width: "100%",
      opacity: 1,
      transform: `translate(0, 0) scale{1}`,
    },
    leave: { width: "100%" },
    config: config.gentle,
  });

  useChain([springRef, transRef], [0, 0])

  const onDropComplete = ({ id }: { id: number }) => {
    return setPlayerDeck((prevPlayerDeck) =>
      prevPlayerDeck.filter((tile) => tile.id !== id)
    );
  };

  useEffect(() => {
    const needTile =
      playerDeck.length &&
      !playerDeck.some(({ tile }) =>
        permits.some((item) => tile.includes(item))
      );

    if (needTile) {
      const requestTileCallBack = (position: numberPair) => {
        console.log("position", position);
        const from = [
          playerDeckBound.right - position[0],
          playerDeckBound.top - position[1],
        ];

        setAddTile(from);
      };

      requestTile(requestTileCallBack);
    }
  }, [
    playerDeck,
    permits,
    requestTile,
    playerDeckBound.right,
    playerDeckBound.top,
  ]);

  return (
    <animated.div
      ref={playerDeckBoundRef}
      style={springProp}
      className="absolute flex left-[50%] translate-x-[-50%] items-center self-end gap-1 "
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
