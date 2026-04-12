import { useMemo, useState } from 'react';
import { SeriesCard } from '../components/SeriesCard';
import { SectionTitle } from '../components/SectionTitle';
import { seriesData } from '../data/series';

const moods = ['All Moods', 'Revenge', 'Romance', 'Mystery'];

export function BrowsePage() {
  const [query, setQuery] = useState('');
  const [mood, setMood] = useState(moods[0]);
  const [access, setAccess] = useState('All Access');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return seriesData.filter((item) => {
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.genres.join(' ').toLowerCase().includes(q) ||
        item.hook.toLowerCase().includes(q);
      const matchMood = mood === moods[0] || item.genres.some((genre) => genre.toLowerCase().includes(mood.toLowerCase()));
      const matchAccess = access === 'All Access' || (access === 'Mostly Free' ? item.freeEpisodes >= 3 : item.freeEpisodes < 3);
      return matchQuery && matchMood && matchAccess;
    });
  }, [query, mood, access]);

  return (
    <div className="stack-lg">
      <section className="panel">
        <SectionTitle title="Browse Library" desc="Discover premium short dramas by genre, mood, unlock path, and release momentum." />
        <div className="browse-filters">
          <label>
            Search
            <input
              className="input"
              placeholder="Search drama, creator, campaign, or keyword"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label>
            Mood
            <select className="input" value={mood} onChange={(e) => setMood(e.target.value)}>
              {moods.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Access
            <select className="input" value={access} onChange={(e) => setAccess(e.target.value)}>
              <option>All Access</option>
              <option>Mostly Free</option>
              <option>Premium Heavy</option>
            </select>
          </label>
        </div>
        <div className="row wrap">
          <span className="filter-chip">{filtered.length} series matched</span>
          <span className="filter-chip">Optimized for vertical mobile watch</span>
          <span className="filter-chip">Fresh campaign-ready drops</span>
        </div>
      </section>

      <div className="grid cards-3">
        {filtered.map((series) => (
          <SeriesCard key={series.id} series={series} />
        ))}
      </div>
    </div>
  );
}
