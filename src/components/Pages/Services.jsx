import PageHero from "./PageHero.jsx";
import ServicesGrid from "../Sections/ServicesGrid.jsx";

export default function Services({ data, onPage }) {
  const u = data.ui;
  return (
    <main>
      <PageHero eyebrow={u.page_services_eyebrow} title={u.page_services_title} sub={u.page_services_sub} />
      <ServicesGrid data={data} onPage={onPage} home={false} />
    </main>
  );
}
