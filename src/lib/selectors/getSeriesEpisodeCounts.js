export function getSeriesEpisodeCounts(series = [], episodes = []) {
  return Object.fromEntries(
    series.map((item) => [item.id, {
      total: episodes.filter((ep) => ep.seriesId === item.id).length,
      preview: episodes.filter((ep) => ep.seriesId === item.id && ep.isPreview).length,
    }])
  );
}
