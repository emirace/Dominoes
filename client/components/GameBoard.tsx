import React, { useState, useRef, useEffect } from "react";
import DropZone from "./DropZone";
import Anchor from "./Anchor";
import {
  numberPair,
  AnchorProp,
  DropZoneProp,
  tileAlignSpecType,
} from "@/types";

const TILEGAP = 4; // gap between layed out tiles in px. this is also affected by scale

function getLayoutHeight(scale: number, peakYCoordinates: numberPair): number {
  return (peakYCoordinates[0] - peakYCoordinates[1]) * scale;
}

function tileAlignSpec(
  this: tileAlignSpecType,
  tile: numberPair,
  root: boolean = false
) {
  this.root = root;
  this.orientation = this.getOrientation();
  this.tile = tile;
  this.isDouble = this.tile[0] === this.tile[1];
  this.coordinates;
  this.connectedAt;
  this.connections = [];
  this.setConnection = (
    to,
    tile,
    scale,
    branchHeight,
    branchWidth,
    maxLayoutHeight,
    maxLayoutWidth
  ) => {
    /* 
    Check 1: Default Positioning -- Check if the tile layout would fit in the playBoard Rect if dropped tiles is placed at the default position
    Default position are connected at [[1], [?]] or [[?], [1]] for mixed and doubles. 
    This is default position rule apply to all tile type except for spinners/root tile 
    
    If this check is true, a default connection is made else Check 2 is done

    */
    const check1: () => boolean = () => {
      if (this.orientation === "vertical") {
        return (
          branchHeight + (120 + TILEGAP) * scale < maxLayoutHeight ||
          branchHeight + (60 + TILEGAP) * scale < maxLayoutHeight
        );
      } else {
        // assumes this.orientation === "horizontal"
        return (
          branchWidth + (120 + TILEGAP) * scale < maxLayoutWidth ||
          branchWidth + (60 + TILEGAP) * scale < maxLayoutWidth
        );
      }
    };
    /* 

    Check 2: Consider Likely Options Based On Drop Preference -- Check if creating a branch based on drop preference would fit in the playBoard Rect
    Branches are connected at [[2 or 3], [?]] or [[?], [2 or 3]] for mixed and doubles.  

     If this check is true, the connection is made else Check 3 is done

     */
    /*

    Check 3: Consider Other Likely Options -- Check if creating a branch would fit in the playBoard Rect
    Branches are connected at [[2 or 3], [?]] or [[?], [2 or 3]] for mixed and doubles.  

     If this check is true, the connection is made else Check 4 is done

     */

    // Check 4:
    // Scale Down:

    if (check1()) {
      if (this.isDouble) this.connectedAt = [[0], [0]];
      else this.connectedAt[this.tile.indexOf(to)] = [1];
      const newTile = new (tileAlignSpec as any)(tile) as tileAlignSpecType;
      newTile.attach();
      this.connections.push(newTile);
    }
  };
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
              : { ...anchor, coordinates: [60, 40], tilt: 90, scale: 0.8 }
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
