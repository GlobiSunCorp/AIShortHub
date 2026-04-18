export function getCreatorEarningsSnapshot({ platform, creatorId }) {
  const snapshot = (platform.creatorEarnings || []).find((item) => item.creatorId === creatorId);
  if (snapshot) return snapshot;
  return {
    creatorId,
    period: '2026-04',
    advertisingRevenue: 0,
    subscriptionShare: 0,
    singleTitleSales: 0,
    episodeUnlockSales: 0,
    addOnServiceCosts: 0,
    platformCommission: 0,
    netEarnings: 0,
    pendingPayout: 0,
    paidOut: 0,
    previousPeriodNet: 0,
  };
}

export function getEarningsBreakdown(snapshot) {
  const incomeItems = [
    ['Advertising revenue', snapshot.advertisingRevenue],
    ['Subscription share', snapshot.subscriptionShare],
    ['Single-title sales', snapshot.singleTitleSales],
    ['Episode unlock sales', snapshot.episodeUnlockSales],
  ];
  const deductions = [
    ['Add-on service costs', snapshot.addOnServiceCosts],
    ['Platform commission', snapshot.platformCommission],
  ];
  const grossIncome = incomeItems.reduce((sum, [, value]) => sum + Number(value || 0), 0);
  return { incomeItems, deductions, grossIncome, netEarnings: snapshot.netEarnings };
}

export function getPeriodComparison(snapshot) {
  const previous = Number(snapshot.previousPeriodNet || 0);
  const current = Number(snapshot.netEarnings || 0);
  const delta = current - previous;
  const ratio = previous > 0 ? (delta / previous) * 100 : 0;
  return {
    previous,
    current,
    delta,
    ratio,
    trend: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat',
  };
}
