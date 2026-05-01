const RECOMMENDED_RATIOS = new Set(['9:16', '4:5', '1:1', '16:9']);

export function validateSeriesWorkflow({ draft }) {
  const issues = [];
  if (!draft.staticPoster) issues.push('Missing cover poster (Static Poster / Cover)');
  if (!draft.trailer.url) issues.push('Missing trailer or teaser video');
  if (!draft.trailer.coverUrl) issues.push('Trailer / Teaser is missing a standalone cover image');
  if (!draft.trailer.title || draft.trailer.title.length < 3) issues.push('Trailer / Teaser title is too short');
  if (!draft.trailer.cta || draft.trailer.cta.length < 3) issues.push('Trailer CTA should be clearer, such as Watch full title or Open project');
  if ((draft.trailer.durationSeconds || 0) < 15 || (draft.trailer.durationSeconds || 0) > 90) issues.push('Trailer / Teaser duration should stay within the recommended 15s-90s range');

  if (!Array.isArray(draft.episodes) || !draft.episodes.length) issues.push('Missing main video asset');

  draft.episodes.forEach((episode, index) => {
    const videoNo = episode.number || index + 1;
    if (!episode.title || !episode.title.trim()) issues.push(`Video ${videoNo} is missing a title`);
    if (!episode.url) issues.push(`Video ${videoNo} is missing a playable file or URL`);
    if (!episode.subtitleLanguages?.length) issues.push(`Video ${videoNo} is missing subtitle language settings`);
    if (!episode.resolutions?.includes('720p')) issues.push(`Video ${videoNo} resolution is below the recommended 720p minimum`);
    if (!RECOMMENDED_RATIOS.has(episode.aspectRatio)) issues.push(`Video ${videoNo} aspect ratio is not recommended; use 9:16, 4:5, 1:1, or 16:9`);
    if ((episode.durationSeconds || 0) < 15 || (episode.durationSeconds || 0) > 240) issues.push(`Video ${videoNo} duration is unusual; AI shorts usually work best within 15s-240s`);
    if ((episode.fileSizeMb || 0) > 350) issues.push(`Video ${videoNo} is large; compress or transcode before publishing`);
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
