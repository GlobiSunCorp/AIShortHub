import {
  creators as mockCreators,
  episodes as mockEpisodes,
  memberships as mockMemberships,
  payments as mockPayments,
  payouts as mockPayouts,
  profiles as mockProfiles,
  reviewLogs as mockReviewLogs,
  series as mockSeries,
  serviceOrders as mockServiceOrders,
  trailers as mockTrailers,
  unlockedContent,
  ordersHistory,
  PLATFORM_CONFIG,
} from '../../data/mockData';
import { fetchTable, hasSupabase, insertTable, updateTable, uploadToStorage } from '../supabaseClient';

function getMockPlatformPayload(mode = 'mock', warning = '') {
  return {
    profiles: mockProfiles,
    creators: mockCreators,
    series: mockSeries,
    episodes: mockEpisodes,
    trailers: mockTrailers,
    serviceOrders: mockServiceOrders,
    payments: mockPayments,
    payouts: mockPayouts,
    reviewLogs: mockReviewLogs,
    memberships: mockMemberships,
    unlockedContent,
    ordersHistory,
    platformConfig: PLATFORM_CONFIG,
    mode,
    warning,
  };
}

export async function loadPlatformData(accessToken) {
  if (!hasSupabase) {
    return getMockPlatformPayload('mock');
  }

  try {
    const [profiles, creators, series, episodes, assets, serviceOrders, payments, payouts, reviewLogs, viewerSubscriptions] = await Promise.all([
      fetchTable('profiles', 'select=*', accessToken),
      fetchTable('creators', 'select=*', accessToken),
      fetchTable('series', 'select=*', accessToken),
      fetchTable('episodes', 'select=*', accessToken),
      fetchTable('assets', 'select=*', accessToken),
      fetchTable('service_orders', 'select=*', accessToken),
      fetchTable('payments', 'select=*', accessToken),
      fetchTable('payouts', 'select=*', accessToken),
      fetchTable('review_logs', 'select=*', accessToken),
      fetchTable('viewer_subscriptions', 'select=*', accessToken),
    ]);

    const responses = [profiles, creators, series, episodes, assets, serviceOrders, payments, payouts, reviewLogs, viewerSubscriptions];
    const firstError = responses.find((item) => item?.error)?.error;
    if (firstError) {
      return getMockPlatformPayload('mock-fallback', `Supabase load fallback: ${firstError}`);
    }

    return {
      profiles: profiles.data || [],
      creators: creators.data || [],
      series: series.data || [],
      episodes: episodes.data || [],
      trailers: (assets.data || []).filter((item) => item.asset_type === 'trailer'),
      assets: assets.data || [],
      serviceOrders: serviceOrders.data || [],
      payments: payments.data || [],
      payouts: payouts.data || [],
      reviewLogs: reviewLogs.data || [],
      memberships: (viewerSubscriptions.data || []).map((item) => ({
        profileId: item.profile_id,
        tier: item.plan_id,
        creatorPlan: item.creator_plan_id,
        status: item.status,
        renewAt: item.renew_at,
      })),
      unlockedContent,
      ordersHistory,
      platformConfig: PLATFORM_CONFIG,
      mode: 'real',
      warning: '',
    };
  } catch (error) {
    return getMockPlatformPayload('mock-fallback', `Supabase load fallback: ${error?.message || 'Unknown error'}`);
  }
}

export async function createServiceOrder(payload, accessToken) {
  if (!hasSupabase) return { data: payload, error: null, mock: true };
  return insertTable('service_orders', payload, accessToken);
}

export async function createSeries(payload, accessToken) {
  if (!hasSupabase) return { data: payload, error: null, mock: true };
  return insertTable('series', payload, accessToken);
}

export async function createEpisode(payload, accessToken) {
  if (!hasSupabase) return { data: payload, error: null, mock: true };
  return insertTable('episodes', payload, accessToken);
}

export async function upsertAsset(payload, accessToken) {
  if (!hasSupabase) return { data: payload, error: null, mock: true };
  return insertTable('assets', payload, accessToken);
}

export async function submitReviewLog(payload, accessToken) {
  if (!hasSupabase) return { data: payload, error: null, mock: true };
  return insertTable('review_logs', payload, accessToken);
}

export async function changeSeriesStatus(seriesId, payload, accessToken) {
  if (!hasSupabase) return { data: [{ id: seriesId, ...payload }], error: null, mock: true };
  return updateTable('series', `id=eq.${seriesId}`, payload, accessToken);
}

export async function changeServiceOrderStatus(orderId, payload, accessToken) {
  if (!hasSupabase) return { data: [{ id: orderId, ...payload }], error: null, mock: true };
  return updateTable('service_orders', `id=eq.${orderId}`, payload, accessToken);
}

export async function uploadAssetFile({ bucket, path, file, accessToken }) {
  return uploadToStorage(bucket, path, file, accessToken);
}
