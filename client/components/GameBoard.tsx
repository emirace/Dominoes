import React, { useState, useRef, useEffect } from "react";
import DropZone from "./DropZone";
import Anchor from "./Anchor";
import useMeasure from "react-use-measure";
import { numberPair, tileAlignSpecType, tileType } from "@/types";
import { calcVectorAngle } from "@/utils/game-utils";

const TILEGAP = 4; // gap between layed out tiles in px. this is also affected by scale

function getLayoutHeight(scale: number, peakYCoordinates: numberPair): number {
  return (peakYCoordinates[0] - peakYCoordinates[1]) * scale;
}

function tileAlignSpec(
  this: tileAlignSpecType,
  id: number,
  tile: numberPair,
  coordinates: numberPair,
  root: boolean = false
) {
  this.id = id;
  this.root = root;
  this.orientation = "vertical";
  this.scale = 1;
  this.tile = tile;
  this.isDouble = this.tile[0] === this.tile[1];
  this.coordinates = coordinates;
  this.connectedAt;
  this.connections = [];
  // this.setConnection = (
  //   to,
  //   tile,
  //   scale,
  //   branchHeight,
  //   branchWidth,
  //   maxLayoutHeight,
  //   maxLayoutWidth
  // ) => {
  //   const getAttachedTileCoordinate = () => {
  //     if (this.orientation === "vertical") {
  //       let attachedTileCoordinate: numberPair;
  //       if (
  //         tile[0] === tile[1] ||
  //         branchHeight + (120 + TILEGAP) * scale > maxLayoutHeight
  //       )
  //         attachedTileCoordinate = [
  //           tile[0] === tile[1] ? this.coordinates[0] : ,
  //           this.coordinates[1] + 60 + 30 + TILEGAP,
  //         ];
  //     } else {
  //       // assumes this.orientation === "horizontal"

  //     }
  //   };
  //   /*
  //   Check 1: Default Positioning -- Check if the tile layout would fit in the playBoard Rect if dropped tiles is placed at the default position
  //   Default position are connected at [[1], [?]] or [[?], [1]] for mixed and doubles.
  //   This is default position rule apply to all tile type except for spinners/root tile

  //   If this check is true, a default connection is made else Check 2 is done

  //   */
  //   const check1: () => boolean = () => {
  //     if (this.orientation === "vertical") {
  //       if (tile[0] === tile[1])
  //         return (
  //           branchHeight + (60 + TILEGAP) * scale < maxLayoutHeight &&
  //           branchWidth + (30 + TILEGAP) * scale < maxLayoutWidth
  //         );
  //       else
  //         return (
  //           branchHeight + (120 + TILEGAP) * scale < maxLayoutHeight ||
  //           branchHeight + (60 + TILEGAP) * scale < maxLayoutHeight
  //         );
  //     } else {
  //       // assumes this.orientation === "horizontal"
  //       if (tile[0] === tile[1])
  //         return (
  //           branchWidth + (60 + TILEGAP) * scale < maxLayoutHeight &&
  //           branchHeight + (30 + TILEGAP) * scale < maxLayoutWidth
  //         );
  //       else
  //         return (
  //           branchWidth + (120 + TILEGAP) * scale < maxLayoutWidth ||
  //           branchWidth + (60 + TILEGAP) * scale < maxLayoutWidth
  //         );
  //     }
  //   };
  //   /*

  //   Check 2: Consider Likely Options Based On Drop Preference -- Check if creating a branch based on drop preference would fit in the playBoard Rect
  //   Branches are connected at [[2 or 3], [?]] or [[?], [2 or 3]] for mixed and doubles.

  //    If this check is true, the connection is made else Check 3 is done

  //    */
  //   /*

  //   Check 3: Consider Other Likely Options -- Check if creating a branch would fit in the playBoard Rect
  //   Branches are connected at [[2 or 3], [?]] or [[?], [2 or 3]] for mixed and doubles.

  //    If this check is true, the connection is made else Check 4 is done

  //    */

  //   // Check 4:
  //   // Scale Down:

  //   if (check1()) {
  //     if (this.isDouble) this.connectedAt = [[0], [0]];
  //     else this.connectedAt[this.tile.indexOf(to)] = [1];
  //   }
  // };
  // this.attach = (connectAt) => {
  //   const newTile = new (tileAlignSpec as any)(tile) as tileAlignSpecType;
  // };

  this.calcDropLocation = (vec) => {
    const vec1 = this.coordinates.map(
      (point, index) => point - vec[index]
    ) as numberPair;
    if (this.orientation === "vertical") {
      console.log(vec1);
      const angle = calcVectorAngle(vec1, [0, 1]);
      if (angle >= 0 && angle <= 45) return "top";
      else if (angle > 45 && vec1[0] > 0) return "right";
      else if (angle >= 135) return "bottom";
      else if (angle > 45 && vec1[0] < 0) return "left";
    } else {
      const angle = calcVectorAngle(vec1, [1, 0]);
      if (angle >= 0 && angle <= 45) return "left";
      else if (angle > 45 && vec1[1] > 0) return "top";
      else if (angle >= 135) return "right";
      else if (angle > 45 && vec1[1] < 0) return "bottom";
    }
  };
}

