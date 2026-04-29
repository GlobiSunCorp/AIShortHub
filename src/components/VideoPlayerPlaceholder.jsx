export function VideoPlayerPlaceholder({ title, subtitle, canWatch, helper }) {
  return (
    <div className="player-shell">
      <div className="player-screen">
        <p>{title}</p>
        <h2>{subtitle}</h2>
        <small>{canWatch ? 'Playable (MVP placeholder)' : 'Locked: upgrade or unlock to watch this full video'}</small>
      </div>
      <div className="player-meta row split small-text">
        <span>{helper}</span>
        <span>Supabase Storage / Mux ready</span>
      </div>
    </div>
  );
}
