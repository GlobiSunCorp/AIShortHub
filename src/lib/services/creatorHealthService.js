function pct(used, total) {
  if (!total) return 0;
  return Math.min(Math.round((used / total) * 100), 100);
}

function getSeverity(percentage) {
  if (percentage >= 100) return 'exhausted';
  if (percentage >= 80) return 'near_limit';
  return 'normal';
}

export function getHealthStatus(snapshot) {
  const checks = [
    pct(snapshot.usage.activeSeries, snapshot.limits.maxActiveSeries),
    pct(snapshot.usage.totalEpisodes, snapshot.limits.maxTotalEpisodes),
    pct(snapshot.usage.usedStorageGb, snapshot.limits.monthlyAssetStorageLimitGb),
    pct(snapshot.usage.usedMotionPosterCount, Math.max(snapshot.limits.includedMotionPosterCount, 1)),
  ];
  const max = Math.max(...checks);
  if (max >= 100) return 'Action Needed';
  if (max >= 80) return 'Near Limit';
  return 'Healthy';
}

export function getCycleDates(renewAt) {
  const renewDate = renewAt || '2026-05-01';
  const resetDate = new Date(renewDate);
  resetDate.setUTCDate(1);
  return {
    renewalDate: renewDate,
    quotaResetDate: resetDate.toISOString().slice(0, 10),
    cycleLabel: `Current cycle ends on ${renewDate}`,
  };
}

export function buildQuotaAlerts({ snapshot, renewAt, unpaidOrders = [] }) {
  const daysToRenew = Math.max(Math.ceil((new Date(renewAt || '2026-05-01').getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 0);
  const alerts = [
    {
      key: 'series',
      message: `You have ${snapshot.remaining.seriesLeft} active series slot${snapshot.remaining.seriesLeft === 1 ? '' : 's'} left`,
      state: snapshot.remaining.seriesLeft <= 0 ? 'exhausted' : snapshot.remaining.seriesLeft <= 1 ? 'near_limit' : 'normal',
      cta: 'Upgrade plan',
    },
    {
      key: 'storage',
      message: `Storage usage is at ${pct(snapshot.usage.usedStorageGb, snapshot.limits.monthlyAssetStorageLimitGb)}%`,
      state: getSeverity(pct(snapshot.usage.usedStorageGb, snapshot.limits.monthlyAssetStorageLimitGb)),
      cta: 'Manage assets',
    },
    {
      key: 'motion',
      message: snapshot.remaining.motionPosterLeft <= 0
        ? 'Motion Poster quota used up — upgrade or purchase add-on'
        : `Motion Poster quota: ${snapshot.remaining.motionPosterLeft} left`,
      state: snapshot.remaining.motionPosterLeft <= 0 ? 'exhausted' : snapshot.remaining.motionPosterLeft <= 1 ? 'near_limit' : 'normal',
      cta: snapshot.remaining.motionPosterLeft <= 0 ? 'Buy add-on' : 'Manage assets',
    },
    {
      key: 'featured',
      message: `Featured placement requests: ${snapshot.remaining.featuredRequestsLeft} left this cycle`,
      state: snapshot.remaining.featuredRequestsLeft <= 0 ? 'exhausted' : snapshot.remaining.featuredRequestsLeft <= 1 ? 'near_limit' : 'normal',
      cta: 'Contact support',
    },
    {
      key: 'renew',
      message: `Creator plan renews in ${daysToRenew} day${daysToRenew === 1 ? '' : 's'}`,
      state: daysToRenew <= 3 ? 'near_limit' : 'normal',
      cta: 'Upgrade plan',
    },
  ];

  if (unpaidOrders.length) {
    alerts.unshift({
      key: 'unpaid',
      message: `${unpaidOrders.length} unpaid add-on order${unpaidOrders.length === 1 ? '' : 's'} requires checkout`,
      state: 'near_limit',
      cta: 'Complete checkout',
    });
  }

  return alerts;
}

export function buildCreatorActions({ snapshot, pendingSeriesCount, unpaidOrdersCount, draft }) {
  const actions = [];
  if (pendingSeriesCount > 0) actions.push({ level: 'informational', title: `${pendingSeriesCount} series waiting for review`, cta: 'View review queue' });
  if (pct(snapshot.usage.usedStorageGb, snapshot.limits.monthlyAssetStorageLimitGb) >= 80) actions.push({ level: 'urgent', title: 'Storage above 80%', cta: 'Manage assets' });
  if (unpaidOrdersCount > 0) actions.push({ level: 'urgent', title: `${unpaidOrdersCount} unpaid add-on order requires checkout`, cta: 'Go to services' });
  if (!draft.trailer) actions.push({ level: 'recommended', title: 'Missing trailer asset for latest submission', cta: 'Upload trailer' });
  if (!snapshot.limits.includedMotionPosterCount) actions.push({ level: 'recommended', title: 'Upgrade to Studio to unlock included Motion Poster', cta: 'Upgrade plan' });
  actions.push({ level: 'informational', title: `${snapshot.remaining.featuredRequestsLeft} featured placement slots left`, cta: 'Request featured placement' });
  return actions;
}

export function getSubmissionChecklist({ draft, snapshot, creatorPlanName }) {
  const tagsCount = draft.tags.split(',').map((t) => t.trim()).filter(Boolean).length;
  const items = [
    ['Title added', Boolean(draft.title.trim()), 'Add a marketable title with brand-safe naming.'],
    ['Synopsis added', draft.synopsis.trim().length >= 12, 'A concise synopsis improves review speed.'],
    ['Tags selected', tagsCount >= 1, 'At least one tag is required for discovery routing.'],
    ['Poster uploaded', Boolean(draft.staticPoster), 'Poster is required for storefront listing.'],
    ['Trailer added', Boolean(draft.trailer), 'Trailer is required for higher conversion.'],
    ['At least 1 episode added', Boolean(draft.episodeUrl), 'At least one playable episode is required.'],
    ['Required metadata completed', Boolean(draft.category && draft.audience), 'Category and audience settings are mandatory.'],
    ['Current plan supports submission', snapshot.remaining.seriesLeft > 0, `Plan ${creatorPlanName} has no remaining series slots.`],
    ['Required assets complete', Boolean(draft.staticPoster && draft.thumbnail), 'Poster + thumbnail are required assets.'],
    ['Motion Poster status clear', true, draft.motionPoster ? 'Included/Add-on selected and URL provided.' : 'Not selected yet.'],
  ];

  const missing = items.filter((item) => !item[1]).length;
  const status = missing === 0 ? 'ready to submit' : snapshot.remaining.seriesLeft <= 0 ? 'upgrade recommended' : 'needs revision';
  return { items, missing, status };
}
