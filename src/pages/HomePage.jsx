import { Link } from '../lib/router';
import { SectionTitle } from '../components/SectionTitle';
import { SeriesCard } from '../components/SeriesCard';
import { OnboardingGuide } from '../components/OnboardingGuide';
import { getLatestSeries } from '../lib/selectors/getLatestSeries';
import { getPublishedSeries } from '../lib/selectors/getPublishedSeries';
import { getSeriesEpisodeCounts } from '../lib/selectors/getSeriesEpisodeCounts';
import { getTrendingSeries } from '../lib/selectors/getTrendingSeries';

export function HomePage({ platform }) {
  const published = getPublishedSeries(platform);
  const trending = getTrendingSeries(platform);
  const latest = getLatestSeries(platform);
  const launchReady = published.slice(0, 2);
  const episodeCounts = getSeriesEpisodeCounts(published, Array.isArray(platform?.episodes) ? platform.episodes : []);
  const takeRate = Number(platform?.platformConfig?.platformTakeRate ?? 0.2);

  return (
    <div className="stack-lg">
      <OnboardingGuide role="viewer" />
      <section className="hero premium-hero">
        <div>
          <span className="kicker">TikTok 引流 + 站内订阅闭环</span>
          <h1>AI 短剧创作与变现平台 MVP</h1>
          <p>平台已进入 soft launch 准备：广告优先 + 服务收入 + 订阅 + 单次解锁 + 低抽成。适合 2-3 部首发短剧快速上线测试。</p>
          <div className="row wrap">
            <Link className="btn btn-primary" to="/browse">浏览热剧</Link>
            <Link className="btn btn-ghost" to="/pricing">开通会员</Link>
          </div>
        </div>
        <Link className="hero-cover from-fuchsia cover-link" to="/browse">
          <span className="status">Soft Launch Ready</span>
          <h3>首发内容承接</h3>
          <p>即使内容不多，也能通过 Trailer + 首发推荐位保持完整体验</p>
          <div className="play-overlay">▶ Play</div>
        </Link>
      </section>

      <section className="grid cards-3">
        <article className="panel"><h3>平台定位</h3><p className="small-text">TikTok 负责前链路曝光，AIShortHub 负责承接转化与用户付费。</p></article>
        <article className="panel"><h3>创作者招募</h3><p className="small-text">低门槛 Creator 方案：有收入后才抽成，月费与抽成分离。</p></article>
        <article className="panel"><h3>平台抽成政策</h3><p className="small-text">默认配置仍可调（{(takeRate * 100).toFixed(0)}%），但 launch policy 面向 Creator 执行 8%/5%/3% 低抽成。</p></article>
      </section>

      <section>
        <SectionTitle title="首发推荐（First Batch）" desc="适配少量优质内容的上新模式" />
        <div className="grid cards-2">
          {launchReady.length ? launchReady.map((item) => <SeriesCard key={item.id} series={item} episodeCount={episodeCounts[item.id]?.total} previewCount={episodeCounts[item.id]?.preview} />) : <article className="panel"><p className="small-text">可先准备 2-3 部短剧：每部至少 1 条 Trailer + 2 条 Main Episodes。</p></article>}
        </div>
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
