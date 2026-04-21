export const PLATFORM_CONFIG = {
  platformTakeRate: 0.2,
  trialSeconds: 45,
  freeEpisodeCount: 1,
  settlementCycle: 'Monthly on the 5th business day (mock)',
  homeHero: {
    featuredSeriesId: 'hidden-return',
    eyebrow: 'Viewer-first landing',
    kicker: 'Featured launch title',
    title: 'Her Hidden Return',
    synopsis: 'A vanished heiress returns under a new identity and rewrites every power game around her.',
    posterUrl: '',
    primaryCtaLabel: 'Watch trailer',
    secondaryCtaLabel: 'Browse titles',
    creatorCtaLabel: 'For creators',
  },
};

export const tags = ['Romance', 'Revenge', 'Mystery', 'Urban', 'Fantasy', 'Workplace', 'Suspense', 'Historical'];

export const profiles = [
  { id: 'u_viewer', name: 'Mia Member', email: 'mia@example.com', role: 'member', viewerPlan: 'free', creatorPlan: null },
  { id: 'u_creator', name: 'Luma Studio', email: 'creator@example.com', role: 'creator', viewerPlan: 'pro_viewer', creatorPlan: 'creator_pro' },
  { id: 'u_admin', name: 'Ops Admin', email: 'admin@example.com', role: 'admin', viewerPlan: 'premium_viewer', creatorPlan: 'studio' },
];

export const memberships = [
  { profileId: 'u_viewer', tier: 'free', creatorPlan: null, status: 'active', renewAt: null },
  { profileId: 'u_creator', tier: 'pro_viewer', creatorPlan: 'creator_pro', status: 'active', renewAt: '2026-05-02' },
  { profileId: 'u_admin', tier: 'premium_viewer', creatorPlan: 'studio', status: 'active', renewAt: '2027-01-01' },
];

export const creators = [
  { id: 'c_luma', profileId: 'u_creator', studioName: 'Luma Vertical Drama', bio: 'TikTok first AI short drama studio.', revenueShare: 0.9 },
  { id: 'c_midnight', profileId: 'u_creator', studioName: 'Midnight Plot Lab', bio: 'Urban revenge mini-series.', revenueShare: 0.9 },
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
    monetization: {
      titlePriceUsd: 8.99,
      episodeUnlockPriceUsd: 0.99,
      finaleUnlockEnabled: true,
      finaleUnlockPriceUsd: 1.99,
      freePreviewEpisodes: [1],
      subscriptionAccess: { proViewer: 'full_access', premiumViewer: 'full_access_plus_early' },
    },
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
    monetization: {
      titlePriceUsd: 11.99,
      episodeUnlockPriceUsd: 1.29,
      finaleUnlockEnabled: false,
      finaleUnlockPriceUsd: 0,
      freePreviewEpisodes: [1],
      subscriptionAccess: { proViewer: 'full_access', premiumViewer: 'full_access_plus_early' },
    },
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
    monetization: {
      titlePriceUsd: 6.99,
      episodeUnlockPriceUsd: 0.79,
      finaleUnlockEnabled: true,
      finaleUnlockPriceUsd: 1.49,
      freePreviewEpisodes: [1, 2],
      subscriptionAccess: { proViewer: 'full_access', premiumViewer: 'full_access_plus_early' },
    },
  },
];

