import { getCreatorPlan } from '../../data/monetization';

const GB = 1024 * 1024 * 1024;

function inCurrentMonth(value) {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return date.getUTCFullYear() === now.getUTCFullYear() && date.getUTCMonth() === now.getUTCMonth();
}

export function getCreatorQuotaSnapshot({ creatorPlanId, creatorId, platform }) {
  const plan = getCreatorPlan(creatorPlanId || 'creator_basic');
  const creatorSeries = platform.series.filter((item) => item.creatorId === creatorId);
  const creatorSeriesIds = new Set(creatorSeries.map((item) => item.id));
  const episodes = platform.episodes.filter((item) => creatorSeriesIds.has(item.seriesId));
  const monthlyAssets = (platform.assets || []).filter((item) => creatorSeriesIds.has(item.series_id || item.seriesId) && inCurrentMonth(item.created_at || item.createdAt));
  const monthlyUploads = monthlyAssets.length;
  const usedStorageBytes = monthlyAssets.reduce((sum, item) => sum + Number(item.size_bytes || item.sizeBytes || 0), 0);

  return {
    plan,
    usage: {
      activeSeries: creatorSeries.length,
      totalEpisodes: episodes.length,
      monthlyUploads,
      usedStorageBytes,
      usedStorageGb: usedStorageBytes / GB,
    },
    limits: {
      maxActiveSeries: plan.maxActiveSeries,
      maxTotalEpisodes: plan.maxTotalEpisodes,
      monthlyAssetStorageLimitGb: plan.monthlyAssetStorageLimitGb,
      monthlyUploadLimit: plan.monthlyUploadLimit,
    },
  };
}

export function evaluateQuotaLimits(snapshot) {
  const failures = [];
  const { usage, limits } = snapshot;
  if (usage.activeSeries >= limits.maxActiveSeries) failures.push(`超过可激活剧集上限（${limits.maxActiveSeries}）`);
  if (usage.totalEpisodes >= limits.maxTotalEpisodes) failures.push(`超过分集总上限（${limits.maxTotalEpisodes}）`);
  if (usage.monthlyUploads >= limits.monthlyUploadLimit) failures.push(`超过月上传次数上限（${limits.monthlyUploadLimit}）`);
  if (usage.usedStorageGb >= limits.monthlyAssetStorageLimitGb) failures.push(`超过月素材存储上限（${limits.monthlyAssetStorageLimitGb}GB）`);
  return failures;
}
