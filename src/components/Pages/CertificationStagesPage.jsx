import PageHero from "./PageHero.jsx";
import CertificationStagesSection from "../Sections/CertificationStagesSection.jsx";

export default function CertificationStagesPage({ data }) {
  const note = data?.ui?.regulatory_context_line;
  return (
    <main>
      <PageHero
        eyebrow="Сертификация"
        title="Основные этапы сертификации продукции"
        sub="Подробная дорожная карта: от заявки и проверки документов до регистрации сертификата."
        contextNote={note}
      />
      <CertificationStagesSection />
    </main>
  );
}
