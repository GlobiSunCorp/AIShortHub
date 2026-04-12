export function VideoPlayerPlaceholder({ seriesTitle, episode, canWatch }) {
  return (
    <div className="player-shell">
      <div className="player-screen">
        <p>{seriesTitle}</p>
        <h2>Episode {episode}</h2>
        <small>{canWatch ? 'Playback source: pending API integration' : 'Locked episode • Unlock with plan'}</small>
      </div>
      <div className="player-meta row split small-text">
        <span>Progress synced to account (future)</span>
        <span>CDN source provider (future)</span>
      </div>
    </div>
  );
}
