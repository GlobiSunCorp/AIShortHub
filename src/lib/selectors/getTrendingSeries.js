import { getPublishedSeries } from './getPublishedSeries';

export function getTrendingSeries(platform, limit = 3) {
  return getPublishedSeries(platform).slice(0, limit);
}
