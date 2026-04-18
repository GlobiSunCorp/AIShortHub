import { useMemo } from 'react';
import { EpisodeList } from '../components/EpisodeList';
import { VideoPlayerPlaceholder } from '../components/VideoPlayerPlaceholder';
import { Link, useRouter } from '../lib/router';
import { resolveMembership } from '../hooks/usePlanAccess';
import { formatUsd } from '../data/monetization';

export function WatchPage({ auth, id, episode, platform }) {
  const { navigate } = useRouter();
  const series = platform.series.find((item) => item.id === id) || platform.series[0];
  const episodes = platform.episodes.filter((item) => item.seriesId === series.id).sort((a, b) => a.number - b.number);
  const current = episodes.find((item) => item.number === Number(episode)) || episodes[0];
  const membership = resolveMembership(auth, platform);
  const isMember = membership.tier !== 'free' || Boolean(membership.creatorPlan) || auth.userState === 'admin';
  const monetization = series.monetization || { episodeUnlockPriceUsd: 0.99, freePreviewEpisodes: [1], titlePriceUsd: 7.99 };
  const freePreviewEpisodes = monetization.freePreviewEpisodes || [1];
  const canWatch = isMember || freePreviewEpisodes.includes(current.number);
  const watchSeconds = canWatch ? current.durationSeconds : Math.min(platform.platformConfig.trialSeconds, current.durationSeconds);

  const moreLikeThis = useMemo(() => platform.series.filter((item) => item.id !== series.id && item.status === 'published').slice(0, 3), [platform.series, series.id]);

  if (!current) return <section className="panel">该剧集暂无可播放分集。</section>;

  return (
    <div className="stack-lg">
      <section className="watch-layout">
        <div className="stack-md">
          <VideoPlayerPlaceholder
            title={series.title}
            subtitle={`Episode ${current.number}: ${current.title}`}
            canWatch={canWatch}
            helper={
              canWatch
                ? `当前可播放 ${watchSeconds}s · 地址: ${current.videoUrl}`
                : `guest 仅可试看预告和指定试看集；可单集解锁 ${formatUsd(current.unlockPriceUsd || monetization.episodeUnlockPriceUsd)} 或整季解锁 ${formatUsd(monetization.titlePriceUsd)}`
            }
          />

          <article className="panel">
            <h3>当前分集信息</h3>
            <p className="small-text">{`E${current.number} · ${current.title} · ${current.durationSeconds}s`}</p>
            <Link className="text-link" to={`/series/${series.id}`}>
              ← 返回详情页
            </Link>
          </article>

          {!canWatch ? (
            <article className="watch-lock">
              <h3>当前分集仅会员可观看</h3>
              <p className="small-text">非订阅用户可观看 trailer 和试看集，或按单集/整剧购买；Pro/Premium 自动解锁完整内容。</p>
              <div className="row wrap">
                <Link className="btn btn-primary" to="/pricing">
                  立即开通 Pro
                </Link>
                {!auth.isLoggedIn ? (
                  <>
                    <Link className="btn btn-ghost" to="/login">
                      登录
                    </Link>
                    <Link className="btn btn-ghost" to="/signup">
                      注册
                    </Link>
                  </>
                ) : null}
              </div>
            </article>
          ) : null}
        </div>

        <aside className="panel stack-md watch-rail">
          <h3>{series.title}</h3>
          <p>{series.synopsis}</p>
          <EpisodeList
            episodes={episodes}
            currentEpisodeNumber={current.number}
            onSelect={(ep) => navigate(`/watch/${series.id}/${ep}`)}
            membershipLocked={(item) => !isMember && !freePreviewEpisodes.includes(item.number)}
          />
        </aside>
      </section>

      <section>
        <h2>更多推荐</h2>
        <div className="row wrap">
          {moreLikeThis.map((item) => (
            <Link key={item.id} className="meta-pill" to={`/series/${item.id}`}>
              {item.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
