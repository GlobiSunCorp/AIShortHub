import { getUserMembershipSnapshot } from './getUserMembershipSnapshot';

export function getCreatorDashboardSnapshot({ platform, auth }) {
  const userId = auth?.user?.id;
  const membership = getUserMembershipSnapshot(platform, userId);
  const creator = platform.creators.find((item) => item.profileId === userId) || null;
  const series = platform.series.filter((item) => item.creatorId === creator?.id);
  const serviceOrders = platform.serviceOrders.filter((item) => item.requesterId === userId);
  const pendingReviewProjects = series.filter((item) => item.status === 'pending_review');
  const publishedProjects = series.filter((item) => item.status === 'published');
  const draftProjects = series.filter((item) => item.status === 'draft');

  return {
    membership,
    creator,
    series,
    projects: series,
    activeProjects: series,
    draftProjects,
    pendingReviewProjects,
    publishedProjects,
    serviceOrders,
    projectMetrics: {
      totalProjects: series.length,
      draftProjects: draftProjects.length,
      pendingReviewProjects: pendingReviewProjects.length,
      publishedProjects: publishedProjects.length,
      pendingPaymentOrders: serviceOrders.filter((item) => item.status === 'pending_payment').length,
    },
    pendingReviewCount: pendingReviewProjects.length,
    pendingPaymentOrders: serviceOrders.filter((item) => item.status === 'pending_payment').length,
    publishedCount: publishedProjects.length,
  };
}
