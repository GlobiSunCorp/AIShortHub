import { useMemo, useState } from 'react';
import { SeriesCard } from '../components/SeriesCard';
import { SectionTitle } from '../components/SectionTitle';

const statuses = ['all', 'published', 'in_review', 'draft'];

export function BrowsePage({ platform }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');
  const [status, setStatus] = useState('all');

  const creatorsById = useMemo(() => Object.fromEntries(platform.creators.map((c) => [c.id, c])), [platform.creators]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return platform.series.filter((item) => {
      const creatorName = creatorsById[item.creatorId]?.studioName || '';
      const queryMatch = !q || item.title.toLowerCase().includes(q) || creatorName.toLowerCase().includes(q);
      const tagMatch = tag === 'all' || item.tags.includes(tag);
      const statusMatch = status === 'all' || item.status === status;
      return queryMatch && tagMatch && statusMatch;
    });
  }, [query, tag, status, platform.series, creatorsById]);

  return (
    <div className="stack-lg">
      <section className="panel">
        <SectionTitle title="Browse" desc="按题材、标签、状态筛选，支持搜索剧名/创作者" />
        <div className="browse-filters">
          <label>
            搜索
            <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索剧名或创作者" />
          </label>
          <label>
            标签
            <select className="input" value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value="all">全部</option>
              {platform.series
                .flatMap((s) => s.tags)
                .filter((value, index, list) => list.indexOf(value) === index)
                .map((value) => (
                  <option key={value}>{value}</option>
                ))}
            </select>
          </label>
          <label>
            状态
            <select className="input" value={status} onChange={(event) => setStatus(event.target.value)}>
              {statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="grid cards-3">
        {filtered.map((item) => {
          const episodes = platform.episodes.filter((ep) => ep.seriesId === item.id);
          return <SeriesCard key={item.id} series={item} episodeCount={episodes.length} previewCount={episodes.filter((ep) => ep.isPreview).length} />;
        })}
      </div>

      {filtered.length === 0 ? <section className="panel">暂无匹配剧集，试试更宽松的筛选条件。</section> : null}
    </div>
  );
}
