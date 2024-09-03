import { numberPair } from "./index.d";
import { RectReadOnly } from "react-use-measure";

export interface User {
  _id: string;
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
  root: boolean;
  coordinates: numberPair;
  tile: tileType;
  canAccept: number[];
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
  registerDrop: (count: number) => void;
  position: numberPair | null;
  initailSetAnchor: (
    tile: tileType,
    coordinates: numberPair,
    id: number,
    isOpponent?: boolean
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
  callbacks: ((position: numberPair) => tileType | undefined)[];
}

export type PlayerId = -1 | 0 | 1;

export interface GameContextType {
  draggedTile: tileType | null;
  setDraggedTile: React.Dispatch<React.SetStateAction<tileType | null>>;
  recentlyDroppedTile: React.MutableRefObject<tileType | null>;
  deck: numberPair[];
  isTurn: boolean;
  setIsTurn: (value: boolean) => void;
  firstPlayer: number;
  playerId: PlayerId;
  setFirstPlayer: React.Dispatch<React.SetStateAction<number>>;

  selectFromBoneYard: () => tileType;
  setDeck: (deck: numberPair[]) => void;

  permits: number[];
  setPermits: React.Dispatch<React.SetStateAction<number[]>>;
  canPlay: boolean;
  setCanPlay: React.Dispatch<React.SetStateAction<boolean>>;

  boneYardDistSpec: boneYardDistSpecType;
  setBoneYardDistSpec: React.Dispatch<
    React.SetStateAction<boneYardDistSpecType>
  >;
  registerDistCallback: (
    callback: (position: numberPair) => tileType | undefined
  ) => number;
  unRegisterDistCallback: (index: number) => void;
  requestTile: (
    instant: boolean,
    callbackID: number,
    required?: number[],
    amount?: number
  ) => void;
  opponentPlay: {
    tilePlayed: tileType;
    playedOn: tileType | null;
  } | null;
  oppenentPullFrom: React.MutableRefObject<numberPair>;
}

export interface AlertProps {
  text: string;
  subText?: string;
  isTop?: boolean;
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
