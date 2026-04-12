import { getCreatorPlan } from '../data/monetization';

export function resolveMembership(auth, platform) {
  return platform.memberships.find((item) => item.profileId === auth.user?.id) || { tier: auth.user?.tier || 'free', creatorPlan: auth.user?.creatorPlan || null };
}

export function canAccessCreatorStudio(auth, platform) {
  const membership = resolveMembership(auth, platform);
  return ['creator', 'admin'].includes(auth.userState) || Boolean(membership.creatorPlan);
}

export function isHighTierCreator(auth, platform) {
  const membership = resolveMembership(auth, platform);
  return membership.creatorPlan === 'creator_pro' || membership.creatorPlan === 'studio' || auth.userState === 'admin';
}

export function getCommissionForUser(auth, platform) {
  const membership = resolveMembership(auth, platform);
  const plan = getCreatorPlan(membership.creatorPlan || 'creator_basic');
  return membership.creatorPlan ? plan.commissionRate : platform.platformConfig.platformTakeRate;
}
