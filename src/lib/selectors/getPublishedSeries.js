export function getPublishedSeries(platform) {
  const series = Array.isArray(platform?.series) ? platform.series : [];
  return series.filter((item) => item.status === 'published' && item.visibility === 'public');
}
