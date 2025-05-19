import type { GameType, HistoryItem } from "resolves/app/types";
import { Dispatch, SetStateAction, useState } from "react";
import { Tabs } from "resolves/app/components/Tabs";
import DownCounter from "resolves/app/components/DownCounter";
import Timeouts from "resolves/app/components/Timeouts";
import { useRouter } from "next/navigation";
import TouchdownOptions from "resolves/app/components/TouchdownOptions";
import Icon from "resolves/app/components/Icon";
import { SCREENS } from "resolves/pages/[name]";

type CurrentGameProps = {
  game: GameType;
  setGame: Dispatch<SetStateAction<GameType | null>>;
  possessionIndex: number | null;
  setPossessionIndex: Dispatch<SetStateAction<number | null>>;
  setScreenKey: Dispatch<SetStateAction<keyof typeof SCREENS>>;
  gameIndex: number;
};

export default function CurrentGame({
  game,
  possessionIndex,
  setPossessionIndex,
  setGame,
  setScreenKey,
  gameIndex,
}: CurrentGameProps) {
  const router = useRouter();
  const [showTouchdownOptions, setShowTouchdownOptions] = useState(false);
  const [showFieldGoalOptions, setShowFieldGoalOptions] = useState(false);

  // Is this a 7on7 game or traditional football game?
  const is7on7 = game.scoringType === "7on7" || !game.scoringType; // Default to 7on7 for backward compatibility

  const addHistoryItem = (
    type: HistoryItem["type"],
    points: number,
    description: string = "",
  ) => {
    const teamIndex = possessionIndex || 0;
    const teamName = game.teams[teamIndex].name;
    const defaultDesc = `${teamName} scored ${points} points (${type})`;

    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      teamIndex,
      points,
      description: description || defaultDesc,
      type,
    };

    return [...(game.history || []), historyItem];
  };

  const onTouchdown = () => {
    const newTeams = [...game.teams].map((team) => ({ ...team, down: 1 }));
    newTeams[possessionIndex || 0].score += 6;
    const history = addHistoryItem("touchdown", 6);
    const updatedGame = {
      ...game,
      teams: newTeams,
      history,
    };
    setGame(updatedGame);
    setShowTouchdownOptions(true);
  };

  const onTurnover = () => {
    const newTeams = [...game.teams].map((team) => ({ ...team, down: 1 }));
    const defendingTeamIndex = possessionIndex === 0 ? 1 : 0;

    // Only award points in 7on7 scoring
    if (is7on7) {
      newTeams[defendingTeamIndex].score += 2;
    }

    const history = addHistoryItem(
      "turnover",
      is7on7 ? 2 : 0,
      `${game.teams[defendingTeamIndex].name} possession by turnover`,
    );

    const updatedGame = {
      ...game,
      teams: newTeams,
      currentPossessionIndex: defendingTeamIndex,
      history,
    };
    setPossessionIndex(defendingTeamIndex);
    setGame(updatedGame);
  };

  const onInterception = () => {
    const newTeams = [...game.teams].map((team) => ({ ...team, down: 1 }));
    const defendingTeamIndex = possessionIndex === 0 ? 1 : 0;

    // Only award points in 7on7 scoring
    if (is7on7) {
      newTeams[defendingTeamIndex].score += 3;
    }

    const pointsText = is7on7 ? "" : "possession by";
    const history = addHistoryItem(
      "interception",
      is7on7 ? 3 : 0,
      `${game.teams[defendingTeamIndex].name} ${pointsText} interception`,
    );

    const updatedGame = {
      ...game,
      teams: newTeams,
      currentPossessionIndex: defendingTeamIndex,
      history,
    };
    setPossessionIndex(defendingTeamIndex);
    setGame(updatedGame);
  };

  const onSafety = () => {
    if (is7on7) return; // Safety not used in 7on7

    const newTeams = [...game.teams].map((team) => ({ ...team, down: 1 }));
    const defendingTeamIndex = possessionIndex === 0 ? 1 : 0;

    // Award 2 points for safety in traditional football
    newTeams[defendingTeamIndex].score += 2;

    const history = addHistoryItem(
      "other",
      2,
      `${game.teams[defendingTeamIndex].name} safety`,
    );

    const updatedGame = {
      ...game,
      teams: newTeams,
      currentPossessionIndex: defendingTeamIndex,
      history,
    };
    setPossessionIndex(defendingTeamIndex);
    setGame(updatedGame);
  };

  const onFieldGoal = () => {
    if (is7on7) return; // Field goals not used in 7on7

    const newTeams = [...game.teams].map((team) => ({ ...team, down: 1 }));
    newTeams[possessionIndex || 0].score += 3;

    const history = addHistoryItem(
      "other",
      3,
      `${game.teams[possessionIndex || 0].name} field goal`,
    );

    const defendingTeamIndex = possessionIndex === 0 ? 1 : 0;

    const updatedGame = {
      ...game,
      teams: newTeams,
      currentPossessionIndex: defendingTeamIndex,
      history,
    };
    setPossessionIndex(defendingTeamIndex);
    setGame(updatedGame);
  };

  const onHalfTime = () => {
    const newPossessionIndex = game.currentPossessionIndex === 0 ? 1 : 0;
    const teams = game.teams.map((team) => ({ ...team, down: 1, timeouts: 3 }));

    // Add history item for halftime
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      teamIndex: newPossessionIndex,
      points: 0,
      description: `Halftime - Possession to ${game.teams[newPossessionIndex].name}`,
      type: "other",
    };

    setGame({
      ...game,
      teams,
      currentPossessionIndex: newPossessionIndex,
      isSecondHalf: true,
      history: [...(game.history || []), historyItem],
    });
  };

  const onEndGame = () => {
    // Determine the winning team (or if it's a tie)
    let winningTeamMessage = "";
    if (game.teams[0].score > game.teams[1].score) {
      winningTeamMessage = `${game.teams[0].name} wins (${game.teams[0].score}-${game.teams[1].score})`;
    } else if (game.teams[1].score > game.teams[0].score) {
      winningTeamMessage = `${game.teams[1].name} wins (${game.teams[1].score}-${game.teams[0].score})`;
    } else {
      winningTeamMessage = `Tie Game: (${game.teams[0].score}-${game.teams[1].score})`;
    }

    // Add history item for game end
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      teamIndex: game.teams[0].score > game.teams[1].score ? 0 : 1,
      points: 0,
      description: `Game Over - ${winningTeamMessage}`,
      type: "other",
    };

    setGame({
      ...game,
      final: true,
      history: [...(game.history || []), historyItem],
    });

    router.push("/");
  };

  const updatePoints = (points: number) => {
    const newTeams = [...game.teams];
    newTeams[possessionIndex || 0].score += points;
    const defendingTeamIndex = possessionIndex === 0 ? 1 : 0;
    const history = addHistoryItem(
      "conversion",
      points,
      `${game.teams[possessionIndex || 0].name} conversion: ${points}`,
    );
    const updatedGame = {
      ...game,
      teams: newTeams,
      currentPossessionIndex: defendingTeamIndex,
      history,
    };
    setPossessionIndex(defendingTeamIndex);
    setGame(updatedGame);
    setShowTouchdownOptions(false);
  };

  const onViewHistory = () => {
    setScreenKey("gameHistory");
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
                Touchdown (6 pts)
              </button>

              {/* 7on7-specific buttons */}
              {is7on7 && (
                <>
                  <button
                    onClick={onTurnover}
                    className="bg-gray-400 hover:bg-gray-200 rounded text-white font-bold py-2 px-4 w-full"
                  >
                    Turn Over (2 pts)
                  </button>
                  <button
                    onClick={onInterception}
                    className="bg-red-600 hover:bg-red-400 rounded text-white font-bold py-2 px-4 w-full"
                  >
                    Interception (3 pts)
                  </button>
                </>
              )}

              {/* Traditional football buttons */}
              {!is7on7 && (
                <>
                  <button
                    onClick={onFieldGoal}
                    className="bg-blue-500 hover:bg-blue-300 rounded text-white font-bold py-2 px-4 w-full"
                  >
                    Field Goal (3 pts)
                  </button>
                  <button
                    onClick={onSafety}
                    className="bg-purple-500 hover:bg-purple-300 rounded text-white font-bold py-2 px-4 w-full"
                  >
                    Safety (2 pts)
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
                </>
              )}
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
          onClick={onViewHistory}
          className="flex-1 hover:bg-blue-700 rounded hover:text-white text-blue-700 font-bold py-2 px-4 w-full"
        >
          History
        </button>
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
