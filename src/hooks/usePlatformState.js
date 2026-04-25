import { useEffect, useMemo, useState } from 'react';
import {
  changeSeriesStatus,
  changeServiceOrderStatus,
  createEpisode as createEpisodeData,
  createSeries as createSeriesData,
  createServiceOrder as createServiceOrderData,
  loadPlatformData,
  submitReviewLog,
  upsertAsset,
  uploadAssetFile,
} from '../lib/services/platformService';
import { PLATFORM_CONFIG } from '../data/mockData';
import { normalizePlatformData } from '../lib/normalizers';
import { normalizeEpisode } from '../lib/normalizers/episodeNormalizer';
import { normalizeOrder } from '../lib/normalizers/orderNormalizer';
import { normalizeSeries } from '../lib/normalizers/seriesNormalizer';
import { getCreatorPlan, getViewerPlan } from '../data/monetization';

const PLATFORM_CONFIG_STORAGE_KEY = 'aishorthub.platformConfig';

function mergePlatformConfig(baseConfig = {}, overrideConfig = {}) {
  return {
    ...baseConfig,
    ...overrideConfig,
    homeHero: {
      ...(baseConfig.homeHero || {}),
      ...(overrideConfig.homeHero || {}),
    },
  };
}

function readStoredPlatformConfig() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PLATFORM_CONFIG_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistPlatformConfig(config) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PLATFORM_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore persistence errors in demo mode
  }
}

function makeAccountEvent({ type, profileId, icon = '✨', tone = 'neutral', title, description, impact, ctaLabel, ctaTo, orderId }) {
  const now = new Date().toISOString();
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    profileId,
    orderId,
    icon,
    tone,
    title,
    description,
    impact,
    ctaLabel,
    ctaTo,
    created_at: now,
    createdAt: now,
  };
}

