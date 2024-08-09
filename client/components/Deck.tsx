import React, { useState, useEffect, useRef } from "react";
import { numberPair } from "@/types";
import DeckTile from "./DeckTile";

function Deck() {
  const [tiles, setTiles] = useState<(numberPair | null)[]>([
    [1, 1],
    [6, 5],
    [4, 3],
    [4, 2],
    [4, 1],
    [4, 4],
  ]);
  const tempDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (tempDiv.current) {
        tempDiv.current.style.width = "0";
      }
    }, 0);
  }, [tiles]);

  const onDropComplete = (index: number) => {
    setTiles((array) => {
      array.splice(index, 1, null);
      return [...array];
    });
  };

  return (
    <div className="absolute flex left-[50%] translate-x-[-50%] justify-center items-center self-end">
      {tiles.map((tile, index) =>
        tile ? (
          <DeckTile key={index} {...{ tile, index, onDropComplete }} />
        ) : (
          <div
            key={"temp" + index}
            ref={tempDiv}
            style={{
              width: 68,
              transition: "width 200ms ease-in 100ms",
            }}
          />
        )
      )}
    </div>
  );
}

export default Deck;
