import { CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getSeriesById } from "../data/series";

export default function SeriesDetailPage() {
  const { id } = useParams();
  const selectedSeries = getSeriesById(id);

  return (
    <section className="detail-layout">
      <div className="detail-poster" />
      <div className="detail-main">
        <div className="detail-meta">
          {selectedSeries.genres.join(" • ")} • {selectedSeries.episodes} Episodes • {selectedSeries.subtitle}
        </div>
        <h2>{selectedSeries.title}</h2>
        <p className="lead-text">{selectedSeries.hook}</p>

        <div className="button-row">
          <Link to={`/watch/${selectedSeries.id}/1`} className="btn btn-light">
            Watch Episode 1
          </Link>
          <button className="btn btn-outline">Add to Watchlist</button>
        </div>

        <div className="subtle-text">First {selectedSeries.freeEpisodes} episodes free</div>

        <div className="panel">
          <h3>Synopsis</h3>
          <p>{selectedSeries.synopsis}</p>
        </div>

        <div className="two-col">
          <div className="panel">
            <h3>Why Watch</h3>
            <ul className="icon-list">
              {selectedSeries.whyWatch.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <h3>Creator / Studio</h3>
            <p>Submitted by {selectedSeries.creator}</p>
            <Link to="/submit" className="btn btn-outline small top-gap">
              Submit Your Series
            </Link>
          </div>
        </div>

        <div className="panel">
          <h3>Episodes</h3>
          <div className="episode-grid">
            {selectedSeries.episodeNames.map((ep, index) => (
              <Link key={ep} to={`/watch/${selectedSeries.id}/${index + 1}`} className="episode-btn">
                <span>
                  Episode {index + 1} — {ep}
                </span>
                <span>Watch</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Main Characters</h3>
          <div className="card-grid three">
            {selectedSeries.characters.map(([name, desc]) => (
              <div key={name} className="mini-card">
                <div className="mini-card-title">{name}</div>
                <div className="mini-card-text">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
