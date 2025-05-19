import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { GamesData, GameType } from "resolves/app/types";
import Kickoff from "resolves/app/components/Kickoff";
import CurrentGame from "resolves/app/components/CurrentGame";
import GameHistory from "resolves/app/components/GameHistory";

export const SCREENS = {
  kickoff: Kickoff,
  currentGame: CurrentGame,
  gameHistory: GameHistory,
  loading: () => <div>Loading...</div>,
};

export default function Game() {
  const params = useParams();
  const [gamesData, setGamesData] = useState<GamesData>({ games: [] });
  const [gameIndex, setGameIndex] = useState<number | null>(null);
  const [game, setGame] = useState<GameType | null>(null);
  const [possessionIndex, setPossessionIndex] = useState<number | null>(null);
  const [screenKey, setScreenKey] = useState<keyof typeof SCREENS>("loading");
  const Screen = SCREENS[screenKey];

  useEffect(() => {
    const gameId = params?.name;
    if (!gameId) return;
    const data: GamesData = JSON.parse(localStorage.getItem("7on7") || "{}");
    setGamesData(data);

    // First, try to find the game by ID (for new games)
    let index = data.games?.findIndex((game: any) => game.id === gameId);
    
    // If not found by ID, try to find by name (for backward compatibility)
    if (index === -1 || index === undefined) {
      index = data.games?.findIndex((game: any) => game.name === gameId);
    }

    const currentGame = data.games[index] || null;
    setGameIndex(index ?? null);
    setGame(currentGame);
    setPossessionIndex(currentGame?.currentPossessionIndex ?? null);
    setScreenKey(
      (typeof currentGame?.currentPossessionIndex === "number" &&
        "currentGame") ??
        typeof currentGame?.firstTeamPossession === "number"
        ? "currentGame"
        : "kickoff",
    );
  }, [params?.name]);

  useEffect(() => {
    if (game && typeof gameIndex === "number") {
      const updatedGames = [...gamesData.games];
      updatedGames[gameIndex] = {
        ...game,
        currentPossessionIndex: possessionIndex,
      };
      localStorage.setItem(
        "7on7",
        JSON.stringify({ ...gamesData, games: updatedGames }),
      );
    }
  }, [game, gameIndex, possessionIndex]);

  if (!game || gameIndex === null) return <div>No game found...</div>;

  return (
    <div className="w-full h-full p-4 flex-1">
      <Screen
        game={game}
        gameIndex={gameIndex}
        possessionIndex={possessionIndex}
        setPossessionIndex={setPossessionIndex}
        setScreenKey={setScreenKey}
        setGame={setGame}
      />
    </div>
  );
}
