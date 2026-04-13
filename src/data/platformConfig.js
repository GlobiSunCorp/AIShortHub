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
    stripePriceKey: 'STRIPE_PRICE_VIEWER_FREE',
  },
  {
    id: 'pro_viewer',
    name: 'Pro Viewer',
    badge: 'Most Popular',
    monthlyPrice: 9.99,
    yearlyPrice: 99,
    fullSeriesAccess: true,
    quality: '1080p HD',
    earlyAccess: true,
    exclusiveContent: true,
    watchTools: true,
    recommendationPriority: 'High',
    stripePriceKey: 'STRIPE_PRICE_VIEWER_PRO',
  },
  {
    id: 'premium_viewer',
    name: 'Premium Viewer',
    badge: 'Best Value',
    monthlyPrice: 19.99,
    yearlyPrice: 199,
    fullSeriesAccess: true,
    quality: '1440p+ Ultra',
    earlyAccess: true,
    exclusiveContent: true,
    watchTools: true,
    recommendationPriority: 'Priority Plus',
    stripePriceKey: 'STRIPE_PRICE_VIEWER_PREMIUM',
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
    motionPoster: 'Add-on only',
    tiktokPromoPack: false,
    featuredPlacementRequest: false,
    advancedAnalytics: false,
    prioritySupport: false,
    maxActiveSeries: 1,
    maxTotalEpisodes: 10,
    monthlyAssetStorageLimit: 2,
    monthlyAssetStorageLimitGb: 2,
    monthlyUploadLimit: 20,
    includedMotionPosterCount: 0,
    maxFeaturedRequestsPerCycle: 0,
    featuredPlacementEligibility: false,
    stripePriceKey: null,
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
    maxActiveSeries: 5,
    maxTotalEpisodes: 100,
    monthlyAssetStorageLimit: 20,
    monthlyAssetStorageLimitGb: 20,
    monthlyUploadLimit: 120,
    includedMotionPosterCount: 2,
    maxFeaturedRequestsPerCycle: 3,
    featuredPlacementEligibility: true,
    stripePriceKey: 'STRIPE_PRICE_CREATOR_PRO',
  },
  {
    id: 'studio',
    name: 'Studio',
    monthlyPrice: 79,
    commissionRate: 0.15,
    reviewPriority: 'Top priority',
    staticPoster: true,
    motionPoster: 'Included',
    tiktokPromoPack: true,
    featuredPlacementRequest: true,
    advancedAnalytics: true,
    prioritySupport: true,
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
  { id: 'motion_poster_addon', name: 'Motion Poster Add-on', description: '5-10s animated poster loops for storefront conversion.', amountUsd: 15, price: '+$15', pricingMode: 'addon', includedIn: ['studio'], discountedIn: ['creator_pro'] },
  { id: 'trailer_editing', name: 'Trailer Editing', description: 'Trailer narrative pacing and hook optimization.', amountUsd: 29, price: '$29+', pricingMode: 'starting', includedIn: [], discountedIn: ['creator_pro', 'studio'] },
  { id: 'tiktok_promo_pack', name: 'TikTok Promo Pack', description: 'Hook cuts, captions and launch script set.', amountUsd: 49, price: '$49+', pricingMode: 'starting', includedIn: ['studio'], discountedIn: ['creator_pro'] },
  { id: 'subtitle_localization', name: 'Subtitle / Localization', description: 'Multilingual subtitles and tone localization.', amountUsd: 19, price: '$19+', pricingMode: 'starting', includedIn: [], discountedIn: ['creator_pro', 'studio'] },
  { id: 'listing_packaging', name: 'Listing Packaging', description: 'Metadata pack, tags and storefront listing improvements.', amountUsd: 39, price: '$39+', pricingMode: 'starting', includedIn: [], discountedIn: ['creator_pro', 'studio'] },
];

export const REFUND_POLICY_CONFIG = {
  viewer: {
    title: 'Viewer Subscription Refund Policy',
    short: '可取消续费；已开始计费周期默认不按比例退款。',
    points: [
      '可随时取消自动续费，取消后在当前计费周期结束时生效。',
      '已开始的计费周期默认不按比例退款。',
      '重复扣费、支付异常或平台重大服务故障可提交人工审核。',
      '若通过 App Store/第三方平台购买，按对应平台规则处理。',
    ],
  },
  creator: {
    title: 'Creator Plan Refund Policy',
    short: '与 Viewer 订阅分开；首次购买可在审核窗口内申请。',
    reviewWindowDays: 7,
    points: [
      'Creator Plan 与 Viewer Subscription 独立结算、独立审核。',
      '首次购买可在 3-7 天审核窗口内申请退款（默认 7 天 mock 规则）。',
      '一旦上传内容、提交审核、使用方案权益或消耗优先审核/推荐位资格，则不可退款。',
      '特殊争议可转人工评估，并保留转平台 credit 的处理方式。',
    ],
  },
  addon: {
    title: 'Add-on Services Refund Policy',
    short: '未开工可退款；排期或制作开始后默认不退款。',
    points: [
      '服务未开工前支持退款。',
      '进入排期/制作后默认不可退款。',
      '特殊情况可转平台 credit 或调整服务范围。',
      '平台未能开工或明显履约失败，可人工处理退款。',
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
};

export const CREATOR_ASSETS = ['Static Poster', 'Motion Poster', 'Thumbnail', 'Trailer', 'Video'];

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
