import { useMemo } from 'react';
import { EpisodeList } from '../components/EpisodeList';
import { VideoPlayerPlaceholder } from '../components/VideoPlayerPlaceholder';
import { Link, useRouter } from '../lib/router';
import { resolveMembership } from '../hooks/usePlanAccess';
import { formatUsd } from '../data/monetization';

export function WatchPage({ auth, id, episode, platform }) {
  const { navigate } = useRouter();
  const series = (platform.series || []).find((item) => item.id === id) || platform.series[0];
  const episodes = (platform.episodes || []).filter((item) => item.seriesId === series.id).sort((a, b) => a.number - b.number);
  const current = episodes.find((item) => item.number === Number(episode)) || episodes[0];
  const membership = resolveMembership(auth, platform);
  const isMember = membership.tier !== 'free' || Boolean(membership.creatorPlan) || auth.userState === 'admin';
  const monetization = series.monetization || { episodeUnlockPriceUsd: 0.99, freePreviewEpisodes: [1], titlePriceUsd: 7.99, finaleUnlockEnabled: false };
  const freePreviewEpisodes = monetization.freePreviewEpisodes || [1];
  const canWatch = isMember || freePreviewEpisodes.includes(current?.number);
  const watchSeconds = canWatch ? current?.durationSeconds : Math.min(platform.platformConfig.trialSeconds, current?.durationSeconds || 0);

  const moreLikeThis = useMemo(() => (platform.series || []).filter((item) => item.id !== series.id && item.status === 'published').slice(0, 3), [platform.series, series.id]);

  if (!current) return <section className="empty-state">This AI short has no playable video yet.</section>;

  return (
    <div className="ds-page">
      <section className="watch-layout">
        <div className="stack-md">
          <VideoPlayerPlaceholder
            title={series.title}
            subtitle={`Video ${current.number}: ${current.title}`}
            canWatch={canWatch}
            helper={canWatch
              ? `Playable window: ${watchSeconds}s · Source URL: ${current.videoUrl}`
              : `Locked main video. Unlock this video for ${formatUsd(current.unlockPriceUsd || monetization.episodeUnlockPriceUsd)} or full title for ${formatUsd(monetization.titlePriceUsd)}.`}
          />

          <article className="panel ds-section">
            <h3 className="ds-h3">Playback context</h3>
            <p className="ds-caption">Trailer and preview videos are free. Main videos require subscription or unlock purchase.</p>
            <p className="ds-caption">Finale unlock: {monetization.finaleUnlockEnabled ? 'Enabled on this title' : 'Not enabled on this title'}.</p>
            <Link className="info-link" to={`/series/${series.id}`}>Back to title details</Link>
          </article>

          {!canWatch ? (
            <article className="watch-lock">
              <h3 className="ds-h3">Video locked</h3>
              <p className="ds-caption">Choose a plan for full access, or unlock only what you want to watch.</p>
              <div className="row wrap">
                <Link className="btn btn-primary" to="/pricing">Upgrade plan</Link>
                {!auth.isLoggedIn ? <><Link className="btn btn-ghost" to="/login">Login</Link><Link className="btn btn-ghost" to="/signup">Create account</Link></> : null}
              </div>
            </article>
          ) : null}
        </div>

        <aside className="panel stack-md watch-rail">
          <h3 className="ds-h3">{series.title}</h3>
          <p className="ds-caption">Preview videos: {freePreviewEpisodes.join(', ')}.</p>
          <EpisodeList
            episodes={episodes}
            currentEpisodeNumber={current.number}
            onSelect={(ep) => navigate(`/watch/${series.id}/${ep}`)}
            membershipLocked={(item) => !isMember && !freePreviewEpisodes.includes(item.number)}
          />
        </aside>
      </section>

      <section className="ds-section">
        <h2 className="ds-h2">More AI shorts</h2>
        <div className="row wrap">
          {moreLikeThis.map((item) => <Link key={item.id} className="meta-pill" to={`/series/${item.id}`}>{item.title}</Link>)}
        </div>
      </section>
    </div>
  );
}
