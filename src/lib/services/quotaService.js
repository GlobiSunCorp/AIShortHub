import { getCreatorPlan } from '../../data/monetization';

const GB = 1024 * 1024 * 1024;

function inCurrentMonth(value) {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return date.getUTCFullYear() === now.getUTCFullYear() && date.getUTCMonth() === now.getUTCMonth();
}

function isFeaturedOrder(item) {
  const text = `${item.serviceType || ''} ${item.projectTitle || ''}`.toLowerCase();
  return text.includes('featured');
}

export function getCreatorQuotaSnapshot({ creatorPlanId, creatorId, platform, profileId }) {
  const plan = getCreatorPlan(creatorPlanId || 'creator_basic');
  const creatorSeries = platform.series.filter((item) => item.creatorId === creatorId);
  const creatorSeriesIds = new Set(creatorSeries.map((item) => item.id));
  const episodes = platform.episodes.filter((item) => creatorSeriesIds.has(item.seriesId || item.series_id));
  const monthlyAssets = (platform.assets || []).filter((item) => creatorSeriesIds.has(item.series_id || item.seriesId) && inCurrentMonth(item.created_at || item.createdAt));
  const monthlyUploads = monthlyAssets.length;
  const usedStorageBytes = monthlyAssets.reduce((sum, item) => sum + Number(item.size_bytes || item.sizeBytes || 0), 0);
  const usedMotionPosterCount = monthlyAssets.filter((item) => (item.asset_type || item.assetType) === 'motion_poster').length;
  const featuredRequestsUsed = (platform.serviceOrders || []).filter((item) => item.requesterId === profileId && inCurrentMonth(item.created_at || item.createdAt) && isFeaturedOrder(item)).length;

  const limits = {
    maxActiveSeries: plan.maxActiveSeries,
    maxTotalEpisodes: plan.maxTotalEpisodes,
    monthlyAssetStorageLimitGb: plan.monthlyAssetStorageLimitGb,
    monthlyUploadLimit: plan.monthlyUploadLimit,
    includedMotionPosterCount: plan.includedMotionPosterCount,
    maxFeaturedRequestsPerCycle: plan.maxFeaturedRequestsPerCycle,
  };

  const usage = {
    activeSeries: creatorSeries.length,
    totalEpisodes: episodes.length,
    monthlyUploads,
    usedStorageBytes,
    usedStorageGb: usedStorageBytes / GB,
    usedMotionPosterCount,
    featuredRequestsUsed,
  };

  const remaining = {
    seriesLeft: Math.max(limits.maxActiveSeries - usage.activeSeries, 0),
    episodesLeft: Math.max(limits.maxTotalEpisodes - usage.totalEpisodes, 0),
    storageGbLeft: Math.max(limits.monthlyAssetStorageLimitGb - usage.usedStorageGb, 0),
    motionPosterLeft: Math.max(limits.includedMotionPosterCount - usage.usedMotionPosterCount, 0),
    featuredRequestsLeft: Math.max(limits.maxFeaturedRequestsPerCycle - usage.featuredRequestsUsed, 0),
  };

  const warning = [];
  if (remaining.seriesLeft <= 1) warning.push(`${remaining.seriesLeft} active project slot left`);
  if (remaining.storageGbLeft <= 2) warning.push(`${remaining.storageGbLeft.toFixed(1)}GB storage remaining`);
  if (remaining.episodesLeft <= 10) warning.push(`${remaining.episodesLeft} video slots left`);

  return {
    plan,
    usage,
    limits,
    remaining,
    warning,
    cycleLabel: 'Current billing cycle · renew placeholder: 2026-05-01',
    upgradeHint: warning.length ? 'You are close to plan limits. Upgrade to unlock more project, video, and storage capacity.' : 'Plan utilization is healthy.',
  };
}

export function evaluateQuotaLimits(snapshot) {
  const failures = [];
  const { usage, limits } = snapshot;
  if (usage.activeSeries >= limits.maxActiveSeries) failures.push(`超过可激活项目上限（${limits.maxActiveSeries}）`);
  if (usage.totalEpisodes >= limits.maxTotalEpisodes) failures.push(`超过视频总上限（${limits.maxTotalEpisodes}）`);
  if (usage.monthlyUploads >= limits.monthlyUploadLimit) failures.push(`超过月上传次数上限（${limits.monthlyUploadLimit}）`);
  if (usage.usedStorageGb >= limits.monthlyAssetStorageLimitGb) failures.push(`超过月素材存储上限（${limits.monthlyAssetStorageLimitGb}GB）`);
  return failures;
}
