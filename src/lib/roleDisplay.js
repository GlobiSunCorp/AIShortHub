export const DEMO_ROLE_OPTIONS = [
  { value: 'guest', label: 'Guest', role: 'guest' },
  { value: 'member_free', label: 'Member (Free)', role: 'member', tier: 'free' },
  { value: 'member_pro_monthly', label: 'Member (Pro Monthly)', role: 'member', tier: 'pro_monthly' },
  { value: 'creator', label: 'Creator', role: 'creator', tier: 'pro_monthly' },
  { value: 'admin', label: 'Admin', role: 'admin', tier: 'pro_yearly' },
];

export function formatTierLabel(tier) {
  if (!tier || tier === 'free') return 'Free';
  if (tier === 'pro_monthly') return 'Pro Monthly';
  if (tier === 'pro_yearly') return 'Pro Yearly';
  return tier;
}

export function getStatusLabel(userState, membershipTier, userTier) {
  if (userState === 'guest') return 'Status: Guest';

  if (userState === 'member') {
    const tier = userTier || membershipTier || 'free';
    return `Status: Member / ${formatTierLabel(tier)}`;
  }

  if (userState === 'creator') return 'Status: Creator';
  if (userState === 'admin') return 'Status: Admin';
  return 'Status: Guest';
}
