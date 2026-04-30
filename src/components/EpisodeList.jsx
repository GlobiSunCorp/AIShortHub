import { formatUsd } from '../data/monetization';

export function EpisodeList({ episodes, currentEpisodeNumber, onSelect, membershipLocked = () => false }) {
  if (!episodes.length) {
    return <p className="small-text">No videos yet. Upload the first trailer, preview, or main video to start distribution.</p>;
  }

  return (
    <div className="episode-list">
      {episodes.map((episode) => {
        const locked = membershipLocked(episode);
        return (
          <button
            key={episode.id}
            type="button"
            className={episode.number === currentEpisodeNumber ? 'ep-btn active' : 'ep-btn'}
            onClick={() => onSelect(episode.number)}
            title={`Open video ${episode.number}`}
          >
            <span>Video {episode.number}</span>
            <small>{episode.title}</small>
            {episode.isPreview ? (
              <i>Preview video</i>
            ) : (
              <i>{locked ? `Single-video unlock ${formatUsd(episode.unlockPriceUsd || 0.99)}` : 'Included in your current access'}</i>
            )}
          </button>
        );
      })}
    </div>
  );
}
