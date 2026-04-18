import { normalizeCreatorList } from './creatorNormalizer';
import { normalizeEpisodeList } from './episodeNormalizer';
import { normalizeOrderList } from './orderNormalizer';
import { normalizePaymentList, normalizePayoutList } from './paymentNormalizer';
import { normalizeMembershipList, normalizeProfileList } from './profileNormalizer';
import { normalizeSeriesList } from './seriesNormalizer';
import { pickFirst } from './utils';

export function normalizePlatformData(payload = {}) {
  return {
    ...payload,
    profiles: normalizeProfileList(payload.profiles),
    creators: normalizeCreatorList(payload.creators),
    series: normalizeSeriesList(payload.series),
    episodes: normalizeEpisodeList(payload.episodes),
    trailers: normalizeEpisodeList(payload.trailers),
    assets: Array.isArray(payload.assets) ? payload.assets : [],
    serviceOrders: normalizeOrderList(payload.serviceOrders),
    payments: normalizePaymentList(payload.payments),
    payouts: normalizePayoutList(payload.payouts),
    memberships: normalizeMembershipList(payload.memberships),
    reviewLogs: Array.isArray(payload.reviewLogs) ? payload.reviewLogs.map((item) => ({ ...item, seriesId: pickFirst(item, ['seriesId', 'series_id'], ''), createdAt: pickFirst(item, ['createdAt', 'created_at'], '') })) : [],
    platformConfig: {
      ...(payload.platformConfig || {}),
      platformTakeRate: Number(pickFirst(payload.platformConfig || {}, ['platformTakeRate', 'defaultTakeRate'], 0.2)),
      defaultTakeRate: Number(pickFirst(payload.platformConfig || {}, ['defaultTakeRate', 'platformTakeRate'], 0.2)),
    },
  };
}
