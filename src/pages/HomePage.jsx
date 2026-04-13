import { Link } from '../lib/router';
import { SectionTitle } from '../components/SectionTitle';
import { SeriesCard } from '../components/SeriesCard';

export function HomePage({ platform }) {
  const published = platform.series.filter((item) => item.status === 'published' && item.visibility === 'public');
  const trending = published.slice(0, 3);
  const latest = [...published].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);

  const episodeCounts = Object.fromEntries(
    published.map((s) => [
      s.id,
      {
        total: platform.episodes.filter((ep) => ep.seriesId === s.id).length,
        preview: platform.episodes.filter((ep) => ep.seriesId === s.id && ep.isPreview).length,
      },
    ])
  );

  return (
    <div className="stack-lg">
      <section className="hero premium-hero">
        <div>
          <span className="kicker">TikTok 引流 + 站内订阅闭环</span>
          <h1>AI 短剧创作与变现平台 MVP</h1>
          <p>创作者发布剧集、用户试看转会员、平台抽成与服务订单一体化。先跑通运营闭环，再逐步接入自动化增长能力。</p>
          <div className="row wrap">
            <Link className="btn btn-primary" to="/browse">浏览热剧</Link>
            <Link className="btn btn-ghost" to="/pricing">开通会员</Link>
          </div>
        </div>
        <Link className="hero-cover from-fuchsia cover-link" to="/browse">
          <span className="status">MVP Ready</span>
          <h3>可运营闭环</h3>
          <p>内容展示、试看、会员、创作者上传、审核、服务订单、管理后台</p>
          <div className="play-overlay">▶ Play</div>
        </Link>
      </section>

      <section className="grid cards-3">
        <article className="panel"><h3>平台定位</h3><p className="small-text">TikTok 负责前链路曝光，AIShortHub 负责承接转化与用户付费。</p></article>
        <article className="panel"><h3>创作者招募</h3><p className="small-text">支持上传封面、预告、分集内容，进入审核后上线变现。</p></article>
        <article className="panel"><h3>平台抽成</h3><p className="small-text">默认抽成 {(platform.platformConfig.platformTakeRate * 100).toFixed(0)}%，可在配置中调整。</p></article>
      </section>

      <section>
        <SectionTitle title="热门剧集" desc="发布状态且可见内容" />
        <div className="grid cards-3">
          {trending.length ? trending.map((item) => <SeriesCard key={item.id} series={item} episodeCount={episodeCounts[item.id]?.total} previewCount={episodeCounts[item.id]?.preview} />) : <article className="panel"><p className="small-text">当前暂无热门剧集，稍后会自动更新。</p></article>}
        </div>
      </section>

      <section>
        <SectionTitle title="最新上架" desc="最近更新内容" />
        <div className="grid cards-3">
          {latest.length ? latest.map((item) => <SeriesCard key={item.id} series={item} episodeCount={episodeCounts[item.id]?.total} previewCount={episodeCounts[item.id]?.preview} />) : <article className="panel"><p className="small-text">当前暂无上新内容，欢迎稍后再来查看。</p></article>}
        </div>
      </section>

      <section className="grid cards-2">
        <article className="panel"><h3>服务介绍区</h3><p className="small-text">Trailer Editing / Cover Design / Listing Packaging / TikTok Promo Pack / Subtitle & Localization。</p><Link className="text-link" to="/services">提交服务需求 →</Link></article>
        <article className="panel"><h3>TikTok 引流说明区</h3><p className="small-text">本轮仅实现引流说明与 Promo Pack 服务入口，未接 TikTok API 自动发布。</p></article>
      </section>
    </div>
  );
}
