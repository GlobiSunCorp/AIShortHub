import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getSeriesById, seriesData } from "../data/series";

export default function WatchPage() {
  const { id, episode } = useParams();
  const selectedSeries = getSeriesById(id);
  const episodeNumber = Number(episode) || 1;
  const clampedEpisode = Math.min(Math.max(1, episodeNumber), selectedSeries.episodes);

  return (
    <section className="watch-layout">
      <div className="watch-main">
        <Link to={`/series/${selectedSeries.id}`} className="back-link">
          <ArrowLeft size={16} /> Back to Series
        </Link>

        <div className="player-shell">
          <div className="fake-player">
            <Play size={54} />
            <div className="player-title">Episode {clampedEpisode}</div>
            <div className="player-subtitle">{selectedSeries.title}</div>
          </div>

          <div className="watch-head">
            <div>
              <h3>
                Episode {clampedEpisode} —{" "}
                {selectedSeries.episodeNames[(clampedEpisode - 1) % selectedSeries.episodeNames.length]}
              </h3>
              <div className="subtle-text">Series: {selectedSeries.title}</div>
            </div>

            <div className="button-row">
              <Link
                to={`/watch/${selectedSeries.id}/${Math.max(1, clampedEpisode - 1)}`}
                className="btn btn-outline icon-btn"
              >
                <ArrowLeft size={16} />
              </Link>
              <Link
                to={`/watch/${selectedSeries.id}/${Math.min(selectedSeries.episodes, clampedEpisode + 1)}`}
                className="btn btn-outline icon-btn"
              >
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {clampedEpisode > selectedSeries.freeEpisodes && (
            <div className="gate-box">
              <h3>Continue Watching</h3>
              <p>Create an account to continue this series and unlock more curated AI dramas.</p>
              <div className="button-row">
                <button className="btn btn-light">Sign Up</button>
                <button className="btn btn-outline">Log In</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <aside className="watch-side">
        <div className="panel">
          <h3>Episode List</h3>
          <div className="episode-list">
            {Array.from({ length: Math.min(selectedSeries.episodes, 10) }).map((_, index) => {
              const itemEpisode = index + 1;
              return (
                <Link
                  key={itemEpisode}
                  to={`/watch/${selectedSeries.id}/${itemEpisode}`}
                  className={clampedEpisode === itemEpisode ? "episode-list-btn active" : "episode-list-btn"}
                >
                  <span>Episode {itemEpisode}</span>
                  <span>{itemEpisode <= selectedSeries.freeEpisodes ? "Free" : "Locked"}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <h3>More Like This</h3>
          <div className="side-list">
            {seriesData
              .filter((series) => series.id !== selectedSeries.id)
              .slice(0, 3)
              .map((item) => (
                <Link key={item.id} to={`/series/${item.id}`} className="side-item">
                  <div className="side-thumb" />
                  <div>
                    <div className="side-title">{item.title}</div>
                    <div className="side-meta">{item.genres.join(" • ")}</div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </aside>
    </section>
  );
}
