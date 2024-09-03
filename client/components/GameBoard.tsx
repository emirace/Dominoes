import React, { useState, useRef, useEffect } from "react";
import DropZone from "./DropZone";
import Anchor from "./Anchor";
import useMeasure from "react-use-measure";
import { numberPair, tileType } from "@/types";
import { useSocket } from "./SocketProvider";
import { useGameContext } from "./GameProvider";
import { useParams } from "next/navigation";
import { TileAlignSpec } from "@/utils/game-utils";

function GameBoard() {
  const [anchors, setAnchors] = useState<TileAlignSpec[]>([]);
  const [defaultDrop, setDefaultDrop] = useState<boolean>(true);
  const [playBoardRef, bounds] = useMeasure();
  const { socket } = useSocket();
  const { playerId, setIsTurn, isTurn } = useGameContext();
  const { slug: gameId } = useParams();
  const activeHover = useRef<number | null>(null);
  const droppedTile = useRef<number | null>(null);
  const droppedOn = useRef<number | null>(null);

  const initailSetAnchor = (
    tile: tileType,
    coordinates: numberPair,
    id: number,
    isOpponent = false
  ) => {
    const tileCoordinate: numberPair = [
      coordinates[0] - bounds.x,
      coordinates[1] - bounds.y,
    ];
    const newTile = new TileAlignSpec(tile, tileCoordinate);
    console.log("gcfcutfut", newTile);
    setAnchors((prevState) => [...prevState, newTile]);
    droppedTile.current = tile.id;
    droppedOn.current = id;

    if (!isOpponent) {
      const triggeredAnchor = anchors.find(
        (anchor) => anchor.id === droppedOn.current
      );

      socket?.emit("tilePlayed", {
        gameId,
        playerId,
        droppedTile: newTile,
        triggeredTile: triggeredAnchor,
      });
    }
  };

  useEffect(() => {
    if (anchors.length === 1) {
      const [midX, midY] = [
        (bounds.right - bounds.left) / 2,
        (bounds.bottom - bounds.top) / 2,
      ];
      setAnchors((anchor) =>
        anchor.map((root) => {
          root.root = true;
          root.coordinates = [midX, midY];
          root.scale = 1;
          root.tilt = root.tile[0] === root.tile[1] ? 0 : 90;
          return root;
        })
      );
      setDefaultDrop(false);
    } else {
      if (droppedTile.current !== -1) {
        const triggeredAnchor = anchors.find(
          (anchor) => anchor.id === droppedOn.current
        );

        const droppedAnchorIndex = anchors.findIndex(
          (anchor) => anchor.id === droppedTile.current
        );
        const droppedAnchor = anchors[droppedAnchorIndex];
        const newDroppedAnchor = triggeredAnchor?.setConnection(droppedAnchor);

        if (newDroppedAnchor) {
          setAnchors((arr) => {
            const newArr = [...arr];
            newArr[droppedAnchorIndex] = newDroppedAnchor;
            return newArr;
          });
        }
      }
    }
  }, [anchors.length, bounds]);

  const registerDrop = (count: number) => {
    if (count !== 0) setDefaultDrop(false);
  };
  return (
    <div
      id="play-board"
      ref={playBoardRef}
      className="absolute top-10 h-3/4 w-full z-0"
    >
      {anchors.map(
        ({ root, coordinates, canAccept, tile, tilt, scale, id }) => (
          <>
            <Anchor
              key={id}
              {...{
                root,
                coordinates,
                tile: { id, tile },
                tilt,
                canAccept,
                scale,
                initailSetAnchor,
                activeHover,
              }}
            />
            <div
              className="w-1 h-1 bg-red-900 absolute z-50"
              style={{
                top: (bounds.bottom - bounds.top) / 2,
                right: (bounds.right - bounds.left) / 2,
              }}
            ></div>
          </>
        )
      )}
      {defaultDrop && (
        <DropZone
          {...{
            position: [
              (bounds.right - bounds.left) / 2,
              (bounds.bottom - bounds.top) / 2,
            ],
            initailSetAnchor,
            activeHover,
            id: 0,
            scale: 1,
            registerDrop,
          }}
        />
      )}
    </div>
  );
}

export default GameBoard;
