import React, { useEffect, useState } from "react";
import { useHover } from "@use-gesture/react";
import { DropZoneProp } from "@/types";
import { useGameContext } from "./GameProvider";

function DropZone({
  position,
  initailSetAnchor,
  activeHover,
  id,
  scale,
  registerDrop,
}: DropZoneProp) {
  const { draggedTile, recentlyDroppedTile, opponentPlay, oppenentPullFrom } =
    useGameContext();

  const bind = useHover(({ xy: [x, y], hovering }) => {
    if (hovering) {
      activeHover.current = activeHover.current || id;

      if (draggedTile && activeHover.current === id) {
        recentlyDroppedTile.current = draggedTile;
        registerDrop(1);

        initailSetAnchor(draggedTile, [x, y], id);
        activeHover.current = null;
      }
    } else
      activeHover.current =
        activeHover.current === id ? null : activeHover.current;
  });

  console.log("]]]]]", opponentPlay);
  useEffect(() => {
    if (opponentPlay?.playedOn?.id === id) {
      console.log("in dropzone", opponentPlay);
      initailSetAnchor(
        opponentPlay.tilePlayed,
        oppenentPullFrom.current,
        id,
        true
      );
    }
  }, [opponentPlay]);

  return (
    <div
      {...bind()}
      className={`-translate-x-1/2 -translate-y-1/2 ${"bg-main-orange/50"}  `}
      style={{
        width: `${400 * scale}px`,
        height: `${400 * scale}px`,
        position: "absolute",
        top: position ? `${position[1]}px` : "0",
        left: position ? `${position[0]}px` : "0",
        transition: "background-color 100ms ease-in-out 10ms",
      }}
    />
  );
}

export default DropZone;
