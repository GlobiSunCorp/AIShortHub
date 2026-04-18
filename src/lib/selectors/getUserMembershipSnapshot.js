export function getUserMembershipSnapshot(platform, profileId) {
  const fallback = { profileId, tier: 'free', creatorPlan: null, status: 'inactive', renewAt: null };
  if (!profileId) return fallback;
  return platform.memberships.find((item) => item.profileId === profileId) || fallback;
}
