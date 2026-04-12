export const VIEWER_SUBSCRIPTIONS = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    fullSeriesAccess: false,
    quality: '720p',
    earlyAccess: false,
    exclusiveContent: false,
    watchTools: false,
    recommendationPriority: 'Standard',
    badge: 'Entry',
    priceId: null,
  },
  {
    id: 'pro_viewer',
    name: 'Pro Viewer',
    monthlyPrice: 9.99,
    yearlyPrice: 99,
    fullSeriesAccess: true,
    quality: '1080p HD',
    earlyAccess: true,
    exclusiveContent: true,
    watchTools: true,
    recommendationPriority: 'High',
    badge: 'Most Popular',
    priceId: 'price_pro_viewer_monthly_placeholder',
  },
  {
    id: 'premium_viewer',
    name: 'Premium Viewer',
    monthlyPrice: 19.99,
    yearlyPrice: 199,
    fullSeriesAccess: true,
    quality: '1440p+ Ultra',
    earlyAccess: true,
    exclusiveContent: true,
    watchTools: true,
    recommendationPriority: 'Priority Plus',
    badge: 'Best Value',
    priceId: 'price_premium_viewer_monthly_placeholder',
  },
];

export const CREATOR_PLANS = [
  {
    id: 'creator_basic',
    name: 'Creator Basic',
    monthlyPrice: 0,
    commissionRate: 0.3,
    reviewPriority: 'Standard queue',
    staticPoster: true,
    motionPoster: false,
    tiktokPromoPack: false,
    featuredPlacementRequest: false,
    advancedAnalytics: false,
    prioritySupport: false,
  },
  {
    id: 'creator_pro',
    name: 'Creator Pro',
    monthlyPrice: 29,
    commissionRate: 0.2,
    reviewPriority: 'Priority queue',
    staticPoster: true,
    motionPoster: 'Discounted',
    tiktokPromoPack: 'Discounted',
    featuredPlacementRequest: true,
    advancedAnalytics: true,
    prioritySupport: false,
  },
  {
    id: 'studio',
    name: 'Studio',
    monthlyPrice: 79,
    commissionRate: 0.15,
    reviewPriority: 'Top priority',
    staticPoster: true,
    motionPoster: true,
    tiktokPromoPack: true,
    featuredPlacementRequest: true,
    advancedAnalytics: true,
    prioritySupport: true,
  },
];

export const ADD_ON_SERVICES = [
  {
    id: 'cover_design',
    name: 'Cover Design',
    description: 'AI key visual optimization + thumbnail variants.',
    price: '$9 - $15',
    pricingMode: 'range',
    includedIn: [],
    discountedIn: ['creator_pro', 'studio'],
  },
  {
    id: 'motion_poster_addon',
    name: 'Motion Poster Add-on',
    description: '5-10s animated poster loops for storefront conversion.',
    price: '+$15',
    pricingMode: 'addon',
    includedIn: ['studio'],
    discountedIn: ['creator_pro'],
  },
  {
    id: 'trailer_editing',
    name: 'Trailer Editing',
    description: 'Trailer narrative pacing and hook optimization.',
    price: '$29+',
    pricingMode: 'starting',
    includedIn: [],
    discountedIn: ['creator_pro', 'studio'],
  },
  {
    id: 'listing_packaging',
    name: 'Listing Packaging',
    description: 'Metadata pack, tags and storefront listing improvements.',
    price: '$39+',
    pricingMode: 'starting',
    includedIn: [],
    discountedIn: ['creator_pro', 'studio'],
  },
  {
    id: 'tiktok_promo_pack',
    name: 'TikTok Promo Pack',
    description: 'Hook cuts, captions and launch script set.',
    price: '$49+',
    pricingMode: 'starting',
    includedIn: ['studio'],
    discountedIn: ['creator_pro'],
  },
  {
    id: 'subtitle_localization',
    name: 'Subtitle / Localization',
    description: 'Multilingual subtitles and tone localization.',
    price: '$19+',
    pricingMode: 'starting',
    includedIn: [],
    discountedIn: ['creator_pro', 'studio'],
  },
];

export const CREATOR_ASSETS = ['Static Poster', 'Motion Poster', 'Thumbnail', 'Trailer', 'TikTok Hook'];

export const DEFAULT_PLATFORM_COMMISSION = 0.2;

export function formatUsd(value) {
  if (value === 0) return '$0';
  return `$${Number(value).toFixed(Number.isInteger(value) ? 0 : 2)}`;
}

export function formatCommission(rate) {
  return `${Math.round(rate * 100)}%`;
}

export function getViewerPlan(planId = 'free') {
  return VIEWER_SUBSCRIPTIONS.find((plan) => plan.id === planId) || VIEWER_SUBSCRIPTIONS[0];
}

export function getCreatorPlan(planId = 'creator_basic') {
  return CREATOR_PLANS.find((plan) => plan.id === planId) || CREATOR_PLANS[0];
}

export function getServiceEntitlement(service, creatorPlanId = 'creator_basic') {
  if (service.includedIn.includes(creatorPlanId)) return 'Included';
  if (service.discountedIn.includes(creatorPlanId)) return 'Discounted';
  return service.pricingMode === 'addon' ? 'Add-on' : 'Optional';
}
