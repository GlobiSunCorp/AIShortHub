import { DemoRoleSwitcher } from '../components/DemoRoleSwitcher';
import { GlossaryTerm } from '../components/GlossaryTerm';
import { OnboardingGuide } from '../components/OnboardingGuide';
import { CreatorPlanCard, MembershipBadge, PlanIdentityBadge, UsageQuotaBadge } from '../components/EntitlementBadges';
import { PlanHealthCard, QuotaAlertBar } from '../components/CreatorOpsPanels';
import { Link } from '../lib/router';
import { REFUND_POLICY_CONFIG, REVENUE_MODEL, formatCommission, formatUsd } from '../data/monetization';
import { getAudienceGroup } from '../lib/planIdentity';
import { getStatusLabel } from '../lib/roleDisplay';
import { buildQuotaAlerts, getHealthStatus } from '../lib/services/creatorHealthService';
import { getAccountCenterSnapshot } from '../lib/selectors/getAccountCenterSnapshot';
import { HowPricingWorksPanel } from '../components/billing/HowPricingWorksPanel';
import { RevenueFlowDiagram } from '../components/billing/RevenueFlowDiagram';

const TONE_STYLES = {
  premium: {
    borderColor: 'rgba(244, 193, 109, 0.36)',
    background: 'linear-gradient(145deg, rgba(70, 44, 14, 0.36), rgba(13, 16, 30, 0.94))',
    boxShadow: '0 18px 36px rgba(67, 42, 12, 0.14)',
  },
  upgrade: {
    borderColor: 'rgba(181, 139, 255, 0.36)',
    background: 'linear-gradient(145deg, rgba(43, 30, 73, 0.42), rgba(13, 16, 30, 0.94))',
    boxShadow: '0 16px 34px rgba(48, 28, 92, 0.16)',
  },
  ok: {
    borderColor: 'rgba(139, 225, 172, 0.28)',
    background: 'linear-gradient(145deg, rgba(23, 56, 45, 0.3), rgba(13, 16, 30, 0.94))',
  },
  warn: {
    borderColor: 'rgba(255, 193, 104, 0.35)',
    background: 'linear-gradient(145deg, rgba(72, 47, 15, 0.32), rgba(13, 16, 30, 0.94))',
  },
  neutral: {
    borderColor: 'rgba(144, 161, 255, 0.2)',
    background: 'linear-gradient(145deg, rgba(24, 31, 58, 0.36), rgba(13, 16, 30, 0.94))',
  },
};

function toneStyle(tone) {
  return TONE_STYLES[tone] || TONE_STYLES.neutral;
}

function PlanSummaryCard({ title, badgeKey, name, priceLabel, summary, ctaLabel, ctaTo, tone = 'data' }) {
  const className = tone === 'status' ? 'card-status' : tone === 'secondary' ? 'card-secondary' : 'card-data';
  return (
    <article className={className}>
      <p className="ds-caption">{title}</p>
      <div className="stack-sm">
        <PlanIdentityBadge badgeKey={badgeKey} subtle />
        <p className="stat-value" style={{ fontSize: '1.45rem' }}>{name}</p>
        <p className="ds-meta">{priceLabel}</p>
        <p className="ds-meta">{summary}</p>
        <Link className="btn btn-ghost" to={ctaTo}>{ctaLabel}</Link>
      </div>
    </article>
  );
}

function ActivityCard({ item }) {
  return (
    <article className="mini-card" style={{ borderRadius: '24px', ...toneStyle(item.tone) }}>
      <div className="row wrap center" style={{ justifyContent: 'space-between', marginBottom: '0.45rem' }}>
        <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span aria-hidden="true" style={{ fontSize: '1.15rem' }}>{item.icon}</span>
          {item.title}
        </strong>
        <span className="meta-pill">{item.time}</span>
      </div>
      <p className="ds-meta">{item.description}</p>
      {item.impact ? <span className="meta-pill" style={{ width: 'fit-content', marginTop: '0.35rem' }}>{item.impact}</span> : null}
      {item.ctaLabel ? <Link className="info-link" to={item.ctaTo}>{item.ctaLabel} →</Link> : null}
    </article>
  );
}

function ChangeCard({ item }) {
  return (
    <article className="mini-card" style={{ borderRadius: '24px', ...toneStyle(item.tone) }}>
      <p className="ds-caption">{item.label}</p>
      <p className="stat-value" style={{ fontSize: '1.2rem' }}>{item.value}</p>
      <p className="ds-meta">{item.note}</p>
    </article>
  );
}

