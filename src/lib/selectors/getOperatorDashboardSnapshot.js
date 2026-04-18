import { getPublishedSeries } from './getPublishedSeries';

export function getOperatorDashboardSnapshot(platform) {
  const users = platform.profiles || [];
  const creators = platform.creators || [];
  const memberships = platform.memberships || [];
  const serviceOrders = platform.serviceOrders || [];
  const payouts = platform.payouts || [];
  const series = platform.series || [];
  const payments = platform.payments || [];

  const pendingReview = series.filter((item) => item.status === 'pending_review');
  const flaggedCount = series.filter((item) => item.flagged || Number(item.report_count || 0) > 0).length;
  const needsAttention = pendingReview.length + flaggedCount + serviceOrders.filter((item) => item.status === 'pending').length;
  const topSeries = [...getPublishedSeries(platform)].slice(0, 3);

  return {
    totals: {
      users: users.length,
      creators: creators.length,
      activeViewerSubscriptions: memberships.filter((item) => item.tier !== 'free' && item.status === 'active').length,
      activeCreatorPlans: memberships.filter((item) => item.creatorPlan && item.status === 'active').length,
      publishedSeries: series.filter((item) => item.status === 'published').length,
      pendingReview: pendingReview.length,
      flagged: flaggedCount,
      serviceOrdersPending: serviceOrders.filter((item) => ['pending', 'in_progress', 'pending_payment'].includes(item.status)).length,
      paymentIssues: payments.filter((item) => item.status === 'failed').length,
      pendingPayouts: payouts.filter((item) => item.status !== 'paid').length,
    },
    cards: {
      needsAttention,
      awaitingReview: pendingReview.slice(0, 4),
      supportInboxSummary: serviceOrders.filter((item) => item.status === 'pending').length,
      revenueThisCycle: payments.filter((item) => item.status === 'paid').reduce((sum, item) => sum + Number(item.amount || 0), 0),
      topSeries,
      creatorsNearQuota: creators.slice(0, 3),
    },
    recentActivity: [...platform.reviewLogs || [], ...serviceOrders].slice(0, 8),
    launchReadiness: [
      { key: 'productionEnv', label: 'Production env configured', ready: false },
      { key: 'customDomain', label: 'Custom domain configured', ready: false },
      { key: 'supportEmail', label: 'Support email configured', ready: false },
      { key: 'stripeLiveMode', label: 'Stripe live mode ready', ready: false },
      { key: 'firstBatch', label: 'First content batch ready', ready: series.filter((s) => s.status === 'published').length > 0 },
      { key: 'checkout', label: 'Checkout tested', ready: false },
      { key: 'creatorUpload', label: 'Creator upload tested', ready: true },
      { key: 'reviewQueue', label: 'Review queue tested', ready: true },
      { key: 'payoutLogic', label: 'Payout logic checked', ready: payouts.length > 0 },
    ],
  };
}
