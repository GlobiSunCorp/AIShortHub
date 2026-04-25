import { Link, useRouter } from '../lib/router';
import { resolveMembership } from '../hooks/usePlanAccess';
import { formatUsd } from '../data/monetization';
import { EpisodeList } from '../components/EpisodeList';

export function SeriesDetailPage({ id, platform, auth }) {
  const { navigate } = useRouter();
  const series = (platform.series || []).find((item) => item.id === id) || platform.series[0];
  const creator = (platform.creators || []).find((item) => item.id === series?.creatorId);
  const trailer = (platform.trailers || []).find((item) => item.id === series?.trailerId);
  const episodes = (platform.episodes || []).filter((item) => item.seriesId === series?.id).sort((a, b) => a.number - b.number);
  const pricing = series?.monetization || { titlePriceUsd: 0, episodeUnlockPriceUsd: 0, finaleUnlockEnabled: false, finaleUnlockPriceUsd: 0, freePreviewEpisodes: [1] };
  const freePreview = pricing.freePreviewEpisodes || [1];

  const membership = resolveMembership(auth, platform);
  const isMember = membership.tier !== 'free' || Boolean(membership.creatorPlan) || auth.userState === 'admin';
  const videoUnitLabel = episodes.length === 1 ? 'Video' : 'Videos';

  return (
    <div className="ds-page">
      <section className="detail-hero panel">
        <Link className="detail-cover from-blue cover-link" to={`/watch/${series.id}/1`}>
          <span className="status">{series.status}</span>
          <h2>{series.title}</h2>
          <small>{series.coverUrl || 'Cover placeholder'}</small>
          <div className="play-overlay">▶ Play</div>
        </Link>

        <div className="ds-section">
          <h1 className="ds-h1">{series.title}</h1>
          <p className="ds-meta">{series.synopsis}</p>
          <div className="meta-row">
            {(series.tags || []).map((tag) => <span className="meta-pill" key={tag}>{tag}</span>)}
            <span className="meta-pill">Creator: {creator?.studioName || 'Unknown'}</span>
            <span className="meta-pill">Trailer: {trailer?.title || 'Available in video 1 slot'}</span>
            <span className="meta-pill">{episodes.length} {videoUnitLabel}</span>
          </div>

          <div className="row wrap detail-actions">
            <Link className="btn btn-primary" to={`/watch/${series.id}/1`}>Watch now</Link>
            <Link className="btn btn-ghost" to="/pricing">Plans & unlock options</Link>
          </div>

          <article className="card-secondary">
            <h4 className="ds-h3">Access map</h4>
            <p className="ds-caption">Trailer: always open. Preview videos: {freePreview.join(', ')}. Main videos: require subscription or purchase.</p>
            <p className="ds-caption">Title price: {formatUsd(pricing.titlePriceUsd)} · Single-video unlock: {formatUsd(pricing.episodeUnlockPriceUsd)}</p>
            <p className="ds-caption">Finale unlock: {pricing.finaleUnlockEnabled ? formatUsd(pricing.finaleUnlockPriceUsd) : 'Not enabled'}</p>
          </article>

          {!isMember ? <article className="watch-lock"><h3 className="ds-h3">Need full access?</h3><p className="ds-caption">Free users can watch trailer + preview videos. Upgrade or unlock by title/video when ready.</p><Link className="info-link" to="/pricing">View viewer plans</Link></article> : null}
        </div>
      </section>

      <section className="panel ds-section">
        <h2 className="ds-h2">Videos</h2>
        <EpisodeList
          episodes={episodes}
          currentEpisodeNumber={1}
          onSelect={(ep) => navigate(`/watch/${series.id}/${ep}`)}
          membershipLocked={(item) => !isMember && !freePreview.includes(item.number)}
        />
      </section>
    </div>
  );
}
