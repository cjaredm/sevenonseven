export type Team = {
  name: string;
  color: string;
  score: number;
  timeouts: number;
  down: number;
};

export type HistoryItem = {
  id: string;
  timestamp: number;
  teamIndex: number;
  points: number;
  description: string;
  type: 'touchdown' | 'turnover' | 'interception' | 'conversion' | 'other';
};

export type ScoringType = '7on7' | 'traditional';

export type GameType = {
  id?: string; // Optional for backward compatibility
  name: string;
  date?: string; // Game date (optional for backward compatibility)
  createdAt?: number; // Timestamp when the game was created (optional for backward compatibility)
  scoringType: ScoringType; // Type of scoring to use
  teams: Team[];
  firstTeamPossession: number | null;
  isSecondHalf: boolean;
  currentPossessionIndex: number | null;
  final: boolean;
  history: HistoryItem[];
};

export type GamesData = {
  games: GameType[];
};
