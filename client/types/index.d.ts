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
  size?: string
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

interface GameContextType {
  draggedTile: tileType | null;
  setDraggedTile: React.Dispatch<React.SetStateAction<TileType>>;
  recentlyDroppedTile: tileType | null;
  setRecentlyDroppedTile: React.Dispatch<React.SetStateAction<tileType | null>>;
  playerDeck: tileType[];
  setPlayerDeck: React.Dispatch<React.SetStateAction<tileType[]>>;
  selectFromBoneYard: () => tileType;
  activateBoneYard: boolean;
  setActivateBoneYard: React.Dispatch<React.SetStateAction<boolean>>;
  drawFromBoneYardClb: React.MutableRefObject<
    ((position: numberPair) => void) | null
  >;
  requestTile: (callback: (position: numberPair) => void) => void;
  permits: number[];
  setPermits: React.Dispatch<React.SetStateAction<number[]>>;
}

declare global {
  interface Window {
    tronWeb: any;
  }
}
