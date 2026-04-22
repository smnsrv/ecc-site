/** Видео + текст */
export default function VideoSection({ data, onPage }) {
  const v = data.video_section;
  const url = data.company.video_url;
  return (
    <section className="section section-alt">
      <div className="container video-grid">
        <div className="video-embed fade-up">
          <div className="ratio-16-9">
            <iframe title="video" src={url} allowFullScreen />
          </div>
        </div>
        <div className="video-copy fade-up d1">
          <p className="eyebrow">{v.eyebrow}</p>
          <h2 className="s-title">{v.title}</h2>
          <p className="s-sub">{v.text}</p>
          <button type="button" className="btn-primary" onClick={() => onPage("about")}>
            {v.btn_about}
          </button>
        </div>
      </div>
    </section>
  );
}
