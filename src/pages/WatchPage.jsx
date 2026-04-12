import { useMemo, useState } from 'react';
import { AuthModal } from '../components/AuthModal';
import { EpisodeList } from '../components/EpisodeList';
import { SeriesCard } from '../components/SeriesCard';
import { VideoPlayerPlaceholder } from '../components/VideoPlayerPlaceholder';
import { seriesData } from '../data/series';
import { Link, useRouter } from '../lib/router';

export function WatchPage({ auth, id, episode }) {
  const { navigate } = useRouter();
  const series = seriesData.find((item) => item.id === id) || seriesData[0];
  const [showAuth, setShowAuth] = useState(false);
  const currentEpisode = Number(episode || 1);
  const canWatch = currentEpisode <= series.freeEpisodes || auth.isLoggedIn;

  const moreLikeThis = useMemo(() => seriesData.filter((item) => item.id !== series.id).slice(0, 3), [series.id]);

  const jumpTo = (ep) => {
    navigate(`/watch/${series.id}/${ep}`);
  };

  return (
    <div className="stack-lg">
      <section className="watch-layout">
        <div className="stack-md">
          <VideoPlayerPlaceholder seriesTitle={series.title} episode={currentEpisode} canWatch={canWatch} />

          <div className="row wrap">
            <button className="btn btn-ghost" onClick={() => jumpTo(Math.max(1, currentEpisode - 1))}>
              Previous
            </button>
            <button className="btn btn-primary" onClick={() => jumpTo(Math.min(series.episodes, currentEpisode + 1))}>
              Next Episode
            </button>
          </div>

          {!canWatch ? (
            <article className="watch-lock">
              <h3>Episode locked — unlock premium arc</h3>
              <p className="small-text">
                Episodes after {series.freeEpisodes} require account access. Sign up to continue instantly and sync progress across devices.
              </p>
              <div className="row wrap">
                <button className="btn btn-primary" onClick={() => setShowAuth(true)}>
                  Quick unlock
                </button>
                <Link className="btn btn-ghost" to="/signup">
                  Create account
                </Link>
                <Link className="btn btn-ghost" to="/login">
                  Log in
                </Link>
              </div>
            </article>
          ) : null}
        </div>

        <aside className="panel stack-md watch-rail">
          <h3>{series.title}</h3>
          <p>{series.hook}</p>
          <div className="meta-row">
            <span className="meta-pill">{series.episodes} episodes</span>
            <span className="meta-pill">Free {series.freeEpisodes}</span>
          </div>
          <EpisodeList series={series} currentEpisode={currentEpisode} onSelect={jumpTo} />
        </aside>
      </section>

      <section>
        <h2>More like this</h2>
        <div className="grid cards-3">
          {moreLikeThis.map((item) => (
            <SeriesCard key={item.id} series={item} />
          ))}
        </div>
      </section>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
