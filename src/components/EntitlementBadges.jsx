import { useMemo, useState } from 'react';
import { formatCommission } from '../data/monetization';
import { PLAN_IDENTITY_META, getAudienceGroup, getCreatorPlanHighlights, getMembershipBadgeKey, getViewerPlanHighlights, getCreatorUpgradeTargets, getViewerUpgradeTargets } from '../lib/planIdentity';

export function PlanIdentityBadge({ badgeKey, subtle = false }) {
  const meta = PLAN_IDENTITY_META[badgeKey] || PLAN_IDENTITY_META.free_viewer;
  return (
    <span className={`plan-identity ${meta.tone} ${subtle ? 'subtle' : ''}`.trim()}>
      <span className="plan-icon" aria-hidden="true">{meta.icon}</span>
      <span>{meta.label}</span>
    </span>
  );
}

function EntitlementPopover({ title, items, ctaList = [], floating = true }) {
  return (
    <div className={`entitlement-popover panel ${floating ? 'floating' : 'inline'}`}>
      <h4>{title}</h4>
      <div className="entitlement-grid">
        {items.map(([label, value]) => (
          <div key={label} className="entitlement-item">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      {ctaList.length ? (
        <div className="entitlement-cta-list">
          {ctaList.map((item) => <p key={item} className="small-text">• {item}</p>)}
        </div>
      ) : null}
    </div>
  );
}

function InteractiveBadge({ className, children, popover }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="badge-wrap" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" className={className} onClick={() => setOpen((prev) => !prev)}>
        {children}
        <span className="info-dot">⌄</span>
      </button>
      {open ? popover : null}
    </div>
  );
}

export function MembershipBadge({ auth, membership }) {
  const key = getMembershipBadgeKey({ auth, membership });
  const meta = PLAN_IDENTITY_META[key];
  const audience = getAudienceGroup({ auth, membership });

  const popoverItems = useMemo(() => {
    if (audience === 'creator' || audience === 'admin') return getCreatorPlanHighlights(membership?.creatorPlan || 'creator_basic');
    return getViewerPlanHighlights(membership?.tier || 'free');
  }, [audience, membership?.creatorPlan, membership?.tier]);

  const ctaList = audience === 'viewer'
    ? getViewerUpgradeTargets(membership?.tier || 'free').map((p) => `Upgrade to ${p.name}`)
    : audience === 'creator'
      ? [...getCreatorUpgradeTargets(membership?.creatorPlan || 'creator_basic').map((p) => `Upgrade to ${p.name}`), 'Buy add-on services']
      : ['Open Admin workspace', 'Review creator entitlement queue'];

  return (
    <InteractiveBadge
      className={`membership-badge ${meta.tone}`}
      popover={<EntitlementPopover title={`${meta.label} status`} items={popoverItems} ctaList={ctaList} />}
    >
      <PlanIdentityBadge badgeKey={key} subtle />
    </InteractiveBadge>
  );
}

export function UsageQuotaBadge({ label, value, tone = 'normal', details = [], cta }) {
  return (
    <InteractiveBadge
      className={`quota-badge ${tone}`}
      popover={<EntitlementPopover title={`${label} details`} items={details} ctaList={cta ? [cta] : []} />}
    >
      <span>{value}</span>
      <small>{label}</small>
    </InteractiveBadge>
  );
}

export function CreatorPlanCard({ snapshot }) {
  const items = [
    ['Current Creator Plan', snapshot.plan.name],
    ['Review priority', snapshot.plan.reviewPriority],
    ['Platform commission', `${formatCommission(snapshot.plan.commissionRate)} (only after revenue)`],
    ['Active Series', `${snapshot.usage.activeSeries}/${snapshot.limits.maxActiveSeries} · Remaining ${snapshot.remaining.seriesLeft}`],
    ['Episodes', `${snapshot.usage.totalEpisodes}/${snapshot.limits.maxTotalEpisodes} · Remaining ${snapshot.remaining.episodesLeft}`],
    ['Storage', `${snapshot.usage.usedStorageGb.toFixed(1)}GB/${snapshot.limits.monthlyAssetStorageLimitGb}GB · Remaining ${snapshot.remaining.storageGbLeft.toFixed(1)}GB`],
    ['Motion Poster', snapshot.limits.includedMotionPosterCount ? `${snapshot.usage.usedMotionPosterCount} used / ${snapshot.remaining.motionPosterLeft} remaining` : 'Add-on'],
    ['Featured requests', snapshot.limits.maxFeaturedRequestsPerCycle ? `${snapshot.usage.featuredRequestsUsed} used / ${snapshot.remaining.featuredRequestsLeft} remaining` : 'Add-on'],
    ['Billing cycle', snapshot.cycleLabel],
  ];
  return <EntitlementPopover title="Creator entitlement status" items={items} ctaList={[snapshot.upgradeHint]} floating={false} />;
}
