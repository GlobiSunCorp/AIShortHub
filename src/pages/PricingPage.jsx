import { useState } from 'react';
import { Link } from '../lib/router';
import { startCreatorPlanCheckout, startViewerCheckout } from '../lib/services/billingService';
import { ADD_ON_SERVICES, CREATOR_PLANS, REFUND_POLICY_CONFIG, VIEWER_SUBSCRIPTIONS, formatCommission, formatStorageGb, formatUsd, getCreatorPlan, getViewerPlan } from '../data/monetization';
import { resolveMembership } from '../hooks/usePlanAccess';
import { MembershipBadge } from '../components/EntitlementBadges';

function FeatureCell({ value }) {
  return <span>{value === true ? '✅' : value === false ? '—' : value}</span>;
}

export function PricingPage({ auth, platform }) {
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [loadingKey, setLoadingKey] = useState('');
  const membership = auth.user ? resolveMembership(auth, platform) : { tier: 'free', creatorPlan: null };

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
        <p className="small-text">Viewer Subscription 与 Creator Plan 分层管理。Platform Commission、Add-on Services 与 Included Benefits 均已拆分展示。</p>
        <p className="small-text">当前 Viewer Subscription: {getViewerPlan(membership.tier).name} · 当前 Creator Plan: {membership.creatorPlan ? getCreatorPlan(membership.creatorPlan).name : 'None'}</p>
        {auth.isLoggedIn ? <MembershipBadge auth={auth} membership={membership} /> : null}
      </section>

      <section className="panel stack-md">
        <h2>For Viewers</h2>
        <div className="grid cards-3">
          {VIEWER_SUBSCRIPTIONS.map((plan) => (
            <article className="pricing-card" key={plan.id}>
              <p className="kicker">{plan.badge}</p>
              <h3>{plan.name}</h3>
              <p className="price">{formatUsd(plan.monthlyPrice)}<small className="small-text"> /month</small></p>
              <p className="small-text">{formatUsd(plan.yearlyPrice)} /year</p>
              <ul>
                <li>完整剧集：<FeatureCell value={plan.fullSeriesAccess} /></li>
                <li>清晰度：<FeatureCell value={plan.quality} /></li>
                <li>抢先看：<FeatureCell value={plan.earlyAccess} /></li>
                <li>会员专属内容：<FeatureCell value={plan.exclusiveContent} /></li>
                <li>继续观看/收藏/历史：<FeatureCell value={plan.watchTools} /></li>
              </ul>
              <button type="button" className="btn btn-primary" disabled={loadingKey === `viewer-${plan.id}`} onClick={() => handleViewerCheckout(plan)}>
                {loadingKey === `viewer-${plan.id}` ? '跳转支付中...' : `选择 ${plan.name}`}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="panel stack-md">
        <h2>For Creators</h2>
        <div className="grid cards-3">
          {CREATOR_PLANS.map((plan) => (
            <article className="pricing-card" key={plan.id}>
              <h3>{plan.name}</h3>
              <p className="price">{formatUsd(plan.monthlyPrice)}<small className="small-text"> /month</small></p>
              <p className="small-text">Platform Commission: {formatCommission(plan.commissionRate)}</p>
              <ul>
                <li>审核优先级：{plan.reviewPriority}</li>
                <li>上传剧集上限：{plan.maxActiveSeries}</li>
                <li>分集总上限：{plan.maxTotalEpisodes}</li>
                <li>月素材存储：{formatStorageGb(plan.monthlyAssetStorageLimitGb)}</li>
                <li>Featured requests / cycle：{plan.maxFeaturedRequestsPerCycle}</li>
                <li>月上传次数：{plan.monthlyUploadLimit}</li>
                <li>Motion Poster：<FeatureCell value={plan.motionPoster} /></li>
                <li>推荐位资格：<FeatureCell value={plan.featuredPlacementEligibility} /></li>
              </ul>
              <button type="button" className="btn btn-ghost" disabled={loadingKey === `creator-${plan.id}`} onClick={() => handleCreatorPlan(plan)}>
                {loadingKey === `creator-${plan.id}` ? '跳转支付中...' : `选择 ${plan.name}`}
              </button>
            </article>
          ))}
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
        <h3>平台抽成说明</h3>
        <ul>
          <li>平台按每笔创作者收入抽取 Platform Commission，默认基准为 20%。</li>
          <li>Creator Plan 越高，平台抽成越低，因为高阶方案承担更高固定订阅费用。</li>
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
