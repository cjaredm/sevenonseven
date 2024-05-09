import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GamesData } from "resolves/app/types";
import Icon from "resolves/app/components/Icon";

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
    <div className="flex-grow container mx-auto p-4 w-full">
      <button
        onClick={onCreateGame}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create New Game
      </button>
      <div className="mt-4 flex flex-col gap-4 w-full">
        {data.games.map((game) => (
          <div
            key={game.name}
            className="w-full p-4 border rounded shadow bg-white flex justify-between gap-4"
          >
            <div>
              <h2 className="text-lg">
                <span className={`text-[${game.teams[0].color}]`}>
                  {game.teams[0].name}
                </span>{" "}
                vs{" "}
                <span className={`text-[${game.teams[1].color}]`}>
                  {game.teams[1].name}
                </span>
              </h2>
              <p className="text-md">
                Score: {game.teams[0].score} - {game.teams[1].score}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => onContinueGame(game.name)}
                className="bg-green-500 hover:bg-green-700 text-white p-2 rounded"
                title="Continue Game"
              >
                <Icon name="continue" />
              </button>
              <button
                onClick={() => deleteGame(game.name)}
                className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
                title="Delete Game"
              >
                <Icon name="trash" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
