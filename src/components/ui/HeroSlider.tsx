import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Simple image slider for hero sections with manual navigation

// Static slide images
const slides = [
  "/hero1.jpg",
  "/hero2.jpg",
  "/hero3.jpg",
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0); // current slide index

    // Go to previous slide (wrap around)
  const prev = () =>
    setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));

      // Go to next slide (wrap around)
  const next = () =>
    setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-full h-full">

      {/* Current image */}
      <img
        src={slides[index]}
        className="w-full h-full object-cover"
      />

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicator lines */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 w-12 ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}