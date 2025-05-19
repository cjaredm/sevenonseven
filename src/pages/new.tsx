import { useState } from "react";
import { useRouter } from "next/navigation";
import TextInput from "resolves/app/components/TextInput";
import { ScoringType } from "resolves/app/types";

const BASE_TEAM = {
  score: 0,
  timeouts: 3,
  downs: 1,
};

// Helper to format date to a more readable format for game names
const formatDate = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  return `${month}-${day}_${hours}-${minutes}`;
};

// Generate a unique game ID
const generateGameId = (teamA: string, teamB: string): string => {
  const timestamp = Date.now();
  const dateStr = formatDate(new Date(timestamp));
  return `${teamA}vs${teamB}_${dateStr}_${timestamp.toString().slice(-4)}`;
};

export default function New() {
  const router = useRouter();
  const [teamA, setTeamA] = useState({ name: "TeamA", color: "#ff0000" });
  const [teamB, setTeamB] = useState({ name: "TeamB", color: "#0011ff" });
  const [gameDate, setGameDate] = useState(new Date().toISOString().split('T')[0]);
  const [scoringType, setScoringType] = useState<ScoringType>('7on7');

  const onStartGame = () => {
    // Generate a unique game ID with timestamp
    const gameId = generateGameId(teamA.name, teamB.name);
    
    // Create a readable display name (still includes teams but is just for display)
    const displayName = `${teamA.name} vs ${teamB.name}`;
    
    const game = {
      id: gameId,
      name: displayName,
      date: gameDate,
      createdAt: Date.now(),
      scoringType: scoringType,
      teams: [
        { ...teamA, ...BASE_TEAM },
        { ...teamB, ...BASE_TEAM },
      ],
      firstTeamPossession: null,
      isSecondHalf: false,
      currentPossessionIndex: 0,
      final: false,
      history: [],
    };

    const gamesData = JSON.parse(localStorage.getItem("7on7") || "{}");
    localStorage.setItem(
      "7on7",
      JSON.stringify({
        games: [game, ...gamesData?.games],
      }),
    );

    router.push(`/${gameId}`);
  };

  const toggleScoringType = () => {
    setScoringType(scoringType === '7on7' ? 'traditional' : '7on7');
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
        
        <div className="flex flex-col gap-1">
          <label htmlFor="gameDate" className="font-bold">Game Date:</label>
          <input
            id="gameDate"
            type="date"
            value={gameDate}
            onChange={(e) => setGameDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="font-bold">Scoring System:</span>
          <div className="flex items-center">
            <div 
              className={`relative inline-flex cursor-pointer w-12 h-6 rounded-full transition-colors ease-in-out duration-200 ${
                scoringType === '7on7' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
              onClick={toggleScoringType}
            >
              <span 
                className={`inline-block w-5 h-5 transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200 ${
                  scoringType === '7on7' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
            <span className="ml-3">
              {scoringType === '7on7' ? '7-on-7 Football' : 'Traditional Football'}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {scoringType === '7on7' ? (
              <p>7-on-7 scoring: Touchdown (6pts), Conversions (1-2pts), Interception (3pts), Turnover (2pts)</p>
            ) : (
              <p>Traditional scoring: Touchdown (6pts), Extra Point (1pt), 2-Point Conversion (2pts), Field Goal (3pts), Safety (2pts)</p>
            )}
          </div>
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
