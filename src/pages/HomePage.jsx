import { Link } from '../lib/router';
import { SectionTitle } from '../components/SectionTitle';
import { SeriesCard } from '../components/SeriesCard';
import { OnboardingGuide } from '../components/OnboardingGuide';
import { getCatalogSnapshot } from '../lib/selectors/getCatalogSnapshot';

export function HomePage({ platform }) {
  const catalog = getCatalogSnapshot(platform);
  const takeRate = Number(platform?.platformConfig?.platformTakeRate ?? 0.2);

  return (
    <div className="ds-page">
      <OnboardingGuide role="viewer" />
      <section className="hero premium-hero">
        <div>
          <span className="kicker">Soft launch viewer experience</span>
          <h1>Short drama streaming, creator tools, and clear monetization in one place.</h1>
          <p>AIShortHub is optimized for early launch with a small catalog: trailers stay visible, featured slots stay curated, and viewers always have a clear next title to watch.</p>
          <div className="row wrap">
            <Link className="btn btn-primary" to="/browse">Browse titles</Link>
            <Link className="btn btn-ghost" to="/pricing">View plans</Link>
          </div>
        </div>
        <Link className="hero-cover from-fuchsia cover-link" to="/browse">
          <span className="status">Launch-prep mode</span>
          <h3>Built for 2-3 launch titles</h3>
          <p>Strong first impression even with a lean catalog.</p>
          <div className="play-overlay">▶ Explore</div>
        </Link>
      </section>

      <section className="grid cards-3">
        <article className="card-primary"><h3 className="ds-h3">Creator-friendly economics</h3><p className="ds-meta">Monthly creator plan fee, separate service fees, and commission only after creator revenue exists.</p></article>
        <article className="card-secondary"><h3 className="ds-h3">Clear viewer access</h3><p className="ds-meta">Preview, trailer, subscription access, and title pricing are presented separately to reduce confusion.</p></article>
        <article className="card-data"><h3 className="ds-h3">Configurable platform take rate</h3><p className="ds-meta">Default configuration is {(takeRate * 100).toFixed(0)}%. Launch policy can run lower by plan tier.</p></article>
      </section>

      <section className="ds-section">
        <SectionTitle title="Featured Launch Titles" desc="Curated first batch for soft launch" />
        <div className="grid cards-2">
          {catalog.firstBatch.length ? catalog.firstBatch.map((item) => <SeriesCard key={item.id} series={item} episodeCount={catalog.episodeMap[item.id]?.total} previewCount={catalog.episodeMap[item.id]?.preview} />) : <article className="empty-state"><p className="ds-meta">No featured title yet. Add 2-3 titles with at least one trailer and one preview episode.</p></article>}
        </div>
      </section>

      <section className="ds-section">
        <SectionTitle title="Trending" desc="Live published content" />
        <div className="grid cards-3">
          {catalog.trending.length ? catalog.trending.map((item) => <SeriesCard key={item.id} series={item} episodeCount={catalog.episodeMap[item.id]?.total} previewCount={catalog.episodeMap[item.id]?.preview} />) : <article className="empty-state"><p className="ds-meta">Trending will populate automatically as view and unlock data grows.</p></article>}
        </div>
      </section>

      <section className="ds-section">
        <SectionTitle title="Latest Releases" desc="Recently updated" />
        <div className="grid cards-3">
          {catalog.latest.length ? catalog.latest.map((item) => <SeriesCard key={item.id} series={item} episodeCount={catalog.episodeMap[item.id]?.total} previewCount={catalog.episodeMap[item.id]?.preview} />) : <article className="empty-state"><p className="ds-meta">No new release yet. Start with one flagship trailer to keep this section fresh.</p></article>}
        </div>
      </section>
    </div>
  );
}
