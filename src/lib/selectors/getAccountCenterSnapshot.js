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

function buildRecentActivity({ membership, viewerPlan, creatorPlan, uploads, serviceOrders, cycle, quota }) {
  const activity = [];
  activity.push({
    id: `viewer-${viewerPlan.id}`,
    icon: viewerPlan.id === 'premium_viewer' ? '✦' : viewerPlan.id === 'pro_viewer' ? '⬆' : '▷',
    title: `Viewer plan active: ${viewerPlan.name}`,
    description: viewerPlan.id === 'free' ? 'Preview-first access is active. Upgrade any time for full episodes and higher quality.' : `${viewerPlan.name} access is active across Browse, Watch, and Profile.`,
    time: formatTimeLabel(cycle?.renewalDate),
    ctaLabel: 'Manage viewer plan',
    ctaTo: `/pricing?intent=viewer&plan=${viewerPlan.id === 'free' ? 'pro_viewer' : viewerPlan.id}`,
  });

  if (creatorPlan) {
    activity.push({
      id: `creator-${creatorPlan.id}`,
      icon: creatorPlan.id === 'studio' ? '👑' : creatorPlan.id === 'creator_pro' ? '⚡' : '▦',
      title: `Creator plan active: ${creatorPlan.name}`,
      description: `${creatorPlan.name} tools, review flow, quota, and creator monetization controls are unlocked.`,
      time: formatTimeLabel(cycle?.renewalDate),
      ctaLabel: 'Open creator tools',
      ctaTo: '/creator#overview',
    });
  }

  if (serviceOrders[0]) {
    activity.push({
      id: `order-${serviceOrders[0].id}`,
      icon: '🧾',
      title: `Service order ${serviceOrders[0].status}`,
      description: `${serviceOrders[0].serviceType || 'Add-on service'} for ${serviceOrders[0].projectTitle || serviceOrders[0].id} is in your queue.`,
      time: formatTimeLabel(serviceOrders[0].updatedAt || serviceOrders[0].createdAt || serviceOrders[0].created_at),
      ctaLabel: 'Open order',
      ctaTo: `/services/${serviceOrders[0].id}`,
    });
  }

  if (uploads[0]) {
    activity.push({
      id: `series-${uploads[0].id}`,
      icon: '🎬',
      title: `${uploads[0].title} · ${uploads[0].status}`,
      description: `Latest title is currently ${uploads[0].status}. Continue editing episodes, assets, and review readiness.`,
      time: formatTimeLabel(uploads[0].updatedAt || uploads[0].createdAt || uploads[0].created_at),
      ctaLabel: 'Open title',
      ctaTo: '/creator#content',
    });
  }

  if (quota) {
    activity.push({
      id: 'quota-reset',
      icon: '📦',
      title: `Quota reset on ${cycle.quotaResetDate}`,
      description: `${quota.remaining.seriesLeft} series slots and ${quota.remaining.storageGbLeft.toFixed(1)}GB storage remain this cycle.`,
      time: 'This cycle',
      ctaLabel: 'Review quota',
      ctaTo: '/profile',
    });
  }

  return activity.slice(0, 6);
}

function buildRecentChanges({ viewerPlan, creatorPlan, quota, commissionRate, serviceOrders, uploads }) {
  const changes = [];
  changes.push({
    id: 'viewer-access',
    label: 'Viewer access',
    value: viewerPlan.id === 'free' ? 'Preview + trailer only' : 'Full episodes unlocked',
    note: `${viewerPlan.quality} streaming · watch tools ${viewerPlan.watchTools ? 'included' : 'locked'}`,
  });

  if (creatorPlan) {
    changes.push({
      id: 'creator-commission',
      label: 'Creator commission',
      value: `${Math.round((commissionRate || 0) * 100)}%`,
      note: 'Only applies after creator-generated revenue exists.',
    });
    changes.push({
      id: 'creator-storage',
      label: 'Creator storage',
      value: `${quota?.limits?.monthlyAssetStorageLimitGb || creatorPlan.monthlyAssetStorageLimitGb}GB / cycle`,
      note: quota ? `${quota.remaining.storageGbLeft.toFixed(1)}GB left this cycle` : `${creatorPlan.reviewPriority} review priority`,
    });
  }

  if (serviceOrders[0]) {
    changes.push({
      id: 'service-status',
      label: 'Latest service order',
      value: serviceOrders[0].status,
      note: serviceOrders[0].projectTitle || serviceOrders[0].serviceType || serviceOrders[0].id,
    });
  }

  if (uploads[0]) {
    changes.push({
      id: 'latest-title',
      label: 'Latest title status',
      value: uploads[0].status,
      note: uploads[0].title,
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
    cycle,
    quota,
    earnings,
    commissionRate,
    billing,
    recentActivity: buildRecentActivity({ membership, viewerPlan, creatorPlan, uploads, serviceOrders, cycle, quota }),
    recentChanges: buildRecentChanges({ viewerPlan, creatorPlan, quota, commissionRate, serviceOrders, uploads }),
  };
}
