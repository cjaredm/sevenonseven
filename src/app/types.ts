export type Team = {
  name: string;
  color: string;
  score: number;
  timeouts: number;
};

export type GameType = {
  name: string;
  teams: Team[];
  firstHalfPossessionIndex: number | null;
  currentPossessionIndex: number | null;
};

export type GamesData = {
  games: GameType[];
};
