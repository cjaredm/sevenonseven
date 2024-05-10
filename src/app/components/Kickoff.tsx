import type { GameType } from "resolves/app/types";
import { SCREENS } from "resolves/pages/[name]";
import { Dispatch, SetStateAction } from "react";

type KickoffProps = {
  game: GameType;
  gameIndex: number;
  possessionIndex: number | null;
  setPossessionIndex: Dispatch<SetStateAction<number | null>>;
  setScreenKey: (screen: keyof typeof SCREENS) => void;
  setGame: Dispatch<SetStateAction<GameType | null>>;
};

export default function Kickoff({
  game,
  setGame,
  setPossessionIndex,
  setScreenKey,
}: KickoffProps) {
  const startGameWithTeamIndex = (index: number) => {
    const newGame = {
      ...game,
      firstTeamPossession: index,
      currentPossessionIndex: index,
    };
    setGame(newGame);
    setPossessionIndex(index);
    setScreenKey("currentGame");
  };
  return (
    <div>
      <div className="flex flex-col gap-4">
        <h1 className="text-12 font-bold mb-4 flex justify-center">
          {game.teams.map((team) => team.name).join(" vs ")}
        </h1>

        <p className="font-bold flex justify-center">
          Who gets the ball first?
        </p>

        <div className="flex flex-col gap-4 items-center">
          {game.teams.map((team, i) => (
            <button
              key={team.name}
              onClick={() => startGameWithTeamIndex(i)}
              className={`text-white w-full max-w-[300px] p-2 rounded font-bold`}
              style={{ backgroundColor: team.color }}
            >
              {team.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
