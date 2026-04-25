import { getCreatorPlan, getViewerPlan } from '../../data/monetization';
import { getCommissionForUser, resolveMembership } from '../../hooks/usePlanAccess';
import { getCreatorQuotaSnapshot } from '../services/quotaService';
import { getCreatorEarningsSnapshot } from '../services/earningsService';
import { getCycleDates } from '../services/creatorHealthService';
import { getBillingSummarySnapshot } from './getBillingSummarySnapshot';

function formatTimeLabel(value) {
  if (!value) return 'Recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';
  const diffHours = Math.max(1, Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60)));
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 8) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function sortByTime(items) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.createdAt || a.created_at || 0).getTime() || 0;
    const bTime = new Date(b.createdAt || b.created_at || 0).getTime() || 0;
    return bTime - aTime;
  });
}

function normalizeAccountEvent(event) {
  return {
    id: event.id,
    icon: event.icon || '✨',
    tone: event.tone || 'neutral',
    title: event.title || 'Account updated',
    description: event.description || 'Your account state changed.',
    impact: event.impact || '',
    time: formatTimeLabel(event.createdAt || event.created_at),
    ctaLabel: event.ctaLabel || 'View details',
    ctaTo: event.ctaTo || '/profile',
    createdAt: event.createdAt || event.created_at,
  };
}

function buildRecentActivity({ viewerPlan, creatorPlan, uploads, serviceOrders, cycle, quota, earnings, accountEvents }) {
  const activity = sortByTime(accountEvents || []).map(normalizeAccountEvent);

  activity.push({
    id: `viewer-${viewerPlan.id}`,
    icon: viewerPlan.id === 'premium_viewer' ? '✦' : viewerPlan.id === 'pro_viewer' ? '⬆' : '▷',
    tone: viewerPlan.id === 'premium_viewer' ? 'premium' : viewerPlan.id === 'pro_viewer' ? 'upgrade' : 'neutral',
    title: `Viewer plan active: ${viewerPlan.name}`,
    description: viewerPlan.id === 'free' ? 'Preview-first access is active. Upgrade any time for full episodes and higher quality.' : `${viewerPlan.name} access is active across Browse, Watch, and Profile.`,
    impact: viewerPlan.id === 'free' ? 'Trailer + preview mode' : `${viewerPlan.quality} streaming · full title access`,
    time: formatTimeLabel(cycle?.renewalDate),
    ctaLabel: 'Manage viewer plan',
    ctaTo: `/pricing?intent=viewer&plan=${viewerPlan.id === 'free' ? 'pro_viewer' : viewerPlan.id}`,
  });

  if (creatorPlan) {
    activity.push({
      id: `creator-${creatorPlan.id}`,
      icon: creatorPlan.id === 'studio' ? '👑' : creatorPlan.id === 'creator_pro' ? '⚡' : '▦',
      tone: creatorPlan.id === 'studio' ? 'premium' : 'upgrade',
      title: `Creator plan active: ${creatorPlan.name}`,
      description: `${creatorPlan.name} tools, review flow, quota, and creator monetization controls are unlocked.`,
      impact: `${creatorPlan.reviewPriority} review · ${creatorPlan.monthlyAssetStorageLimitGb}GB storage`,
      time: formatTimeLabel(cycle?.renewalDate),
      ctaLabel: 'Open creator tools',
      ctaTo: '/creator#overview',
    });
  }

  if (serviceOrders[0]) {
    activity.push({
      id: `order-${serviceOrders[0].id}`,
      icon: '🧾',
      tone: serviceOrders[0].status === 'completed' ? 'ok' : serviceOrders[0].status === 'in_progress' ? 'upgrade' : 'neutral',
      title: `Service order ${serviceOrders[0].status}`,
      description: `${serviceOrders[0].serviceType || 'Add-on service'} for ${serviceOrders[0].projectTitle || serviceOrders[0].id} is in your queue.`,
      impact: serviceOrders[0].budget || serviceOrders[0].projectTitle || serviceOrders[0].id,
      time: formatTimeLabel(serviceOrders[0].updatedAt || serviceOrders[0].createdAt || serviceOrders[0].created_at),
      ctaLabel: 'Open order',
      ctaTo: `/services/${serviceOrders[0].id}`,
    });
  }

  if (uploads[0]) {
    activity.push({
      id: `series-${uploads[0].id}`,
      icon: '🎬',
      tone: uploads[0].status === 'published' ? 'ok' : uploads[0].status === 'pending_review' ? 'upgrade' : 'neutral',
      title: `${uploads[0].title} · ${uploads[0].status}`,
      description: `Latest title is currently ${uploads[0].status}. Continue editing episodes, assets, and review readiness.`,
      impact: `${uploads[0].episodeCount || uploads[0].episodes?.length || 0} episodes tracked`,
      time: formatTimeLabel(uploads[0].updatedAt || uploads[0].createdAt || uploads[0].created_at),
      ctaLabel: 'Open title',
      ctaTo: '/creator#content',
    });
  }

  if (quota) {
    activity.push({
      id: 'quota-reset',
      icon: '📦',
      tone: quota.remaining.seriesLeft <= 1 || quota.remaining.storageGbLeft <= 2 ? 'warn' : 'ok',
      title: `Quota reset on ${cycle.quotaResetDate}`,
      description: `${quota.remaining.seriesLeft} series slots and ${quota.remaining.storageGbLeft.toFixed(1)}GB storage remain this cycle.`,
      impact: `${quota.usage.activeSeries}/${quota.limits.maxActiveSeries} active series used`,
      time: 'This cycle',
      ctaLabel: 'Review quota',
      ctaTo: '/profile',
    });
  }

  if (earnings?.pendingPayout) {
    activity.push({
      id: 'earnings-pending',
      icon: '💸',
      tone: earnings.pendingPayout > 0 ? 'ok' : 'neutral',
      title: 'Payout pipeline updated',
      description: 'Creator earnings and payout pipeline were recalculated for the current cycle.',
      impact: `$${Number(earnings.pendingPayout).toFixed(2)} pending payout`,
      time: 'This cycle',
      ctaLabel: 'Review earnings',
      ctaTo: '/creator#earnings',
    });
  }

  const deduped = [];
  const seen = new Set();
  activity.forEach((item) => {
    if (seen.has(item.id)) return;
    seen.add(item.id);
    deduped.push(item);
  });

  return deduped.slice(0, 6);
}

