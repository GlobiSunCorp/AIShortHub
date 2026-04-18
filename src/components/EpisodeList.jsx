import { formatUsd } from '../data/monetization';

export function EpisodeList({ episodes, currentEpisodeNumber, onSelect, membershipLocked = () => false }) {
  if (!episodes.length) {
    return <p className="small-text">No episodes yet. Upload the first episode to start distribution.</p>;
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
          >
            <span>E{episode.number}</span>
            <small>{episode.title}</small>
            {episode.isPreview ? <i>Preview</i> : <i>{locked ? `Unlock ${formatUsd(episode.unlockPriceUsd || 0.99)}` : 'Unlocked'}</i>}
          </button>
        );
      })}
    </div>
  );
}
