import { DemoRoleSwitcher } from '../components/DemoRoleSwitcher';
import { CreatorPlanCard, MembershipBadge, UsageQuotaBadge } from '../components/EntitlementBadges';
import { Link } from '../lib/router';
import { ADD_ON_SERVICES, REFUND_POLICY_CONFIG, formatCommission, getCreatorPlan, getServiceEntitlement, getViewerPlan } from '../data/monetization';
import { getCommissionForUser, resolveMembership } from '../hooks/usePlanAccess';
import { getStatusLabel } from '../lib/roleDisplay';
import { getCreatorQuotaSnapshot } from '../lib/services/quotaService';

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

  return (
    <div className="stack-lg">
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
          <article className="mini-card"><h3>Viewer Subscription</h3><p className="small-text">{viewerPlan.name}</p></article>
          <article className="mini-card"><h3>Creator Plan</h3><p className="small-text">{creatorPlan?.name || 'None'}</p></article>
          <article className="mini-card"><h3>Platform Commission</h3><p className="small-text">{commission}</p></article>
          <article className="mini-card"><h3>Included Benefits</h3><p className="small-text">{creatorPlan ? creatorPlan.reviewPriority : 'Viewer-only account'}</p></article>
          <article className="mini-card"><h3>退款规则摘要</h3><p className="small-text">{creatorPlan ? REFUND_POLICY_CONFIG.creator.short : REFUND_POLICY_CONFIG.viewer.short}</p></article>
        </div>
        <p className="small-text">Auth mode: {auth.mode === 'real' ? 'Supabase Auth' : 'Mock fallback'} · Demo Role Switcher only affects demo mode.</p>
        <DemoRoleSwitcher auth={auth} />
      </section>

      {quota ? (
        <section className="panel stack-md">
          <h3>Creator 上传配额</h3>
          <div className="row wrap">
            <UsageQuotaBadge label="Series" value={`${quota.usage.activeSeries}/${quota.limits.maxActiveSeries}`} tone={quota.remaining.seriesLeft <= 1 ? 'warn' : 'ok'} details={[["Used", quota.usage.activeSeries], ["Remaining", quota.remaining.seriesLeft]]} cta={quota.upgradeHint} />
            <UsageQuotaBadge label="Episodes" value={`${quota.usage.totalEpisodes}/${quota.limits.maxTotalEpisodes}`} details={[["Used", quota.usage.totalEpisodes], ["Remaining", quota.remaining.episodesLeft]]} />
            <UsageQuotaBadge label="Storage" value={`${quota.usage.usedStorageGb.toFixed(1)}GB/${quota.limits.monthlyAssetStorageLimitGb}GB`} tone={quota.remaining.storageGbLeft <= 2 ? 'warn' : 'ok'} details={[["Used", `${quota.usage.usedStorageGb.toFixed(1)}GB`], ["Remaining", `${quota.remaining.storageGbLeft.toFixed(1)}GB`]]} />
            <UsageQuotaBadge label="Motion Poster" value={`${quota.remaining.motionPosterLeft} left`} details={[["Included", quota.limits.includedMotionPosterCount], ["Used", quota.usage.usedMotionPosterCount], ["Remaining", quota.remaining.motionPosterLeft]]} />
            <UsageQuotaBadge label="Featured" value={`${quota.remaining.featuredRequestsLeft} left`} details={[["Per cycle", quota.limits.maxFeaturedRequestsPerCycle], ["Used", quota.usage.featuredRequestsUsed], ["Remaining", quota.remaining.featuredRequestsLeft], ["Platform commission", `${Math.round(quota.plan.commissionRate * 100)}%`]]} />
          </div>
          <CreatorPlanCard snapshot={quota} />
        </section>
      ) : null}

      <section className="grid cards-2">
        <article className="panel stack-md">
          <h3>订阅与方案概览</h3>
          <p className="small-text">Viewer Subscription: {viewerPlan.name}</p>
          <p className="small-text">Creator Plan: {creatorPlan?.name || 'Not activated'}</p>
          <p className="small-text">推荐位申请：{creatorPlan?.featuredPlacementRequest ? 'Supported' : 'Not available'}</p>
          <Link className="text-link" to="/refund">查看退款矩阵 →</Link>
        </article>
        <article className="panel stack-md">
          <h3>Add-on Services</h3>
          {ADD_ON_SERVICES.slice(0, 4).map((item) => (
            <p key={item.id} className="small-text">{item.name}: {getServiceEntitlement(item, membership.creatorPlan || 'creator_basic')}</p>
          ))}
        </article>
      </section>

      <section className="grid cards-2">
        <article className="panel">
          <h3>最近服务订单</h3>
          {orders.length ? orders.map((item) => <p className="small-text" key={item.id}>{item.id} · {item.serviceType} · {item.status}</p>) : <p className="small-text">暂无服务订单。</p>}
        </article>
        <article className="panel">
          <h3>最近上传内容</h3>
          {uploads.length ? uploads.map((item) => <p className="small-text" key={item.id}>{item.title} · {item.status}</p>) : <p className="small-text">暂无上传内容。</p>}
          <p className="small-text">服务订单摘要：{orders.length} 条 · 最近状态 {orders[0]?.status || 'N/A'}</p>
          <p className="small-text">最近计划变更：2026-04-13（mock）</p>
        </article>
      </section>
    </div>
  );
}
