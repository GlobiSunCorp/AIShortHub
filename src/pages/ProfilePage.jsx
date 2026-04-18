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
  const { membership, viewerPlan, creatorPlan, cycle, quota, creator, uploads, serviceOrders, earnings, commissionRate, billing } = snapshot;
  const statusLabel = getStatusLabel(auth.userState, membership.tier, auth.user?.tier, membership.creatorPlan);
  const audienceGroup = getAudienceGroup({ auth, membership });
  const latestSeries = uploads[0];
  const monetization = latestSeries?.monetization;

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
          <article className="card-data"><p className="ds-caption">Viewer plan</p><PlanIdentityBadge badgeKey={membership.tier === 'free' ? 'free_viewer' : membership.tier} subtle /><p className="ds-meta">{viewerPlan.name} · {formatUsd(viewerPlan.monthlyPrice)}/month</p></article>
          <article className="card-data"><p className="ds-caption">Creator plan</p>{creatorPlan ? <><PlanIdentityBadge badgeKey={creatorPlan.id} subtle /><p className="ds-meta">{creatorPlan.name} · {formatUsd(creatorPlan.monthlyPrice)}/month</p></> : <p className="ds-meta">No creator plan yet.</p>}</article>
          <article className="card-status"><p className="ds-caption">Platform commission <GlossaryTerm id="platform_commission" tier="learn_more" /></p><p className="ds-meta">{creatorPlan ? `${formatCommission(commissionRate)} · applies only after creator revenue exists` : 'Not applicable for viewer-only account'}</p></article>
        </div>
      </section>

      <section className="panel ds-section">
        <h2 className="ds-h2">Plans & Billing</h2>
        <HowPricingWorksPanel viewerSummary={billing.viewer} creatorSummary={billing.creator} />
        <p className="ds-caption">Refund policy: Viewer {REFUND_POLICY_CONFIG.viewer.short} · Creator {REFUND_POLICY_CONFIG.creator.short} · Add-on {REFUND_POLICY_CONFIG.addon.short}. <Link className="info-link" to="/refund">Open full refund matrix</Link></p>
      </section>

      {quota ? (
        <section className="panel ds-section">
          <h2 className="ds-h2">Quota & Entitlements</h2>
          <div className="row wrap">
            <UsageQuotaBadge label="Series" value={`${quota.usage.activeSeries}/${quota.limits.maxActiveSeries}`} tone={quota.remaining.seriesLeft <= 1 ? 'warn' : 'ok'} details={[["Used", quota.usage.activeSeries], ["Remaining", quota.remaining.seriesLeft]]} cta={quota.upgradeHint} />
            <UsageQuotaBadge label="Episodes" value={`${quota.usage.totalEpisodes}/${quota.limits.maxTotalEpisodes}`} details={[["Used", quota.usage.totalEpisodes], ["Remaining", quota.remaining.episodesLeft]]} />
            <UsageQuotaBadge label="Storage" value={`${quota.usage.usedStorageGb.toFixed(1)}GB/${quota.limits.monthlyAssetStorageLimitGb}GB`} tone={quota.remaining.storageGbLeft <= 2 ? 'warn' : 'ok'} details={[["Used", `${quota.usage.usedStorageGb.toFixed(1)}GB`], ["Remaining", `${quota.remaining.storageGbLeft.toFixed(1)}GB`]]} />
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
          <p className="ds-caption">Recent service orders</p>
          {serviceOrders.length ? serviceOrders.map((item) => <p className="ds-meta" key={item.id}>{item.projectTitle || item.id} · {item.status}</p>) : <p className="ds-meta">No service order yet.</p>}
        </article>
        <article className="panel ds-section">
          <h2 className="ds-h2">Revenue Summary</h2>
          {earnings ? <><p className="ds-meta">Ad revenue <GlossaryTerm id="ad_revenue_share" /> {formatUsd(earnings.advertisingRevenue)}</p><p className="ds-meta">Subscription pool <GlossaryTerm id="subscription_pool_share" /> {formatUsd(earnings.subscriptionShare)}</p><p className="ds-meta">Pending payout <GlossaryTerm id="pending_payout" tier="learn_more" /> {formatUsd(earnings.pendingPayout)}</p><p className="stat-value">Net earnings {formatUsd(earnings.netEarnings)}</p><RevenueFlowDiagram lines={billing.creator.lines} netPayout={billing.creator.netPayout} /></> : <p className="ds-meta">Revenue data appears after creator activity starts.</p>}
        </article>
      </section>

      {monetization ? <section className="panel ds-section"><h2 className="ds-h2">Creator-set pricing (latest title)</h2><p className="ds-meta">{latestSeries.title}</p><div className="grid cards-2"><article className="card-secondary"><p className="ds-caption">Title pricing <GlossaryTerm id="title_pricing" /></p><p className="stat-value">{formatUsd(monetization.titlePriceUsd)}</p></article><article className="card-secondary"><p className="ds-caption">Episode unlock <GlossaryTerm id="episode_unlock_price" /></p><p className="stat-value">{formatUsd(monetization.episodeUnlockPriceUsd)}</p></article></div></section> : null}

      <section className="panel ds-section">
        <h2 className="ds-h2">Help, Policies, Learn More</h2>
        <p className="ds-meta">Revenue model: {REVENUE_MODEL.platform.map((item) => item.label).join(' · ')}</p>
        <p className="ds-meta">Audience mode: {audienceGroup}. Demo role switcher only affects mock mode.</p>
        <div className="row wrap">
          <Link className="info-link" to="/pricing">Plan guide</Link>
          <Link className="info-link" to="/refund">Refund policy</Link>
          <Link className="info-link" to="/services">Support and services</Link>
        </div>
        <DemoRoleSwitcher auth={auth} />
      </section>
    </div>
  );
}
