import { useState } from "react";
import { useRouter } from "next/navigation";
import TextInput from "resolves/app/components/TextInput";

const BASE_TEAM = {
  score: 0,
  timeouts: 3,
  downs: 1,
};

export default function New() {
  const router = useRouter();
  const [teamA, setTeamA] = useState({ name: "TeamA", color: "#ff0000" });
  const [teamB, setTeamB] = useState({ name: "TeamB", color: "#0011ff" });

  const onStartGame = () => {
    let gameIndex = 0;
    let gameName = `${teamA.name}vs${teamB.name}`;
    let hasUniqueName = false;
    while (!hasUniqueName) {
      if (!localStorage.getItem(gameName)) {
        hasUniqueName = true;
        break;
      }
      gameIndex++;
      gameName = `${gameName}${gameIndex}`;
    }

    const game = {
      name: gameName,
      teams: [
        { ...teamA, ...BASE_TEAM },
        { ...teamB, ...BASE_TEAM },
      ],
      firstTeamPossession: null,
      isSecondHalf: false,
      currentPossessionIndex: 0,
      final: false,
    };

    const gamesData = JSON.parse(localStorage.getItem("7on7") || "{}");
    localStorage.setItem(
      "7on7",
      JSON.stringify({
        games: [game, ...gamesData?.games],
      }),
    );

    router.push(`/${gameName}`);
  };

  return (
    <div className="flex flex-col gap-12 p-12">
      <h1 className="text-[24px] font-bold mb-4 flex justify-center">
        Create a New Game
      </h1>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <TextInput
            label="Team A Name"
            name="teamAName"
            value={teamA.name}
            onChange={(e) => setTeamA({ ...teamA, name: e.target.value })}
          />

          <label htmlFor="teamAColor" className="flex flex-col gap-1">
            <span className="flex gap-4">
              <span className="font-bold">Team A Color:</span> {teamA.color}
            </span>
            <input
              id="teamAColor"
              type="color"
              value={teamA.color}
              onChange={(e) => setTeamA({ ...teamA, color: e.target.value })}
            />
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <TextInput
            label="Team B Name"
            name="teamBName"
            value={teamB.name}
            onChange={(e) => setTeamB({ ...teamB, name: e.target.value })}
          />

          <label htmlFor="teamBColor" className="flex flex-col gap-1">
            <span className="flex gap-4">
              <span className="font-bold">Team B Color:</span> {teamB.color}
            </span>
            <input
              id="teamBColor"
              type="color"
              value={teamB.color}
              onChange={(e) => setTeamB({ ...teamB, color: e.target.value })}
            />
          </label>
        </div>
      </div>

      <button
        onClick={onStartGame}
        className="bg-green-400 text-white rounded hover:bg-green-300 p-2"
      >
        Start Game
      </button>
    </div>
  );
}
