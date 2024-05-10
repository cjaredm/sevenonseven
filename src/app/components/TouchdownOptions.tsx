type TouchdownOptionsProps = {
  updatePoints: (points: number) => void;
};

export default function TouchdownOptions({
  updatePoints,
}: TouchdownOptionsProps) {
  return (
    <div className="flex-1 flex flex-col justify-end gap-4">
      <button
        onClick={() => updatePoints(2)}
        className="bg-green-600 rounded text-white font-bold py-2 px-4 w-full"
      >
        + 2 points
      </button>
      <button
        onClick={() => updatePoints(1)}
        className="bg-green-300 rounded text-white font-bold py-2 px-4 w-full"
      >
        + 1 points
      </button>
      <button
        onClick={() => updatePoints(0)}
        className="bg-gray-400 rounded text-white font-bold py-2 px-4 w-full"
      >
        + 0 points
      </button>
    </div>
  );
}
