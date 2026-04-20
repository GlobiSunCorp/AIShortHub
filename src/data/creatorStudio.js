export const CREATOR_HASH_ALIASES = {
  overview: 'overview',
  dashboard: 'overview',
  content: 'content',
  'my-series': 'content',
  assets: 'assets',
  'upload-assets': 'assets',
  episodes: 'content',
  pricing: 'pricing',
  monetization: 'pricing',
  earnings: 'earnings',
  review: 'review',
  'review-publish': 'review',
  featured: 'featured',
  'motion-poster': 'motion-poster',
  'promo-tools': 'promo-tools',
  'priority-support': 'priority-support',
};

export const CREATOR_MODULE_TO_WORKSPACE = {
  overview: 'overview',
  content: 'content',
  assets: 'assets',
  pricing: 'pricing',
  earnings: 'earnings',
  review: 'review',
  featured: 'review',
  'motion-poster': 'assets',
  'promo-tools': 'assets',
  'priority-support': 'review',
};

export const CREATOR_STUDIO_GROUPS = [
  {
    id: 'workspace',
    title: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', to: '/creator#overview', mode: 'page', status: 'Ready', hint: 'Overview of quota, action center, and launch readiness.' },
      { id: 'my-series', label: 'My Series', to: '/creator#content', mode: 'page', status: '3 drafts', hint: 'Manage scripts, episodes, and metadata drafts.' },
      { id: 'upload-assets', label: 'Upload Assets', to: '/creator#assets', mode: 'page', status: '2 files missing', hint: 'Poster, trailer, subtitle, and promo asset intake.' },
      { id: 'pricing', label: 'Pricing & Monetization', to: '/creator#pricing', mode: 'page', status: 'Setup 80%', hint: 'Complete pricing and monetization configuration.' },
      { id: 'earnings', label: 'Earnings', to: '/creator#earnings', mode: 'page', status: '$0 pending', hint: 'Track net payout, deductions, and payout timeline.' },
    ],
  },
  {
    id: 'publishing',
    title: 'Publishing',
    items: [
      { id: 'review-publish', label: 'Review & Publish', to: '/creator#review', mode: 'module', tag: 'Studio', status: 'Pending Review', hint: 'Submission checklist, QA status, and review queue sync.' },
      { id: 'featured', label: 'Featured Placement', to: '/creator#featured', mode: 'module', tag: 'Add-on', status: '0/2 used', hint: 'Apply for featured slots based on plan quota and add-ons.' },
      { id: 'guidelines', label: 'Creator Guidelines', to: '/creator-guidelines', mode: 'page', status: 'Updated', hint: 'Policy, quality baseline, and moderation requirements.' },
    ],
  },
  {
    id: 'growth-tools',
    title: 'Growth Tools',
    items: [
      { id: 'motion-poster', label: 'Motion Poster', to: '/creator#motion-poster', mode: 'module', tag: 'Pro', status: '1 rendering', hint: 'Generate motion poster variants for campaign launch.' },
      { id: 'promo-tools', label: 'Promo Tools', to: '/creator#promo-tools', mode: 'module', tag: 'Beta', status: 'Ready', hint: 'Channel-ready captions, hooks, and ad copy presets.' },
      { id: 'priority-support', label: 'Priority Support', to: '/creator#priority-support', mode: 'module', tag: 'Studio only', status: 'Locked', hint: 'Fast-track ops support for Studio creators.' },
    ],
  },
  {
    id: 'service',
    title: 'Service',
    items: [
      { id: 'service-orders', label: 'Service Orders', to: '/services', mode: 'page', status: '2 in progress', hint: 'Place and track paid creative service orders.' },
    ],
  },
];
