import VideoPlayerEmbed from "../VideoPlayerEmbed.jsx";

export default function VideoSection({ data, onPage }) {
  const v = data.video_section;

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="video-grid">
          <VideoPlayerEmbed
            className="fade-up"
            company={data.company}
            title="Сертификация — видео"
          />
          <div className="video-copy fade-up d1">
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
      </div>
    </section>
  );
}
