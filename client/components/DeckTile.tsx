import React, { useRef, useEffect, useState } from "react";
import DominoesTile from "./DominoesTile";
import { useDrag } from "@use-gesture/react";
import { useSpring, animated, config } from "@react-spring/web";
import { tileType } from "@/types";
import { useGameContext } from "./GameProvider";

function DeckTile({
  tile,
  onDropComplete,
}: {
  tile: tileType;
  onDropComplete: any;
}) {
  const { draggedTile, canPlay, setDraggedTile, recentlyDroppedTile } =
    useGameContext();

  const [springProp, api] = useSpring(() => ({
    transform: "translate(0px, 0px)",
    opacity: 1,
    config: config.default,
  }));

  const bind = useDrag(({ movement: [x, y], active }) => {
    if (!canPlay) return;
    if (!draggedTile && active) setDraggedTile(tile);
    else if (!active) {
      setTimeout(() => {
        if (recentlyDroppedTile.current?.id === tile.id) {
          api.start({
            opacity: 0,
            immediate: true,
          });
          onDropComplete(tile);
        } else
          api.start({
            transform: `translate(0, 0)`,
          });

        setDraggedTile(null);
      }, 0);
    } else
      api.start({
        transform: `translate(${x}px, ${y}px)`,
        immediate: active,
      });
  });
  return (
    <animated.div
      {...bind()}
      style={{ ...springProp }}
      className={`touch-none relative`}
    >
      <DominoesTile {...{ tile }} />
    </animated.div>
  );
}

export default DeckTile;
