import { useCallback, useEffect, useRef, useState } from "react";

export const CERTIFICATION_STAGES = [
  {
    title: "Подача заявки и первичный анализ",
    text: [
      "Клиент направляет заполненную заявку, в которой указывает реквизиты компании и данные о продукции (наименование, модели, артикулы, коды ТН ВЭД).",
      "Орган по сертификации анализирует продукцию, подбирает подходящую схему (на разовую партию, контракт или серийное производство) и рассчитывает стоимость и сроки выполнения работ.",
    ],
  },
  {
    title: "Предоставление пакета документов",
    text: [
      "Заказчик передает необходимую документацию для оценки. В стандартный пакет входят: технические паспорта, руководства по эксплуатации, контракты на поставку, инвойсы, а также ранее полученные иностранные сертификаты (при наличии).",
      "Эксперты проверяют документацию на полноту и соответствие национальным стандартам (например, O'z DSt или межгосударственным ГОСТ).",
    ],
  },
  {
    title: "Отбор образцов продукции",
    text: ["Для проведения экспертизы отбираются типовые образцы заявленной продукции. Процедура фиксируется официальным актом отбора образцов."],
  },
  {
    title: "Лабораторные испытания",
    text: [
      "Образцы направляются в аккредитованную испытательную лабораторию. Проверяются ключевые показатели: электромагнитная совместимость и электробезопасность (для техники), физико-механические свойства (для металла) и другие критические параметры.",
      "По завершении тестов лаборатория выпускает официальный протокол испытаний.",
    ],
  },
  {
    title: "Анализ состояния производства (если применимо)",
    text: ["Этот этап обязателен только при сертификации серийного выпуска продукции. Эксперт выезжает на завод-изготовитель, чтобы оценить производственные мощности, технологические процессы и систему контроля качества."],
  },
  {
    title: "Оценка результатов и принятие решения",
    text: ["Эксперт органа по сертификации анализирует протоколы испытаний, акт отбора и, при необходимости, акт анализа производства. На основании этих данных принимается финальное решение о выдаче (или отказе в выдаче) документа."],
  },
  {
    title: "Оформление и регистрация сертификата",
    text: [
      "Сертификат соответствия печатается на защищенном бланке строгого учета.",
      "Документ вносится в единый государственный реестр сертифицированной продукции, после чего оригинал передается клиенту.",
    ],
  },
];

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function CertificationStagesSection() {
  const rowRefs = useRef([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollToStage = useCallback((idx) => {
    const el = rowRefs.current[idx];
    if (!el) return;
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "center",
    });
    el.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const nodes = rowRefs.current.filter(Boolean);
    if (!nodes.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target) {
          const idx = Number(visible[0].target.getAttribute("data-stage-idx"));
          if (!Number.isNaN(idx)) setActiveIdx(idx);
        }
      },
      { root: null, rootMargin: "-12% 0px -40% 0px", threshold: [0.08, 0.2, 0.45] }
    );

    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section section-alt cert-stages" aria-labelledby="cert-stages-heading">
      <div className="container">
        <div className="cert-stages-head fade-up">
          <h2 id="cert-stages-heading" className="s-title cert-stages-section-title">
            Пошаговая дорожная карта
          </h2>
          <p className="s-sub cert-stages-intro">
            Семь последовательных шагов — от заявки и проверки документов до регистрации сертификата в реестре. Выберите этап
            ниже или прокрутите страницу: активный шаг подсвечивается на панели перехода.
          </p>
        </div>

        <nav className="cert-stages-jump fade-up d1" aria-label="Быстрый переход к этапу сертификации">
          <span className="cert-stages-jump-label">К этапу:</span>
          <div className="cert-stages-jump-track">
            {CERTIFICATION_STAGES.map((item, idx) => (
              <button
                key={item.title}
                type="button"
                className={`cert-stages-jump-btn${activeIdx === idx ? " is-active" : ""}`}
                aria-current={activeIdx === idx ? "step" : undefined}
                onClick={() => scrollToStage(idx)}
                title={item.title}
              >
                <span className="cert-stages-jump-num">{idx + 1}</span>
                <span className="cert-stages-jump-text">{item.title}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="cert-stages-timeline" role="list">
          {CERTIFICATION_STAGES.map((item, idx) => (
            <div
              key={item.title}
              ref={(el) => {
                rowRefs.current[idx] = el;
              }}
              id={`cert-stage-${idx + 1}`}
              className={`cert-stages-row fade-up d${(idx % 7) + 1}`}
              data-stage-idx={idx}
              role="listitem"
              tabIndex={-1}
            >
              <div className="cert-stages-rail" aria-hidden="true">
                <span className="cert-stages-node">{idx + 1}</span>
                {idx < CERTIFICATION_STAGES.length - 1 ? <span className="cert-stages-spine" /> : null}
              </div>
              <article className="cert-stage-card">
                <h3>
                  <span className="cert-stage-card-num">{idx + 1}.</span> {item.title}
                </h3>
                <div className="cert-stage-card-body">
                  {item.text.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
