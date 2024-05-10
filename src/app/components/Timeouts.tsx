import Icon from "resolves/app/components/Icon";
import type { GameType } from "resolves/app/types";
import { Dispatch, SetStateAction } from "react";

type TimeoutsProps = {
  game: GameType;
  setGame: Dispatch<SetStateAction<GameType | null>>;
};

export default function Timeouts({ game, setGame }: TimeoutsProps) {
  const onTimeoutChange =
    (teamIndex: number, plusOrMinus: "plus" | "minus") => () => {
      const newTeams = [...game.teams];
      const team = newTeams[teamIndex];
      newTeams[teamIndex].timeouts =
        team.timeouts + (plusOrMinus === "plus" ? 1 : -1);
      setGame({ ...game, teams: newTeams });
    };

  return (
    <div className="flex gap-4 justify-between min-w-[120px]">
      <div className="flex flex-col gap-1">
        <div className="flex gap-4 justify-between items-center">
          <button
            onClick={onTimeoutChange(0, "minus")}
            className="p-2 rounded bg-red-400 hover:bg-red-600 text-white"
          >
            <Icon name="minus" />
          </button>
          <span className="font-bold text-[16px]">
            {game.teams[0].timeouts}
          </span>
          <button
            onClick={onTimeoutChange(0, "plus")}
            className="p-2 rounded bg-blue-400 hover:bg-blue-600 text-white"
          >
            <Icon name="plus" />
          </button>
        </div>
        <p className="text-[12px] flex justify-center italic">Timeouts Left</p>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex gap-4 justify-between items-center">
          <button
            onClick={onTimeoutChange(1, "minus")}
            className="p-2 rounded bg-red-400 hover:bg-red-600 text-white"
          >
            <Icon name="minus" />
          </button>
          <span className="font-bold text-[16px]">
            {game.teams[1].timeouts}
          </span>
          <button
            onClick={onTimeoutChange(1, "plus")}
            className="p-2 rounded bg-blue-400 hover:bg-blue-600 text-white"
          >
            <Icon name="plus" />
          </button>
        </div>
        <p className="text-[12px] flex justify-center italic">Timeouts Left</p>
      </div>
    </div>
  );
}
