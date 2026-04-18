import { getLatestSeries } from './getLatestSeries';
import { getPublishedSeries } from './getPublishedSeries';
import { getTrendingSeries } from './getTrendingSeries';

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function buildEpisodeMap(episodes) {
  return safeArray(episodes).reduce((acc, episode) => {
    const seriesId = episode.seriesId || episode.series_id;
    if (!seriesId) return acc;
    if (!acc[seriesId]) {
      acc[seriesId] = { total: 0, preview: 0, paid: 0, trailer: 0 };
    }
    acc[seriesId].total += 1;
    if (episode.isPreview || episode.is_preview) acc[seriesId].preview += 1;
    if (episode.isPaid || episode.is_paid) acc[seriesId].paid += 1;
    if ((episode.kind || '').toLowerCase() === 'trailer') acc[seriesId].trailer += 1;
    return acc;
  }, {});
}

export function getCatalogSnapshot(platform, filters = {}) {
  const creators = safeArray(platform?.creators);
  const series = safeArray(platform?.series);
  const episodes = safeArray(platform?.episodes);
  const query = (filters.query || '').trim().toLowerCase();
  const tag = filters.tag || 'all';
  const status = filters.status || 'all';

  const creatorById = Object.fromEntries(creators.map((creator) => [creator.id, creator]));
  const episodeMap = buildEpisodeMap(episodes);

  const filtered = series.filter((item) => {
    const creatorName = creatorById[item.creatorId]?.studioName || '';
    const queryMatch = !query || (item.title || '').toLowerCase().includes(query) || creatorName.toLowerCase().includes(query);
    const tagMatch = tag === 'all' || safeArray(item.tags).includes(tag);
    const statusMatch = status === 'all' || item.status === status;
    return queryMatch && tagMatch && statusMatch;
  });

  const published = getPublishedSeries({ ...platform, series: filtered });
  const latest = getLatestSeries({ ...platform, series: filtered });
  const trending = getTrendingSeries({ ...platform, series: filtered });

  return {
    allSeries: filtered,
    published,
    latest,
    trending,
    firstBatch: published.slice(0, 3),
    isLowInventory: published.length <= 3,
    tags: [...new Set(series.flatMap((item) => safeArray(item.tags)))],
    episodeMap,
  };
}
