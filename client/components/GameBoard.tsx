import React, { useState, useRef, useEffect } from "react";
import DropZone from "./DropZone";
import Anchor from "./Anchor";
import useMeasure from "react-use-measure";
import { numberPair, tileType } from "@/types";
import { useSocket } from "./SocketProvider";
import { useGameContext } from "./GameProvider";
import { useParams } from "next/navigation";
import { TileAlignSpec } from "@/utils/game-utils";

interface GameBoardProps {
  anchors: TileAlignSpec[];
  setAnchors: React.Dispatch<React.SetStateAction<TileAlignSpec[]>>;
}

const GameBoard: React.FC<GameBoardProps> = ({ anchors, setAnchors }) => {
  const [defaultDrop, setDefaultDrop] = useState<boolean>(true);
  const [playBoardRef, bounds] = useMeasure();
  const { socket } = useSocket();
  const { playerId, opponentWin, playerWin } = useGameContext();
  const { slug: gameId } = useParams();
  const activeHover = useRef<number | null>(null);
  const droppedTile = useRef<number | null>(null);
  const droppedOn = useRef<number | null>(null);

  // Get the center of the game board
  const getBoardCenter = (): numberPair => {
    const midX = (bounds.right - bounds.left) / 2;
    const midY = (bounds.bottom - bounds.top) / 2;
    return [midX, midY];
  };

  // Calculate the bounding area of all the tiles/anchors
  const calculateBoundingBox = (tiles: TileAlignSpec[]) => {
    console.log("tiles", tiles, tiles[0].coordinates);
    const xCoordinates = tiles.map((anchor) => anchor._coordinates[0]);
    const yCoordinates = tiles.map((anchor) => anchor._coordinates[1]);

    const minX = Math.min(...xCoordinates);
    const maxX = Math.max(...xCoordinates);
    const minY = Math.min(...yCoordinates);
    const maxY = Math.max(...yCoordinates);
    console.log("bounding cordinate", xCoordinates, yCoordinates);
    console.log("minX", minX, "minY", minY, "maxX", maxX, "maxY", maxY);

    return {
      minX,
      maxX,
      minY,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  };

  // Calculate the midpoint of the bounding box
  const getBoundingBoxMidpoint = (tiles: TileAlignSpec[]) => {
    const boundingBox = calculateBoundingBox(tiles);
    console.log("boundingBox", boundingBox);
    const midX = boundingBox.minX + boundingBox.width / 2;
    const midY = boundingBox.minY + boundingBox.height / 2;
    console.log("midpoit", midX, midY);
    return [midX, midY];
  };

  // Function to adjust anchors to center them on the board
  const adjustAnchorsToCenter = (tiles: TileAlignSpec[]) => {
    const [boardCenterX, boardCenterY] = getBoardCenter();
    const [boundingBoxMidX, boundingBoxMidY] = getBoundingBoxMidpoint(tiles);

    console.log("board", boardCenterX, boardCenterY);

    // Calculate the offset
    const offsetX = boardCenterX - boundingBoxMidX;
    const offsetY = boardCenterY - boundingBoxMidY;
    console.log("offset", offsetX, offsetY);

    // Adjust anchor positions by the offset
    setAnchors((prevAnchors) =>
      prevAnchors.map((anchor) => {
        anchor.coordinates = [
          anchor._coordinates[0] + offsetX,
          anchor._coordinates[1] + offsetY,
        ];
        return anchor;
      })
    );
  };

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
    setAnchors((prevState) => {
      // Check if the tile with the same ID already exists in the state
      const tileExists = prevState.some((anchor) => anchor.id === newTile.id);

      // If the tile exists, replace it; otherwise, add it
      if (tileExists) {
        return prevState.map((anchor) =>
          anchor.id === newTile.id ? newTile : anchor
        );
      }

      // If the tile doesn't exist, add it to the state
      return [...prevState, newTile];
    });

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
  console.log(anchors);
  useEffect(() => {
    if (anchors.length === 1) {
      const [midX, midY] = getBoardCenter();
      setAnchors((anchor) =>
        anchor.map((root) => {
          root.root = true;
          root.coordinates = [midX, midY];
          root.scale = 0.6;
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
        console.log(triggeredAnchor);
        const newDroppedAnchor = triggeredAnchor?.setConnection(droppedAnchor);
        console.log(newDroppedAnchor);
        if (newDroppedAnchor) {
          setAnchors((arr) => {
            const newArr = [...arr];
            newArr[droppedAnchorIndex] = newDroppedAnchor;
            console.log("newArr", newArr);
            // adjustAnchorsToCenter(newArr);
            return newArr;
          });
        }
      }
    }
  }, [anchors.length, bounds]);

  useEffect(() => {
    if (opponentWin || playerWin) {
      setAnchors([]);
    }
  }, [opponentWin, , playerWin]);

  const registerDrop = (count: number) => {
    if (count !== 0) setDefaultDrop(false);
  };

  return (
    <div
      id="play-board"
      ref={playBoardRef}
      className="absolute top-10 h-3/4 w-full z-0 "
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
};

export default GameBoard;
