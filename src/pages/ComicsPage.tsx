import PublicHeader from "../components/layout/PublicHeader";
import { useQuery } from "@tanstack/react-query";
import { getSeries } from "../api/endpoints/series.api";
import { Link } from "react-router-dom";

// Function to display comics page with hero section and grid of comics fetched from backend
export default function ComicsPage() {
  const { data: series = [] } = useQuery({
    queryKey: ["series"],
    queryFn: getSeries,
  });

  const comics = series;

  // Loading state while fetching comics data
  return (
    <div className="bg-white">

      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <PublicHeader dark />

        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-transparent">

          <div className="max-w-6xl mx-auto px-16 pt-[220px]">

            <h1 className="font-heading text-4xl md:text-5xl text-black">
              FEATURED COMICS
            </h1>

            <p className="mt-3 text-black/70 font-body">
              Explore our comics
            </p>

          </div>

        </div>
      </div>

      <div className="bg-gradient-to-b from-[#7F13FD] to-[#43089B] text-white">

        <div className="max-w-6xl mx-auto px-16 py-20">

          <div className="max-w-2xl space-y-6">

            <h2 className="font-heading text-3xl md:text-4xl">
              Title for story behind comic
            </h2>

            <p className="font-body text-sm leading-relaxed opacity-90">
              This section will explain what are company focusing on in comics
              and why is comic important for them. Their goal on it and
              achievements.
            </p>

          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">

            {comics.map((s: any) => (
              <Link key={s.id} to={`/comics/${s.id}`} className="group">

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