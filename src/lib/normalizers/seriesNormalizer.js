import { normalizeArray, normalizeTimestamp, pickFirst } from './utils';

export function normalizeSeries(series = {}) {
  const id = pickFirst(series, ['id'], '');
  if (!id) return null;
  return {
    ...series,
    id,
    creatorId: pickFirst(series, ['creatorId', 'creator_id'], ''),
    createdAt: normalizeTimestamp(series),
    coverUrl: pickFirst(series, ['coverUrl', 'cover_url'], ''),
    trailerUrl: pickFirst(series, ['trailerUrl', 'trailer_url'], ''),
    reviewNote: pickFirst(series, ['reviewNote', 'review_note'], ''),
    status: pickFirst(series, ['status'], 'draft'),
    visibility: pickFirst(series, ['visibility'], 'private'),
    tags: Array.isArray(series.tags) ? series.tags : [],
    monetization: series.monetization || {},
  };
}

export function normalizeSeriesList(items) {
  return normalizeArray(items, normalizeSeries);
}
