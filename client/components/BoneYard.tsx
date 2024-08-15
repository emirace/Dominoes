import React, { useState } from "react";
import DominoesTile from "./DominoesTile";
import { animated, config, useTransition } from "@react-spring/web";
import { useGameContext } from "./GameProvider";
import { numberPair, tileType } from "@/types";

function BoneYard() {
  const {
    selectFromBoneYard,
    activateBoneYard,
    drawFromBoneYardClb,
    setPlayerDeck,
  } = useGameContext();
  const [tiles, setTiles] = useState(
    Array.from({ length: 28 }, () => "unpicked")
  );

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    // console.log('inclick hanged')
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    if (drawFromBoneYardClb.current) {
      const pick = selectFromBoneYard();
      console.log(pick)
      setPlayerDeck((prevTiles) => [...prevTiles, pick]);
      drawFromBoneYardClb.current([rect.left, rect.top]);
      setTiles((tile) =>
        tile.map((item, i) => (i === index ? "picked" : item))
      );
    }
  };

  const boneYardTranstion = useTransition(activateBoneYard, {
    from: { opacity: 0, transform: "translateY(40px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(40px)" },
    config: config.gentle,
  });
  // console.log(activateBoneYard)
  return boneYardTranstion((style, item) =>
    item ? (
      <animated.div
        className="absolute bottom-12 w-full h-64 bg-[#49596f] flex justify-center  "
        style={style}
      >
        <div className="grid grid-cols-14 gap-1 auto-rows-min p-7">
          {tiles.map((tile, index) => (
            <animated.div
              key={index}
              onClick={(e) => handleClick(e, index)}
              className={`h-16 w-8 ${
                tile === "picked" ? " opacity-60 pointer-events-none" : ""
              }`}
            >
              <DominoesTile tile={{ id: 0, tile: [0, 0] }} size="small" />
            </animated.div>
          ))}
        </div>
      </animated.div>
    ) : (
      <div />
    )
  );
}

export default BoneYard;
