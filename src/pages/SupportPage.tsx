import PublicHeader from "../components/layout/PublicHeader";
import patreonImage from "../assets/patreon.svg";
import buyMeACoffeeImage from "../assets/buy-me-a-coffee.png";

// This page is a simple static page with info about how to support the project
export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7F13FD] to-[#43089B] text-white">
      <div className="relative">
        <PublicHeader />

        <div className="max-w-5xl mx-auto px-6 md:px-16 pt-[180px] pb-24">
          {/* Hero section */}
          <div className="text-center mt-20">
            <h1 className="font-heading text-4xl md:text-5xl text-[#57FA00]">
              SUPPORT THE CREATORS
            </h1>

            <p className="mt-14 font-body text-lg text-white/95">
              Help us continue creating comics and animations by supporting the
              project
            </p>
          </div>

          {/* Section for supprto and benefits */}
          <div className="mt-24 max-w-4xl mx-auto">
            {/* Tip support card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
              {/* Patreon */}
              <div className="flex flex-col items-center text-center">
                <h2 className="font-heading text-3xl text-[#57FA00]">
                  Support on Patreon
                </h2>

                <img
                  src={patreonImage}
                  alt="Patreon"
                  className="mt-8 h-20 w-20 object-contain"
                />

                <p className="mt-8 font-body text-lg leading-snug">
                  Get exclusive content
                  <br />
                  and early access
                </p>
              </div>

              {/* BuyMeACoffee */}
              <div className="flex flex-col items-center text-center">
                <h2 className="font-heading text-3xl text-[#57FA00]">
                  Buy us a coffee
                </h2>

                <img
                  src={buyMeACoffeeImage}
                  alt="Buy me a coffee"
                  className="mt-8 h-20 w-20 object-contain"
                />

                <p className="mt-8 font-body text-lg leading-snug">
                  Make a one-time
                  <br />
                  contribution
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-24 max-w-[360px] text-left">
              <h2 className="font-heading text-3xl text-[#57FA00]">
                Benefits
              </h2>

              <ul className="mt-8 space-y-5 font-body text-lg text-white/95 list-disc pl-7">
                <li>Early access to new chapters</li>
                <li>Updates about the project</li>
                <li>Potential community access</li>
                <li>Exclusive content (sketches, behind the scenes)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}