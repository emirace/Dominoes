import React from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { DropZoneProp } from "@/types";

function DropZone({
  acceptedDotCount,
  position,
  initailSetAnchor,
  activeHover,
  index,
}: DropZoneProp) {
  const dropSpec = {
    accept: "DOMINOTILE",
    collect: (monitor: DropTargetMonitor<any, void>) => ({
      canDrop: monitor.canDrop() && monitor.isOver(),
    }),
    hover: () => {
      console.log("hovering dropzone at index ", index);
      if (activeHover.current === -1) activeHover.current = index;
    },
    drop: (item: any, monitor: DropTargetMonitor<any, void>) => {
      const coordinates = monitor.getClientOffset();
      coordinates &&
        initailSetAnchor(item.tile, [coordinates.x, coordinates.y]);
    },
    canDrop: (item: any) =>
      acceptedDotCount.some((dot: number) => item.tile.includes(dot)),
  };

  const [{ canDrop }, drop] = useDrop(dropSpec);

  const handleDragLeave = () => {
    activeHover.current = -1;
  };

  let coordinates = position;
  let measurementUnit = "px";
  if (position.some((item) => item > 0 && item < 1)) {
    coordinates = [position[0] * 100, position[1] * 100];
    measurementUnit = "%";
  }

  return (
    <div
      ref={drop}
      onDragLeave={handleDragLeave}
      className={`h-56 w-56 rounded-2xl -translate-x-1/2 -translate-y-1/2 ${
        canDrop ? "bg-main-orange/65" : "bg-transparent"
      }  `}
      style={{
        position: "absolute",
        top: `${coordinates[1]}${measurementUnit}`,
        left: `${coordinates[0]}${measurementUnit}`,
        transition: "background-color 100ms ease-in-out 10ms",
        zIndex: activeHover.current === index ? 1 : 0,
      }}
    />
  );
}

export default DropZone;
