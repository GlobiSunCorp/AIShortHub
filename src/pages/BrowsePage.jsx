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
      <SectionTitle title="Browse Series" desc="Search by genre, mood, or campaign." />
      <input
        className="input"
        placeholder="Search drama / genre / creator"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid cards-3">
        {filtered.map((series) => (
          <SeriesCard key={series.id} series={series} />
        ))}
      </div>
    </div>
  );
}
