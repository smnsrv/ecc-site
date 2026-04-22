import Hero from "../Sections/Hero.jsx";
import ServicesGrid from "../Sections/ServicesGrid.jsx";
import VideoSection from "../Sections/VideoSection.jsx";
import ClientsSection from "../Sections/ClientsSection.jsx";
import Industries from "../Sections/Industries.jsx";
import Process from "../Sections/Process.jsx";
import WhyUs from "../Sections/WhyUs.jsx";
import Numbers from "../Sections/Numbers.jsx";
import Reviews from "../Sections/Reviews.jsx";
import CtaForm from "../Sections/CtaForm.jsx";

/** Главная: все секции по порядку ТЗ */
export default function Home({ data, onPage }) {
  return (
    <main>
      <section className="hero">
        <div className="container hero-inner">
          <Hero data={data} onPage={onPage} />
        </div>
      </section>
      <ServicesGrid data={data} onPage={onPage} home />
      <VideoSection data={data} onPage={onPage} />
      <ClientsSection data={data} />
      <Industries data={data} />
      <Process data={data} />
      <WhyUs data={data} />
      <Numbers data={data} />
      <Reviews data={data} />
      <CtaForm data={data} />
    </main>
  );
}
