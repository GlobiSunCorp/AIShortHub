export function VideoPlayerPlaceholder({ title, subtitle, canWatch, helper }) {
  return (
    <div className="player-shell">
      <div className="player-screen">
        <p>{title}</p>
        <h2>{subtitle}</h2>
        <small>{canWatch ? 'Playable video (MVP placeholder)' : 'Locked video: upgrade or unlock to watch the full version'}</small>
      </div>
      <div className="player-meta row split small-text">
        <span>{helper}</span>
        <span>Streaming pipeline ready</span>
      </div>
    </div>
  );
}
