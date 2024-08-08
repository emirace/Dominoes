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
  tile: numberPair;
  tilt: number;
  scale: number;
}

export interface DominoesTileProps {
  tile: numberPair;
}

export type numberPair = [number, number];

export interface DropZoneProp {
  acceptedDotCount: number[];
  position: numberPair;
  initailSetAnchor: (tile: numberPair, coordinates: numberPair) => void;
  activeHover: React.MutableRefObject<number>;
  index: number;
}

export interface tileAlignSpecType {
  root: boolean;
  orientation: string;
  tile: numberPair;
  isDouble: boolean;
  coordinates: numberPair;
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
}

declare global {
  interface Window {
    tronWeb: any;
  }
}
