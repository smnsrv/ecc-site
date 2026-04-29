import PageHero from "./PageHero.jsx";
import CertificationStagesSection from "../Sections/CertificationStagesSection.jsx";

export default function CertificationStagesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Сертификация"
        title="Основные этапы сертификации продукции"
        sub="Подробная дорожная карта: от заявки и проверки документов до регистрации сертификата."
      />
      <CertificationStagesSection />
    </main>
  );
}
