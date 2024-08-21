import { RectReadOnly } from "react-use-measure";

export interface User {
  _id: number;
  username: string;
  address: string;
  games: Game[];
}

export interface Game {
  gameId: string;
  isPrivate: boolean;
  players: User[];
}

export interface AnchorProp {
  coordinates: numberPair;
  tile: tileType;
  tilt: number;
  scale: number;
  initailSetAnchor: (
    tile: tileType,
    coordinates: numberPair,
    id: number
  ) => void;
  activeHover: React.MutableRefObject<number | null>;
}

export type numberPair = [number, number];
export type tileType = { id: number; tile: numberPair };

export interface DominoesTileProps {
  tile: tileType;
  size?: string;
}
export interface DropZoneProp {
  acceptedDotCount: number[];
  position: numberPair | null;
  initailSetAnchor: (
    tile: tileType,
    coordinates: numberPair,
    id: number
  ) => void;
  activeHover: React.MutableRefObject<number | null>;
  id: number;
  scale: number;
}

export interface tileAlignSpecType {
  id: number;
  root: boolean;
  orientation: string;
  scale: number;
  tile: numberPair;
  isDouble: boolean;
  coordinates: numberPair;
  connectedAt: [[number], [number]];
  connections: tileAlignSpec[];
  setConnection: (
    to: number,
    tile: numberPair,
    scale: number,
    branchHeight: number,
    branchWidth: number,
    maxLayoutHeight: number,
    maxLayoutWidth: number
  ) => void;
  attach: any;
  calcDropLocation: (vec: numberPair) => string | undefined;
}

export interface boneYardDistSpecType {
  active: boolean;
  distribute: boolean;
  instant: boolean;
  drawAmount: number;
  required: number[] | null;
  callbacks: ((position: numberPair) => tileType|undefined)[];
}

export interface GameContextType {
  draggedTile: tileType | null;
  setDraggedTile: React.Dispatch<React.SetStateAction<TileType>>;
  recentlyDroppedTile: tileType | null;
  setRecentlyDroppedTile: React.Dispatch<React.SetStateAction<tileType | null>>;

  selectFromBoneYard: () => tileType;

  permits: number[];
  setPermits: React.Dispatch<React.SetStateAction<number[]>>;

  boneYardDistSpec: boneYardDistSpecType;
  setBoneYardDistSpec: React.Dispatch<
    React.SetStateAction<boneYardDistSpecType>
  >;
  registerDistCallback: (callback: (position: numberPair) => tileType|undefined) => number;
  unRegisterDistCallback: (index: number) => void;
  requestTile: (
    instant: boolean,
    callbackID: number,
    required?: number[],
    amount?: number,
  ) => void;
}

export type useDistributorType = [
  tileType[],
  React.Dispatch<SetStateAction<tileType[]>>,
  numberPair | undefined,
  MutableRefObject<HTMLDivElement | null>,
  (amount?: number) => void
];

declare global {
  interface Window {
    tronWeb: any;
  }
}
