import { DemoRoleSwitcher } from '../components/DemoRoleSwitcher';
import { GlossaryTerm } from '../components/GlossaryTerm';
import { OnboardingGuide } from '../components/OnboardingGuide';
import { CreatorPlanCard, MembershipBadge, PlanIdentityBadge, UsageQuotaBadge } from '../components/EntitlementBadges';
import { PlanHealthCard, QuotaAlertBar } from '../components/CreatorOpsPanels';
import { Link } from '../lib/router';
import { REFUND_POLICY_CONFIG, REVENUE_MODEL, formatCommission, formatUsd, getCreatorPlan, getViewerPlan } from '../data/monetization';
import { getCommissionForUser, resolveMembership } from '../hooks/usePlanAccess';
import { getAudienceGroup } from '../lib/planIdentity';
import { getStatusLabel } from '../lib/roleDisplay';
import { getCreatorQuotaSnapshot } from '../lib/services/quotaService';
import { buildQuotaAlerts, getCycleDates, getHealthStatus } from '../lib/services/creatorHealthService';
import { getCreatorEarningsSnapshot } from '../lib/services/earningsService';
import { getBillingSummarySnapshot } from '../lib/selectors/getBillingSummarySnapshot';
import { HowPricingWorksPanel } from '../components/billing/HowPricingWorksPanel';
import { RevenueFlowDiagram } from '../components/billing/RevenueFlowDiagram';