function buildRecentChanges({ viewerPlan, creatorPlan, quota, commissionRate, serviceOrders, uploads, earnings }) {
  const changes = [];
  changes.push({
    id: 'viewer-access',
    label: 'Viewer access',
    value: viewerPlan.id === 'free' ? 'Preview + trailer only' : 'Full episodes unlocked',
    note: `${viewerPlan.quality} streaming · watch tools ${viewerPlan.watchTools ? 'included' : 'locked'}`,
    tone: viewerPlan.id === 'free' ? 'neutral' : 'ok',
  });

  if (creatorPlan) {
    changes.push({
      id: 'creator-commission',
      label: 'Creator commission',
      value: `${Math.round((commissionRate || 0) * 100)}%`,
      note: 'Only applies after creator-generated revenue exists.',
      tone: commissionRate <= 0.05 ? 'premium' : 'upgrade',
    });
    changes.push({
      id: 'creator-storage',
      label: 'Creator storage',
      value: `${quota?.limits?.monthlyAssetStorageLimitGb || creatorPlan.monthlyAssetStorageLimitGb}GB / cycle`,
      note: quota ? `${quota.remaining.storageGbLeft.toFixed(1)}GB left this cycle` : `${creatorPlan.reviewPriority} review priority`,
      tone: quota && quota.remaining.storageGbLeft <= 2 ? 'warn' : 'ok',
    });
    changes.push({
      id: 'creator-capacity',
      label: 'Active title capacity',
      value: `${quota?.limits?.maxActiveSeries || creatorPlan.maxActiveSeries} live slots`,
      note: quota ? `${quota.remaining.seriesLeft} slots remaining this cycle` : `${creatorPlan.maxTotalEpisodes} total episode cap`,
      tone: quota && quota.remaining.seriesLeft <= 1 ? 'warn' : 'neutral',
    });
  }

  if (serviceOrders[0]) {
    changes.push({
      id: 'service-status',
      label: 'Latest service order',
      value: serviceOrders[0].status,
      note: serviceOrders[0].projectTitle || serviceOrders[0].serviceType || serviceOrders[0].id,
      tone: serviceOrders[0].status === 'completed' ? 'ok' : serviceOrders[0].status === 'in_progress' ? 'upgrade' : 'neutral',
    });
  }

  if (uploads[0]) {
    changes.push({
      id: 'latest-title',
      label: 'Latest title status',
      value: uploads[0].status,
      note: uploads[0].title,
      tone: uploads[0].status === 'published' ? 'ok' : uploads[0].status === 'pending_review' ? 'upgrade' : 'neutral',
    });
  }

  if (earnings) {
    changes.push({
      id: 'net-earnings',
      label: 'Net earnings',
      value: `$${Number(earnings.netEarnings || 0).toFixed(2)}`,
      note: `$${Number(earnings.pendingPayout || 0).toFixed(2)} pending payout`,
      tone: earnings.netEarnings > 0 ? 'ok' : 'neutral',
    });
  }

  return changes.slice(0, 6);
}

export function getAccountCenterSnapshot({ auth, platform }) {
  const membership = resolveMembership(auth, platform);
  const viewerPlan = getViewerPlan(membership.tier);
  const creatorPlan = membership.creatorPlan ? getCreatorPlan(membership.creatorPlan) : null;
  const creator = (platform.creators || []).find((item) => item.profileId === auth?.user?.id) || null;
  const uploads = creator ? (platform.series || []).filter((item) => item.creatorId === creator.id).slice(0, 5) : [];
  const serviceOrders = (platform.serviceOrders || []).filter((item) => item.requesterId === auth?.user?.id).slice(0, 5);
  const accountEvents = (platform.ordersHistory || []).filter((item) => item.profileId === auth?.user?.id).slice(0, 10);
  const cycle = getCycleDates((platform.memberships || []).find((m) => m.profileId === auth?.user?.id)?.renewAt);
  const quota = creatorPlan && creator ? getCreatorQuotaSnapshot({ creatorPlanId: creatorPlan.id, creatorId: creator.id, profileId: auth.user.id, platform }) : null;
  const earnings = creator ? getCreatorEarningsSnapshot({ platform, creatorId: creator.id }) : null;
  const commissionRate = creatorPlan ? getCommissionForUser(auth, platform) : null;
  const billing = getBillingSummarySnapshot({ platform, creatorId: creator?.id, membership });

  return {
    membership,
    viewerPlan,
    creatorPlan,
    creator,
    uploads,
    serviceOrders,
    accountEvents,
    cycle,
    quota,
    earnings,
    commissionRate,
    billing,
    recentActivity: buildRecentActivity({ viewerPlan, creatorPlan, uploads, serviceOrders, cycle, quota, earnings, accountEvents }),
    recentChanges: buildRecentChanges({ viewerPlan, creatorPlan, quota, commissionRate, serviceOrders, uploads, earnings }),
  };
}
