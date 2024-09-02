import React, { useState, useRef, useEffect } from "react";
import DropZone from "./DropZone";
import Anchor from "./Anchor";
import useMeasure from "react-use-measure";
import { numberPair, tileAlignSpecType, tileType } from "@/types";
import { calcVectorAngle, calcDotProduct } from "@/utils/game-utils";
import { availableMemory } from "process";
import { useSocket } from "./SocketProvider";
import { useGameContext } from "./GameProvider";
import { useParams } from "next/navigation";

const TILEGAP = 4; // gap between layed out tiles in px. this is also affected by scale

function getLayoutHeight(scale: number, peakYCoordinates: numberPair): number {
  return (peakYCoordinates[0] - peakYCoordinates[1]) * scale;
}

class TileAlignSpec {
  /*
  Tile Positioning and Alignment 
  spec = [firstHalf, secondHalf, rightSide, leftSide] 
  where spec is a shape of the conneccurrenttions when the tile is upright (0deg), 
  
  e.g when the tile is at 90deg tilt, the firstHalf is on the right,
  the secondHalf is on the left and so on 
  
  0deg = [top, bottom, left, right]
  90deg = [right, left, top, bottom]
  -90deg = [left, right, bottom, top]
  180deg = [bottom, top, right, left]
  */

  id: number;
  root: boolean;
  private _tilt: 0 | 90 | -90 | 180 = 0;
  scale: number;
  tile: numberPair;
  isDouble: boolean;
  _coordinates: numberPair = [0, 0];
  private _connectedAt: number[];
  private _orientationSpec = {
    "0deg": ["top", "bottom", "left", "right"],
    "90deg": ["right", "left", "top", "bottom"],
    "-90deg": ["left", "right", "bottom", "top"],
    "180deg": ["bottom", "top", "right", "left"],
  };
  private GAP = 3;

  constructor(tile: tileType, coordinates: numberPair, root: boolean = false) {
    this.id = tile.id;
    this.root = root;
    this.scale = 1;
    this.tile = tile.tile;
    this.isDouble = this.tile[0] === this.tile[1];
    this.coordinates = coordinates;
    this._connectedAt = [];

    console.info(
      `${this.root ? "A root anchor" : "An anchor"} with a ${
        this.isStepper ? "stepper" : this.isDouble ? "double" : "mixed"
      } tile was created at ${this._coordinates}`
    );
  }

  get isStepper() {
    return this.root && this.isDouble;
  }

  private get _connectionSpec(): (0 | 1)[] {
    return this.isStepper
      ? [1, 1, 1, 1]
      : this.isDouble
      ? [0, 0, 1, 1]
      : [1, 1, 0, 0];
  }

  get coordinates(): numberPair {
    const [val1, val2] = this._coordinates;
    return [val1 - 30, val2 - 60];
  }

  set coordinates(value: numberPair) {
    this._coordinates = value;
  }

  get canAccept() {
    return this.tile.filter((element) => !this._connectedAt.includes(element));
  }

  set tilt(value: 0 | 90 | -90 | 180) {
    this._tilt = value;
  }

  get tilt() {
    return this._tilt;
  }

  private _getAvailableDropPosition(
    connectingHalveIndex: number,
    dropSide: string
  ) {
    const orientation = this._orientationSpec[`${this.tilt}deg`];
    const connectingDotCount = this.tile[connectingHalveIndex];
    let actualDropPosition: [string] = [""];
    console.log(orientation, this.tilt);
    if (!this.isDouble) {
      if (this._connectionSpec[connectingHalveIndex]) {
        this._connectionSpec[connectingHalveIndex] = 0;
        this._connectedAt.push(connectingDotCount);
        actualDropPosition = [orientation[connectingHalveIndex]];
      } else
        console.error(
          `Couldn't index _connectioSpec with index ${connectingHalveIndex}`
        );
    } else {
      const connectingHalveIndex = orientation.indexOf(dropSide);

      if (this._connectionSpec[connectingHalveIndex]) {
        this._connectionSpec[connectingHalveIndex] = 0;
        this._connectedAt.push(connectingDotCount);
        actualDropPosition = [orientation[connectingHalveIndex]]; // = dropSide
      } else {
        const availableHalveIndex = this._connectionSpec.indexOf(1);
        if (availableHalveIndex !== -1) {
          this._connectionSpec[connectingHalveIndex] = 0;
          this._connectedAt.push(connectingDotCount);
          actualDropPosition = [orientation[availableHalveIndex]];
        } else console.error("couldn't find '1' in _connectionSpec");
      }
    }

    console.info(
      `A connection should be made on the ${actualDropPosition} of tile with id ${this.id}`
    );
    return actualDropPosition;
  }

