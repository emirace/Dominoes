export interface User {
  _id: number;
  username: string;
  email: string;
  games: Game[];
}

export interface Game {
  gameId: string;
  isPrivate: boolean;
  players: User[];
}
