import { getUserMembershipSnapshot } from './getUserMembershipSnapshot';

export function getCreatorDashboardSnapshot({ platform, auth }) {
  const userId = auth?.user?.id;
  const membership = getUserMembershipSnapshot(platform, userId);
  const creator = platform.creators.find((item) => item.profileId === userId) || null;
  const series = platform.series.filter((item) => item.creatorId === creator?.id);
  const serviceOrders = platform.serviceOrders.filter((item) => item.requesterId === userId);
  return {
    membership,
    creator,
    series,
    pendingReviewCount: series.filter((item) => item.status === 'pending_review').length,
    pendingPaymentOrders: serviceOrders.filter((item) => item.status === 'pending_payment').length,
    publishedCount: series.filter((item) => item.status === 'published').length,
  };
}
