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

      console.log("tileCoordinate", tileCoordinate);

      setAnchors((prevState) => [
        ...prevState,
        { coordinates: tileCoordinate, tile, tilt: 0 },
      ]);
    }
  };

  const finalSetAnchor = (tile: numberPair, coordinates: numberPair) => {
    setAnchors((prevState) =>
      prevState.map((state) =>
        state.tile.every((currentTile, i) => currentTile === tile[i]) ? ({...state, finalCoordinates: [350, 300]}) : state
      )
    );
  };

  useEffect(() => {
    console.log(anchors, anchors[anchors.length - 1]?.finalCoordinates);
    if (anchors.length > 0 && !anchors[anchors.length - 1].finalCoordinates) {
      finalSetAnchor(
        anchors[anchors.length - 1].tile,
        anchors[anchors.length - 1].coordinates
      );
    }
  }, [anchors]);

  return (
    <div
      id="play-board"
      ref={playBoard}
      className="absolute top-10 h-3/4 w-full bg-green-500"
    >
      {anchors.map(({finalCoordinates, coordinates, tile, tilt }, index) => (
        <Anchor key={index} {...{ finalCoordinates, coordinates, tile, tilt }} />
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
