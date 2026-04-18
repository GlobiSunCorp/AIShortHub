import { useState } from 'react';
import { Link } from '../lib/router';
import { startCreatorPlanCheckout, startViewerCheckout } from '../lib/services/billingService';
import { ADD_ON_SERVICES, CREATOR_PLANS, REFUND_POLICY_CONFIG, REVENUE_MODEL, VIEWER_SUBSCRIPTIONS, formatCommission, formatStorageGb, formatUsd, getCreatorPlan, getViewerPlan } from '../data/monetization';
import { resolveMembership } from '../hooks/usePlanAccess';
import { MembershipBadge, PlanIdentityBadge } from '../components/EntitlementBadges';

function FeatureCell({ value }) {
  return <span>{value === true ? '✅' : value === false ? '—' : value}</span>;
}

export function PricingPage({ auth, platform }) {
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [loadingKey, setLoadingKey] = useState('');
  const membership = auth.user ? resolveMembership(auth, platform) : { tier: 'free', creatorPlan: null };
  const activeCreator = getCreatorPlan(membership.creatorPlan || 'creator_basic');

  const handleViewerCheckout = async (plan) => {
    if (!auth.isLoggedIn) return setNotice({ type: 'error', text: '请先登录后再升级 Viewer Subscription。' });
    if (plan.id === 'free') {
      platform.actions.setMembershipTier(auth.user.id, 'free');
      return setNotice({ type: 'success', text: 'Viewer Subscription 已切换为 Free。' });
    }
    setLoadingKey(`viewer-${plan.id}`);
    setNotice({ type: '', text: '' });
    try {
      const session = await startViewerCheckout({ plan, user: auth.user });
      if (session.url) {
        window.location.href = session.url;
        return;
      }
      platform.actions.setMembershipTier(auth.user.id, plan.id);
      setNotice({ type: 'success', text: 'Checkout session created，正在同步状态。' });
    } catch (error) {
      setNotice({ type: 'error', text: `支付初始化失败：${error.message}` });
    } finally {
      setLoadingKey('');
    }
  };

  const handleCreatorPlan = async (plan) => {
    if (!auth.isLoggedIn) return setNotice({ type: 'error', text: '请先登录后再升级 Creator Plan。' });
    if (plan.id === 'creator_basic') {
      platform.actions.setCreatorPlan(auth.user.id, plan.id);
      return setNotice({ type: 'success', text: `Creator Plan 已更新为 ${plan.name}。` });
    }
    setLoadingKey(`creator-${plan.id}`);
    setNotice({ type: '', text: '' });
    try {
      const session = await startCreatorPlanCheckout({ plan, user: auth.user });
      if (session.url) {
        window.location.href = session.url;
        return;
      }
      platform.actions.setCreatorPlan(auth.user.id, plan.id);
      setNotice({ type: 'success', text: 'Creator plan checkout session created，正在同步状态。' });
    } catch (error) {
      setNotice({ type: 'error', text: `Creator Plan 支付初始化失败：${error.message}` });
    } finally {
      setLoadingKey('');
    }
  };

  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>Pricing & Monetization</h1>
        <p className="small-text">更低门槛、更透明、更适合持续订阅。平台商业模型升级为“广告优先 + 服务收入 + 订阅 + 单次解锁 + 低抽成”。</p>
        <p className="small-text">当前 Viewer Subscription: {getViewerPlan(membership.tier).name} · 当前 Creator Plan: {membership.creatorPlan ? getCreatorPlan(membership.creatorPlan).name : 'None'}</p>
        {auth.isLoggedIn ? <MembershipBadge auth={auth} membership={membership} /> : null}
      </section>

      <section className="panel stack-md">
        <h2>For Viewers</h2>
        <div className="grid cards-3">
          {VIEWER_SUBSCRIPTIONS.map((plan) => (
            <article className={`pricing-card ${membership.tier === plan.id ? 'active-card' : ''}`} key={plan.id}>
              <p className="kicker">{plan.badge}</p>
              {membership.tier === plan.id ? <span className="status ok">Current Plan</span> : null}
              <h3><PlanIdentityBadge badgeKey={plan.id === 'free' ? 'free_viewer' : plan.id} subtle /> </h3>
              <p className="price">{formatUsd(plan.monthlyPrice)}<small className="small-text"> /month</small></p>
              <p className="small-text">{plan.accessNote}</p>
              <ul>
                <li>完整剧集：<FeatureCell value={plan.fullSeriesAccess} /></li>
                <li>清晰度：<FeatureCell value={plan.quality} /></li>
                <li>抢先看：<FeatureCell value={plan.earlyAccess} /></li>
                <li>会员专属内容：<FeatureCell value={plan.exclusiveContent} /></li>
                <li>继续观看/收藏/历史：<FeatureCell value={plan.watchTools} /></li>
              </ul>
              {plan.id !== membership.tier ? <p className="small-text">Upgrade gains: full content unlock, transparent monthly price, flexible cancellation.</p> : null}
              <button type="button" className="btn btn-primary" disabled={loadingKey === `viewer-${plan.id}`} onClick={() => handleViewerCheckout(plan)}>
                {loadingKey === `viewer-${plan.id}` ? '跳转支付中...' : membership.tier === plan.id ? 'Current Plan' : `升级到 ${plan.name}`}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="panel stack-md">
        <h2>For Creators</h2>
        <div className="grid cards-3">
          {CREATOR_PLANS.map((plan) => (
            <article className={`pricing-card ${membership.creatorPlan === plan.id ? 'active-card' : ''}`} key={plan.id}>
              {membership.creatorPlan === plan.id ? <span className="status ok">Current Plan</span> : null}
              <h3><PlanIdentityBadge badgeKey={plan.id} subtle /></h3>
              <p className="price">{formatUsd(plan.monthlyPrice)}<small className="small-text"> /month</small></p>
              <p className="small-text">Platform Commission: {formatCommission(plan.commissionRate)}</p>
              <ul>
                <li>审核优先级：{plan.reviewPriority}</li>
                <li>活跃剧集上限：{plan.maxActiveSeries}</li>
                <li>分集总上限：{plan.maxTotalEpisodes}</li>
                <li>月素材存储：{formatStorageGb(plan.monthlyAssetStorageLimitGb)}</li>
                <li>Creator-set pricing：{plan.creatorSetPricing ? 'Included' : '—'}</li>
                <li>广告分成资格：{plan.adRevenueShareEligible ? 'Included' : '—'}</li>
                <li>Motion Poster：<FeatureCell value={plan.motionPoster} /></li>
                <li>推荐位资格：<FeatureCell value={plan.featuredPlacementEligibility} /></li>
              </ul>
              {plan.id !== activeCreator.id ? <p className="small-text">增量权益：+{plan.maxActiveSeries - activeCreator.maxActiveSeries} series · +{plan.monthlyAssetStorageLimitGb - activeCreator.monthlyAssetStorageLimitGb}GB · 佣金降低 {Math.round((activeCreator.commissionRate - plan.commissionRate) * 100)}%。</p> : null}
              <button type="button" className="btn btn-ghost" disabled={loadingKey === `creator-${plan.id}`} onClick={() => handleCreatorPlan(plan)}>
                {loadingKey === `creator-${plan.id}` ? '跳转支付中...' : membership.creatorPlan === plan.id ? 'Current Plan' : `升级到 ${plan.name}`}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="panel stack-md">
        <h3>Revenue Model / Platform Monetization</h3>
        <div className="grid cards-2">
          <article className="mini-card">
            <h4>Platform Revenue Streams</h4>
            {REVENUE_MODEL.platform.map((item) => <p key={item.key} className="small-text">• {item.label}: {item.detail}</p>)}
          </article>
          <article className="mini-card">
            <h4>Creator Earnings Streams</h4>
            {REVENUE_MODEL.creator.map((item) => <p key={item} className="small-text">• {item}</p>)}
          </article>
        </div>
      </section>

      <section className="panel stack-md">
        <h3>退款策略矩阵入口</h3>
        <div className="grid cards-3">
          <article className="mini-card"><h4>{REFUND_POLICY_CONFIG.viewer.title}</h4><p className="small-text">{REFUND_POLICY_CONFIG.viewer.short}</p><Link className="text-link" to="/refund">查看完整规则 →</Link></article>
          <article className="mini-card"><h4>{REFUND_POLICY_CONFIG.creator.title}</h4><p className="small-text">{REFUND_POLICY_CONFIG.creator.short}</p><Link className="text-link" to="/refund">查看完整规则 →</Link></article>
          <article className="mini-card"><h4>{REFUND_POLICY_CONFIG.addon.title}</h4><p className="small-text">{REFUND_POLICY_CONFIG.addon.short}</p><Link className="text-link" to="/refund">查看完整规则 →</Link></article>
        </div>
      </section>

      <section className="panel stack-md">
        <h3>平台说明</h3>
        <ul>
          <li>平台默认基准抽成为 20%（可配置），但 Creator Plan 提供 15% / 10% / 7%低抽成方案。</li>
          <li>平台未来核心收入不只来自抽成：广告与服务订单是第一增长来源。</li>
          <li>结算周期：{platform.platformConfig.settlementCycle}。</li>
          <li>Viewer Subscription、Creator Plan、Add-on Services 各自独立计费与退款路径。</li>
        </ul>
        <div className="grid cards-3">
          {ADD_ON_SERVICES.slice(0, 3).map((service) => (
            <article key={service.id} className="mini-card">
              <h4>{service.name}</h4>
              <p className="small-text">{service.price}</p>
              <p className="small-text">{service.description}</p>
            </article>
          ))}
        </div>
        {notice.text ? <p className={`form-feedback ${notice.type || 'success'}`}>{notice.text}</p> : null}
      </section>
    </div>
  );
}