export const episodes = [
  { id: 'e1', seriesId: 'hidden-return', number: 1, title: 'The Return', videoUrl: 'https://cdn.example.com/hidden/ep1.mp4', isPreview: true, isPaid: false, unlockPriceUsd: 0, durationSeconds: 62, publishAt: '2026-03-22T12:00:00Z', subtitleLanguages: ['en', 'zh'], reviewStatus: 'approved', availableResolutions: ['360p', '540p', '720p', '1080p'], aspectRatio: '9:16' },
  { id: 'e2', seriesId: 'hidden-return', number: 2, title: 'Invitation', videoUrl: 'https://cdn.example.com/hidden/ep2.mp4', isPreview: false, isPaid: true, unlockPriceUsd: 0.99, durationSeconds: 78, publishAt: '2026-03-23T12:00:00Z', subtitleLanguages: ['en', 'zh'], reviewStatus: 'approved', availableResolutions: ['360p', '540p', '720p', '1080p'], aspectRatio: '9:16' },
  { id: 'e3', seriesId: 'hidden-return', number: 3, title: 'Silent Toast', videoUrl: 'https://cdn.example.com/hidden/ep3.mp4', isPreview: false, isPaid: true, unlockPriceUsd: 1.29, durationSeconds: 81, publishAt: '2026-03-24T12:00:00Z', subtitleLanguages: ['en'], reviewStatus: 'approved', availableResolutions: ['360p', '540p', '720p'], aspectRatio: '9:16' },
  { id: 'e4', seriesId: 'crimson-veil', number: 1, title: 'Red Hall', videoUrl: 'https://cdn.example.com/crimson/ep1.mp4', isPreview: true, isPaid: false, unlockPriceUsd: 0, durationSeconds: 70, publishAt: '2026-04-07T12:00:00Z', subtitleLanguages: ['en', 'es'], reviewStatus: 'approved', availableResolutions: ['360p', '540p', '720p', '1080p'], aspectRatio: '9:16' },
  { id: 'e5', seriesId: 'crimson-veil', number: 2, title: 'The Archive Door', videoUrl: 'https://cdn.example.com/crimson/ep2.mp4', isPreview: false, isPaid: true, unlockPriceUsd: 1.29, durationSeconds: 75, publishAt: '2026-04-08T12:00:00Z', subtitleLanguages: ['en'], reviewStatus: 'pending_review', availableResolutions: ['360p', '540p'], aspectRatio: '4:5' },
  { id: 'e6', seriesId: 'contract-bride', number: 1, title: 'Signed', videoUrl: 'https://cdn.example.com/contract/ep1.mp4', isPreview: true, isPaid: false, unlockPriceUsd: 0, durationSeconds: 55, publishAt: '2026-04-11T12:00:00Z', subtitleLanguages: ['zh'], reviewStatus: 'pending_review', availableResolutions: ['360p', '540p', '720p'], aspectRatio: '9:16' },
];

export const trailers = [
  { id: 't_hidden', seriesId: 'hidden-return', title: 'Official Trailer', videoUrl: 'https://cdn.example.com/hidden/trailer.mp4', coverUrl: 'https://images.example.com/hidden-return-trailer-cover.jpg', durationSeconds: 35, ctaText: 'Watch full season', aspectRatio: '16:9', availableResolutions: ['360p', '540p', '720p', '1080p'] },
  { id: 't_crimson', seriesId: 'crimson-veil', title: 'Crimson Teaser', videoUrl: 'https://cdn.example.com/crimson/trailer.mp4', coverUrl: 'https://images.example.com/crimson-veil-trailer-cover.jpg', durationSeconds: 30, ctaText: 'Unlock episode pack', aspectRatio: '9:16', availableResolutions: ['360p', '540p', '720p'] },
  { id: 't_contract', seriesId: 'contract-bride', title: 'Contract Hook', videoUrl: 'https://cdn.example.com/contract/trailer.mp4', coverUrl: 'https://images.example.com/contract-bride-trailer-cover.jpg', durationSeconds: 29, ctaText: 'Start free preview', aspectRatio: '9:16', availableResolutions: ['360p', '540p', '720p'] },
];

export const creatorEarnings = [
  {
    creatorId: 'c_luma',
    period: '2026-04',
    advertisingRevenue: 540,
    subscriptionShare: 420,
    singleTitleSales: 180,
    episodeUnlockSales: 140,
    addOnServiceCosts: 90,
    platformCommission: 119,
    netEarnings: 1071,
    pendingPayout: 340,
    paidOut: 731,
    previousPeriodNet: 928,
  },
];

export const serviceOrders = [
  {
    id: 'so_001', requesterId: 'u_creator', serviceType: 'TikTok Promo Pack', projectTitle: 'Her Hidden Return', requestDetails: 'Need 5 hooks + caption templates for next launch.', budget: '$300-$600', contact: 'ops@lumastudio.com', status: 'in_progress', entitlement: 'Included', addOnPrice: '$0', nextStep: 'Deliver first TikTok hook pack for approval.', createdAt: '2026-04-08',
  },
];

export const payments = [{ id: 'pay_001', profileId: 'u_viewer', amount: 9.99, currency: 'USD', provider: 'stripe', type: 'membership', status: 'paid', createdAt: '2026-04-01' }];

export const payouts = [{ id: 'po_001', creatorId: 'c_luma', grossAmount: 1280, platformFeeRate: 0.1, netAmount: 1152, status: 'scheduled', createdAt: '2026-04-10' }];

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

export const ordersHistory = [{ id: 'ord_001', profileId: 'u_viewer', item: 'Pro Viewer Monthly', amount: '$4.99', status: 'Paid', date: '2026-04-01' }];
