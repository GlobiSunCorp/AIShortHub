import { useMemo, useState } from 'react';
import { SeriesCard } from '../components/SeriesCard';
import { SectionTitle } from '../components/SectionTitle';
import { DarkSelect } from '../components/DarkSelect';

const statuses = ['all', 'published', 'pending_review', 'draft', 'rejected'];

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

  const published = filtered.filter((item) => item.status === 'published');
  const firstBatch = published.slice(0, 3);

  return (
    <div className="stack-lg">
      <section className="panel">
        <SectionTitle title="Browse" desc="按题材、标签、状态筛选，支持搜索剧名/创作者" />
        <p className="small-text">若当前处于首批内容阶段，系统将优先展示首发推荐，避免空白浏览体验。</p>
        <div className="browse-filters">
          <label>
            搜索
            <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索剧名或创作者" />
          </label>
          <DarkSelect
            id="browse-tag"
            label="标签"
            value={tag}
            onChange={setTag}
            options={[{ value: 'all', label: '全部' }, ...platform.series
              .flatMap((s) => s.tags)
              .filter((value, index, list) => list.indexOf(value) === index)
              .map((value) => ({ value, label: value }))]}
          />
          <DarkSelect
            id="browse-status"
            label="状态"
            value={status}
            onChange={setStatus}
            options={statuses.map((item) => ({ value: item, label: item }))}
          />
        </div>
      </section>

      {firstBatch.length && query.trim() === '' && status === 'all' ? (
        <section>
          <SectionTitle title="首发推荐" desc="Trailer 优先 + 主剧集跟进" />
          <div className="grid cards-3">
            {firstBatch.map((item) => {
              const episodes = platform.episodes.filter((ep) => ep.seriesId === item.id);
              return <SeriesCard key={`starter-${item.id}`} series={item} episodeCount={episodes.length} previewCount={episodes.filter((ep) => ep.isPreview).length} />;
            })}
          </div>
        </section>
      ) : null}

      <div className="grid cards-3">
        {filtered.map((item) => {
          const episodes = platform.episodes.filter((ep) => ep.seriesId === item.id);
          return <SeriesCard key={item.id} series={item} episodeCount={episodes.length} previewCount={episodes.filter((ep) => ep.isPreview).length} />;
        })}
      </div>

      {filtered.length === 0 ? <section className="panel">暂无匹配剧集，试试更宽松的筛选条件。若你在准备软上线，建议先上架 2-3 部含 Trailer 的短剧。</section> : null}
    </div>
  );
}
