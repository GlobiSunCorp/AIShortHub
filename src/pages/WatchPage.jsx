import { useState } from 'react';
import { AuthModal } from '../components/AuthModal';
import { EpisodeList } from '../components/EpisodeList';
import { VideoPlayerPlaceholder } from '../components/VideoPlayerPlaceholder';
import { seriesData } from '../data/series';

export function WatchPage({ auth, id, episode }) {
  const series = seriesData.find((item) => item.id === id) || seriesData[0];
  const [showAuth, setShowAuth] = useState(false);
  const currentEpisode = Number(episode || 1);
  const canWatch = currentEpisode <= series.freeEpisodes || auth.isLoggedIn;

  const jumpTo = (ep) => {
    window.location.assign(`/watch/${series.id}/${ep}`);
  };

  return (
    <div className="watch-layout">
      <div className="stack-md">
        <VideoPlayerPlaceholder seriesTitle={series.title} episode={currentEpisode} canWatch={canWatch} />
        <div className="row wrap">
          <button className="btn btn-ghost" onClick={() => jumpTo(Math.max(1, currentEpisode - 1))}>
            Previous
          </button>
          <button className="btn btn-primary" onClick={() => jumpTo(Math.min(series.episodes, currentEpisode + 1))}>
            Next Episode
          </button>
          {!canWatch ? (
            <button className="btn btn-primary" onClick={() => setShowAuth(true)}>
              Unlock with signup
            </button>
          ) : null}
        </div>
      </div>

      <aside className="panel">
        <h3>{series.title}</h3>
        <p>{series.hook}</p>
        <EpisodeList series={series} currentEpisode={currentEpisode} onSelect={jumpTo} />
      </aside>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
