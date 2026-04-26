export default function VideoSection({ data, onPage }) {
  const v = data.video_section;
  const url = data.company.video_url?.trim();
  const hasVideo = Boolean(url);
  return (
    <section className="section section-alt">
      <div className={`container video-grid${hasVideo ? "" : " video-grid--text-only"}`}>
        {hasVideo ? (
          <div className="video-embed fade-up">
            <div className="ratio-16-9">
              <iframe title="video" src={url} allowFullScreen />
            </div>
          </div>
        ) : null}
        <div className={`video-copy fade-up${hasVideo ? " d1" : ""}`}>
          <p className="eyebrow">{v.eyebrow}</p>
          <h2 className="s-title">{v.title}</h2>
          <p className="s-sub">{v.intro}</p>
          {v.purposes_lead && v.purposes?.length ? (
            <>
              <p className="video-purposes-lead">{v.purposes_lead}</p>
              <ul className="video-purposes-list">
                {v.purposes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </>
          ) : null}
          <button type="button" className="btn-primary" onClick={() => onPage("about")}>
            {v.btn_about}
          </button>
        </div>
      </div>
    </section>
  );
}
