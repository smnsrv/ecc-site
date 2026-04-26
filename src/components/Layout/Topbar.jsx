/**
 * Верхняя полоса: один телефон в шапке (см. ТЗ)
 */
const TOPBAR_PHONE = { text: "+998 95 1159997", tel: "998951159997" };

export default function Topbar() {
  const p = TOPBAR_PHONE;
  return (
    <header className="topbar">
      <div className="container topbar-inner topbar-inner--phone-only">
        <a className="topbar-link topbar-solo-phone" href={`tel:+${p.tel}`}>
          {p.text}
        </a>
      </div>
    </header>
  );
}
