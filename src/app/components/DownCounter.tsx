import type { GameType } from "resolves/app/types";
import { Dispatch, SetStateAction } from "react";
import Icon from "resolves/app/components/Icon";
import { classnames } from "resolves/app/utils";

type DownCounterProps = {
  game: GameType;
  setGame: Dispatch<SetStateAction<GameType | null>>;
};
type DownType = 1 | 2 | 3 | 4;

export default function DownCounter({ game, setGame }: DownCounterProps) {
  const teamIndex = game.currentPossessionIndex || 0;
  const currentDown = game.teams[teamIndex].down || 1;

  const updateDowns = (upOrDown: "up" | "down") => () => {
    const newDowns =
      (game.teams[teamIndex].down || 1) + (upOrDown === "up" ? 1 : -1);
    if (newDowns < 1 || newDowns > 4) {
      return;
    }
    const newTeams = [...game.teams];
    newTeams[teamIndex].down = newDowns as DownType;
    setGame({ ...game, teams: newTeams });
  };

  const onDownReset = () => {
    const newTeams = [...game.teams];
    newTeams[teamIndex].down = 1;
    setGame({ ...game, teams: newTeams });
  };

  return (
    <div className="flex flex-col gap-2 items-center flex-1 justify-center">
      <p className="font-bold text-[18px] flex justify-center">Down</p>
      <div className="flex justify-center gap-5 items-center">
        <button
          className={classnames("rounded p-4 text-white text-[16px]", {
            "cursor-not-allowed bg-gray-200": currentDown === 1,
            "bg-red-400 hover:bg-red-600": currentDown !== 1,
          })}
          onClick={updateDowns("down")}
        >
          <Icon name="minus" />
        </button>
        <span className="text-[32px]">{game.teams[teamIndex].down || 1}</span>
        <button
          className={classnames("rounded p-4 text-white text-[16px]", {
            "cursor-not-allowed bg-gray-200": currentDown === 4,
            "bg-blue-400 hover:bg-blue-600": currentDown !== 4,
          })}
          onClick={updateDowns("up")}
        >
          <Icon name="plus" />
        </button>
      </div>
      <button
        onClick={onDownReset}
        className="rounded hover:bg-green-500 text-green-500 hover:text-white transition-colors p-2"
      >
        Reset Downs
      </button>
    </div>
  );
}
// Need halftime button and final score button
// downs plus and minus buttons
