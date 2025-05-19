import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GamesData } from "resolves/app/types";
import Icon from "resolves/app/components/Icon";
import { classnames } from "resolves/app/utils";

// Helper to format date for display
const formatDisplayDate = (dateStr: string | undefined, createdAt: number | undefined): string => {
  if (!dateStr && !createdAt) return 'Unknown date';

  // If we have a date string, use it
  if (dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }

  // Otherwise use createdAt timestamp
  if (createdAt) {
    const date = new Date(createdAt);
    return date.toLocaleDateString();
  }

  return 'Unknown date';
};

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<GamesData>({ games: [] });

  useEffect(() => {
    const localStorageData = localStorage.getItem("7on7");
    if (!localStorageData) {
      return localStorage.setItem("7on7", JSON.stringify({ games: [] }));
    }

    const gamesData = JSON.parse(localStorageData || "{}");

    // Sort games by creation date if available, otherwise keep current order
    if (gamesData.games) {
      gamesData.games.sort((a: any, b: any) => {
        // Sort by createdAt if available, most recent first
        if (a.createdAt && b.createdAt) {
          return b.createdAt - a.createdAt;
        }
        // Keep current order if no createdAt
        return 0;
      });
    }

    setData(gamesData);
  }, []);

  const onCreateGame = () => {
    router.push("/new");
  };

  const deleteGame = (gameId: string) => {
    // Try to find the game by ID first
    let games = data.games.filter((game) => game.id !== gameId);

    // If no games were filtered out, try by name (for backward compatibility)
    if (games.length === data.games.length) {
      games = data.games.filter((game) => game.name !== gameId);
    }

    const newData = { ...data, games };
    localStorage.setItem("7on7", JSON.stringify({ ...data, games }));
    setData(newData);
  };

  const onContinueGame = (game: any) => {
    // Use game ID if available, otherwise fall back to name
    const routeId = game.id || game.name;
    router.push(`/${routeId}`);
  };

  return (
    <div className="container flex flex-col flex-1 mx-auto p-4 w-full h-full max-h-full">
      <div className="flex-1 flex flex-col gap-2 w-full overflow-y-auto">
        {data.games.map((game) => {
          let winningTeamIndex =
            game.teams[0].score > game.teams[1].score ? 0 : 1;
          if (!game.final || game.teams[0].score === game.teams[1].score) {
            winningTeamIndex = -1;
          }

          return (
            <div
              key={game.id || game.name}
              className="w-full p-4 border rounded shadow bg-white flex justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-medium truncate max-w-[200px]">{game.name}</h2>
                  <span className="text-xs text-gray-500">
                    {formatDisplayDate(game.date, game.createdAt)}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span
                    className={classnames({
                      "font-bold": winningTeamIndex === 0,
                    })}
                    style={{
                      color:
                        winningTeamIndex === 0
                          ? game.teams[0].color
                          : "initial",
                    }}
                  >
                    {game.teams[0].name} ({game.teams[0].score})
                  </span>
                  <span
                    className={classnames({
                      "font-bold": winningTeamIndex === 1,
                    })}
                    style={{
                      color:
                        winningTeamIndex === 1
                          ? game.teams[1].color
                          : "initial",
                    }}
                  >
                    {game.teams[1].name} ({game.teams[1].score})
                  </span>
                </div>

                {game.final && (
                  <div className="mt-1 text-xs bg-gray-100 rounded px-2 py-1 inline-block">
                    Final
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {!game.final && (
                  <button
                    onClick={() => onContinueGame(game)}
                    className="bg-green-500 hover:bg-green-700 text-white p-2 rounded"
                    title="Continue Game"
                  >
                    <Icon name="continue" />
                  </button>
                )}
                <button
                  onClick={() => deleteGame(game.id || game.name)}
                  className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
                  title="Delete Game"
                >
                  <Icon name="trash" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onCreateGame}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Create New Game
      </button>
    </div>
  );
}
