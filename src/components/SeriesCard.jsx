import { Link } from '../lib/router';

export function SeriesCard({ series, episodeCount = 0, previewCount = 0 }) {
  return (
    <article className="series-card">
      <div className="cover from-purple">
        <span>{series.status}</span>
      </div>
      <div className="series-card-body stack-md">
        <div className="row split center">
          <h3>{series.title}</h3>
          <span className="status">{series.visibility}</span>
        </div>
        <p>{series.synopsis}</p>
        <div className="row wrap">
          {(series.tags || []).map((tag) => (
            <span key={tag} className="genre-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="row split small-text series-card-foot">
          <span>{episodeCount} Episodes</span>
          <span>{previewCount} Preview</span>
        </div>
        <Link className="text-link" to={`/series/${series.id}`}>
          View detail →
        </Link>
      </div>
    </article>
  );
}
