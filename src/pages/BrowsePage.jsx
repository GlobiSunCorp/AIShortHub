import { useMemo, useState } from 'react';
import { SeriesCard } from '../components/SeriesCard';
import { SectionTitle } from '../components/SectionTitle';
import { DarkSelect } from '../components/DarkSelect';
import { useBrowseDiscovery } from '../hooks/useBrowseDiscovery';

export function BrowsePage({ platform }) {
  const [filters, setFilters] = useState({
    query: '',
    category: 'All',
    sort: 'Featured',
    quickFilter: 'All',
  });
  const discovery = useBrowseDiscovery(platform, filters);
  const suggestions = useMemo(() => discovery.suggestions.slice(0, 5), [discovery.suggestions]);

  return (
    <div className="ds-page">
      <section className="panel ds-section">
        <SectionTitle title="Browse" desc="Discover short dramas by category, mood, monetization mode, and creator profile." />
        <p className="ds-meta">Smart discovery supports title/tag/creator/synopsis/theme/payment keywords with guided suggestions.</p>
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
          <SectionTitle title="Launch Starter Picks" desc="Curated featured entries for first-time viewers" />
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

      <section className="grid cards-3">
        {discovery.result.map((item) => (
          <SeriesCard
            key={item.id}
            series={item}
            episodeCount={discovery.catalog.episodeMap[item.id]?.total}
            previewCount={discovery.catalog.episodeMap[item.id]?.preview}
          />
        ))}
      </section>

      {discovery.result.length === 0 ? (
        <section className="empty-state">
          <h3 className="ds-h3">No exact match yet</h3>
          <p className="ds-meta">Try broader keywords or switch quick filters. You can also start from trending picks below.</p>
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
