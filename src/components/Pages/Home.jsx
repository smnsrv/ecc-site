import { useMemo } from "react";
import heroRef from "../../assets/hero-lab-ref.png";
import Hero from "../Sections/Hero.jsx";
import ServicesGrid from "../Sections/ServicesGrid.jsx";
import VideoSection from "../Sections/VideoSection.jsx";
import ClientsSection from "../Sections/ClientsSection.jsx";
import Process from "../Sections/Process.jsx";
import Numbers from "../Sections/Numbers.jsx";
import Reviews from "../Sections/Reviews.jsx";
import CtaForm from "../Sections/CtaForm.jsx";

// 1) Твой референс в репо. 2–6) Unsplash, тема: учёные / лаборатория / холодный свет
// License: https://unsplash.com/license
const HERO_LAB_PHOTOS = [
  heroRef,
  "https://images.unsplash.com/photo-1631556759511-6ce895fbf0ad?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1745420052756-1b1c294a6420?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1581093577421-f561a654a353?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b12?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?auto=format&fit=crop&w=1920&q=80",
];

function pickRandomHeroUrl() {
  return HERO_LAB_PHOTOS[Math.floor(Math.random() * HERO_LAB_PHOTOS.length)];
}

export default function Home({ data, onPage, onOpenService }) {
  const heroBgUrl = useMemo(() => pickRandomHeroUrl(), []);

  return (
    <main>
      <section
        className="hero"
        style={{
          background: `linear-gradient(120deg, rgba(11, 31, 58, 0.9) 0%, rgba(11, 31, 58, 0.75) 42%, rgba(11, 31, 58, 0.88) 100%), url(${heroBgUrl}) center / cover no-repeat`,
        }}
      >
        <div className="container hero-inner">
          <Hero data={data} onPage={onPage} />
        </div>
      </section>
      <ServicesGrid data={data} onPage={onPage} onOpenService={onOpenService} home />
      <VideoSection data={data} onPage={onPage} />
      <ClientsSection data={data} />
      <Process data={data} />
      <Numbers data={data} />
      <Reviews data={data} />
      <CtaForm data={data} />
    </main>
  );
}
