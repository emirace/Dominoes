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

declare global {
  interface Window {
    tronWeb: any;
  }
}
