import PageHero from "./PageHero.jsx";
import ServicesGrid from "../Sections/ServicesGrid.jsx";

export default function Services({ data, onPage, onOpenService }) {
  const u = data.ui;
  return (
    <main>
      <PageHero
        eyebrow={u.page_services_eyebrow}
        title={u.page_services_title}
        sub={u.page_services_sub}
        contextNote={u.regulatory_context_line}
      />
      <section className="section services-page-cross">
        <div className="container fade-up">
          <p className="services-page-cross-text">{u.services_link_we_certify}</p>
          <button type="button" className="btn-ghost services-page-cross-btn" onClick={() => onPage("we-certify")}>
            {u.services_link_we_certify_btn}
          </button>
        </div>
      </section>
      <ServicesGrid data={data} onPage={onPage} onOpenService={onOpenService} home={false} />
    </main>
  );
}
