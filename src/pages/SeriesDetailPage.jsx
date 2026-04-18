import { Link, useRouter } from '../lib/router';
import { resolveMembership } from '../hooks/usePlanAccess';
import { formatUsd } from '../data/monetization';
import { EpisodeList } from '../components/EpisodeList';

export function SeriesDetailPage({ id, platform, auth }) {
  const { navigate } = useRouter();
  const series = platform.series.find((item) => item.id === id) || platform.series[0];
  const creator = platform.creators.find((item) => item.id === series.creatorId);
  const trailer = platform.trailers.find((item) => item.id === series.trailerId);
  const episodes = platform.episodes.filter((item) => item.seriesId === series.id).sort((a, b) => a.number - b.number);
  const membership = resolveMembership(auth, platform);
  const isMember = membership.tier !== 'free' || Boolean(membership.creatorPlan) || auth.userState === 'admin';
  const pricing = series.monetization || { titlePriceUsd: 0, episodeUnlockPriceUsd: 0, finaleUnlockEnabled: false, finaleUnlockPriceUsd: 0, freePreviewEpisodes: [1] };

  return (
    <div className="stack-lg">
      <section className="detail-hero panel">
        <Link className="detail-cover from-blue cover-link" to={`/watch/${series.id}/1`}>
          <span className="status">{series.status}</span>
          <h2>{series.title}</h2>
          <small>{series.coverUrl || 'Cover placeholder'}</small>
          <div className="play-overlay">▶ Play</div>
        </Link>

        <div>
          <h1>{series.title}</h1>
          <p>{series.synopsis}</p>
          <div className="meta-row">
            {series.tags.map((tag) => (
              <span className="meta-pill" key={tag}>
                {tag}
              </span>
            ))}
            <span className="meta-pill">Creator: {creator?.studioName || 'Unknown'}</span>
          </div>

          <div className="row wrap detail-actions">
            <Link className="btn btn-primary" to={`/watch/${series.id}/1`}>
              开始观看
            </Link>
            <Link className="btn btn-ghost" to={`/watch/${series.id}/1`}>
              预告入口：{trailer?.title || '未上传'}
            </Link>
          </div>

          <article className="mini-card" style={{ marginTop: '0.85rem' }}>
            <h4>Access & Pricing</h4>
            <p className="small-text">Subscription: Free only trailer/preview · Pro/Premium full access.</p>
            <p className="small-text">Single-title unlock: {formatUsd(pricing.titlePriceUsd)} · Episode unlock: {formatUsd(pricing.episodeUnlockPriceUsd)}</p>
            <p className="small-text">Free preview episodes: {pricing.freePreviewEpisodes?.join(', ') || '1'} · Finale pack: {pricing.finaleUnlockEnabled ? formatUsd(pricing.finaleUnlockPriceUsd) : 'Disabled'}</p>
          </article>

          {!isMember ? (
            <article className="watch-lock" style={{ marginTop: '1rem' }}>
              <h3>会员解锁提示</h3>
              <p className="small-text">Free 用户仅可看 Trailer 与试看集（前 {platform.platformConfig.trialSeconds}s）。可升级 Pro/Premium 或按整剧/单集解锁。</p>
              <Link className="text-link" to="/pricing">
                查看会员方案 →
              </Link>
            </article>
          ) : null}
        </div>
      </section>

      <section className="panel">
        <h2>分集列表</h2>
        <EpisodeList episodes={episodes} currentEpisodeNumber={1} onSelect={(ep) => navigate(`/watch/${series.id}/${ep}`)} membershipLocked={(item) => !isMember && !pricing.freePreviewEpisodes?.includes(item.number)} />
      </section>
    </div>
  );
}
