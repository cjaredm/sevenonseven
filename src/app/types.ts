export type Team = {
  name: string;
  color: string;
  score: number;
  timeouts: number;
  down: number;
};

export type GameType = {
  name: string;
  teams: Team[];
  firstTeamPossession: number | null;
  isSecondHalf: boolean;
  currentPossessionIndex: number | null;
  final: boolean;
};

export type GamesData = {
  games: GameType[];
};
