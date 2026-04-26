export const CREATOR_HASH_ALIASES = {
  overview: 'overview',
  dashboard: 'overview',
  content: 'content',
  'my-series': 'content',
  'my-projects': 'content',
  assets: 'assets',
  'upload-assets': 'assets',
  episodes: 'content',
  videos: 'content',
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
      { id: 'dashboard', label: 'Dashboard', to: '/creator#overview', mode: 'page', status: 'Overview', hint: 'Quota, launch readiness, and creator action center in one place.' },
      { id: 'my-projects', label: 'My Projects', to: '/creator#content', mode: 'page', status: '3 drafts', hint: 'Manage AI short metadata, video structure, and publishing setup.' },
      { id: 'upload-assets', label: 'Upload Assets', to: '/creator#assets', mode: 'page', status: '2 missing', hint: 'Poster, trailer, video, subtitle, and promo asset intake.' },
      { id: 'pricing', label: 'Pricing & Monetization', to: '/creator#pricing', mode: 'page', status: '80% ready', hint: 'Complete title pricing, single-video unlocks, and monetization configuration.' },
      { id: 'earnings', label: 'Earnings', to: '/creator#earnings', mode: 'page', status: '$0 pending', hint: 'Track gross income, deductions, and payout timeline.' },
    ],
  },
  {
    id: 'publishing',
    title: 'Publishing',
    items: [
      { id: 'review-publish', label: 'Review & Publish', to: '/creator#review', mode: 'module', tag: 'Core', status: 'Checklist', hint: 'Submission checklist, QA status, and review queue sync.' },
      { id: 'featured', label: 'Featured Placement', to: '/creator#featured', mode: 'module', tag: 'Add-on', status: '0 / 2 used', hint: 'Apply for featured AI shorts slots based on plan quota and add-ons.' },
      { id: 'guidelines', label: 'Creator Guidelines', to: '/creator-guidelines', mode: 'page', status: 'Policy', hint: 'Quality baseline, moderation rules, and creator operations guidance.' },
    ],
  },
  {
    id: 'growth-tools',
    title: 'Growth Tools',
    items: [
      { id: 'motion-poster', label: 'Motion Poster', to: '/creator#motion-poster', mode: 'module', tag: 'Pro', status: '1 rendering', hint: 'Generate motion-poster variants for AI short launch campaigns.' },
      { id: 'promo-tools', label: 'Promo Tools', to: '/creator#promo-tools', mode: 'module', tag: 'Beta', status: 'Ready', hint: 'Channel-ready captions, hooks, and ad-copy presets.' },
      { id: 'priority-support', label: 'Priority Support', to: '/creator#priority-support', mode: 'module', tag: 'Studio', status: 'Locked', hint: 'Fast-track creator ops support for Studio plans.' },
    ],
  },
  {
    id: 'service',
    title: 'Service',
    items: [
      { id: 'service-orders', label: 'Service Orders', to: '/services', mode: 'page', status: '2 active', hint: 'Place and track paid creative service orders.' },
    ],
  },
];
