import React, { useRef, useEffect } from "react";
import DominoesTile from "./DominoesTile";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { numberPair } from "@/types";

function DeckTile({
  index,
  tile,
  onDropComplete,
}: {
  index: number;
  tile: numberPair;
  onDropComplete: any;
}) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "DOMINOTILE",
    item: { index, tile },
    end: (_, monitor) => monitor.didDrop() && onDropComplete(index),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // console.log(tile, "component");
  return (
    <div ref={drag} className={` pl-2 ${isDragging && "opacity-0"}`}>
      <DominoesTile
        config={{
          dots: tile,
          active: false,
          scale: 1,
          tilt: 0,
        }}
      />
    </div>
  );
}

export default DeckTile;
