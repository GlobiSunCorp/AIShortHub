export const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    note: 'Trailer + preview episodes only',
    features: ['Browse all series', 'Watch trailer and preview episodes', 'Upgrade anytime without lock-in'],
  },
  {
    id: 'pro_viewer',
    name: 'Pro Viewer',
    price: '$4.99/mo',
    note: 'Low barrier full access plan',
    features: ['Watch full series library', '1080p playback', 'Continue watching across devices'],
  },
  {
    id: 'premium_viewer',
    name: 'Premium Viewer',
    price: '$9.99/mo',
    note: 'Premium quality + early access',
    features: ['Higher quality up to 1440p', 'Early access drops', 'Exclusive premium-only content'],
  },
];

export const billingEntries = [
  { id: 'INV-9001', item: 'Pro Viewer Monthly', amount: '$4.99', status: 'Paid', date: '2026-04-01' },
  { id: 'INV-9002', item: 'Creator Pro Monthly', amount: '$19', status: 'Paid', date: '2026-04-09' },
];
