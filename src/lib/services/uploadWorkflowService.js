const RECOMMENDED_RATIOS = new Set(['9:16', '4:5', '1:1', '16:9']);

export function validateSeriesWorkflow({ draft }) {
  const issues = [];
  if (!draft.staticPoster) issues.push('缺少封面海报（Static Poster）');
  if (!draft.trailer.url) issues.push('缺少预告 / teaser 视频（Trailer / Teaser）');
  if (!draft.trailer.coverUrl) issues.push('预告 / teaser 缺少独立封面');
  if (!draft.trailer.title || draft.trailer.title.length < 3) issues.push('预告 / teaser 标题过短');
  if (!draft.trailer.cta || draft.trailer.cta.length < 3) issues.push('预告 CTA 需要更清晰');
  if ((draft.trailer.durationSeconds || 0) < 15 || (draft.trailer.durationSeconds || 0) > 90) issues.push('预告 / teaser 时长不在推荐区间（15s-90s）');

  if (!Array.isArray(draft.episodes) || !draft.episodes.length) issues.push('缺少正片视频（Main Videos）');

  draft.episodes.forEach((episode, index) => {
    const videoNo = episode.number || index + 1;
    if (!episode.title || !episode.title.trim()) issues.push(`视频标题缺失：Video ${videoNo}`);
    if (!episode.url) issues.push(`Video ${videoNo} 缺少视频文件`);
    if (!episode.subtitleLanguages?.length) issues.push(`Video ${videoNo} 缺少字幕语言`);
    if (!episode.resolutions?.includes('720p')) issues.push(`Video ${videoNo} 分辨率不足（建议至少 720p）`);
    if (!RECOMMENDED_RATIOS.has(episode.aspectRatio)) issues.push(`Video ${videoNo} 比例不推荐`);
    if ((episode.durationSeconds || 0) < 15 || (episode.durationSeconds || 0) > 240) issues.push(`Video ${videoNo} 时长异常，AI short 建议保持 15s-240s`);
    if ((episode.fileSizeMb || 0) > 350) issues.push(`Video ${videoNo} 文件过大`);
  });

  return {
    issues,
    passed: issues.length === 0,
  };
}

export function normalizePricingConfig(pricing) {
  return {
    titlePriceUsd: Number(pricing.titlePriceUsd || 0),
    episodeUnlockPriceUsd: Number(pricing.episodeUnlockPriceUsd || 0),
    singleVideoUnlockPriceUsd: Number(pricing.singleVideoUnlockPriceUsd || pricing.episodeUnlockPriceUsd || 0),
    finaleUnlockEnabled: Boolean(pricing.finaleUnlockEnabled),
    finaleUnlockPriceUsd: Number(pricing.finaleUnlockPriceUsd || 0),
    freePreviewEpisodes: (pricing.freePreviewEpisodes || []).map((value) => Number(value)).filter((value) => value > 0),
    freePreviewVideos: (pricing.freePreviewVideos || pricing.freePreviewEpisodes || []).map((value) => Number(value)).filter((value) => value > 0),
  };
}
