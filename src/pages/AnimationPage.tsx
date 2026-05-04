import PublicHeader from "../components/layout/PublicHeader";
import { useQuery } from "@tanstack/react-query";
import { getSeries } from "../api/endpoints/series.api";
import { Link } from "react-router-dom";

// function to display animation page with hero section and grid of series fetched from backend
export default function AnimationPage() {
  const { data: series = [] } = useQuery({
    // Fetch series data from backend
    queryKey: ["series"], // Unique cache key for series data
    queryFn: getSeries, // API function to fetch series
  });

  // Loading state while fetching series data
  return (
    <div className="bg-white">
      {/* Hero */}
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1608889175123-8ee362201f81')",
        }}
      >
        <PublicHeader dark />

        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-transparent">
          <div className="max-w-6xl mx-auto px-16 pt-[220px]">
            <h1 className="font-heading text-4xl md:text-5xl text-black">
              FEATURED ANIMATION
            </h1>

            <p className="mt-3 text-black/70 font-body">
              Explore our animated series and short videos
            </p>
          </div>
        </div>
      </div>

      {/* Story section */}
      <div className="bg-gradient-to-b from-[#7F13FD] to-[#43089B] text-white">
        <div className="max-w-6xl mx-auto px-16 py-24">
          {/* Text */}
          <div className="max-w-2xl space-y-6">
            <h2 className="font-heading text-3xl md:text-4xl">
              Title for story behind animation
            </h2>

            <p className="font-body text-sm leading-relaxed opacity-90">
              This section will explain what are company focusing on in
              animation and why animation is important for them. Their goal on
              it and achievements.
            </p>
          </div>

          {/* Grid layout */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
            {series.map((s: any) => (
              <Link key={s.id} to={`/animation/${s.id}`} className="group">
                <div className="overflow-hidden">
                  <img
                    src={s.coverImageUrl}
                    className="w-full h-[180px] object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
