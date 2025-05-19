import { useState, useMemo } from "react";
import type { GameType, HistoryItem } from "resolves/app/types";
import Icon from "resolves/app/components/Icon";

type GameHistoryProps = {
  game: GameType;
  setGame: React.Dispatch<React.SetStateAction<GameType | null>>;
  setScreenKey: React.Dispatch<React.SetStateAction<string>>;
};

type FilterType = 'all' | 'points' | 'touchdown' | 'turnover' | 'interception' | 'conversion' | 'timeout' | 'down' | 'other';

type RunningBalance = {
  team0: {
    points: number;
    timeouts: number;
  };
  team1: {
    points: number;
    timeouts: number;
  };
};

export default function GameHistory({ game, setGame, setScreenKey }: GameHistoryProps) {
  const [editItem, setEditItem] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editPoints, setEditPoints] = useState(0);
  const [teamFilter, setTeamFilter] = useState<number | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleEditItem = (item: HistoryItem) => {
    setEditItem(item.id);
    setEditDescription(item.description);
    setEditPoints(item.points);
  };

  const saveEdit = (id: string) => {
    // Find the item being edited to get its current points
    const currentItem = game.history.find(item => item.id === id);
    if (!currentItem) return;
    
    const pointsDiff = editPoints - currentItem.points;
    
    // Update the history item with new description and points
    const updatedHistory = game.history.map(item => 
      item.id === id ? { ...item, description: editDescription, points: editPoints } : item
    );
    
    // Update the team's score
    const newTeams = [...game.teams];
    newTeams[currentItem.teamIndex].score += pointsDiff;
    
    setGame({
      ...game,
      history: updatedHistory,
      teams: newTeams
    });
    
    setEditItem(null);
  };

  const deleteHistoryItem = (id: string) => {
    const updatedHistory = game.history.filter(item => item.id !== id);
    
    // Recalculate scores
    const newTeams = [...game.teams].map(team => ({ ...team, score: 0 }));
    
    updatedHistory.forEach(item => {
      newTeams[item.teamIndex].score += item.points;
    });
    
    setGame({
      ...game,
      history: updatedHistory,
      teams: newTeams
    });
  };

  const onBack = () => {
    setScreenKey('currentGame');
  };

  // Prepare type filter options
  const typeFilterOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'points', label: 'Points' },
    { value: 'touchdown', label: 'Touchdowns' },
    { value: 'turnover', label: 'Turnovers' },
    { value: 'interception', label: 'Interceptions' },
    { value: 'conversion', label: 'Conversions' },
    { value: 'timeout', label: 'Timeouts' },
    { value: 'down', label: 'Downs' },
    { value: 'other', label: 'Other' }
  ];

  // Filter history items based on selected filters
  const filteredHistory = useMemo(() => {
    return game.history.filter(item => {
      // Filter by team
      if (teamFilter !== 'all' && item.teamIndex !== teamFilter) {
        return false;
      }
      
      // Filter by type
      if (typeFilter === 'all') {
        return true;
      } else if (typeFilter === 'points') {
        return item.points > 0;
      } else if (typeFilter === 'timeout') {
        return item.type === 'other' && item.description.toLowerCase().includes('timeout');
      } else if (typeFilter === 'down') {
        return item.type === 'other' && (
          item.description.toLowerCase().includes('down') || 
          item.description.toLowerCase().includes('downs')
        );
      } else {
        return item.type === typeFilter;
      }
    });
  }, [game.history, teamFilter, typeFilter]);
  
  // Calculate running balances for each history item
  const historyWithBalances = useMemo(() => {
    // Initialize balances based on current game state
    const initialBalance: RunningBalance = {
      team0: { points: 0, timeouts: 3 },
      team1: { points: 0, timeouts: 3 }
    };
    
    // Create a mapping of history items by ID for easier access
    const historyById = new Map();
    game.history.forEach(item => {
      historyById.set(item.id, { ...item });
    });
    
    // Sort all history by timestamp (ascending)
    const sortedHistory = [...game.history].sort((a, b) => a.timestamp - b.timestamp);
    
    // Calculate running balances for all history items
    let currentBalance = { ...initialBalance };
    
    const historyWithRunningBalances = sortedHistory.map(item => {
      // Use defensive programming for team index
      const teamIndex = item.teamIndex === 0 || item.teamIndex === 1 ? item.teamIndex : 0;
      const opposingTeamIndex = teamIndex === 0 ? 1 : 0;
      
      // Update points if this is a scoring event
      if (item.points > 0) {
        currentBalance[`team${teamIndex}`].points += item.points;
      }
      
      // Handle timeout events
      if (item.type === 'other' && item.description.toLowerCase().includes('timeout')) {
        // Extract timeout information from the description
        if (item.description.toLowerCase().includes('used')) {
          const match = item.description.match(/\((\d+) remaining\)/);
          if (match && match[1]) {
            currentBalance[`team${teamIndex}`].timeouts = parseInt(match[1]);
          }
        } else if (item.description.toLowerCase().includes('received')) {
          const match = item.description.match(/\((\d+) total\)/);
          if (match && match[1]) {
            currentBalance[`team${teamIndex}`].timeouts = parseInt(match[1]);
          }
        }
      }
      
      // Create a deep copy of the current balance to assign to this history item
      const balanceCopy = JSON.parse(JSON.stringify(currentBalance));
      
      // Return the history item with its running balance
      return {
        ...item,
        runningBalance: balanceCopy
      };
    });
    
    // Sort back by descending timestamp for display
    return historyWithRunningBalances.sort((a, b) => b.timestamp - a.timestamp);
  }, [game.history]);
  
  // Filter history with balances
  const filteredHistoryWithBalances = useMemo(() => {
    return historyWithBalances.filter(item => {
      // Filter by team
      if (teamFilter !== 'all' && item.teamIndex !== teamFilter) {
        return false;
      }
      
      // Filter by type
      if (typeFilter === 'all') {
        return true;
      } else if (typeFilter === 'points') {
        return item.points > 0;
      } else if (typeFilter === 'timeout') {
        return item.type === 'other' && item.description.toLowerCase().includes('timeout');
      } else if (typeFilter === 'down') {
        return item.type === 'other' && (
          item.description.toLowerCase().includes('down') || 
          item.description.toLowerCase().includes('downs')
        );
      } else {
        return item.type === typeFilter;
      }
    });
  }, [historyWithBalances, teamFilter, typeFilter]);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Game History</h2>
        <button 
          onClick={onBack}
          className="text-blue-500 hover:text-blue-700"
        >
          Back to Game
        </button>
      </div>

      {/* Filter Controls - Single Row */}
      <div className="bg-white rounded p-3 flex items-center">
        <h3 className="font-medium mr-4">Filters:</h3>
        
        <div className="flex gap-3 flex-grow">
          {/* Team Filter Dropdown */}
          <div className="flex items-center">
            <label htmlFor="teamFilter" className="text-xs font-semibold mr-2">Team</label>
            <select 
              id="teamFilter"
              value={teamFilter.toString()} 
              onChange={(e) => setTeamFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="border rounded p-1.5 text-sm"
            >
              <option value="all">All Teams</option>
              {game.teams.map((team, index) => (
                <option key={`team-${index}`} value={index.toString()}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Type Filter Dropdown */}
          <div className="flex items-center">
            <label htmlFor="typeFilter" className="text-xs font-semibold mr-2">Type</label>
            <select 
              id="typeFilter"
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value as FilterType)}
              className="border rounded p-1.5 text-sm"
            >
              {typeFilterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white rounded p-2">
        {filteredHistoryWithBalances.length === 0 ? (
          <p className="text-center text-gray-500 p-4">No matching history items</p>
        ) : (
          <ul className="divide-y">
            {filteredHistoryWithBalances.map((item) => (
              <li key={item.id} className="py-3 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">{formatTime(item.timestamp)}</span>
                    
                    {editItem === item.id ? (
                      <div className="flex flex-col gap-2 mt-1">
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="border p-1 rounded w-full"
                          placeholder="Description"
                        />
                        <div className="flex items-center">
                          <label className="mr-2 text-sm">Points:</label>
                          <input
                            type="number"
                            value={editPoints}
                            onChange={(e) => setEditPoints(parseInt(e.target.value) || 0)}
                            className="border p-1 rounded w-20"
                            min="0"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => saveEdit(item.id)}
                            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditItem(null)}
                            className="bg-gray-300 px-2 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="font-medium">{item.description}</p>
                    )}
                    
                    <div className="flex items-center mt-1">
                      <span 
                        className="px-2 py-1 rounded-full text-xs text-white"
                        style={{ backgroundColor: game.teams[item.teamIndex].color }}
                      >
                        {game.teams[item.teamIndex].name}
                      </span>
                      {item.points > 0 && (
                        <span className="ml-2 text-sm font-bold">+{item.points} pts</span>
                      )}
                      <span className="ml-2 text-xs px-1 py-0.5 bg-gray-100 rounded">
                        {item.type === 'other' ? 
                          (item.description.toLowerCase().includes('timeout') ? 'Timeout' : 
                           item.description.toLowerCase().includes('down') ? 'Down' : 'Other') 
                          : item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex gap-2">
                      {editItem !== item.id && (
                        <>
                          <button 
                            onClick={() => handleEditItem(item)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit"
                          >
                            <Icon name="edit" />
                          </button>
                          <button 
                            onClick={() => deleteHistoryItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <Icon name="trash" />
                          </button>
                        </>
                      )}
                    </div>
                    
                    {/* Running Balance - Always show score balance */}
                    <div className="text-xs mt-3 text-gray-500">
                      <div className="flex justify-end gap-2">
                        <span>Score:</span>
                        <span 
                          style={{ color: game.teams[0].color }}
                          className="font-semibold"
                        >
                          {item.runningBalance?.team0?.points || 0}
                        </span>
                        -
                        <span 
                          style={{ color: game.teams[1].color }}
                          className="font-semibold"
                        >
                          {item.runningBalance?.team1?.points || 0}
                        </span>
                      </div>
                      
                      {/* Show timeouts for timeout-related events or when specifically filtering for timeouts */}
                      {(item.description.toLowerCase().includes('timeout') || typeFilter === 'timeout') && (
                        <div className="flex justify-end gap-2 mt-1">
                          <span>Timeouts:</span>
                          <span 
                            style={{ color: game.teams[0].color }}
                            className="font-semibold"
                          >
                            {item.runningBalance?.team0?.timeouts || 0}
                          </span>
                          -
                          <span 
                            style={{ color: game.teams[1].color }}
                            className="font-semibold"
                          >
                            {item.runningBalance?.team1?.timeouts || 0}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 