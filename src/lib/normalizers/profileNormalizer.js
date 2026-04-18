import { normalizeArray, pickFirst } from './utils';

export function normalizeProfile(profile = {}) {
  const id = pickFirst(profile, ['id'], '');
  if (!id) return null;
  return {
    ...profile,
    id,
    name: pickFirst(profile, ['name', 'display_name'], 'User'),
    viewerPlan: pickFirst(profile, ['viewerPlan', 'viewer_plan', 'tier'], 'free'),
    creatorPlan: pickFirst(profile, ['creatorPlan', 'creator_plan'], null),
    role: pickFirst(profile, ['role'], 'member'),
    email: pickFirst(profile, ['email'], ''),
  };
}

export function normalizeMembership(membership = {}) {
  const profileId = pickFirst(membership, ['profileId', 'profile_id'], '');
  if (!profileId) return null;
  return {
    ...membership,
    profileId,
    tier: pickFirst(membership, ['tier', 'viewerPlan', 'viewer_plan'], 'free'),
    creatorPlan: pickFirst(membership, ['creatorPlan', 'creator_plan'], null),
    renewAt: pickFirst(membership, ['renewAt', 'renew_at'], null),
    status: pickFirst(membership, ['status'], 'active'),
  };
}

export function normalizeProfileList(items) {
  return normalizeArray(items, normalizeProfile);
}

export function normalizeMembershipList(items) {
  return normalizeArray(items, normalizeMembership);
}