export function ProfilePage({ auth, platform }) {
  if (!auth.isLoggedIn) {
    return (
      <section className="panel">
        <h1>账号中心</h1>
        <p className="small-text">请先登录。</p>
        <Link className="btn btn-primary" to="/login">去登录</Link>
      </section>
    );
  }

  const membership = resolveMembership(auth, platform);
  const viewerPlan = getViewerPlan(membership.tier);
  const creatorPlan = membership.creatorPlan ? getCreatorPlan(membership.creatorPlan) : null;
  const statusLabel = getStatusLabel(auth.userState, membership.tier, auth.user?.tier, membership.creatorPlan);
  const commission = creatorPlan ? formatCommission(getCommissionForUser(auth, platform)) : 'N/A';
  const orders = platform.serviceOrders.filter((item) => item.requesterId === auth.user.id).slice(0, 3);
  const creator = platform.creators.find((item) => item.profileId === auth.user.id);
  const uploads = creator ? platform.series.filter((item) => item.creatorId === creator.id).slice(0, 3) : [];
  const quota = creatorPlan && creator ? getCreatorQuotaSnapshot({ creatorPlanId: creatorPlan.id, creatorId: creator.id, profileId: auth.user.id, platform }) : null;
  const cycle = getCycleDates(platform.memberships.find((m) => m.profileId === auth.user.id)?.renewAt);
  const audienceGroup = getAudienceGroup({ auth, membership });
  const latestSeries = uploads[0];
  const monetization = latestSeries?.monetization;
  const earnings = creator ? getCreatorEarningsSnapshot({ platform, creatorId: creator.id }) : null;
  const billingSnapshot = getBillingSummarySnapshot({ platform, creatorId: creator?.id, membership });

  return (
    <div className="stack-lg">
      <OnboardingGuide role={creatorPlan ? 'creator' : 'viewer'} />
      {quota ? <QuotaAlertBar alerts={buildQuotaAlerts({ snapshot: quota, renewAt: cycle.renewalDate }).slice(0, 2)} compact /> : null}

      <section className="panel stack-md">
        <h1>{auth.user.name}</h1>
        <p className="small-text">{auth.user.email}</p>
        <div className="row wrap">
          <MembershipBadge auth={auth} membership={membership} />
          {quota ? <UsageQuotaBadge label="Series" value={`${quota.usage.activeSeries}/${quota.limits.maxActiveSeries}`} tone={quota.remaining.seriesLeft <= 1 ? 'warn' : 'ok'} details={[["Active Series used", quota.usage.activeSeries], ["Series slots left", quota.remaining.seriesLeft]]} /> : null}
          {quota ? <UsageQuotaBadge label="Episodes" value={`${quota.usage.totalEpisodes}/${quota.limits.maxTotalEpisodes}`} details={[["Episodes used", quota.usage.totalEpisodes], ["Episode slots left", quota.remaining.episodesLeft]]} /> : null}
        </div>
        <div className="grid cards-3">
          <article className="mini-card"><h3>Status</h3><p className="small-text">{statusLabel}</p></article>
          <article className="mini-card"><h3>Viewer Subscription</h3><PlanIdentityBadge badgeKey={membership.tier === 'free' ? 'free_viewer' : membership.tier} subtle /><p className="small-text">{viewerPlan.name} · {formatUsd(viewerPlan.monthlyPrice)}/month</p></article>
          <article className="mini-card"><h3>Creator Plan</h3>{creatorPlan ? <><PlanIdentityBadge badgeKey={creatorPlan.id} subtle /><p className="small-text">{formatUsd(creatorPlan.monthlyPrice)}/month</p></> : <p className="small-text">Viewer-only account · Creator plan optional</p>}</article>
          <article className="mini-card"><h3>Platform Commission <GlossaryTerm id="platform_commission" /></h3><p className="small-text">{commission} · 仅在创作者有收入后才生效</p></article>
          <article className="mini-card"><h3>Quota reset date <GlossaryTerm id="quota_reset" /></h3><p className="small-text">{cycle.quotaResetDate}</p></article>
          <article className="mini-card"><h3>Billing renewal date <GlossaryTerm id="renewal_date" /></h3><p className="small-text">{cycle.renewalDate}</p></article>
        </div>
        <p className="small-text">Auth mode: {auth.mode === 'real' ? 'Supabase Auth' : 'Mock fallback'} · Demo Role Switcher only affects demo mode.</p>
        <DemoRoleSwitcher auth={auth} />
      </section>

      {monetization ? (
        <section className="panel stack-md">
          <h3>Creator-set Pricing Snapshot (Latest Series)</h3>
          <p className="small-text">Series: {latestSeries.title}</p>
          <div className="grid cards-2">
            <article className="mini-card"><p className="small-text">Entire title price <GlossaryTerm id="entire_title_price" /></p><strong>{formatUsd(monetization.titlePriceUsd)}</strong></article>
            <article className="mini-card"><p className="small-text">Episode unlock price <GlossaryTerm id="episode_unlock_price" /></p><strong>{formatUsd(monetization.episodeUnlockPriceUsd)}</strong></article>
            <article className="mini-card"><p className="small-text">Finale unlock</p><strong>{monetization.finaleUnlockEnabled ? formatUsd(monetization.finaleUnlockPriceUsd) : 'Disabled'}</strong></article>
            <article className="mini-card"><p className="small-text">Free preview episodes</p><strong>{monetization.freePreviewEpisodes.join(', ')}</strong></article>
          </div>
          <p className="small-text">订阅用户：Pro/Premium 可完整观看。非订阅用户：支持按整剧或按单集解锁。</p>
        </section>
      ) : null}

      {quota ? (
        <>
          <PlanHealthCard
            data={{
              healthStatus: getHealthStatus(quota),
              cycleLabel: cycle.cycleLabel,
              metrics: [
                { label: 'Series', value: `${quota.usage.activeSeries}/${quota.limits.maxActiveSeries}`, tone: quota.remaining.seriesLeft <= 1 ? 'warn' : 'ok', details: [['Used', quota.usage.activeSeries], ['Remaining', quota.remaining.seriesLeft]] },
                { label: 'Storage', value: `${quota.usage.usedStorageGb.toFixed(1)}GB/${quota.limits.monthlyAssetStorageLimitGb}GB`, tone: quota.remaining.storageGbLeft <= 2 ? 'warn' : 'ok', details: [['Used', `${quota.usage.usedStorageGb.toFixed(1)}GB`], ['Remaining', `${quota.remaining.storageGbLeft.toFixed(1)}GB`]] },
              ],
              summary: [
                ['Viewer Plan', viewerPlan.name],
                ['Creator Plan', creatorPlan.name],
                ['Review Priority', quota.plan.reviewPriority],
                ['Featured requests', `${quota.usage.featuredRequestsUsed} used / ${quota.remaining.featuredRequestsLeft} left`],
              ],
            }}
          />
          <section className="panel stack-md">
            <h3>Creator 上传配额</h3>
            <div className="row wrap">
              <UsageQuotaBadge label="Series" value={`${quota.usage.activeSeries}/${quota.limits.maxActiveSeries}`} tone={quota.remaining.seriesLeft <= 1 ? 'warn' : 'ok'} details={[["Used", quota.usage.activeSeries], ["Remaining", quota.remaining.seriesLeft]]} cta={quota.upgradeHint} />
              <UsageQuotaBadge label="Episodes" value={`${quota.usage.totalEpisodes}/${quota.limits.maxTotalEpisodes}`} details={[["Used", quota.usage.totalEpisodes], ["Remaining", quota.remaining.episodesLeft]]} />
              <UsageQuotaBadge label="Storage" value={`${quota.usage.usedStorageGb.toFixed(1)}GB/${quota.limits.monthlyAssetStorageLimitGb}GB`} tone={quota.remaining.storageGbLeft <= 2 ? 'warn' : 'ok'} details={[["Used", `${quota.usage.usedStorageGb.toFixed(1)}GB`], ["Remaining", `${quota.remaining.storageGbLeft.toFixed(1)}GB`]]} />
            </div>
            <CreatorPlanCard snapshot={quota} />
          </section>
        </>
      ) : null}

      {earnings ? <section className="panel stack-md"><h3>Earnings quick summary</h3><p className="small-text">Ad revenue <GlossaryTerm id="ad_revenue_share" /> {formatUsd(earnings.advertisingRevenue)} · Subscription share <GlossaryTerm id="subscription_pool_share" /> {formatUsd(earnings.subscriptionShare)} · Single-title {formatUsd(earnings.singleTitleSales)} · Episode unlock {formatUsd(earnings.episodeUnlockSales)} · Net <GlossaryTerm id="net_earnings" /> {formatUsd(earnings.netEarnings)}</p></section> : null}
      <HowPricingWorksPanel viewerSummary={billingSnapshot.viewer} creatorSummary={billingSnapshot.creator} />
      {creatorPlan ? <section className="panel"><RevenueFlowDiagram lines={billingSnapshot.creator.lines} netPayout={billingSnapshot.creator.netPayout} /></section> : null}

      <section className="grid cards-2">
        <article className="panel stack-md">
          <h3>Plan Upgrade Guide</h3>
          {audienceGroup === 'viewer' ? (
            <>
              <p className="small-text">Current Viewer Plan: {viewerPlan.name}</p>
              <p className="small-text">Upgrade options: Pro Viewer ($4.99) / Premium Viewer ($9.99)</p>
              <p className="small-text">Benefits: full access · better quality · early access (Premium).</p>
            </>
          ) : (
            <>
              <p className="small-text">Current Creator Plan: {creatorPlan?.name || 'Creator Basic'}</p>
              <p className="small-text">Upgrade options: Creator Pro / Studio</p>
              <p className="small-text">Benefits: lower commission · more slots · stronger storage + analytics.</p>
            </>
          )}
          <Link className="text-link" to="/pricing">查看升级方案 →</Link>
        </article>
        <article className="panel stack-md">
          <h3>Revenue Model Summary</h3>
          <p className="small-text">Platform: {REVENUE_MODEL.platform.map((item) => item.label).join(' · ')}</p>
          <p className="small-text">Creator: {REVENUE_MODEL.creator.join(' · ')}</p>
        </article>
      </section>

      <section className="grid cards-2">
        <article className="panel stack-md">
          <h3>Refund Rules by Category</h3>
          <p className="small-text">Viewer: {REFUND_POLICY_CONFIG.viewer.short}</p>
          <p className="small-text">Creator: {REFUND_POLICY_CONFIG.creator.short}</p>
          <p className="small-text">Add-on: {REFUND_POLICY_CONFIG.addon.short}</p>
          <Link className="text-link" to="/refund">查看退款矩阵 →</Link>
        </article>
        <article className="panel">
          <h3>最近上传内容</h3>
          {uploads.length ? uploads.map((item) => <p className="small-text" key={item.id}>{item.title} · {item.status}</p>) : <p className="small-text">暂无上传内容。</p>}
          <p className="small-text">最近服务订单：{orders.length} 条</p>
          <p className="small-text">最近计划变更：2026-04-13（mock）</p>
        </article>
      </section>
    </div>
  );
}
