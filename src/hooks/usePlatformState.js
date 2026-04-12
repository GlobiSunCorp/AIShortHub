import { useMemo, useState } from 'react';
import {
  PLATFORM_CONFIG,
  creators,
  episodes as initialEpisodes,
  memberships as initialMemberships,
  ordersHistory,
  payments,
  payouts,
  profiles,
  reviewLogs as initialReviewLogs,
  series as initialSeries,
  serviceOrders as initialServiceOrders,
  trailers,
  unlockedContent,
} from '../data/mockData';

export function usePlatformState() {
  const [allSeries, setAllSeries] = useState(initialSeries);
  const [allEpisodes, setAllEpisodes] = useState(initialEpisodes);
  const [allServiceOrders, setAllServiceOrders] = useState(initialServiceOrders);
  const [allReviewLogs, setAllReviewLogs] = useState(initialReviewLogs);
  const [allMemberships, setAllMemberships] = useState(initialMemberships);

  const bySeriesId = useMemo(() => Object.fromEntries(allSeries.map((item) => [item.id, item])), [allSeries]);

  const createSeries = (payload) => {
    setAllSeries((prev) => [
      {
        id: payload.id,
        creatorId: payload.creatorId,
        title: payload.title,
        synopsis: payload.synopsis,
        tags: payload.tags,
        category: payload.category,
        trailerId: null,
        status: 'draft',
        visibility: 'private',
        createdAt: new Date().toISOString().slice(0, 10),
        tiktokHook: payload.tiktokHook || '',
      },
      ...prev,
    ]);
  };

  const createEpisode = (payload) => {
    setAllEpisodes((prev) => [
      {
        id: `ep_${Math.random().toString(36).slice(2, 8)}`,
        seriesId: payload.seriesId,
        number: payload.number,
        title: payload.title,
        videoUrl: payload.videoUrl,
        isPreview: payload.isPreview,
        durationSeconds: payload.durationSeconds || 60,
      },
      ...prev,
    ]);
  };

  const submitForReview = (seriesId) => {
    setAllSeries((prev) => prev.map((item) => (item.id === seriesId ? { ...item, status: 'in_review' } : item)));
    setAllReviewLogs((prev) => [
      {
        id: `rv_${Math.random().toString(36).slice(2, 8)}`,
        seriesId,
        reviewerId: 'system',
        decision: 'pending',
        reason: 'Submitted by creator, waiting admin review.',
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
  };

  const reviewSeries = (seriesId, decision, reason) => {
    setAllSeries((prev) =>
      prev.map((item) =>
        item.id === seriesId
          ? {
              ...item,
              status: decision === 'approved' ? 'published' : 'rejected',
              visibility: decision === 'approved' ? 'public' : item.visibility,
            }
          : item
      )
    );
    setAllReviewLogs((prev) => [
      {
        id: `rv_${Math.random().toString(36).slice(2, 8)}`,
        seriesId,
        reviewerId: 'u_admin',
        decision,
        reason,
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
  };

  const toggleSeriesOnline = (seriesId) => {
    setAllSeries((prev) => prev.map((item) => (item.id === seriesId ? { ...item, visibility: item.visibility === 'public' ? 'private' : 'public' } : item)));
  };

  const createServiceOrder = (payload) => {
    setAllServiceOrders((prev) => [
      {
        id: `so_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString().slice(0, 10),
        status: 'pending',
        ...payload,
      },
      ...prev,
    ]);
  };

  const updateServiceOrderStatus = (orderId, status) => {
    setAllServiceOrders((prev) => prev.map((item) => (item.id === orderId ? { ...item, status } : item)));
  };

  const setMembershipTier = (profileId, tier) => {
    setAllMemberships((prev) => prev.map((item) => (item.profileId === profileId ? { ...item, tier } : item)));
  };

  return {
    platformConfig: PLATFORM_CONFIG,
    profiles,
    creators,
    series: allSeries,
    episodes: allEpisodes,
    trailers,
    serviceOrders: allServiceOrders,
    payments,
    payouts,
    reviewLogs: allReviewLogs,
    memberships: allMemberships,
    unlockedContent,
    ordersHistory,
    bySeriesId,
    actions: {
      createSeries,
      createEpisode,
      submitForReview,
      reviewSeries,
      toggleSeriesOnline,
      createServiceOrder,
      updateServiceOrderStatus,
      setMembershipTier,
    },
  };
}
