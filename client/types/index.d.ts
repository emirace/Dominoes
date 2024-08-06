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
}

export interface DraggedTileProp {
  index: number;
  tile: numberPair;
  addTileToDeck: Function;
  origin: { X: number; Y: number };
}

declare global {
  interface Window {
    tronWeb: any;
  }
}
