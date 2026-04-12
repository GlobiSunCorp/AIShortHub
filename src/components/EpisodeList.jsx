export function EpisodeList({ series, currentEpisode, onSelect }) {
  return (
    <div className="episode-list">
      {Array.from({ length: series.episodes }).slice(0, 12).map((_, index) => {
        const ep = index + 1;
        const locked = ep > series.freeEpisodes;
        const label = series.episodeNames[index] || `Episode ${ep}`;
        return (
          <button
            key={ep}
            className={ep === currentEpisode ? 'ep-btn active' : 'ep-btn'}
            onClick={() => onSelect(ep)}
          >
            <span>E{ep}</span>
            <small>{label}</small>
            {locked ? <i>Locked</i> : <i>Free</i>}
          </button>
        );
      })}
    </div>
  );
}
