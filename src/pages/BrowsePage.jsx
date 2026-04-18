import { useState } from 'react';
import { SeriesCard } from '../components/SeriesCard';
import { SectionTitle } from '../components/SectionTitle';
import { DarkSelect } from '../components/DarkSelect';
import { getCatalogSnapshot } from '../lib/selectors/getCatalogSnapshot';

const statuses = ['all', 'published', 'pending_review', 'draft', 'rejected'];

export function BrowsePage({ platform }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');
  const [status, setStatus] = useState('all');
  const catalog = getCatalogSnapshot(platform, { query, tag, status });

  return (
    <div className="ds-page">
      <section className="panel ds-section">
        <SectionTitle title="Browse" desc="Search by title, creator, tag, and release status" />
        <p className="ds-meta">The browse experience stays intentional even in low-content launch mode.</p>
        <div className="browse-filters">
          <label>
            Search
            <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title or creator" />
          </label>
          <DarkSelect
            id="browse-tag"
            label="Tag"
            value={tag}
            onChange={setTag}
            options={[{ value: 'all', label: 'All tags' }, ...catalog.tags.map((value) => ({ value, label: value }))]}
          />
          <DarkSelect
            id="browse-status"
            label="Status"
            value={status}
            onChange={setStatus}
            options={statuses.map((item) => ({ value: item, label: item.replace('_', ' ') }))}
          />
        </div>
      </section>

      {catalog.firstBatch.length && query.trim() === '' && status === 'all' ? (
        <section className="ds-section">
          <SectionTitle title="Launch Starter Picks" desc="Trailer-first discovery for first visitors" />
          <div className="grid cards-3">
            {catalog.firstBatch.map((item) => (
              <SeriesCard
                key={`starter-${item.id}`}
                series={item}
                episodeCount={catalog.episodeMap[item.id]?.total}
                previewCount={catalog.episodeMap[item.id]?.preview}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid cards-3">
        {catalog.allSeries.map((item) => (
          <SeriesCard
            key={item.id}
            series={item}
            episodeCount={catalog.episodeMap[item.id]?.total}
            previewCount={catalog.episodeMap[item.id]?.preview}
          />
        ))}
      </section>

      {catalog.allSeries.length === 0 ? (
        <section className="empty-state">
          <h3 className="ds-h3">No title matches this filter yet</h3>
          <p className="ds-meta">Try removing one filter or start with a launch catalog of 2-3 titles that each include a trailer.</p>
        </section>
      ) : null}
    </div>
  );
}
