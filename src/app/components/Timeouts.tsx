import Icon from "resolves/app/components/Icon";
import type { GameType, HistoryItem } from "resolves/app/types";
import { Dispatch, SetStateAction } from "react";

type TimeoutsProps = {
  game: GameType;
  setGame: Dispatch<SetStateAction<GameType | null>>;
};

export default function Timeouts({ game, setGame }: TimeoutsProps) {
  const team1Timeouts = game.teams[0].timeouts;
  const team2Timeouts = game.teams[1].timeouts;

  const onTimeoutChange =
    (teamIndex: number, plusOrMinus: "plus" | "minus") => () => {
      const newTeams = [...game.teams];
      const team = newTeams[teamIndex];
      const newTimeouts = team.timeouts + (plusOrMinus === "plus" ? 1 : -1);
      if (newTimeouts < 0 || newTimeouts > 3) {
        return;
      }
      newTeams[teamIndex].timeouts =
        team.timeouts + (plusOrMinus === "plus" ? 1 : -1);
      
      // Add history item for timeout
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        teamIndex,
        points: 0,
        description: plusOrMinus === "minus" 
          ? `${team.name} used a timeout (${newTimeouts} remaining)` 
          : `${team.name} received a timeout (${newTimeouts} total)`,
        type: 'other',
      };
      
      setGame({ 
        ...game, 
        teams: newTeams,
        history: [...(game.history || []), historyItem],
      });
    };

  return (
    <div className="flex gap-4 justify-between min-w-[120px]">
      <div className="flex flex-col gap-1">
        <div className="flex gap-4 justify-between items-center">
          <button
            onClick={onTimeoutChange(0, "minus")}
            className="p-2 rounded bg-red-400 hover:bg-red-600 text-white disabled:bg-gray-200 transition-colors"
            disabled={team1Timeouts === 0}
          >
            <Icon name="minus" />
          </button>

          <span className="font-bold text-[16px]">{team1Timeouts}</span>

          <button
            onClick={onTimeoutChange(0, "plus")}
            className="p-2 rounded bg-blue-400 hover:bg-blue-600 text-white disabled:bg-gray-200 transition-colors"
            disabled={team1Timeouts === 3}
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
            className="p-2 rounded bg-red-400 hover:bg-red-600 text-white disabled:bg-gray-200 transition-colors"
            disabled={team2Timeouts === 0}
          >
            <Icon name="minus" />
          </button>

          <span className="font-bold text-[16px]">{team2Timeouts}</span>

          <button
            onClick={onTimeoutChange(1, "plus")}
            className="p-2 rounded bg-blue-400 hover:bg-blue-600 text-white disabled:bg-gray-200 transition-colors"
            disabled={team2Timeouts === 3}
          >
            <Icon name="plus" />
          </button>
        </div>
        <p className="text-[12px] flex justify-center italic">Timeouts Left</p>
      </div>
    </div>
  );
}
