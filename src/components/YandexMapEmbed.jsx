const DEFAULT_LAT = 41.359135;
const DEFAULT_LNG = 69.248372;

/** URL виджета Яндекс.Карт: центр и метка (долгота, широта). */
function buildYandexMapWidgetUrl(lat, lng) {
  const z = 16;
  return `https://yandex.ru/map-widget/v1/?ll=${encodeURIComponent(`${lng},${lat}`)}&z=${z}&pt=${encodeURIComponent(
    `${lng},${lat},pm2rdm`
  )}&l=map`;
}

/**
 * @param {object} props
 * @param {number} [props.lat] — широта
 * @param {number} [props.lng] — долгота
 * @param {string} [props.className]
 * @param {string} props.title — заголовок для iframe (a11y)
 */
export default function YandexMapEmbed({ lat, lng, className = "", title = "Схема проезда" }) {
  const la = Number.isFinite(Number(lat)) ? Number(lat) : DEFAULT_LAT;
  const ln = Number.isFinite(Number(lng)) ? Number(lng) : DEFAULT_LNG;
  const src = buildYandexMapWidgetUrl(la, ln);
  return (
    <div className={`yandex-map-embed ${className}`.trim()}>
      <iframe
        title={title}
        src={src}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export function yandexMapCoordinatesFromCompany(company) {
  if (!company) return { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
  return {
    lat: Number(company.map_lat) || DEFAULT_LAT,
    lng: Number(company.map_lng) || DEFAULT_LNG,
  };
}
