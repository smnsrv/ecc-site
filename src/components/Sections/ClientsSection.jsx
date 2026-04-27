function normaliseClient(entry) {
  if (typeof entry === "string") return { name: entry, logo: null };
  return { name: entry.name, logo: entry.logo ?? null };
}

function resolveLogoUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path) || path.startsWith("/")) return path;
  return `${import.meta.env.BASE_URL}${path}`;
}

function ClientLogoItem({ c }) {
  const src = resolveLogoUrl(c.logo);
  if (src) {
    return (
      <div className="client-logo">
        <img
          className="client-logo__img"
          src={src}
          alt={c.name}
          width="140"
          height="48"
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <div className="client-logo client-logo--text">
      <span className="client-logo__label">{c.name}</span>
    </div>
  );
}

export default function ClientsSection({ data }) {
  const u = data.ui;
  const items = (data.clients || []).map(normaliseClient);

  return (
    <section className="section" aria-labelledby="clients-heading">
      <div className="container center-head fade-up">
        <p className="eyebrow" id="clients-eyebrow">
          {u.clients_eyebrow}
        </p>
        <h2 className="s-title" id="clients-heading">
          {u.clients_title}
        </h2>
        {u.clients_sub ? <p className="s-sub">{u.clients_sub}</p> : null}
      </div>
      <div
        className="clients-marquee-wrap fade-up d1"
        role="region"
        aria-roledescription="карусель"
        aria-label={u.clients_title}
        aria-describedby="clients-eyebrow"
      >
        <div className="clients-marquee">
          <div className="clients-marquee__inner">
            <div className="clients-marquee__track">
              <div className="clients-marquee__group">
                {items.map((c) => (
                  <ClientLogoItem key={c.name} c={c} />
                ))}
              </div>
              <div className="clients-marquee__group clients-marquee__group--dup" aria-hidden="true">
                {items.map((c) => (
                  <ClientLogoItem key={`${c.name}-dup`} c={c} />
                ))}
              </div>
            </div>
          </div>
        </div>
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
