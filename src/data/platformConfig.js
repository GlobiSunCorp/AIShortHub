export const VIEWER_PLANS = [
  {
    id: 'free',
    name: 'Free',
    badge: 'Entry',
    monthlyPrice: 0,
    yearlyPrice: 0,
    fullSeriesAccess: false,
    quality: '720p',
    earlyAccess: false,
    exclusiveContent: false,
    watchTools: false,
    recommendationPriority: 'Standard',
    accessNote: 'Trailers and preview AI shorts only',
    stripePriceKey: 'STRIPE_PRICE_VIEWER_FREE',
  },
  {
    id: 'pro_viewer',
    name: 'Pro Viewer',
    badge: 'Most Popular',
    monthlyPrice: 4.99,
    yearlyPrice: 49.9,
    fullSeriesAccess: true,
    quality: '1080p HD',
    earlyAccess: false,
    exclusiveContent: false,
    watchTools: true,
    recommendationPriority: 'High',
    accessNote: 'Full AI short video access across eligible titles',
    stripePriceKey: 'STRIPE_PRICE_VIEWER_PRO',
  },
  {
    id: 'premium_viewer',
    name: 'Premium Viewer',
    badge: 'Best Value',
    monthlyPrice: 9.99,
    yearlyPrice: 99.9,
    fullSeriesAccess: true,
    quality: '1440p+ Ultra',
    earlyAccess: true,
    exclusiveContent: true,
    watchTools: true,
    recommendationPriority: 'Priority Plus',
    accessNote: 'Higher quality, early access, and exclusive AI shorts',
    stripePriceKey: 'STRIPE_PRICE_VIEWER_PREMIUM',
  },
];

export const CREATOR_PLANS = [
  {
    id: 'creator_basic',
    name: 'Creator Basic',
    monthlyPrice: 0,
    commissionRate: 0.08,
    commissionPolicy: 'Only applies after creator-generated revenue exists.',
    reviewPriority: 'Standard queue',
    staticPoster: true,
    motionPoster: 'Add-on',
    tiktokPromoPack: false,
    featuredPlacementRequest: false,
    advancedAnalytics: false,
    prioritySupport: false,
    adRevenueShareEligible: true,
    creatorSetPricing: true,
    maxActiveSeries: 2,
    maxTotalEpisodes: 20,
    monthlyAssetStorageLimit: 5,
    monthlyAssetStorageLimitGb: 5,
    monthlyUploadLimit: 30,
    includedMotionPosterCount: 0,
    maxFeaturedRequestsPerCycle: 0,
    featuredPlacementEligibility: false,
    stripePriceKey: null,
  },
  {
    id: 'creator_pro',
    name: 'Creator Pro',
    monthlyPrice: 19,
    commissionRate: 0.05,
    commissionPolicy: 'Only applies after creator-generated revenue exists.',
    reviewPriority: 'Priority queue',
    staticPoster: true,
    motionPoster: 'Discounted',
    tiktokPromoPack: 'Discounted',
    featuredPlacementRequest: true,
    advancedAnalytics: true,
    prioritySupport: false,
    adRevenueShareEligible: true,
    creatorSetPricing: true,
    maxActiveSeries: 5,
    maxTotalEpisodes: 100,
    monthlyAssetStorageLimit: 25,
    monthlyAssetStorageLimitGb: 25,
    monthlyUploadLimit: 150,
    includedMotionPosterCount: 2,
    maxFeaturedRequestsPerCycle: 3,
    featuredPlacementEligibility: true,
    stripePriceKey: 'STRIPE_PRICE_CREATOR_PRO',
  },
  {
    id: 'studio',
    name: 'Studio',
    monthlyPrice: 49,
    commissionRate: 0.03,
    commissionPolicy: 'Only applies after creator-generated revenue exists.',
    reviewPriority: 'Top priority review',
    staticPoster: true,
    motionPoster: 'Included',
    tiktokPromoPack: true,
    featuredPlacementRequest: true,
    advancedAnalytics: true,
    prioritySupport: true,
    adRevenueShareEligible: true,
    creatorSetPricing: true,
    maxActiveSeries: 20,
    maxTotalEpisodes: 500,
    monthlyAssetStorageLimit: 100,
    monthlyAssetStorageLimitGb: 100,
    monthlyUploadLimit: 500,
    includedMotionPosterCount: 20,
    maxFeaturedRequestsPerCycle: 12,
    featuredPlacementEligibility: true,
    stripePriceKey: 'STRIPE_PRICE_CREATOR_STUDIO',
  },
];

export const ADD_ON_SERVICES = [
  { id: 'motion_poster_addon', name: 'Motion Poster Add-on', description: '5-10s animated poster loops for AI short cards, trailers, and storefront conversion.', amountUsd: 15, price: '+$15', pricingMode: 'addon', includedIn: ['studio'], discountedIn: ['creator_pro'] },
  { id: 'trailer_editing', name: 'Trailer Editing', description: 'Trailer, teaser, or hook-cut pacing for AI-powered short videos.', amountUsd: 29, price: '$29+', pricingMode: 'starting', includedIn: [], discountedIn: ['creator_pro', 'studio'] },
  { id: 'tiktok_promo_pack', name: 'TikTok Promo Pack', description: 'Vertical hooks, captions and launch script set for TikTok/Reels/Shorts.', amountUsd: 49, price: '$49+', pricingMode: 'starting', includedIn: ['studio'], discountedIn: ['creator_pro'] },
  { id: 'subtitle_localization', name: 'Subtitle / Localization', description: 'Multilingual subtitles and tone localization for global AI shorts.', amountUsd: 19, price: '$19+', pricingMode: 'starting', includedIn: [], discountedIn: ['creator_pro', 'studio'] },
  { id: 'listing_packaging', name: 'Listing Packaging', description: 'Metadata pack, tags and showcase listing improvements.', amountUsd: 39, price: '$39+', pricingMode: 'starting', includedIn: [], discountedIn: ['creator_pro', 'studio'] },
];

