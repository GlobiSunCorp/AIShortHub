import { useMemo, useState } from 'react';
import { getCreatorPlan, getViewerPlan } from '../data/monetization';
import { resolveMembership } from '../hooks/usePlanAccess';
import { getAudienceGroup, getMembershipBadgeKey, getCreatorUpgradeTargets, getViewerUpgradeTargets } from '../lib/planIdentity';
import { getCreatorQuotaSnapshot } from '../lib/services/quotaService';
import { PlanIdentityBadge } from './EntitlementBadges';

export function StickyUpgradeRail({ auth, platform }) {
  const [open, setOpen] = useState(false);
  if (!auth.isLoggedIn) return null;
  const membership = resolveMembership(auth, platform);
  const audience = getAudienceGroup({ auth, membership });
  const badgeKey = getMembershipBadgeKey({ auth, membership });
  const creator = platform.creators.find((item) => item.profileId === auth.user?.id);
  const quota = audience === 'creator' && creator
    ? getCreatorQuotaSnapshot({ creatorPlanId: membership.creatorPlan, creatorId: creator.id, profileId: auth.user.id, platform })
    : null;

  const content = useMemo(() => {
    if (audience === 'viewer') {
      const viewerPlan = getViewerPlan(membership.tier);
      return {
        title: 'Viewer Upgrade Guide',
        items: [
          `Current Viewer Plan: ${viewerPlan.name}`,
          `Full access: ${viewerPlan.fullSeriesAccess ? 'Included' : 'Upgrade required'}`,
          `Quality: ${viewerPlan.quality}`,
          `Early access: ${viewerPlan.earlyAccess ? 'Included' : 'Optional'}`,
          `Exclusive content: ${viewerPlan.exclusiveContent ? 'Included' : 'Optional'}`,
        ],
        ctas: getViewerUpgradeTargets(membership.tier).map((plan) => `Upgrade to ${plan.name}`),
      };
    }

    if (audience === 'creator' && quota) {
      const plan = getCreatorPlan(membership.creatorPlan);
      return {
        title: 'Creator Growth Rail',
        items: [
          `Current Creator Plan: ${plan.name}`,
          `Platform commission: ${Math.round(plan.commissionRate * 100)}%`,
          `Active series remaining: ${quota.remaining.seriesLeft}`,
          `Storage remaining: ${quota.remaining.storageGbLeft.toFixed(1)}GB`,
          `Motion Poster: ${quota.remaining.motionPosterLeft > 0 ? `${quota.remaining.motionPosterLeft} Remaining` : 'Add-on required'}`,
          `Featured requests: ${quota.remaining.featuredRequestsLeft} Remaining`,
        ],
        ctas: [...getCreatorUpgradeTargets(membership.creatorPlan).map((planItem) => `Upgrade to ${planItem.name}`), 'Buy add-on services'],
      };
    }

    return {
      title: 'Admin Workspace',
      items: ['Current role: Admin', 'Moderation queue and support triage ready', 'Creator entitlement dashboard available'],
      ctas: ['Open admin panel', 'Review pending approvals'],
    };
  }, [audience, membership.creatorPlan, membership.tier, quota]);

  return (
    <aside className={`sticky-upgrade-rail ${open ? 'open' : ''}`}>
      <button type="button" className="sticky-rail-toggle" onClick={() => setOpen((prev) => !prev)}>
        <PlanIdentityBadge badgeKey={badgeKey} subtle />
        <span>{open ? 'Collapse' : 'Upgrade Rail'}</span>
      </button>
      {open ? (
        <div className="sticky-rail-panel panel stack-md">
          <h4>{content.title}</h4>
          {content.items.map((item) => <p key={item} className="small-text">{item}</p>)}
          <div className="sticky-rail-ctas">
            {content.ctas.map((cta) => <button className="btn btn-ghost" type="button" key={cta}>{cta}</button>)}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
