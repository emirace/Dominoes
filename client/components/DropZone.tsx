import React, { useEffect, useState } from "react";
import { useHover } from "@use-gesture/react";
import { DropZoneProp } from "@/types";
import { useGameContext } from "./GameProvider";

function DropZone({
  acceptedDotCount,
  position,
  initailSetAnchor,
  activeHover,
  id,
  scale,
}: DropZoneProp) {
  const [canDrop, setCanDrop] = useState(false);
  const { draggedTile, setRecentlyDroppedTile } = useGameContext();

  useEffect(() => {
    if (
      draggedTile &&
      acceptedDotCount.some((i) => draggedTile.tile.includes(i))
    )
      setCanDrop(true);
  }, [acceptedDotCount, draggedTile]);

  const bind = useHover(({ xy: [x, y], hovering }) => {
    if (hovering) {
      activeHover.current = activeHover.current || id;

      if (draggedTile && activeHover.current === id && canDrop) {
        setRecentlyDroppedTile(draggedTile);
        initailSetAnchor(draggedTile, [x, y], id);
        activeHover.current = null;
      }
    } else
      activeHover.current =
        activeHover.current === id ? null : activeHover.current;
  });

  return (
    <div
      {...bind()}
      className={`-translate-x-1/2 -translate-y-1/2 ${
        canDrop ? "bg-main-orange/65" : "bg-transparent"
      }  `}
      style={{
        width: `${400 * scale}px`,
        height: `${400 * scale}px`,
        position: "absolute",
        top: position ? `${position[1]}px` : "0",
        left: position ? `${position[0]}px` : "0",
        transition: "background-color 100ms ease-in-out 10ms",
        zIndex: activeHover.current === id ? 1 : 0,
      }}
    />
  );
}

export default DropZone;
