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

// function tileAlignSpec(
//   this: tileAlignSpecType,
//   tile: numberPair,
//   root: boolean = false
// ) {
//   this.root = root;
//   this.orientation = this.getOrientation();
//   this.tile = tile;
//   this.isDouble = this.tile[0] === this.tile[1];
//   this.coordinates;
//   this.connectedAt;
//   this.connections = [];
//   this.setConnection = (
//     to,
//     tile,
//     scale,
//     branchHeight,
//     branchWidth,
//     maxLayoutHeight,
//     maxLayoutWidth
//   ) => {
//     const getAttachedTileCoordinate = () => {
//       if (this.orientation === "vertical") {
//         let attachedTileCoordinate: numberPair;
//         if (
//           tile[0] === tile[1] ||
//           branchHeight + (120 + TILEGAP) * scale > maxLayoutHeight
//         )
//           attachedTileCoordinate = [
//             tile[0] === tile[1] ? this.coordinates[0] : ,
//             this.coordinates[1] + 60 + 30 + TILEGAP,
//           ];
//       } else {
//         // assumes this.orientation === "horizontal"

//       }
//     };
//     /*
//     Check 1: Default Positioning -- Check if the tile layout would fit in the playBoard Rect if dropped tiles is placed at the default position
//     Default position are connected at [[1], [?]] or [[?], [1]] for mixed and doubles.
//     This is default position rule apply to all tile type except for spinners/root tile

//     If this check is true, a default connection is made else Check 2 is done

//     */
//     const check1: () => boolean = () => {
//       if (this.orientation === "vertical") {
//         if (tile[0] === tile[1])
//           return (
//             branchHeight + (60 + TILEGAP) * scale < maxLayoutHeight &&
//             branchWidth + (30 + TILEGAP) * scale < maxLayoutWidth
//           );
//         else
//           return (
//             branchHeight + (120 + TILEGAP) * scale < maxLayoutHeight ||
//             branchHeight + (60 + TILEGAP) * scale < maxLayoutHeight
//           );
//       } else {
//         // assumes this.orientation === "horizontal"
//         if (tile[0] === tile[1])
//           return (
//             branchWidth + (60 + TILEGAP) * scale < maxLayoutHeight &&
//             branchHeight + (30 + TILEGAP) * scale < maxLayoutWidth
//           );
//         else
//           return (
//             branchWidth + (120 + TILEGAP) * scale < maxLayoutWidth ||
//             branchWidth + (60 + TILEGAP) * scale < maxLayoutWidth
//           );
//       }
//     };
//     /*

//     Check 2: Consider Likely Options Based On Drop Preference -- Check if creating a branch based on drop preference would fit in the playBoard Rect
//     Branches are connected at [[2 or 3], [?]] or [[?], [2 or 3]] for mixed and doubles.

//      If this check is true, the connection is made else Check 3 is done

//      */
//     /*

//     Check 3: Consider Other Likely Options -- Check if creating a branch would fit in the playBoard Rect
//     Branches are connected at [[2 or 3], [?]] or [[?], [2 or 3]] for mixed and doubles.

//      If this check is true, the connection is made else Check 4 is done

//      */

//     // Check 4:
//     // Scale Down:

//     if (check1()) {
//       if (this.isDouble) this.connectedAt = [[0], [0]];
//       else this.connectedAt[this.tile.indexOf(to)] = [1];

//       newTile.attach();
//       this.connections.push(newTile);
//     }
//   };
//   this.attach = (connectAt) => {
//     const newTile = new (tileAlignSpec as any)(tile) as tileAlignSpecType;

//   };
// }

function GameBoard() {
  const [dropZones, setDropZones] = useState<
    Omit<DropZoneProp, "initailSetAnchor" | "activeHover" | "index">[]
  >([
    { acceptedDotCount: [1, 2, 3, 4, 5, 6], position: [0.5, 0.5] },
    { acceptedDotCount: [1, 2, 3, 4, 5, 6], position: [0.45, 0.45] },
  ]);

  const [anchors, setAnchors] = useState<AnchorProp[]>([]);
  const playBoard = useRef<HTMLDivElement | null>(null);
  const activeHover = useRef<number>(-1);

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
      const boardBoundingPosition = playBoard.current?.getBoundingClientRect();
      if (anchors.length && boardBoundingPosition) {
        const midX =
          (boardBoundingPosition.right - boardBoundingPosition.left) / 2;
        const midY =
          (boardBoundingPosition.bottom - boardBoundingPosition.top) / 2;
        setAnchors((prevState) =>
          prevState.map((anchor, index) =>
            index !== anchors.length - 1
              ? anchor
              : prevState.length === 1
              ? {
                  ...anchor,
                  coordinates: [midX - 30, midY - 60],
                  tilt: 90,
                  scale: 0.9,
                }
              : prevState.length === 2
              ? {
                  ...anchor,
                  coordinates: [midX - 114, midY - 60],
                  tilt: 0,
                  scale: 0.9,
                }
              : {
                  ...anchor,
                  coordinates: [midX + 54, midY - 60],
                  tilt: 0,
                  scale: 0.9,
                }
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
      className="absolute top-10 h-3/4 w-full "
    >
      {anchors.map(({ coordinates, tile, tilt, scale }, index) => (
        <Anchor key={index} {...{ coordinates, tile, tilt, scale }} />
      ))}
      {dropZones.map(({ position, acceptedDotCount }, index) => (
        <DropZone
          key={index}
          {...{
            position,
            acceptedDotCount,
            initailSetAnchor,
            activeHover,
            index,
          }}
        />
      ))}
    </div>
  );
}

export default GameBoard;
