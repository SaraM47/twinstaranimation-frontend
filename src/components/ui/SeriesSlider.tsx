import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "../../assets/img1.png";
import img2 from "../../assets/img2.png";
import img3 from "../../assets/img3.png";

// Advanced carousel with animated transitions and multi-position layout

// Key idea:
// - Uses "positions" (left, center, right, offscreen)
// - Uses animation phases (prepare → move)
// - Keeps DOM stable for smooth transitions

const items = [img1, img2, img3];
const ANIMATION_MS = 500;

type Direction = "prev" | "next";
type Phase = "prepare" | "move";

type AnimState = {
  direction: Direction;
  phase: Phase;
} | null;

type Position = "offLeft" | "left" | "center" | "right" | "offRight";

// wrapIndex ensures circular navigation
function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

// getPositionStyle defines visual state for each slide position
// Includes transform, scale, opacity, and z-index layering
function getPositionStyle(position: Position): React.CSSProperties {
  switch (position) {
    case "offLeft":
      return {
        transform: "translateX(-520px) scale(0.75)",
        width: "160px",
        height: "260px",
        opacity: 0,
        filter: "brightness(0.75)",
        zIndex: 0,
      };
    case "left":
      return {
        transform: "translateX(-260px) scale(0.9)",
        width: "160px",
        height: "260px",
        opacity: 0.5,
        filter: "brightness(0.75)",
        zIndex: 10,
      };
    case "center":
      return {
        transform: "translateX(0px) scale(1.1)",
        width: "220px",
        height: "340px",
        opacity: 1,
        filter: "brightness(1)",
        zIndex: 20,
      };
    case "right":
      return {
        transform: "translateX(260px) scale(0.9)",
        width: "160px",
        height: "260px",
        opacity: 0.5,
        filter: "brightness(0.75)",
        zIndex: 10,
      };
    case "offRight":
      return {
        transform: "translateX(520px) scale(0.75)",
        width: "160px",
        height: "260px",
        opacity: 0,
        filter: "brightness(0.75)",
        zIndex: 0,
      };
    default:
      return {};
  }
}

