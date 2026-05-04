import { useState } from "react";
import { Star } from "lucide-react";

type Props = {
  value?: number; // average eller selected
  onRate?: (value: number) => void;
  disabled?: boolean; // for non-authenticated users
  size?: number;
};

export default function RatingStars({
  value = 0,
  onRate,
  disabled = false,
  size = 20,
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex gap-1">
      {[...Array(10)].map((_, i) => {
        const starValue = i + 1;

        const isActive =
          hovered !== null
            ? starValue <= hovered
            : starValue <= Math.round(value);

        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onMouseEnter={() => !disabled && setHovered(starValue)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => {
              if (!disabled && onRate) {
                onRate(starValue);
              }
            }}
            className="transition"
            aria-label={`Rate ${starValue} out of 10`}
            title={
              disabled
                ? "Login as customer to rate"
                : `Rate ${starValue}/10`
            }
          >
            <Star
              size={size}
              className={`transition-all duration-200
                ${
                  isActive
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
                ${!disabled ? "hover:scale-125" : "opacity-70"}
                ${hovered && starValue <= hovered ? "drop-shadow-md" : ""}
              `}
            />
          </button>
        );
      })}
    </div>
  );
}