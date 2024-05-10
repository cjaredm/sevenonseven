import type { GameType } from "resolves/app/types";
import { Dispatch, SetStateAction, useState } from "react";
import { Tabs } from "resolves/app/components/Tabs";
import DownCounter from "resolves/app/components/DownCounter";
import Timeouts from "resolves/app/components/Timeouts";
import { useRouter } from "next/navigation";
import TouchdownOptions from "resolves/app/components/TouchdownOptions";

type CurrentGameProps = {
  game: GameType;
  setGame: Dispatch<SetStateAction<GameType | null>>;
  possessionIndex: number | null;
  setPossessionIndex: Dispatch<SetStateAction<number | null>>;
};

export default function CurrentGame({
  game,
  possessionIndex,
  setPossessionIndex,
  setGame,
}: CurrentGameProps) {
  const router = useRouter();
  const [showTouchdownOptions, setShowTouchdownOptions] = useState(false);

  const onTouchdown = () => {
    const newTeams = [...game.teams].map((team) => ({ ...team, down: 1 }));
    newTeams[possessionIndex || 0].score += 6;
    const updatedGame = {
      ...game,
      teams: newTeams,
    };
    setGame(updatedGame);
    setShowTouchdownOptions(true);
  };

  const onTurnover = () => {
    const newTeams = [...game.teams].map((team) => ({ ...team, down: 1 }));
    const defendingTeamIndex = possessionIndex === 0 ? 1 : 0;
    newTeams[defendingTeamIndex].score += 2;
    const updatedGame = {
      ...game,
      teams: newTeams,
      currentPossessionIndex: defendingTeamIndex,
    };
    setPossessionIndex(defendingTeamIndex);
    setGame(updatedGame);
  };

  const onInterception = () => {
    const newTeams = [...game.teams].map((team) => ({ ...team, down: 1 }));
    const defendingTeamIndex = possessionIndex === 0 ? 1 : 0;
    newTeams[defendingTeamIndex].score += 3;
    const updatedGame = {
      ...game,
      teams: newTeams,
      currentPossessionIndex: defendingTeamIndex,
    };
    setPossessionIndex(defendingTeamIndex);
    setGame(updatedGame);
  };

  const onHalfTime = () => {
    const newPossessionIndex = game.currentPossessionIndex === 0 ? 1 : 0;
    const teams = game.teams.map((team) => ({ ...team, down: 1, timeouts: 3 }));
    setGame({
      ...game,
      teams,
      currentPossessionIndex: newPossessionIndex,
      isSecondHalf: true,
    });
  };

  const onEndGame = () => {
    setGame({ ...game, final: true });
    router.push("/");
  };

  const updatePoints = (points: number) => {
    const newTeams = [...game.teams];
    newTeams[possessionIndex || 0].score += points;
    const defendingTeamIndex = possessionIndex === 0 ? 1 : 0;
    const updatedGame = {
      ...game,
      teams: newTeams,
      currentPossessionIndex: defendingTeamIndex,
    };
    setPossessionIndex(defendingTeamIndex);
    setGame(updatedGame);
    setShowTouchdownOptions(false);
  };

  const onTabClick = (index: number) => {
    setGame({ ...game, currentPossessionIndex: index });
    setPossessionIndex(index);
    setShowTouchdownOptions(false);
  };

  return (
    <div className="flex flex-col gap-2 flex-1 h-full">
      <Tabs
        activeTabIndex={possessionIndex || 0}
        tabs={game.teams.map((team, i) => ({
          label: team.name,
          onClick: () => onTabClick(i),
          color: team.color,
        }))}
      >
        <div className="h-full bg-white rounded p-4 flex flex-col gap-4">
          <div className="flex items-center">
            <p
              className="flex-1 text-[24px] font-bold flex justify-center rounded text-white"
              style={{ backgroundColor: game.teams[0].color }}
            >
              {game.teams[0].score}
            </p>
            <span className="text-[24px] px-4">-</span>
            <p
              className="flex-1 text-[24px] font-bold flex justify-center rounded text-white"
              style={{ backgroundColor: game.teams[1].color }}
            >
              {game.teams[1].score}
            </p>
          </div>

          <Timeouts game={game} setGame={setGame} />

          <DownCounter game={game} setGame={setGame} />

          {showTouchdownOptions ? (
            <TouchdownOptions updatePoints={updatePoints} />
          ) : (
            <div className="flex-1 flex flex-col justify-end gap-4">
              <button
                onClick={onTouchdown}
                className="bg-green-500 hover:bg-green-300 rounded text-white font-bold py-2 px-4 w-full"
              >
                Touchdown
              </button>
              <button
                onClick={onTurnover}
                className="bg-gray-400 hover:bg-gray-200 rounded text-white font-bold py-2 px-4 w-full"
              >
                Turn Over
              </button>
              <button
                onClick={onInterception}
                className="bg-red-600 hover:bg-red-400 rounded text-white font-bold py-2 px-4 w-full"
              >
                Interception
              </button>
            </div>
          )}
        </div>
      </Tabs>

      <div className="flex gap-4">
        {!game.isSecondHalf && (
          <button
            onClick={onHalfTime}
            className="flex-1 hover:bg-orange-400 rounded hover:text-white text-orange-400 font-bold py-2 px-4 w-full"
          >
            Halftime
          </button>
        )}
        <button
          onClick={onEndGame}
          className="flex-1 hover:bg-green-700 rounded hover:text-white text-green-700 font-bold py-2 px-4 w-full"
        >
          End Game
        </button>
      </div>
    </div>
  );
}
