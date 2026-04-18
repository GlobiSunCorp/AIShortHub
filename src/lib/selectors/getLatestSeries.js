import { getPublishedSeries } from './getPublishedSeries';

export function getLatestSeries(platform, limit = 3) {
  return [...getPublishedSeries(platform)].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))).slice(0, limit);
}