export function ProfilePage({ auth, platform }) {
  if (!auth.isLoggedIn) {
    return (
      <section className="panel">
        <h1>Account Center</h1>
        <p className="small-text">Please login to view plans, uploads, and billing details.</p>
        <Link className="btn btn-primary" to="/login">Go to login</Link>
      </section>
    );
  }

  const snapshot = getAccountCenterSnapshot({ auth, platform });
  const {
    membership,
    viewerPlan,
    creatorPlan,
    cycle,
    quota,
    uploads,
    serviceOrders,
    earnings,
    commissionRate,
    billing,
    recentActivity,
    recentChanges,
  } = snapshot;
  const statusLabel = getStatusLabel(auth.userState, membership.tier, auth.user?.tier, membership.creatorPlan);
  const audienceGroup = getAudienceGroup({ auth, membership });
  const latestSeries = uploads[0];
  const monetization = latestSeries?.monetization;
  const viewerSummary = viewerPlan.id === 'free'
    ? 'Free access, previews first, upgrade any time for more full episodes and higher quality.'
    : 'Paid viewer access is active. Browse and Profile now reflect your upgraded viewing tier.';
  const creatorSummary = creatorPlan
    ? `Creator tools, quota, and monetization controls are active for ${creatorPlan.name}.`
    : 'Creator tools are not active yet. Upgrade when you want uploads, review, quota, and earnings controls.';

  return (
    <div className="ds-page">
      <OnboardingGuide role={creatorPlan ? 'creator' : 'viewer'} />
      {quota ? <QuotaAlertBar alerts={buildQuotaAlerts({ snapshot: quota, renewAt: cycle.renewalDate }).slice(0, 2)} compact /> : null}

      <section className="panel ds-section">
        <div className="ds-section-heading">
          <h1 className="ds-h1">Account Overview</h1>
          <p className="ds-meta">{auth.user.name} · {auth.user.email}</p>
        </div>
        <div className="row wrap">
          <MembershipBadge auth={auth} membership={membership} />
          <span className="meta-pill">{statusLabel}</span>
          <span className="meta-pill">Renewal: {cycle.renewalDate}</span>
        </div>
        <div className="grid cards-3">
          <PlanSummaryCard
            title="Viewer plan"
            badgeKey={membership.tier === 'free' ? 'free_viewer' : membership.tier}
            name={viewerPlan.name}
            priceLabel={`${formatUsd(viewerPlan.monthlyPrice)}/month`}
            summary={viewerSummary}
            ctaLabel="Manage viewer plan"
            ctaTo="/pricing?intent=viewer&plan=pro_viewer"
          />
          <PlanSummaryCard
            title="Creator plan"
            badgeKey={creatorPlan?.id || 'creator_basic'}
            name={creatorPlan?.name || 'Not active'}
            priceLabel={creatorPlan ? `${formatUsd(creatorPlan.monthlyPrice)}/month` : '$0/month'}
            summary={creatorSummary}
            ctaLabel={creatorPlan ? 'Open creator pricing' : 'Activate creator tools'}
            ctaTo="/pricing?intent=creator&plan=creator_pro"
            tone="secondary"
          />
          <PlanSummaryCard
            title="Platform commission"
            badgeKey={creatorPlan?.id || 'free_viewer'}
            name={creatorPlan ? formatCommission(commissionRate) : 'Not active'}
            priceLabel={creatorPlan ? 'Applies only after creator revenue exists' : 'Viewer-only account'}
            summary={creatorPlan ? 'Commission is tied to your current creator plan and only activates after real revenue starts.' : 'Upgrade to a creator plan to unlock creator-side monetization and payout controls.'}
            ctaLabel={creatorPlan ? 'Review creator earnings' : 'See creator plan differences'}
            ctaTo={creatorPlan ? '/creator#earnings' : '/pricing?intent=creator&plan=creator_basic'}
            tone="status"
          />
        </div>
      </section>

      <section className="grid cards-2">
        <article className="panel ds-section">
          <div className="ds-section-heading">
            <h2 className="ds-h2">Recent Activity</h2>
            <p className="ds-meta">Your latest plan, billing, order, and upload updates.</p>
          </div>
          <div className="stack-md">
            {(recentActivity || []).map((item) => <ActivityCard key={item.id} item={item} />)}
          </div>
        </article>
        <article className="panel ds-section">
          <div className="ds-section-heading">
            <h2 className="ds-h2">Recent Changes</h2>
            <p className="ds-meta">What changed in access, quota, billing, and creator controls.</p>
          </div>
          <div className="stack-md">
            {(recentChanges || []).map((item) => <ChangeCard key={item.id} item={item} />)}
          </div>
        </article>
      </section>

      <section className="panel ds-section">
        <h2 className="ds-h2">Plans & Billing</h2>
        <HowPricingWorksPanel viewerSummary={billing.viewer} creatorSummary={billing.creator} />
        <div className="row wrap">
          <Link className="btn btn-ghost" to="/pricing?intent=viewer&plan=pro_viewer">Change viewer plan</Link>
          <Link className="btn btn-ghost" to="/pricing?intent=creator&plan=creator_pro">Change creator plan</Link>
          <Link className="btn btn-ghost" to="/refund">Open refund matrix</Link>
        </div>
        <p className="ds-caption">Refund policy: Viewer {REFUND_POLICY_CONFIG.viewer.short} · Creator {REFUND_POLICY_CONFIG.creator.short} · Add-on {REFUND_POLICY_CONFIG.addon.short}. <Link className="info-link" to="/refund">Open full refund matrix</Link></p>
      </section>

      {quota ? (
        <section className="panel ds-section">
          <h2 className="ds-h2">Quota & Entitlements</h2>
          <div className="row wrap">
            <UsageQuotaBadge label="Series" value={`${quota.usage.activeSeries}/${quota.limits.maxActiveSeries}`} tone={quota.remaining.seriesLeft <= 1 ? 'warn' : 'ok'} details={[["Used", quota.usage.activeSeries], ["Remaining", quota.remaining.seriesLeft]]} cta={quota.upgradeHint} />
            <UsageQuotaBadge label="Episodes" value={`${quota.usage.totalEpisodes}/${quota.limits.maxTotalEpisodes}`} details={[["Used", quota.usage.totalEpisodes], ["Remaining", quota.remaining.episodesLeft]]} />
            <UsageQuotaBadge label="Storage" value={`${quota.usage.usedStorageGb.toFixed(1)}GB/${quota.limits.monthlyAssetStorageLimitGb}GB`} tone={quota.remaining.storageGbLeft <= 2 ? 'warn' : 'ok'} details={[["Used", `${quota.usage.usedStorageGb.toFixed(1)}GB`], ["Remaining", `${quota.remaining.storageGbLeft.toFixed(1)}GB`]]} cta={quota.upgradeHint} />
          </div>
          <CreatorPlanCard snapshot={quota} />
          <PlanHealthCard data={{ healthStatus: getHealthStatus(quota), cycleLabel: quota.cycleLabel, metrics: [{ label: 'Series', value: `${quota.usage.activeSeries}/${quota.limits.maxActiveSeries}` }, { label: 'Storage', value: `${quota.usage.usedStorageGb.toFixed(1)}GB/${quota.limits.monthlyAssetStorageLimitGb}GB` }], summary: [['Quota reset', cycle.quotaResetDate], ['Review priority', quota.plan.reviewPriority]] }} />
        </section>
      ) : null}

      <section className="grid cards-2">
        <article className="panel ds-section">
          <h2 className="ds-h2">Orders & Uploads</h2>
          <p className="ds-caption">Recent uploads</p>
          {uploads.length ? uploads.map((item) => <p className="ds-meta" key={item.id}>{item.title} · {item.status}</p>) : <p className="ds-meta">No uploads yet.</p>}
          <div className="row wrap">
            <Link className="info-link" to="/creator#content">Open Creator Studio</Link>
            <Link className="info-link" to="/services">Open Services</Link>
          </div>
          <p className="ds-caption">Recent service orders</p>
          {serviceOrders.length ? serviceOrders.map((item) => <p className="ds-meta" key={item.id}>{item.projectTitle || item.id} · {item.status}</p>) : <p className="ds-meta">No service order yet.</p>}
        </article>
        <article className="panel ds-section">
          <h2 className="ds-h2">Revenue Summary</h2>
          {earnings ? (
            <>
              <p className="ds-meta">Ad revenue <GlossaryTerm id="ad_revenue_share" /> {formatUsd(earnings.advertisingRevenue)}</p>
              <p className="ds-meta">Subscription pool <GlossaryTerm id="subscription_pool_share" /> {formatUsd(earnings.subscriptionShare)}</p>
              <p className="ds-meta">Pending payout <GlossaryTerm id="pending_payout" tier="learn_more" /> {formatUsd(earnings.pendingPayout)}</p>
              <p className="stat-value">Net earnings {formatUsd(earnings.netEarnings)}</p>
              <RevenueFlowDiagram lines={billing.creator.lines} netPayout={billing.creator.netPayout} />
            </>
          ) : <p className="ds-meta">Revenue data appears after creator activity starts.</p>}
        </article>
      </section>

      {monetization ? (
        <section className="panel ds-section">
          <h2 className="ds-h2">Creator-set pricing (latest title)</h2>
          <p className="ds-meta">{latestSeries.title}</p>
          <div className="grid cards-2">
            <article className="card-secondary">
              <p className="ds-caption">Title pricing <GlossaryTerm id="title_pricing" /></p>
              <p className="stat-value">{formatUsd(monetization.titlePriceUsd)}</p>
            </article>
            <article className="card-secondary">
              <p className="ds-caption">Episode unlock <GlossaryTerm id="episode_unlock_price" /></p>
              <p className="stat-value">{formatUsd(monetization.episodeUnlockPriceUsd)}</p>
            </article>
          </div>
        </section>
      ) : null}

      <section className="panel ds-section">
        <h2 className="ds-h2">Help, Policies, Learn More</h2>
        <p className="ds-meta">Revenue model: {REVENUE_MODEL.platform.map((item) => item.label).join(' · ')}</p>
        <p className="ds-meta">Audience mode: {audienceGroup}. Demo role switcher only affects mock mode.</p>
        <div className="row wrap">
          <Link className="info-link" to="/pricing?intent=viewer&plan=pro_viewer">Plan guide</Link>
          <Link className="info-link" to="/refund">Refund policy</Link>
          <Link className="info-link" to="/services">Support and services</Link>
        </div>
        <DemoRoleSwitcher auth={auth} />
      </section>
    </div>
  );
}
