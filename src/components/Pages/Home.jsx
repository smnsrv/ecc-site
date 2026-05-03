import ServicesGrid from "../Sections/ServicesGrid.jsx";
import AboutHighlightSection from "../Sections/AboutHighlightSection.jsx";
import VideoSection from "../Sections/VideoSection.jsx";
import ClientsSection from "../Sections/ClientsSection.jsx";
import Process from "../Sections/Process.jsx";
import Numbers from "../Sections/Numbers.jsx";
import Reviews from "../Sections/Reviews.jsx";
import CasesSection from "../Sections/CasesSection.jsx";
import FaqSection from "../Sections/FaqSection.jsx";
import CtaForm from "../Sections/CtaForm.jsx";

export default function Home({ data, onPage, onOpenService }) {
  return (
    <main>
      <ServicesGrid data={data} onPage={onPage} onOpenService={onOpenService} home />
      <AboutHighlightSection data={data} onPage={onPage} />
      <VideoSection data={data} onPage={onPage} />
      <ClientsSection data={data} />
      <Process data={data} onPage={onPage} />
      <Numbers data={data} />
      <Reviews data={data} />
      <CasesSection data={data} />
      <FaqSection data={data} />
      <CtaForm data={data} />
    </main>
  );
}
