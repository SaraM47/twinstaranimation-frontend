import { useState } from "react";

// Allows users to select predefined genres and add custom ones

type Props = {
  value: string[]; // Currently selected genres
  onChange: (genres: string[]) => void; // Callback when selection changes
};

// Predefined genre options
const GENRE_OPTIONS = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Romance",
  "Horror",
  "Sci-Fi",
  "Slice of Life",
];

export default function GenreSelector({ value, onChange }: Props) {
  const [customGenre, setCustomGenre] = useState(""); // Input state for custom genre

    // Toggle genre selection (add/remove)
  const toggleGenre = (genre: string) => {
    if (value.includes(genre)) {
      onChange(value.filter((g) => g !== genre));
    } else {
      onChange([...value, genre]);
    }
  };

    // Add custom genre to selection
  const addCustomGenre = () => {
    const trimmed = customGenre.trim();
    if (!trimmed) return;

    if (!value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }

    setCustomGenre(""); // Reset input after adding
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Genres</label>

      {/* Predefined genres */}
      <div className="flex flex-wrap gap-2 mb-3">
        {GENRE_OPTIONS.map((genre) => {
          const active = value.includes(genre);

          return (
            <button
              key={genre}
              type="button"
              onClick={() => toggleGenre(genre)}
              className={`px-3 py-1 rounded-full text-sm border transition
                ${
                  active
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }
              `}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Selected genre input */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((g) => (
            <span
              key={g}
              className="px-3 py-1 rounded-full text-sm bg-gray-200"
            >
              {g}
            </span>
          ))}
        </div>
      )}

      {/* Custom genre input */}
      <div className="flex gap-2">
        <input
          placeholder="Add custom genre"
          className="flex-1 p-2 border rounded"
          value={customGenre}
          onChange={(e) => setCustomGenre(e.target.value)}
        />

        <button
          type="button"
          onClick={addCustomGenre}
          className="px-3 py-2 bg-black text-white rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}