export default function Poster({ title, meta, compact = false }) {
  return (
    <div className="poster-card">
      <div className={`poster-media ${compact ? "compact" : ""}`} />
      <div className="poster-title">{title}</div>
      <div className="poster-meta">{meta}</div>
    </div>
  );
}
