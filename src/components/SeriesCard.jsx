import { Link } from '../lib/router';

export function SeriesCard({ series, episodeCount = 0, previewCount = 0 }) {
  const monetization = series?.monetization || {};
  const accessLabel = previewCount > 0 ? 'Free Preview' : monetization.subscriptionAccess ? 'Included with Subscription' : 'Paid Unlock';
  const reviewLabel = series.status === 'pending_review' ? 'In Review' : series.status;

  return (
    <article className="series-card">
      <Link className="cover from-purple cover-link" to={`/watch/${series.id}/1`}>
        <span>{reviewLabel}</span>
        <div className="play-overlay" aria-label="Play series trailer">
          ▶ Play
        </div>
      </Link>
      <div className="series-card-body stack-md">
        <div className="row split center">
          <h3>{series.title}</h3>
          <span className="status">{accessLabel}</span>
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
        <div className="row split center">
          <Link className="text-link" to={`/watch/${series.id}/1`}>
            Play now →
          </Link>
          <Link className="text-link" to={`/series/${series.id}`}>
            View detail →
          </Link>
        </div>
      </div>
    </article>
  );
}
