export const PLATFORM_CONFIG = {
  platformTakeRate: 0.2,
  trialSeconds: 45,
  freeEpisodeCount: 1,
};

export const tags = ['Romance', 'Revenge', 'Mystery', 'Urban', 'Fantasy', 'Workplace', 'Suspense', 'Historical'];

export const profiles = [
  { id: 'u_viewer', name: 'Mia Member', email: 'mia@example.com', role: 'member' },
  { id: 'u_creator', name: 'Luma Studio', email: 'creator@example.com', role: 'creator' },
  { id: 'u_admin', name: 'Ops Admin', email: 'admin@example.com', role: 'admin' },
];

export const memberships = [
  { profileId: 'u_viewer', tier: 'free', status: 'active', renewAt: null },
  { profileId: 'u_creator', tier: 'pro_monthly', status: 'active', renewAt: '2026-05-02' },
  { profileId: 'u_admin', tier: 'pro_yearly', status: 'active', renewAt: '2027-01-01' },
];

export const creators = [
  { id: 'c_luma', profileId: 'u_creator', studioName: 'Luma Vertical Drama', bio: 'TikTok first AI short drama studio.', revenueShare: 0.8 },
  { id: 'c_midnight', profileId: 'u_creator', studioName: 'Midnight Plot Lab', bio: 'Urban revenge mini-series.', revenueShare: 0.8 },
];

export const series = [
  {
    id: 'hidden-return',
    creatorId: 'c_luma',
    title: 'Her Hidden Return',
    synopsis: 'A vanished heiress returns under a new identity and rewrites every power game around her.',
    status: 'published',
    visibility: 'public',
    coverUrl: 'https://images.example.com/hidden-return-cover.jpg',
    category: 'Romance',
    tags: ['Romance', 'Revenge'],
    trailerId: 't_hidden',
    createdAt: '2026-03-22',
    tiktokHook: '30s betrayal reveal clip',
  },
  {
    id: 'crimson-veil',
    creatorId: 'c_midnight',
    title: 'Beneath the Crimson Veil',
    synopsis: 'A royal conspiracy thriller where every vow has a hidden blood price.',
    status: 'published',
    visibility: 'public',
    coverUrl: 'https://images.example.com/crimson-veil-cover.jpg',
    category: 'Mystery',
    tags: ['Mystery', 'Fantasy'],
    trailerId: 't_crimson',
    createdAt: '2026-04-07',
    tiktokHook: 'Masked court teaser',
  },
  {
    id: 'contract-bride',
    creatorId: 'c_luma',
    title: 'Contract Bride, Real Revenge',
    synopsis: 'A fake marriage contract ignites real vengeance inside a billionaire family.',
    status: 'pending_review',
    visibility: 'private',
    coverUrl: 'https://images.example.com/contract-bride-cover.jpg',
    category: 'Urban',
    tags: ['Urban', 'Revenge'],
    trailerId: 't_contract',
    createdAt: '2026-04-11',
    tiktokHook: 'Ring + revenge hook cut',
  },
];

export const episodes = [
  { id: 'e1', seriesId: 'hidden-return', number: 1, title: 'The Return', videoUrl: 'https://cdn.example.com/hidden/ep1.mp4', isPreview: true, durationSeconds: 62 },
  { id: 'e2', seriesId: 'hidden-return', number: 2, title: 'Invitation', videoUrl: 'https://cdn.example.com/hidden/ep2.mp4', isPreview: false, durationSeconds: 78 },
  { id: 'e3', seriesId: 'hidden-return', number: 3, title: 'Silent Toast', videoUrl: 'https://cdn.example.com/hidden/ep3.mp4', isPreview: false, durationSeconds: 81 },
  { id: 'e4', seriesId: 'crimson-veil', number: 1, title: 'Red Hall', videoUrl: 'https://cdn.example.com/crimson/ep1.mp4', isPreview: true, durationSeconds: 70 },
  { id: 'e5', seriesId: 'crimson-veil', number: 2, title: 'The Archive Door', videoUrl: 'https://cdn.example.com/crimson/ep2.mp4', isPreview: false, durationSeconds: 75 },
  { id: 'e6', seriesId: 'contract-bride', number: 1, title: 'Signed', videoUrl: 'https://cdn.example.com/contract/ep1.mp4', isPreview: true, durationSeconds: 55 },
];

export const trailers = [
  { id: 't_hidden', seriesId: 'hidden-return', title: 'Official Trailer', videoUrl: 'https://cdn.example.com/hidden/trailer.mp4', durationSeconds: 35 },
  { id: 't_crimson', seriesId: 'crimson-veil', title: 'Crimson Teaser', videoUrl: 'https://cdn.example.com/crimson/trailer.mp4', durationSeconds: 30 },
  { id: 't_contract', seriesId: 'contract-bride', title: 'Contract Hook', videoUrl: 'https://cdn.example.com/contract/trailer.mp4', durationSeconds: 29 },
];

export const serviceOrders = [
  {
    id: 'so_001',
    requesterId: 'u_creator',
    serviceType: 'TikTok Promo Pack',
    projectTitle: 'Her Hidden Return',
    requestDetails: 'Need 5 hooks + caption templates for next launch.',
    budget: '$300-$600',
    contact: '@lumastudio',
    status: 'in_progress',
    createdAt: '2026-04-08',
  },
];

export const payments = [{ id: 'pay_001', profileId: 'u_viewer', amount: 19, currency: 'USD', provider: 'stripe', type: 'membership', status: 'paid', createdAt: '2026-04-01' }];

export const payouts = [{ id: 'po_001', creatorId: 'c_luma', grossAmount: 1240, platformFeeRate: PLATFORM_CONFIG.platformTakeRate, netAmount: 992, status: 'scheduled', createdAt: '2026-04-10' }];

export const reviewLogs = [
  {
    id: 'rv_001',
    seriesId: 'contract-bride',
    reviewerId: 'u_admin',
    decision: 'pending',
    reason: 'Waiting final subtitle QC.',
    createdAt: '2026-04-12',
  },
];

export const unlockedContent = {
  u_viewer: ['hidden-return:1'],
};

export const ordersHistory = [{ id: 'ord_001', profileId: 'u_viewer', item: 'Pro Monthly', amount: '$19', status: 'Paid', date: '2026-04-01' }];
