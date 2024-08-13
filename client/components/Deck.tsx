import React, { useState, useEffect, useRef } from "react";
import { numberPair, tileType } from "@/types";
import DeckTile from "./DeckTile";
import { useTransition, animated } from "@react-spring/web";
import { useGameContext } from "./GameProvider";

function Deck() {
  const { playerDeck, setPlayerDeck } = useGameContext();

  const transitions = useTransition(playerDeck, {
    keys: (item) => item.id,
    enter: { width: "100%" },
    leave: { width: "0%" },
  });

  const onDropComplete = ({ id }: { id: number }) => {
    return setPlayerDeck((prevPlayerDeck) =>
      prevPlayerDeck.filter((tile) => tile.id !== id)
    );
  };
  return (
    <div className="absolute flex left-[50%] translate-x-[-50%] justify-center items-center self-end gap-2 z-20">
      {transitions((style, tile) => (
        <animated.div style={style} key={tile.id}>
          <DeckTile {...{ tile, onDropComplete }} />
        </animated.div>
      ))}
    </div>
  );
}

export default Deck;
