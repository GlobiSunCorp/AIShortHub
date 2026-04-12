import { Link } from '../lib/router';
import { EpisodeList } from '../components/EpisodeList';

export function SeriesDetailPage({ id, platform, auth }) {
  const series = platform.series.find((item) => item.id === id) || platform.series[0];
  const creator = platform.creators.find((item) => item.id === series.creatorId);
  const trailer = platform.trailers.find((item) => item.id === series.trailerId);
  const episodes = platform.episodes.filter((item) => item.seriesId === series.id).sort((a, b) => a.number - b.number);
  const membership = platform.memberships.find((item) => item.profileId === auth.user?.id);
  const isPro = membership && membership.tier !== 'free';

  return (
    <div className="stack-lg">
      <section className="detail-hero panel">
        <div className="detail-cover from-blue">
          <span className="status">{series.status}</span>
          <h2>{series.title}</h2>
          <small>{series.category}</small>
        </div>

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
            <button className="btn btn-ghost" type="button">
              预告片：{trailer?.title || '未上传'}
            </button>
          </div>

          {!isPro ? (
            <article className="watch-lock" style={{ marginTop: '1rem' }}>
              <h3>会员解锁提示</h3>
              <p className="small-text">非会员可看预告和首集试看。开通 Pro 后可观看全集并解锁更多剧集。</p>
              <Link className="text-link" to="/pricing">
                查看会员方案 →
              </Link>
            </article>
          ) : null}
        </div>
      </section>

      <section className="panel">
        <h2>分集列表</h2>
        <EpisodeList episodes={episodes} currentEpisodeNumber={1} onSelect={() => {}} membershipLocked={(episode) => !episode.isPreview && !isPro} />
      </section>
    </div>
  );
}