  private _calcBoundingBorder(position: string) {
    let coordinates: numberPair = [0, 0];
    if (this._tilt === 0 || this.tilt === 180) {
      switch (position) {
        case "top":
          coordinates = [
            this._coordinates[0],
            this._coordinates[1] - (60 + this.GAP) * this.scale,
          ];
          break;
        case "bottom":
          coordinates = [
            this._coordinates[0],
            this._coordinates[1] + (60 + this.GAP) * this.scale,
          ];
          break;
        case "left":
          coordinates = [
            this._coordinates[0] - (30 + this.GAP) * this.scale,
            this._coordinates[1],
          ];
          break;
        case "right":
          coordinates = [
            this._coordinates[0] + (30 + this.GAP) * this.scale,
            this._coordinates[1],
          ];
          break;
      }
    } else {
      switch (position) {
        case "top":
          coordinates = [
            this._coordinates[0],
            this._coordinates[1] - (30 + this.GAP) * this.scale,
          ];
          break;
        case "bottom":
          coordinates = [
            this._coordinates[0],
            this._coordinates[1] + (30 + this.GAP) * this.scale,
          ];
          break;
        case "left":
          coordinates = [
            this._coordinates[0] - (60 + this.GAP) * this.scale,
            this._coordinates[1],
          ];
          break;
        case "right":
          coordinates = [
            this._coordinates[0] + (60 + this.GAP) * this.scale,
            this._coordinates[1],
          ];
          break;
      }
    }

    console.info(`Boundary cordinate at ${coordinates}`);
    return coordinates;
  }

  private _calcRelativeDropPosition([cor1, cor2]: numberPair): string {
    const vec = [
      (this._coordinates[0] - cor1) * -1,
      this._coordinates[1] - cor2,
    ] as numberPair;

    let position: string = "";
    const angle = calcVectorAngle(vec, [0, 100]);
    if (angle >= 0 && angle <= 45) position = "top";
    else if (angle > 45 && angle < 135) {
      if (vec[0] > 0) position = "right";
      else position = "left";
    } else position = "bottom";

    console.info(`A tile was dropped at the ${position} of another tile`);
    return position;
  }

  setConnection(tileSpec: TileAlignSpec) {
    const { _coordinates, tile: incomingTile } = tileSpec;
    const relativePosition = this._calcRelativeDropPosition(_coordinates);
    const connectingHalveIndex = this.tile.indexOf(
      this.tile.find((num) => incomingTile.includes(num)) as number
    ) as 0 | 1;
    const availableDropPosition = this._getAvailableDropPosition(
      connectingHalveIndex,
      relativePosition
    );
    const attachBoundaryCoordinates = this._calcBoundingBorder(
      ...availableDropPosition
    );
    const newConnection = new TileAlignSpec(
      { id: tileSpec.id, tile: tileSpec.tile },
      attachBoundaryCoordinates
    );
    newConnection.setIn(
      ...availableDropPosition,
      connectingHalveIndex,
      this.scale
    );
    return newConnection;
  }

  setIn(conectingPosition: string, connectingHalveIndex: 1 | 0, scale: number) {
    let tilt: 0 | 90 | -90 | 180 = 0;
    let boundaryExtensionCoordinates: numberPair = this._coordinates;
    if (!connectingHalveIndex) {
      switch (conectingPosition) {
        case "top":
          tilt = 180;
          boundaryExtensionCoordinates[1] -= 60 * scale;
          break;
        case "bottom":
          tilt = 0;
          boundaryExtensionCoordinates[1] += 60 * scale;
          break;
        case "left":
          tilt = 90;
          boundaryExtensionCoordinates[0] -= 60 * scale;
          break;
        case "right":
          tilt = -90;
          boundaryExtensionCoordinates[0] += 60 * scale;
          break;
      }
    } else {
      switch (conectingPosition) {
        case "top":
          tilt = 0;
          boundaryExtensionCoordinates[1] -= 60 * scale;
          break;
        case "bottom":
          tilt = 180;
          boundaryExtensionCoordinates[1] += 60 * scale;
          break;
        case "left":
          tilt = -90;
          boundaryExtensionCoordinates[0] -= 60 * scale;
          break;
        case "right":
          tilt = 90;
          boundaryExtensionCoordinates[0] += (60 + this.GAP) * scale;
          break;
      }
    }

    this.coordinates = boundaryExtensionCoordinates;
    this.tilt = tilt;
    this.scale = scale;
    console.info(`Anchor ${this.id} set in at ${this.coordinates}`);
  }
}

function GameBoard() {
  const [anchors, setAnchors] = useState<TileAlignSpec[]>([]);
  const [defaultDrop, setDefaultDrop] = useState<boolean>(true);
  const [playBoardRef, bounds] = useMeasure();
  const { socket } = useSocket();
  const { playerId, setIsTurn } = useGameContext();
  const { slug: gameId } = useParams();
  const dynamicTileBound = useRef<numberPair>([0, 0]);
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
    const newTile = new TileAlignSpec(tile, tileCoordinate);
    setAnchors((prevState) => [...prevState, newTile]);
    droppedTile.current = tile.id;
    droppedOn.current = id;
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
      const triggeredAnchor = anchors.find(
        (anchor) => anchor.id === droppedOn.current
      );

      const droppedAnchor = anchors.find(
        (anchor) => anchor.id === droppedTile.current
      );

      socket?.emit("tilePlayed", {
        gameId,
        playerId,
        droppedTile: droppedAnchor,
        triggeredTile: triggeredAnchor,
      });
      setIsTurn(false);
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

          socket?.emit("tilePlayed", {
            gameId,
            playerId,
            droppedTile: droppedAnchor,
            triggeredTile: triggeredAnchor,
          });
          setIsTurn(false);
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