export const REVENUE_MODEL = {
  platform: [
    { key: 'advertising', label: 'Advertising revenue', detail: 'Primary launch-stage revenue source from feed / mid-roll inventory and brand placement.' },
    { key: 'services', label: 'Service revenue', detail: 'Creator support services like trailer editing, promo packs, localization and packaging.' },
    { key: 'viewer_subscription', label: 'Viewer subscriptions', detail: 'Recurring viewer membership helps finance platform operations and payout pool.' },
    { key: 'single_unlocks', label: 'Single-title / single-video unlocks', detail: 'One-time unlock purchases by non-subscribers.' },
    { key: 'low_commission', label: 'Low platform commission', detail: 'Low launch-stage commission only after creators generate revenue.' },
  ],
  creator: [
    'Ad revenue share',
    'Subscription pool share',
    'Single-title sales',
    'Single-video sales',
    'Net payout after low commission',
  ],
};

export const REFUND_POLICY_CONFIG = {
  viewer: {
    title: 'Viewer Subscription Refund Policy',
    short: 'Cancel renewal anytime; started billing cycles are usually not prorated.',
    points: [
      'You can cancel auto-renewal anytime; cancellation takes effect after the current billing cycle.',
      'Started billing cycles are usually not prorated.',
      'Duplicate charges, payment errors, or major platform outages can be reviewed manually.',
      'If purchased through an app store or third-party platform, that platform’s rules apply.',
    ],
  },
  creator: {
    title: 'Creator Plan Refund Policy',
    short: 'Creator Plan refunds are separate; used upload/review/entitlement benefits are not refundable.',
    reviewWindowDays: 7,
    points: [
      'Creator Plan and Viewer Subscription are billed and reviewed separately.',
      'First purchases can request review within the default 7-day mock review window.',
      'Once content is uploaded, submitted for review, or plan benefits are used, the plan is generally not refundable.',
      'Special disputes may be manually reviewed and converted to platform credit where appropriate.',
    ],
  },
  addon: {
    title: 'Add-on Services Refund Policy',
    short: 'Refundable before work starts; generally not refundable after scheduling or production begins.',
    points: [
      'Services can be refunded before work begins.',
      'After scheduling or production begins, add-on services are generally not refundable.',
      'Special cases can be converted to platform credit or adjusted service scope.',
      'If the platform cannot start work or materially fails to deliver, manual refund handling may apply.',
    ],
  },
};

export const SUPPORT_CONTACT_CONFIG = {
  mode: import.meta.env.VITE_SUPPORT_PILOT_MODE === '1' ? 'pilot' : 'domain',
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support@aishorthub.com',
  creatorOpsEmail: import.meta.env.VITE_CREATOR_OPS_EMAIL || 'creatorops@aishorthub.com',
  policyEmail: import.meta.env.VITE_POLICY_EMAIL || 'policy@aishorthub.com',
  fallbackFormUrl: import.meta.env.VITE_SUPPORT_FORM_URL || '/support',
  pilotNotice: 'Pilot contact mode: custom domain inbox routing is being verified. We currently triage via shared operations mailbox and manual SLA tracking.',
};

export const COMMISSION_RULES = {
  defaultTakeRate: Number(import.meta.env.VITE_PLATFORM_TAKE_RATE || 0.2),
  launchPolicy: 'Creator-friendly launch policy: low commission, charged only after creator revenue is generated.',
};

export const CREATOR_ASSETS = [
  'Static Poster',
  'Motion Poster',
  'Vertical Cover',
  'Square Thumbnail',
  'Trailer / Teaser',
  'Main Video',
  'Subtitle files',
  'Caption pack',
  'Promo pack',
];

export function formatUsd(value) {
  if (value === 0) return '$0';
  return `$${Number(value).toFixed(Number.isInteger(value) ? 0 : 2)}`;
}

export function formatCommission(rate) {
  return `${Math.round(rate * 100)}%`;
}

export function formatStorageGb(gb) {
  return `${gb}GB/month`;
}

export function getViewerPlan(planId = 'free') {
  return VIEWER_PLANS.find((plan) => plan.id === planId) || VIEWER_PLANS[0];
}

export function getCreatorPlan(planId = 'creator_basic') {
  return CREATOR_PLANS.find((plan) => plan.id === planId) || CREATOR_PLANS[0];
}

export function getServiceEntitlement(service, creatorPlanId = 'creator_basic') {
  if (service.includedIn.includes(creatorPlanId)) return 'Included';
  if (service.discountedIn.includes(creatorPlanId)) return 'Discounted';
  return service.pricingMode === 'addon' ? 'Add-on' : 'Optional';
}
