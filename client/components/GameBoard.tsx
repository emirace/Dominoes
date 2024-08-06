import React, { useState, useRef, useEffect } from "react";
import DropZone from "./DropZone";
import Anchor from "./Anchor";
import { numberPair, AnchorProp, DropZoneProp } from "@/types";

function calcTileAlignment() {
  // Left,
}

function GameBoard() {
  const [dropZones, setDropZones] = useState<
    Omit<DropZoneProp, "initailSetAnchor">[]
  >([{ acceptedDotCount: [1, 2, 3, 4, 5, 6], position: [0.5, 0.5] }]);

  const [anchors, setAnchors] = useState<AnchorProp[]>([]);
  const playBoard = useRef<HTMLDivElement | null>(null);

  const initailSetAnchor = (tile: numberPair, coordinates: numberPair) => {
    const boardBoundingPosition = playBoard.current?.getBoundingClientRect();
    if (boardBoundingPosition) {
      const tileCoordinate: numberPair = [
        coordinates[0] - boardBoundingPosition?.x,
        coordinates[1] - boardBoundingPosition?.y,
      ];
      setAnchors((prevState) => [
        ...prevState,
        { coordinates: tileCoordinate, tile, tilt: 0, scale: 1 },
      ]);
    }
  };

  useEffect(() => {
    const finalSetAnchor = () => {
      if (anchors.length) {
        setAnchors((prevState) =>
          prevState.map((anchor, index) =>
            index !== anchors.length - 1
              ? anchor
              : { ...anchor, coordinates: [60, 40], tilt: 90, scale: .8 }
          )
        );
      }
    };

    finalSetAnchor();
  }, [anchors.length]);

  return (
    <div
      id="play-board"
      ref={playBoard}
      className="absolute top-10 h-3/4 w-full"
    >
      {anchors.map(({ coordinates, tile, tilt, scale }, index) => (
        <Anchor key={index} {...{ coordinates, tile, tilt, scale }} />
      ))}
      {dropZones.map(({ position, acceptedDotCount }, index) => (
        <DropZone
          key={index}
          {...{ position, acceptedDotCount, initailSetAnchor }}
        />
      ))}
    </div>
  );
}

export default GameBoard;
