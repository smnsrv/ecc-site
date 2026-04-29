import VideoPlayerEmbed from "../VideoPlayerEmbed.jsx";

export default function VideoSection({ data }) {
  const v = data.video_section;
  const gallery = Array.isArray(v.gallery) ? v.gallery : [];

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="video-grid">
          <div className="video-primary fade-up">
            <VideoPlayerEmbed className="" company={data.company} title="Сертификация — видео" />
          </div>
          <div className="video-side fade-up d1">
            {v.gallery_title ? <p className="video-gallery-title">{v.gallery_title}</p> : null}
            {gallery.length ? (
              <div className="video-gallery">
                {gallery.map((item) => (
                  <article key={item.title} className="video-gallery-item">
                    <div className="video-gallery-media">
                      <div className="ratio-16-9">
                        <iframe
                          title={item.title}
                          src={item.video_url || data.company.video_url}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="video-gallery-text">
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
