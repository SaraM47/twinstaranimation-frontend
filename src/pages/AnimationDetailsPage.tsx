import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSeriesById } from "../api/endpoints/series.api";
import { getEpisodesBySeries } from "../api/endpoints/episodes.api";
import PublicHeader from "../components/layout/PublicHeader";
import { ChevronLeft, ChevronRight, Lock, Play } from "lucide-react";

type SectionId = "intro" | "video" | "episodes" | "gallery";

export default function AnimationDetailsPage() {
  const { id } = useParams();
  const seriesId = Number(id);
  const navigate = useNavigate();

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>("intro");
  const [prevSlideIndex, setPrevSlideIndex] = useState<number | null>(null);

  const { data: series } = useQuery({
    queryKey: ["series", seriesId],
    queryFn: () => getSeriesById(seriesId),
    enabled: !!seriesId,
  });

  const {
    data: episodes = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["episodes", seriesId],
    queryFn: () => getEpisodesBySeries(seriesId),
    enabled: !!seriesId,
    retry: false,
  });

  const locked = isError;

  const heroImages = useMemo(() => {
    if (!series) return [];

    const baseImages = [series.coverImageUrl, series.coverImageUrl].filter(
      Boolean
    );

    return baseImages.length > 0 ? baseImages : [];
  }, [series]);

  const sliderItems = useMemo(() => {
    if (!series) return [];

    if (episodes.length > 0) {
      return episodes.map((episode: any, index: number) => ({
        id: episode.id ?? index,
        title: episode.title || `Episode ${index + 1}`,
        subtitle: `${(episode.videos ?? []).length} videos`,
        image: series.coverImageUrl,
      }));
    }

    return [
      {
        id: "fallback-1",
        title: series.title,
        subtitle: "Featured content",
        image: series.coverImageUrl,
      },
      {
        id: "fallback-2",
        title: `${series.title} trailer`,
        subtitle: "Preview",
        image: series.coverImageUrl,
      },
      {
        id: "fallback-3",
        title: `${series.title} gallery`,
        subtitle: "More content",
        image: series.coverImageUrl,
      },
    ];
  }, [series, episodes]);

  useEffect(() => {
    const ids: SectionId[] = ["intro", "video", "episodes", "gallery"];

    const observers = ids
      .map((sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return null;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(sectionId);
            }
          },
          {
            rootMargin: "-35% 0px -45% 0px",
            threshold: 0.1,
          }
        );

        observer.observe(element);
        return observer;
      })
      .filter(Boolean) as IntersectionObserver[];

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [series, episodes]);

  if (!series) {
    return <div className="p-10">Loading...</div>;
  }

  const currentHeroImage =
    heroImages[activeHeroIndex] || series.coverImageUrl;

  const currentSlide = sliderItems[activeSlideIndex] || sliderItems[0];

  const goToSection = (sectionId: SectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const goPrevSlide = () => {
    setPrevSlideIndex(activeSlideIndex);

    setActiveSlideIndex((prev) =>
      prev === 0 ? sliderItems.length - 1 : prev - 1
    );
  };

  const goNextSlide = () => {
    setPrevSlideIndex(activeSlideIndex);

    setActiveSlideIndex((prev) =>
      prev === sliderItems.length - 1 ? 0 : prev + 1
    );
  };

  const handlePlay = () => {
    if (locked) return;
    if (!episodes[0]?.id) return;

    navigate(`/viewer/videos/${episodes[0].id}`);
  };

  return (
    <div className="bg-[#F6F6F6] text-black">
      <div className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 lg:flex flex-col gap-3">
        {(["intro", "video", "episodes", "gallery"] as SectionId[]).map(
          (sectionId) => {
            const isActive = activeSection === sectionId;

            return (
              <button
                key={sectionId}
                type="button"
                onClick={() => goToSection(sectionId)}
                aria-label={`Go to ${sectionId} section`}
                className={`rounded-full transition ${
                  isActive
                    ? "h-3.5 w-3.5 bg-black"
                    : "h-2.5 w-2.5 bg-gray-300 hover:bg-gray-500"
                }`}
              />
            );
          }
        )}
      </div>

      <section className="relative h-[420px] md:h-[460px]">
        <PublicHeader dark />

        <div className="absolute inset-0">
          <img
            src={currentHeroImage}
            alt={series.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-white/45" />
        </div>

        <div className="relative mx-auto flex h-full max-w-6xl items-center justify-center px-6 md:px-16">
          <div className="flex w-full items-center justify-center">
            <img
              src={currentHeroImage}
              alt={series.title}
              className="h-20 w-20 rounded object-cover shadow-sm md:h-28 md:w-28"
            />
          </div>

          <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 md:flex flex-col gap-4">
            {heroImages.slice(0, 2).map((image, index) => {
              const isActive = activeHeroIndex === index;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveHeroIndex(index)}
                  className={`h-12 w-12 overflow-hidden border transition ${
                    isActive
                      ? "border-transparent bg-[#D9D9D9]"
                      : "border-[#D9D9D9] bg-white"
                  }`}
                  aria-label={`Show banner ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`Banner ${index + 1}`}
                    className={`h-full w-full object-cover ${
                      isActive ? "opacity-40" : "opacity-100"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12 md:px-16 md:py-16">
        <div className="mb-12 text-sm text-black">
          <Link to="/" className="underline">
            Home
          </Link>

          <span className="mx-2">{">"}</span>

          <Link to="/animation" className="underline">
            Animation
          </Link>

          <span className="mx-2">{">"}</span>

          <span className="font-semibold">Detailed animation</span>
        </div>

        <section id="intro" className="scroll-mt-24">
          <h1 className="font-heading text-4xl md:text-5xl">
            {series.title}
          </h1>

          <div className="mt-12 max-w-2xl">
            <h2 className="font-heading text-3xl md:text-4xl">
              Introduction
            </h2>

            <p className="mt-5 max-w-md font-body text-[15px] leading-relaxed text-black/80">
              {series.description ||
                "Section to explain what the animation series is about, like a short description"}
            </p>
          </div>
        </section>

        <section
          id="video"
          className="scroll-mt-24 mt-14 flex justify-center"
        >
          <div className="w-full max-w-[620px] border border-[#D9D9D9] bg-white p-5 md:p-6">
            <button
              type="button"
              onClick={handlePlay}
              disabled={locked}
              className="group relative block w-full overflow-hidden bg-[#EFEFEF] disabled:cursor-not-allowed"
              aria-label="Play animation trailer"
            >
              <img
                src={series.coverImageUrl}
                alt={series.title}
                className="h-[240px] w-full object-cover opacity-45 md:h-[300px]"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-24 w-24 items-center justify-center rounded-full border-[8px] border-black bg-white/70 transition group-hover:scale-105">
                  <Play className="ml-1 h-10 w-10 fill-black text-black" />
                </span>
              </div>
            </button>

            {locked && (
              <div className="mt-4 flex items-center gap-2 text-sm text-black/70">
                <Lock size={16} />
                <span>You need to purchase this content to play it.</span>
              </div>
            )}
          </div>
        </section>

        <section id="episodes" className="scroll-mt-24 mt-20">
          <h2 className="font-heading text-3xl md:text-4xl">Episodes</h2>

          <div className="mt-8 space-y-0 border-t border-black">
            {isLoading && (
              <div className="border-b border-black py-8 text-sm">
                Loading episodes...
              </div>
            )}

            {locked && !isLoading && (
              <div className="border-b border-black py-8 text-sm">
                This content is locked.
              </div>
            )}

            {!locked &&
              episodes.map((episode: any, index: number) => (
                <button
                  key={episode.id ?? index}
                  type="button"
                  onClick={() =>
                    navigate(`/viewer/videos/${episode.id}`)
                  }
                  className="flex w-full items-center gap-10 border-b border-black px-0 py-8 text-left transition hover:bg-black hover:text-white"
                >
                  <span className="min-w-[130px] font-body text-[15px]">
                    Episode {index + 1}
                  </span>

                  <span className="font-body text-[15px]">
                    {episode.title}
                  </span>
                </button>
              ))}
          </div>
        </section>

        <section id="gallery" className="scroll-mt-24 mt-20 mb-24">
          <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-[#EFEFEF]">
            <div className="relative h-[320px] md:h-[420px] lg:h-[500px]">
              {prevSlideIndex !== null && sliderItems[prevSlideIndex] && (
                <img
                  src={sliderItems[prevSlideIndex].image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-45 transition-opacity duration-500"
                />
              )}

              {currentSlide && (
                <img
                  key={activeSlideIndex}
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 animate-fadeIn"
                />
              )}

              <button
                onClick={goPrevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-black transition hover:scale-110"
              >
                <ChevronLeft size={56} strokeWidth={1.75} />
              </button>

              <button
                onClick={goNextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-black transition hover:scale-110"
              >
                <ChevronRight size={56} strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            {sliderItems.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setPrevSlideIndex(activeSlideIndex);
                  setActiveSlideIndex(index);
                }}
                className={`h-[3px] w-[52px] rounded-2xl transition ${
                  activeSlideIndex === index
                    ? "bg-black"
                    : "bg-[#BDBDBD]"
                }`}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}