import { useMemo, useState } from 'react';
import { SeriesCard } from '../components/SeriesCard';
import { SectionTitle } from '../components/SectionTitle';
import { DarkSelect } from '../components/DarkSelect';
import { useBrowseDiscovery } from '../hooks/useBrowseDiscovery';

const FORMAT_RAIL = [
  { label: 'Cinematic', hint: 'Film-style AI shorts' },
  { label: 'Vertical', hint: 'Mobile-first stories' },
  { label: 'Animation', hint: 'Animated creator work' },
  { label: 'Music Video', hint: 'Song-led AI visuals' },
  { label: 'Trailer', hint: 'Teasers and launch cuts' },
  { label: 'Commercial', hint: 'Brand-safe spots' },
  { label: 'Product Video', hint: 'Product-led showcase' },
  { label: 'Experimental', hint: 'New-form AI tests' },
];

export function BrowsePage({ platform }) {
  const [filters, setFilters] = useState({
    query: '',
    category: 'All',
    sort: 'Featured',
    quickFilter: 'All',
  });
  const discovery = useBrowseDiscovery(platform, filters);
  const suggestions = useMemo(() => discovery.suggestions.slice(0, 5), [discovery.suggestions]);
  const totalResults = discovery.result.length;
  const totalFormats = Math.max(discovery.categories.length - 1, 0);

  return (
    <div className="ds-page">
      <section className="panel ds-section stack-md">
        <SectionTitle eyebrow="AI shorts discovery" title="Browse" desc="Discover AI-powered short videos by format, genre, style, monetization mode, and creator profile." />
        <p className="ds-meta">Smart discovery supports title, tag, creator, synopsis, style, format, and payment keywords with guided suggestions and low-content launch resilience.</p>

        <div className="grid cards-3">
          <article className="mini-card" style={{ borderRadius: '24px' }}>
            <p className="ds-caption">Visible titles</p>
            <p className="stat-value">{totalResults}</p>
            <p className="ds-meta">Current filtered AI shorts ready to explore.</p>
          </article>
          <article className="mini-card" style={{ borderRadius: '24px' }}>
            <p className="ds-caption">Formats / categories</p>
            <p className="stat-value">{totalFormats}</p>
            <p className="ds-meta">Cinematic, vertical, animation, music video, trailer, commercial, product video, and more.</p>
          </article>
          <article className="mini-card" style={{ borderRadius: '24px' }}>
            <p className="ds-caption">Discovery mode</p>
            <p className="stat-value">Smart</p>
            <p className="ds-meta">Search can mix creator names, mood, format, genre, and monetization terms.</p>
          </article>
        </div>

        <section className="mini-card stack-sm" style={{ borderRadius: '24px' }}>
          <div className="row wrap center" style={{ justifyContent: 'space-between' }}>
            <div>
              <h3 className="ds-h3">Explore by format</h3>
              <p className="ds-meta">Jump into the content shape first, then refine by tags or access type.</p>
            </div>
            <span className="meta-pill">{FORMAT_RAIL.length} launch lanes</span>
          </div>
          <div className="row wrap">
            {FORMAT_RAIL.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`filter-chip ${filters.category === item.label ? 'active-chip' : ''}`}
                onClick={() => setFilters((prev) => ({ ...prev, category: item.label }))}
                title={item.hint}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <div className="browse-filters">
          <label>
            Smart Search
            <input
              className="input"
              value={filters.query}
              onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
              placeholder="Search title, tag, creator, synopsis, theme, or payment type"
            />
          </label>
          <DarkSelect
            id="browse-category"
            label="Category"
            value={filters.category}
            onChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
            options={discovery.categories.map((value) => ({ value, label: value }))}
          />
          <DarkSelect
            id="browse-sort"
            label="Sort"
            value={filters.sort}
            onChange={(value) => setFilters((prev) => ({ ...prev, sort: value }))}
            options={discovery.sortOptions.map((item) => ({ value: item, label: item }))}
          />
        </div>

        <div className="row wrap">
          {discovery.quickFilters.map((item) => (
            <button
              key={item}
              type="button"
              className={`filter-chip ${filters.quickFilter === item ? 'active-chip' : ''}`}
              onClick={() => setFilters((prev) => ({ ...prev, quickFilter: item }))}
              title={`Filter by ${item}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="row wrap">
          <strong className="ds-caption">Hot keywords:</strong>
          {discovery.hotKeywords.map((word) => (
            <button key={word} className="text-link" type="button" onClick={() => setFilters((prev) => ({ ...prev, query: word }))}>
              {word}
            </button>
          ))}
        </div>

        {suggestions.length ? <p className="ds-meta">Suggestions: {suggestions.join(' · ')}</p> : null}
        {discovery.activeFilters.length ? <p className="ds-caption">Active filters: {discovery.activeFilters.join(' | ')}</p> : <p className="ds-caption">Active filters: none</p>}
      </section>

      {discovery.catalog.firstBatch.length && filters.query.trim() === '' ? (
        <section className="ds-section">
          <SectionTitle eyebrow="Curated start" title="Launch Starter Picks" desc="Curated featured entries for first-time viewers who want one fast, high-confidence click." />
          <div className="grid cards-3">
            {discovery.catalog.firstBatch.map((item) => (
              <SeriesCard
                key={`starter-${item.id}`}
                series={item}
                episodeCount={discovery.catalog.episodeMap[item.id]?.total}
                previewCount={discovery.catalog.episodeMap[item.id]?.preview}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="ds-section">
        <SectionTitle eyebrow="Catalog" title="All discoverable AI shorts" desc="Browse currently available titles across free preview, subscriber access, and paid unlock formats." />
        <div className="grid cards-3">
          {discovery.result.map((item) => (
            <SeriesCard
              key={item.id}
              series={item}
              episodeCount={discovery.catalog.episodeMap[item.id]?.total}
              previewCount={discovery.catalog.episodeMap[item.id]?.preview}
            />
          ))}
        </div>
      </section>

      {discovery.result.length === 0 ? (
        <section className="empty-state">
          <h3 className="ds-h3">No exact match yet</h3>
          <p className="ds-meta">Try broader keywords, switch quick filters, or jump into curated picks below. Browse is tuned for a growing AI shorts catalog, so broad searches usually perform better during soft launch.</p>
          <div className="grid cards-3">
            {discovery.fallbackRecommendations.map((item) => (
              <SeriesCard
                key={`fallback-${item.id}`}
                series={item}
                episodeCount={discovery.catalog.episodeMap[item.id]?.total}
                previewCount={discovery.catalog.episodeMap[item.id]?.preview}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
