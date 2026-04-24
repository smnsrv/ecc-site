/** Логотипы клиентов и флаги стран */
export default function ClientsSection({ data }) {
  const u = data.ui;
  return (
    <section className="section">
      <div className="container center-head fade-up">
        <p className="eyebrow">{u.clients_eyebrow}</p>
        <h2 className="s-title">{u.clients_title}</h2>
        {u.clients_sub ? <p className="s-sub">{u.clients_sub}</p> : null}
      </div>
      <div className="container clients-grid fade-up d1">
        {data.clients.map((name) => (
          <div key={name} className="client-pill">
            {name}
          </div>
        ))}
      </div>
      <div className="container flags-row fade-up d2">
        {data.client_countries.map((c) => (
          <span key={c} className="flag-chip">
            {c}
          </span>
        ))}
      </div>
    </section>
  );
}
