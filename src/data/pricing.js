export const pricingPlans = [
  {
    id: 'starter',
    name: 'Audience Starter',
    price: '$0',
    note: 'Free browsing + limited watch',
    features: ['Browse all series', 'Watch free episodes', 'Basic watchlist (requires login)'],
  },
  {
    id: 'plus',
    name: 'Drama Plus',
    price: '$11/mo',
    note: 'Unlock full stories',
    features: ['Unlimited episode unlocks', 'No trailer ads', 'Continue watching across devices'],
  },
  {
    id: 'creator',
    name: 'Creator Service',
    price: 'Custom',
    note: 'Submission + growth services',
    features: ['Submission onboarding', 'Distribution dashboard', 'Traffic + conversion analytics'],
  },
];

export const billingEntries = [
  { id: 'INV-9001', item: 'Drama Plus Monthly', amount: '$11', status: 'Paid', date: '2026-04-01' },
  { id: 'INV-9002', item: 'Creator Growth Pack', amount: '$149', status: 'Pending', date: '2026-04-09' },
];
