import { useMemo, useState } from 'react';
import { SeriesCard } from '../components/SeriesCard';
import { SectionTitle } from '../components/SectionTitle';
import { seriesData } from '../data/series';

export function BrowsePage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return seriesData;
    return seriesData.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.genres.join(' ').toLowerCase().includes(q) ||
        item.hook.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="stack-lg">
      <section className="panel">
        <SectionTitle title="Browse Library" desc="Find premium short dramas by mood, genre, or campaign keyword." />
        <input
          className="input"
          placeholder="Search drama, genre, creator, or promotion"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </section>
      <div className="grid cards-3">
        {filtered.map((series) => (
          <SeriesCard key={series.id} series={series} />
        ))}
      </div>
    </div>
  );
}
