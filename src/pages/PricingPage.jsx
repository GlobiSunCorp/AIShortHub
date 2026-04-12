import { useState } from 'react';
import { createStripeCheckoutSession } from '../lib/stripeClient';
import { ADD_ON_SERVICES, CREATOR_PLANS, VIEWER_SUBSCRIPTIONS, formatCommission, formatUsd, getCreatorPlan, getViewerPlan } from '../data/monetization';
import { resolveMembership } from '../hooks/usePlanAccess';

function FeatureCell({ value }) {
  return <span>{value === true ? '✅' : value === false ? '—' : value}</span>;
}

export function PricingPage({ auth, platform }) {
  const [notice, setNotice] = useState('');
  const membership = auth.user ? resolveMembership(auth, platform) : { tier: 'free', creatorPlan: null };

  const handleViewerCheckout = async (plan) => {
    if (!auth.isLoggedIn) return setNotice('请先登录后再升级 Viewer Subscription。');
    if (plan.id === 'free') {
      platform.actions.setMembershipTier(auth.user.id, 'free');
      return setNotice('Viewer Subscription 已切换为 Free。');
    }
    try {
      const session = await createStripeCheckoutSession({ priceId: plan.priceId, email: auth.user.email });
      platform.actions.setMembershipTier(auth.user.id, plan.id);
      setNotice(session.mode === 'mock' ? `Mock checkout: ${session.message}` : 'Checkout session created.');
    } catch (error) {
      setNotice(`支付初始化失败：${error.message}`);
    }
  };

  const handleCreatorPlan = (plan) => {
    if (!auth.isLoggedIn) return setNotice('请先登录后再升级 Creator Plan。');
    platform.actions.setCreatorPlan(auth.user.id, plan.id);
    setNotice(`Creator Plan 已更新为 ${plan.name}。`);
  };

  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>Pricing & Monetization</h1>
        <p className="small-text">Viewer Subscription 与 Creator Plan 分层管理。Platform Commission、Add-on Services 与 Included Benefits 均已拆分展示。</p>
        <p className="small-text">当前 Viewer Subscription: {getViewerPlan(membership.tier).name} · 当前 Creator Plan: {membership.creatorPlan ? getCreatorPlan(membership.creatorPlan).name : 'None'}</p>
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
                <li>推荐优先级：<FeatureCell value={plan.recommendationPriority} /></li>
              </ul>
              <button type="button" className="btn btn-primary" onClick={() => handleViewerCheckout(plan)}>
                选择 {plan.name}
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
                <li>Static Poster：<FeatureCell value={plan.staticPoster} /></li>
                <li>Motion Poster：<FeatureCell value={plan.motionPoster} /></li>
                <li>TikTok Promo Pack：<FeatureCell value={plan.tiktokPromoPack} /></li>
                <li>推荐位申请：<FeatureCell value={plan.featuredPlacementRequest} /></li>
                <li>完整数据面板：<FeatureCell value={plan.advancedAnalytics} /></li>
                <li>优先支持：<FeatureCell value={plan.prioritySupport} /></li>
              </ul>
              <button type="button" className="btn btn-ghost" onClick={() => handleCreatorPlan(plan)}>
                选择 {plan.name}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="panel stack-md">
        <h3>平台抽成说明</h3>
        <ul>
          <li>平台按每笔创作者收入抽取 Platform Commission，默认基准为 20%。</li>
          <li>Creator Plan 越高，平台抽成越低，因为高阶方案承担更高固定订阅费用。</li>
          <li>结算周期：{platform.platformConfig.settlementCycle}。</li>
          <li>Viewer Subscription 是观众端观看订阅费；Service Fee 是创作者购买的 Add-on Services；Platform Commission 是内容收入分成抽取。</li>
          <li>Included Benefits 属于方案内权益，Add-on Services 属于额外购买，Discounted 表示当前方案可享优惠价。</li>
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
        {notice ? <p className="form-feedback success">{notice}</p> : null}
      </section>
    </div>
  );
}
