/** URL по умолчанию, если в `company.video_url` пусто */
export const DEFAULT_VIDEO_EMBED = "https://www.youtube.com/embed/M7lc1UVf-VE";

const IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

export function getVideoEmbedUrl(company) {
  if (!company) return DEFAULT_VIDEO_EMBED;
  const raw = company.video_url?.trim();
  return raw || DEFAULT_VIDEO_EMBED;
}

export default function VideoPlayerEmbed({ className, company, src, title, loading = "lazy" }) {
  const url = src != null && src !== "" ? src : getVideoEmbedUrl(company);
  return (
    <div className={["video-embed", className].filter(Boolean).join(" ")}>
      <div className="ratio-16-9">
        <iframe
          title={title}
          src={url}
          allow={IFRAME_ALLOW}
          allowFullScreen
          loading={loading}
        />
      </div>
    </div>
  );
}