function GameBoard() {
  const [anchors, setAnchors] = useState<tileAlignSpecType[]>([]);
  const [defaultDrop, setDefaultDrop] = useState<boolean>(false);
  const [playBoardRef, bounds] = useMeasure();
  const activeHover = useRef<number | null>(null);
  const droppedTile = useRef<number | null>(null);
  const droppedOn = useRef<number | null>(null);

  const initailSetAnchor = (
    tile: tileType,
    coordinates: numberPair,
    id: number
  ) => {
    const tileCoordinate: numberPair = [
      coordinates[0] - bounds.x,
      coordinates[1] - bounds.y,
    ];
    const newTile = new (tileAlignSpec as any)(
      tile.id,
      tile.tile,
      tileCoordinate
    );
    setAnchors((prevState) => [...prevState, newTile]);
    droppedTile.current = tile.id;
    droppedOn.current = id;
  };

  useEffect(() => {
    if (anchors.length === 0) setDefaultDrop(true);
    else if (anchors.length === 1) {
      const [midX, midY] = [
        (bounds.right - bounds.left) / 2,
        (bounds.bottom - bounds.top) / 2,
      ];
      setAnchors((anchor) =>
        anchor.map((root) => {
          root.root = true;
          root.coordinates = [midX - 30, midY - 60];
          root.scale = 0.95;
          root.orientation =
            root.tile[0] === root.tile[1] ? "vertical" : "horizontal";
          return root;
        })
      );
      setDefaultDrop(false);
    } else {
      if (droppedTile.current !== -1) {
        console.log(
          anchors
            .find((anchor) => anchor.id === droppedOn.current)
            ?.calcDropLocation(
              anchors.find((anchor) => anchor.id === droppedTile.current)
                ?.coordinates as numberPair
            )
        );
      }
    }
  }, [anchors.length, bounds]);
  // console.log(anchors.length, defaultDrop);

  return (
    <div
      id="play-board"
      ref={playBoardRef}
      className="absolute top-10 h-3/4 w-full "
    >
      {anchors.map(({ coordinates, tile, orientation, scale, id }, index) => (
        <Anchor
          key={index}
          {...{
            coordinates,
            tile: { id, tile },
            tilt: orientation === "vertical" ? 0 : 90,
            scale,
            initailSetAnchor,
            activeHover,
          }}
        />
      ))}
      {defaultDrop && (
        <DropZone
          {...{
            position: [
              (bounds.right - bounds.left) / 2,
              (bounds.bottom - bounds.top) / 2,
            ],
            acceptedDotCount: [1, 2, 3, 4, 5, 6],
            initailSetAnchor,
            activeHover,
            id: -1,
            scale: 1,
          }}
        />
      )}
    </div>
  );
}

export default GameBoard;
