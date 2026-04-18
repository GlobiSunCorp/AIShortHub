import { CREATOR_PLANS, VIEWER_SUBSCRIPTIONS, formatCommission, formatStorageGb, getCreatorPlan, getViewerPlan } from '../data/monetization';

export const PLAN_IDENTITY_META = {
  free_viewer: { label: 'Free Viewer', icon: '▷', tone: 'viewer-free', group: 'viewer' },
  pro_viewer: { label: 'Pro Viewer', icon: '◉▷', tone: 'viewer-pro', group: 'viewer' },
  premium_viewer: { label: 'Premium Viewer', icon: '✦▷', tone: 'viewer-premium', group: 'viewer' },
  creator_basic: { label: 'Creator Basic', icon: '▦', tone: 'creator-basic', group: 'creator' },
  creator_pro: { label: 'Creator Pro', icon: '⚡▦', tone: 'creator-pro', group: 'creator' },
  studio: { label: 'Studio', icon: '♛▦', tone: 'studio', group: 'creator' },
  admin: { label: 'Admin', icon: '🛡', tone: 'admin', group: 'admin' },
};

export function getMembershipBadgeKey({ auth, membership }) {
  if (auth?.userState === 'admin') return 'admin';
  if (membership?.creatorPlan === 'studio') return 'studio';
  if (membership?.creatorPlan === 'creator_pro') return 'creator_pro';
  if (membership?.creatorPlan === 'creator_basic') return 'creator_basic';
  if (membership?.tier === 'premium_viewer') return 'premium_viewer';
  if (membership?.tier === 'pro_viewer') return 'pro_viewer';
  return 'free_viewer';
}

export function getAudienceGroup({ auth, membership }) {
  if (auth?.userState === 'admin') return 'admin';
  if (membership?.creatorPlan) return 'creator';
  return 'viewer';
}

export function getViewerPlanHighlights(planId) {
  const plan = getViewerPlan(planId);
  return [
    ['Current Viewer Plan', plan.name],
    ['Full access', plan.fullSeriesAccess ? 'Included' : 'Upgrade required'],
    ['Quality', plan.quality],
    ['Early access', plan.earlyAccess ? 'Included' : 'Optional with upgrade'],
    ['Exclusive content', plan.exclusiveContent ? 'Included' : 'Optional with upgrade'],
    ['Continue / history / favorites', plan.watchTools ? 'Included' : 'Upgrade required'],
  ];
}

export function getCreatorPlanHighlights(planId) {
  const plan = getCreatorPlan(planId || 'creator_basic');
  return [
    ['Current Creator Plan', plan.name],
    ['Review priority', plan.reviewPriority],
    ['Platform commission', formatCommission(plan.commissionRate)],
    ['Active Series cap', `${plan.maxActiveSeries} active series`],
    ['Episodes cap', `${plan.maxTotalEpisodes} total episodes`],
    ['Storage cap', formatStorageGb(plan.monthlyAssetStorageLimitGb)],
    ['Motion Poster', plan.includedMotionPosterCount ? `${plan.includedMotionPosterCount} Included` : 'Add-on'],
    ['Featured requests', plan.maxFeaturedRequestsPerCycle ? `${plan.maxFeaturedRequestsPerCycle} / cycle` : 'Add-on'],
    ['Creator-set pricing', plan.creatorSetPricing ? 'Included' : 'Not included'],
  ];
}

export function getViewerUpgradeTargets(currentTier) {
  return VIEWER_SUBSCRIPTIONS.filter((plan) => plan.id !== 'free' && plan.id !== currentTier);
}

export function getCreatorUpgradeTargets(currentPlanId) {
  return CREATOR_PLANS.filter((plan) => plan.id !== currentPlanId && plan.id !== 'creator_basic');
}
