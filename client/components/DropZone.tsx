import React from "react";
import { useDrop } from "react-dnd";
import { DropZoneProp } from "@/types";

function DropZone({
  acceptedDotCount,
  position,
  initailSetAnchor,
}: DropZoneProp) {
  const [{ isOver }, drop] = useDrop({
    accept: "DOMINOTILE",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: (item, monitor) => {
      console.log(monitor.getClientOffset(), monitor.getInitialClientOffset(), monitor.getDropResult())
      const coordinates = monitor.getClientOffset()
      coordinates && initailSetAnchor(item.tile, [coordinates.x, coordinates.y])
    },
    canDrop: (item: any) =>
      acceptedDotCount.some((dot: number) => item.tile.includes(dot)),
  });

  let coordinates = position;
  let measurementUnit = "px";
  if (position.some((item) => item > 0 && item < 1)) {
    coordinates = [position[0] * 100, position[1] * 100];
    measurementUnit = "%";
  }

  return (
    <div
      ref={drop}
      className={`h-56 w-56 rounded-2xl -translate-x-1/2 -translate-y-1/2 ${
        isOver ? "bg-main-orange/65" : "bg-transparent"
      }  `}
      style={{
        position: "absolute",
        top: `${coordinates[1]}${measurementUnit}`,
        left: `${coordinates[0]}${measurementUnit}`,
        transition: "background-color 100ms ease-in-out 10ms",
      }}
    />
  );
}

export default DropZone;