export function usePlatformState(auth) {
  const [state, setState] = useState({
    profiles: [], creators: [], series: [], episodes: [], trailers: [], assets: [], serviceOrders: [], payments: [], payouts: [], creatorEarnings: [], reviewLogs: [], memberships: [],
    unlockedContent: {}, ordersHistory: [], platformConfig: { platformTakeRate: 0.2, settlementCycle: 'Monthly (mock)' }, mode: 'mock', loading: true,
  });

  useEffect(() => {
    let mounted = true;
    loadPlatformData(auth?.session?.access_token).then((data) => {
      if (!mounted) return;
      const storedConfig = readStoredPlatformConfig();
      const nextConfig = mergePlatformConfig(data.platformConfig || {}, storedConfig || {});
      setState((prev) => ({ ...prev, ...normalizePlatformData(data), platformConfig: nextConfig, loading: false }));
    });
    return () => {
      mounted = false;
    };
  }, [auth?.user?.id]);

  const bySeriesId = useMemo(() => Object.fromEntries(state.series.map((item) => [item.id, item])), [state.series]);

  const actions = {
    async createSeries(payload) {
      const row = { ...payload, status: payload.status || 'draft', visibility: payload.visibility || 'private', created_at: new Date().toISOString() };
      await createSeriesData(row, auth?.session?.access_token);
      const normalized = normalizeSeries(row);
      setState((prev) => ({ ...prev, series: normalized ? [normalized, ...prev.series] : prev.series }));
      return normalized || row;
    },
    async createEpisode(payload) {
      const row = { ...payload, created_at: new Date().toISOString() };
      await createEpisodeData(row, auth?.session?.access_token);
      const normalized = normalizeEpisode(row);
      setState((prev) => ({ ...prev, episodes: normalized ? [normalized, ...prev.episodes] : prev.episodes }));
    },
    async createAsset(payload) {
      const row = { ...payload, created_at: new Date().toISOString() };
      await upsertAsset(row, auth?.session?.access_token);
      setState((prev) => ({ ...prev, assets: [row, ...(prev.assets || [])] }));
      return row;
    },
    async uploadAssetFile({ bucket, seriesId, assetType, file }) {
      const path = `${auth?.user?.id || 'guest'}/${seriesId || 'draft'}/${Date.now()}-${file.name}`;
      const uploaded = await uploadAssetFile({ bucket, path, file, accessToken: auth?.session?.access_token });
      if (uploaded.error) return uploaded;
      await actions.createAsset({
        series_id: seriesId || null,
        asset_type: assetType,
        url: uploaded.data.publicUrl,
        storage_bucket: bucket,
        storage_path: path,
        size_bytes: Number(file?.size || 0),
      });
      return uploaded;
    },
    async submitForReview(seriesId, reason = 'Submitted by creator') {
      setState((prev) => ({ ...prev, series: prev.series.map((s) => (s.id === seriesId ? { ...s, status: 'pending_review' } : s)) }));
      await changeSeriesStatus(seriesId, { status: 'pending_review' }, auth?.session?.access_token);
      const log = { series_id: seriesId, reviewer_id: auth?.user?.id || 'system', decision: 'pending_review', reason, created_at: new Date().toISOString() };
      await submitReviewLog(log, auth?.session?.access_token);
      setState((prev) => ({ ...prev, reviewLogs: [{ ...log, seriesId, createdAt: log.created_at }, ...prev.reviewLogs] }));
    },
    async reviewSeries(seriesId, decision, reason) {
      const status = decision === 'approved' ? 'published' : 'rejected';
      setState((prev) => ({ ...prev, series: prev.series.map((s) => (s.id === seriesId ? { ...s, status, reviewNote: reason } : s)) }));
      await changeSeriesStatus(seriesId, { status, visibility: decision === 'approved' ? 'public' : 'private', review_note: reason }, auth?.session?.access_token);
      const log = { series_id: seriesId, reviewer_id: auth?.user?.id || 'u_admin', decision, reason, created_at: new Date().toISOString() };
      await submitReviewLog(log, auth?.session?.access_token);
      setState((prev) => ({ ...prev, reviewLogs: [{ ...log, seriesId, createdAt: log.created_at }, ...prev.reviewLogs] }));
    },
    toggleSeriesOnline(seriesId) {
      setState((prev) => ({ ...prev, series: prev.series.map((s) => (s.id === seriesId ? { ...s, visibility: s.visibility === 'public' ? 'private' : 'public' } : s)) }));
    },
    async createServiceOrder(payload) {
      const createdOrder = { id: `so_${Math.random().toString(36).slice(2, 8)}`, created_at: new Date().toISOString(), status: payload.status || 'pending', ...payload };
      await createServiceOrderData(createdOrder, auth?.session?.access_token);
      const normalized = normalizeOrder(createdOrder);
      const event = makeAccountEvent({
        type: 'service_order_created',
        profileId: createdOrder.requesterId,
        orderId: createdOrder.id,
        icon: '🧾',
        tone: createdOrder.status === 'pending_payment' ? 'warn' : 'upgrade',
        title: `Service order created: ${createdOrder.serviceType}`,
        description: `${createdOrder.projectTitle || createdOrder.id} entered the service workflow.`,
        impact: createdOrder.addOnPrice || createdOrder.budget || 'Service queue updated',
        ctaLabel: 'Open order',
        ctaTo: `/services/${createdOrder.id}`,
      });
      setState((prev) => ({ ...prev, serviceOrders: normalized ? [normalized, ...prev.serviceOrders] : prev.serviceOrders, ordersHistory: [event, ...(prev.ordersHistory || [])].slice(0, 30) }));
      return normalized || createdOrder;
    },
    async updateServiceOrderStatus(orderId, status, note = '') {
      const update = { status, admin_note: note, updated_at: new Date().toISOString() };
      await changeServiceOrderStatus(orderId, update, auth?.session?.access_token);
      setState((prev) => {
        const order = prev.serviceOrders.find((o) => o.id === orderId);
        const event = makeAccountEvent({
          type: 'service_order_status_changed',
          profileId: order?.requesterId || auth?.user?.id || 'guest',
          orderId,
          icon: status === 'completed' ? '✅' : status === 'in_progress' ? '🛠️' : '🧾',
          tone: status === 'completed' ? 'ok' : status === 'in_progress' ? 'upgrade' : 'neutral',
          title: `Service order moved to ${status}`,
          description: note || `${order?.projectTitle || orderId} status has been updated.`,
          impact: order?.serviceType || 'Service workflow updated',
          ctaLabel: 'Open order',
          ctaTo: `/services/${orderId}`,
        });
        return {
          ...prev,
          serviceOrders: prev.serviceOrders.map((o) => (o.id === orderId ? { ...o, ...update, reviewNote: note, updatedAt: update.updated_at } : o)),
          ordersHistory: [event, ...(prev.ordersHistory || [])].slice(0, 30),
        };
      });
    },
    updatePlatformConfig(patch) {
      setState((prev) => {
        const nextConfig = mergePlatformConfig(prev.platformConfig || {}, patch || {});
        persistPlatformConfig(nextConfig);
        return { ...prev, platformConfig: nextConfig };
      });
    },
    resetPlatformConfig() {
      const fallbackConfig = mergePlatformConfig(PLATFORM_CONFIG, {});
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.removeItem(PLATFORM_CONFIG_STORAGE_KEY);
        } catch {
          // ignore remove errors
        }
      }
      setState((prev) => ({ ...prev, platformConfig: fallbackConfig }));
    },
    setMembershipTier(profileId, tier) {
      setState((prev) => {
        const found = prev.memberships.find((m) => m.profileId === profileId);
        const previousTier = found?.tier || 'free';
        const plan = getViewerPlan(tier || 'free');
        const event = previousTier === tier ? null : makeAccountEvent({
          type: 'viewer_plan_changed',
          profileId,
          icon: tier === 'premium_viewer' ? '✦' : tier === 'pro_viewer' ? '⬆' : '▷',
          tone: tier === 'premium_viewer' ? 'premium' : tier === 'free' ? 'neutral' : 'upgrade',
          title: `Viewer plan changed to ${plan.name}`,
          description: `Viewer access changed from ${getViewerPlan(previousTier).name} to ${plan.name}.`,
          impact: `${plan.quality} · ${plan.fullSeriesAccess ? 'Full episodes unlocked' : 'Preview access'}`,
          ctaLabel: 'View profile',
          ctaTo: '/profile',
        });
        const nextMemberships = found
          ? prev.memberships.map((m) => (m.profileId === profileId ? { ...m, tier, updatedAt: new Date().toISOString() } : m))
          : [{ profileId, tier, creatorPlan: null, status: 'active', renewAt: null, updatedAt: new Date().toISOString() }, ...prev.memberships];
        return { ...prev, memberships: nextMemberships, ordersHistory: event ? [event, ...(prev.ordersHistory || [])].slice(0, 30) : prev.ordersHistory };
      });
    },
    setCreatorPlan(profileId, creatorPlan) {
      setState((prev) => {
        const found = prev.memberships.find((m) => m.profileId === profileId);
        const previousPlan = found?.creatorPlan || 'creator_basic';
        const plan = getCreatorPlan(creatorPlan || 'creator_basic');
        const event = previousPlan === creatorPlan ? null : makeAccountEvent({
          type: 'creator_plan_changed',
          profileId,
          icon: creatorPlan === 'studio' ? '👑' : creatorPlan === 'creator_pro' ? '⚡' : '▦',
          tone: creatorPlan === 'studio' ? 'premium' : creatorPlan === 'creator_pro' ? 'upgrade' : 'neutral',
          title: `Creator plan changed to ${plan.name}`,
          description: `Creator tools changed from ${getCreatorPlan(previousPlan).name} to ${plan.name}.`,
          impact: `${plan.reviewPriority} · ${plan.monthlyAssetStorageLimitGb}GB storage · ${Math.round(plan.commissionRate * 100)}% commission`,
          ctaLabel: 'Open Creator Studio',
          ctaTo: '/creator#overview',
        });
        const nextMemberships = found
          ? prev.memberships.map((m) => (m.profileId === profileId ? { ...m, creatorPlan, updatedAt: new Date().toISOString() } : m))
          : [{ profileId, tier: 'free', creatorPlan, status: 'active', renewAt: null, updatedAt: new Date().toISOString() }, ...prev.memberships];
        return { ...prev, memberships: nextMemberships, ordersHistory: event ? [event, ...(prev.ordersHistory || [])].slice(0, 30) : prev.ordersHistory };
      });
    },
  };

  return { ...state, bySeriesId, actions };
}
