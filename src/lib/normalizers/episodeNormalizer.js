import { normalizeArray, normalizeTimestamp, pickFirst } from './utils';

export function normalizeEpisode(episode = {}) {
  const id = pickFirst(episode, ['id'], '');
  if (!id) return null;
  return {
    ...episode,
    id,
    seriesId: pickFirst(episode, ['seriesId', 'series_id'], ''),
    createdAt: normalizeTimestamp(episode),
    isPreview: Boolean(pickFirst(episode, ['isPreview', 'is_preview'], false)),
    number: Number(pickFirst(episode, ['number'], 0)),
    unlockPriceUsd: Number(pickFirst(episode, ['unlockPriceUsd', 'unlock_price_usd'], 0)),
    subtitleState: pickFirst(episode, ['subtitleState', 'subtitle_state'], Array.isArray(episode.subtitleLanguages) && episode.subtitleLanguages.length ? 'attached' : 'missing'),
    qcState: pickFirst(episode, ['qcState', 'qc_state'], 'pending'),
  };
}

export function normalizeEpisodeList(items) {
  return normalizeArray(items, normalizeEpisode);
}