// Main component manages active index, animation state, and slide rendering
export default function SeriesSlider() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [animState, setAnimState] = useState<AnimState>(null);

  const timeoutRef = useRef<number | null>(null);

  const indices = useMemo(() => {
    return {
      prev2: wrapIndex(activeIndex - 2, items.length),
      prev: wrapIndex(activeIndex - 1, items.length),
      current: wrapIndex(activeIndex, items.length),
      next: wrapIndex(activeIndex + 1, items.length),
      next2: wrapIndex(activeIndex + 2, items.length),
    };
  }, [activeIndex]);

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // startSlide initiates the animation sequence for a given direction
  const startSlide = (direction: Direction) => {
    if (animState) return;

    setAnimState({ direction, phase: "prepare" });

    // Two nested requestAnimationFrames ensure the "prepare" state is applied before transitioning to "move"
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimState({ direction, phase: "move" });
      });
    });

    timeoutRef.current = window.setTimeout(() => {
      setActiveIndex((prev) =>
        direction === "next"
          ? wrapIndex(prev + 1, items.length)
          : wrapIndex(prev - 1, items.length)
      );
      setAnimState(null);
    }, ANIMATION_MS);
  };

  const handleDotClick = (targetIndex: number) => {
    if (animState || targetIndex === activeIndex) return;

    const nextIndex = wrapIndex(activeIndex + 1, items.length);
    const prevIndex = wrapIndex(activeIndex - 1, items.length);

    if (targetIndex === nextIndex) {
      startSlide("next");
      return;
    }

    if (targetIndex === prevIndex) {
      startSlide("prev");
      return;
    }

    setActiveIndex(targetIndex);
  };

  // renderSlides determines which slides to render based on the current animation state and their positions
  const renderSlides = () => {
    if (!animState) {
      return [
        {
          key: `left-${indices.prev}`,
          src: items[indices.prev],
          position: "left" as Position,
        },
        {
          key: `center-${indices.current}`,
          src: items[indices.current],
          position: "center" as Position,
        },
        {
          key: `right-${indices.next}`,
          src: items[indices.next],
          position: "right" as Position,
        },
      ];
    }

    if (animState.direction === "next" && animState.phase === "prepare") {
      return [
        {
          key: `left-${indices.prev}`,
          src: items[indices.prev],
          position: "left" as Position,
        },
        {
          key: `center-${indices.current}`,
          src: items[indices.current],
          position: "center" as Position,
        },
        {
          key: `right-${indices.next}`,
          src: items[indices.next],
          position: "right" as Position,
        },
        {
          key: `incoming-${indices.next2}`,
          src: items[indices.next2],
          position: "offRight" as Position,
        },
      ];
    }

    if (animState.direction === "next" && animState.phase === "move") {
      return [
        {
          key: `left-${indices.prev}`,
          src: items[indices.prev],
          position: "offLeft" as Position,
        },
        {
          key: `center-${indices.current}`,
          src: items[indices.current],
          position: "left" as Position,
        },
        {
          key: `right-${indices.next}`,
          src: items[indices.next],
          position: "center" as Position,
        },
        {
          key: `incoming-${indices.next2}`,
          src: items[indices.next2],
          position: "right" as Position,
        },
      ];
    }

    if (animState.direction === "prev" && animState.phase === "prepare") {
      return [
        {
          key: `incoming-${indices.prev2}`,
          src: items[indices.prev2],
          position: "offLeft" as Position,
        },
        {
          key: `left-${indices.prev}`,
          src: items[indices.prev],
          position: "left" as Position,
        },
        {
          key: `center-${indices.current}`,
          src: items[indices.current],
          position: "center" as Position,
        },
        {
          key: `right-${indices.next}`,
          src: items[indices.next],
          position: "right" as Position,
        },
      ];
    }

    return [
      {
        key: `incoming-${indices.prev2}`,
        src: items[indices.prev2],
        position: "left" as Position,
      },
      {
        key: `left-${indices.prev}`,
        src: items[indices.prev],
        position: "center" as Position,
      },
      {
        key: `center-${indices.current}`,
        src: items[indices.current],
        position: "right" as Position,
      },
      {
        key: `right-${indices.next}`,
        src: items[indices.next],
        position: "offRight" as Position,
      },
    ];
  };

  const slides = renderSlides();

  return (
    <div className="relative flex flex-col items-center">
      <div className="mt-20 mb-20 relative flex w-full max-w-6xl justify-center">
        <div className="relative h-[650px] w-[900px] overflow-hidden">
          {slides.map((slide) => {
            const isCenter = slide.position === "center";
            const isSide =
              slide.position === "left" || slide.position === "right";

            return (
              <img
                key={slide.key}
                src={slide.src}
                alt=""
                className="absolute left-1/2 top-1/2 object-contain transition-all duration-500 ease-in-out"
                style={{
                  ...getPositionStyle(slide.position),

                  width: isCenter ? "480px" : isSide ? "320px" : "260px",
                  height: isCenter ? "580px" : isSide ? "420px" : "360px",

                  transform: `translate(-50%, -50%) ${
                    getPositionStyle(slide.position).transform ?? ""
                  }`,
                }}
              />
            );
          })}
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => startSlide("prev")}
          className="absolute left-0 top-1/2 z-30 -translate-y-1/2 text-white hover:scale-110"
        >
          <ChevronLeft size={40} />
        </button>

        <button
          type="button"
          onClick={() => startSlide("next")}
          className="absolute right-0 top-1/2 z-30 -translate-y-1/2 text-white hover:scale-110"
        >
          <ChevronRight size={40} />
        </button>
      </div>

      {/* DOTS */}
      <div className="mt-6 flex justify-center gap-3">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`h-3 w-3 rounded-full ${
              i === activeIndex ? "bg-black" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
