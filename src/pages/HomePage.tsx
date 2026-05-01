import PublicHeader from "../components/layout/PublicHeader";
import HeroSlider from "../components/ui/HeroSlider";
import SeriesSlider from "../components/ui/SeriesSlider";

// This is the home page of the website
export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative h-[500px]">
        <PublicHeader dark />
        <HeroSlider />
      </div>

      {/* Short about section */}
      <div className="bg-black text-white py-48 md:py-56">
        <div className="max-w-6xl mx-auto px-16">
          <h2 className="font-heading text-3xl md:text-4xl mb-8">
            Title to describe the company
          </h2>

          <p className="font-body text-sm md:text-base max-w-xl leading-relaxed text-white/80">
            This section will describe following points: what, where, when and
            why. What is Twinstar animation? Where are they located? When did
            the company started? Why is the company’s achievements.
          </p>
        </div>
      </div>

      {/* Slider series */}
      <div className="bg-gradient-to-b from-[#7F13FD] to-[#43089B] text-white py-20">
        <div className="max-w-6xl mx-auto px-16">
          <h2 className="font-heading text-3xl text-center mb-4">Series</h2>

          <SeriesSlider />
        </div>
      </div>

      {/* Showcase video */}
      <div className="w-full h-[500px] overflow-hidden">
        <video autoPlay muted loop className="w-full h-full object-cover">
          <source src="/videos/showcase.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
