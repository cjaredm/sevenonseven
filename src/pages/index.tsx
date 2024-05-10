import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GamesData } from "resolves/app/types";
import Icon from "resolves/app/components/Icon";
import { classnames } from "resolves/app/utils";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<GamesData>({ games: [] });

  useEffect(() => {
    const localStorageData = localStorage.getItem("7on7");
    if (!localStorageData) {
      return localStorage.setItem("7on7", JSON.stringify({ games: [] }));
    }

    const gamesData = JSON.parse(localStorageData || "{}");
    setData(gamesData);
  }, []);

  const onCreateGame = () => {
    router.push("/new");
  };

  const deleteGame = (gameName: string) => {
    const games = data.games.filter((game) => game.name !== gameName);
    const newData = { ...data, games };
    localStorage.setItem("7on7", JSON.stringify({ ...data, games }));
    setData(newData);
  };

  const onContinueGame = (gameName: string) => {
    router.push(`/${gameName}`);
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
          const team1Color = `text-[${game.teams[0].color}]`;

          return (
            <div
              key={game.name}
              className="w-full p-4 border rounded shadow bg-white flex justify-between gap-4"
            >
              <div>
                <h2 className="text-lg">
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
                    {game.teams[0].name}
                  </span>{" "}
                  vs{" "}
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
                    {game.teams[1].name}
                  </span>
                </h2>
                <p className="text-md">
                  Score: {game.teams[0].score} - {game.teams[1].score}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {!game.final && (
                  <button
                    onClick={() => onContinueGame(game.name)}
                    className="bg-green-500 hover:bg-green-700 text-white p-2 rounded"
                    title="Continue Game"
                  >
                    <Icon name="continue" />
                  </button>
                )}
                <button
                  onClick={() => deleteGame(game.name)}
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
