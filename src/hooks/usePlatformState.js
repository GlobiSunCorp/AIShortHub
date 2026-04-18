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

export function usePlatformState(auth) {
  const [state, setState] = useState({
    profiles: [], creators: [], series: [], episodes: [], trailers: [], assets: [], serviceOrders: [], payments: [], payouts: [], creatorEarnings: [], reviewLogs: [], memberships: [],
    unlockedContent: {}, ordersHistory: [], platformConfig: { platformTakeRate: 0.2, settlementCycle: 'Monthly (mock)' }, mode: 'mock', loading: true,
  });

  useEffect(() => {
    let mounted = true;
    loadPlatformData(auth?.session?.access_token).then((data) => {
      if (!mounted) return;
      setState((prev) => ({ ...prev, ...data, loading: false }));
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
      setState((prev) => ({ ...prev, series: [{ ...row, createdAt: row.created_at }, ...prev.series] }));
      return row;
    },
    async createEpisode(payload) {
      const row = { ...payload, created_at: new Date().toISOString() };
      await createEpisodeData(row, auth?.session?.access_token);
      setState((prev) => ({ ...prev, episodes: [{ ...row, createdAt: row.created_at }, ...prev.episodes] }));
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
      setState((prev) => ({ ...prev, reviewLogs: [log, ...prev.reviewLogs] }));
    },
    async reviewSeries(seriesId, decision, reason) {
      const status = decision === 'approved' ? 'published' : 'rejected';
      setState((prev) => ({ ...prev, series: prev.series.map((s) => (s.id === seriesId ? { ...s, status } : s)) }));
      await changeSeriesStatus(seriesId, { status, visibility: decision === 'approved' ? 'public' : 'private', review_note: reason }, auth?.session?.access_token);
      const log = { series_id: seriesId, reviewer_id: auth?.user?.id || 'u_admin', decision, reason, created_at: new Date().toISOString() };
      await submitReviewLog(log, auth?.session?.access_token);
      setState((prev) => ({ ...prev, reviewLogs: [log, ...prev.reviewLogs] }));
    },
    toggleSeriesOnline(seriesId) {
      setState((prev) => ({ ...prev, series: prev.series.map((s) => (s.id === seriesId ? { ...s, visibility: s.visibility === 'public' ? 'private' : 'public' } : s)) }));
    },
    async createServiceOrder(payload) {
      const createdOrder = { id: `so_${Math.random().toString(36).slice(2, 8)}`, created_at: new Date().toISOString(), status: payload.status || 'pending', ...payload };
      await createServiceOrderData(createdOrder, auth?.session?.access_token);
      setState((prev) => ({ ...prev, serviceOrders: [createdOrder, ...prev.serviceOrders] }));
      return createdOrder;
    },
    async updateServiceOrderStatus(orderId, status, note = '') {
      const update = { status, admin_note: note, updated_at: new Date().toISOString() };
      await changeServiceOrderStatus(orderId, update, auth?.session?.access_token);
      setState((prev) => ({ ...prev, serviceOrders: prev.serviceOrders.map((o) => (o.id === orderId ? { ...o, ...update } : o)) }));
    },
    setMembershipTier(profileId, tier) {
      setState((prev) => {
        const found = prev.memberships.find((m) => m.profileId === profileId);
        const nextMemberships = found
          ? prev.memberships.map((m) => (m.profileId === profileId ? { ...m, tier } : m))
          : [{ profileId, tier, creatorPlan: null, status: 'active', renewAt: null }, ...prev.memberships];
        return { ...prev, memberships: nextMemberships };
      });
    },
    setCreatorPlan(profileId, creatorPlan) {
      setState((prev) => {
        const found = prev.memberships.find((m) => m.profileId === profileId);
        const nextMemberships = found
          ? prev.memberships.map((m) => (m.profileId === profileId ? { ...m, creatorPlan } : m))
          : [{ profileId, tier: 'free', creatorPlan, status: 'active', renewAt: null }, ...prev.memberships];
        return { ...prev, memberships: nextMemberships };
      });
    },
  };

  return { ...state, bySeriesId, actions };
}
