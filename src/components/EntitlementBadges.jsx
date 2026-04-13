import { useMemo, useState } from 'react';
import { formatCommission } from '../data/monetization';
import { MEMBERSHIP_BADGE_META, getCreatorPlanHighlights, getMembershipBadgeKey, getViewerPlanHighlights } from '../lib/entitlementBadges';

function EntitlementPopover({ title, items, cta, floating = true }) {
  return (
    <div className={`entitlement-popover panel ${floating ? "floating" : "inline"}`}>
      <h4>{title}</h4>
      <div className="entitlement-grid">
        {items.map(([label, value]) => (
          <div key={label} className="entitlement-item">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      {cta ? <p className="small-text">{cta}</p> : null}
    </div>
  );
}

function InteractiveBadge({ className, children, popover }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="badge-wrap" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" className={className} onClick={() => setOpen((prev) => !prev)}>
        {children}
        <span className="info-dot">i</span>
      </button>
      {open ? popover : null}
    </div>
  );
}

export function MembershipBadge({ auth, membership }) {
  const key = getMembershipBadgeKey({ auth, membership });
  const meta = MEMBERSHIP_BADGE_META[key];
  const popoverItems = useMemo(() => {
    if (meta.group === 'creator' || meta.group === 'admin') {
      return getCreatorPlanHighlights(membership?.creatorPlan || 'creator_basic');
    }
    return getViewerPlanHighlights(membership?.tier || 'free');
  }, [meta.group, membership?.creatorPlan, membership?.tier]);

  const cta = meta.group === 'viewer' ? 'Upgrade to Creator Pro to unlock advanced upload quotas and discounted services.' : 'Upgrade for more slots, storage, and lower platform commission.';

  return (
    <InteractiveBadge
      className={`membership-badge ${meta.tone}`}
      popover={<EntitlementPopover title={`${meta.label} benefits`} items={popoverItems} cta={cta} />}
    >
      <span>{meta.icon}</span>
      <span>{meta.label}</span>
    </InteractiveBadge>
  );
}

export function UsageQuotaBadge({ label, value, tone = 'normal', details = [], cta }) {
  return (
    <InteractiveBadge
      className={`quota-badge ${tone}`}
      popover={<EntitlementPopover title={`${label} details`} items={details} cta={cta} />}
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
    ['Platform commission', formatCommission(snapshot.plan.commissionRate)],
    ['Active Series', `${snapshot.usage.activeSeries}/${snapshot.limits.maxActiveSeries} (left ${snapshot.remaining.seriesLeft})`],
    ['Episodes', `${snapshot.usage.totalEpisodes}/${snapshot.limits.maxTotalEpisodes} (left ${snapshot.remaining.episodesLeft})`],
    ['Storage', `${snapshot.usage.usedStorageGb.toFixed(1)}GB/${snapshot.limits.monthlyAssetStorageLimitGb}GB (left ${snapshot.remaining.storageGbLeft.toFixed(1)}GB)`],
    ['Motion Poster', snapshot.limits.includedMotionPosterCount ? `${snapshot.usage.usedMotionPosterCount} used / ${snapshot.remaining.motionPosterLeft} left` : 'Add-on for Basic'],
    ['Featured requests', snapshot.limits.maxFeaturedRequestsPerCycle ? `${snapshot.usage.featuredRequestsUsed} used / ${snapshot.remaining.featuredRequestsLeft} left` : 'Add-on for Basic'],
    ['Billing cycle', snapshot.cycleLabel],
  ];

  return <EntitlementPopover title="Creator entitlement status" items={items} cta={snapshot.upgradeHint} floating={false} />;
}
