import { getCreatorPlan, getViewerPlan } from '../../data/monetization';
import { getCommissionForUser, resolveMembership } from '../../hooks/usePlanAccess';
import { getCreatorQuotaSnapshot } from '../services/quotaService';
import { getCreatorEarningsSnapshot } from '../services/earningsService';
import { getCycleDates } from '../services/creatorHealthService';
import { getBillingSummarySnapshot } from './getBillingSummarySnapshot';

export function getAccountCenterSnapshot({ auth, platform }) {
  const membership = resolveMembership(auth, platform);
  const viewerPlan = getViewerPlan(membership.tier);
  const creatorPlan = membership.creatorPlan ? getCreatorPlan(membership.creatorPlan) : null;
  const creator = (platform.creators || []).find((item) => item.profileId === auth?.user?.id) || null;
  const uploads = creator ? (platform.series || []).filter((item) => item.creatorId === creator.id).slice(0, 5) : [];
  const serviceOrders = (platform.serviceOrders || []).filter((item) => item.requesterId === auth?.user?.id).slice(0, 5);
  const cycle = getCycleDates((platform.memberships || []).find((m) => m.profileId === auth?.user?.id)?.renewAt);
  const quota = creatorPlan && creator ? getCreatorQuotaSnapshot({ creatorPlanId: creatorPlan.id, creatorId: creator.id, profileId: auth.user.id, platform }) : null;
  const earnings = creator ? getCreatorEarningsSnapshot({ platform, creatorId: creator.id }) : null;

  return {
    membership,
    viewerPlan,
    creatorPlan,
    creator,
    uploads,
    serviceOrders,
    cycle,
    quota,
    earnings,
    commissionRate: creatorPlan ? getCommissionForUser(auth, platform) : null,
    billing: getBillingSummarySnapshot({ platform, creatorId: creator?.id, membership }),
  };
}
