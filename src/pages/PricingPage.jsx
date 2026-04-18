import { useState } from 'react';
import { Link } from '../lib/router';
import { startCreatorPlanCheckout, startViewerCheckout } from '../lib/services/billingService';
import { ADD_ON_SERVICES, CREATOR_PLANS, REFUND_POLICY_CONFIG, REVENUE_MODEL, VIEWER_SUBSCRIPTIONS, formatCommission, formatStorageGb, formatUsd, getCreatorPlan, getViewerPlan } from '../data/monetization';
import { resolveMembership } from '../hooks/usePlanAccess';
import { MembershipBadge, PlanIdentityBadge } from '../components/EntitlementBadges';
import { GlossaryTerm } from '../components/GlossaryTerm';
import { OnboardingGuide } from '../components/OnboardingGuide';
import { getBillingSummarySnapshot } from '../lib/selectors/getBillingSummarySnapshot';
import { FeeBreakdownCard } from '../components/billing/FeeBreakdownCard';
import { HowPricingWorksPanel } from '../components/billing/HowPricingWorksPanel';
import { RevenueFlowDiagram } from '../components/billing/RevenueFlowDiagram';

function FeatureCell({ value }) {
  return <span>{value === true ? '✅' : value === false ? '—' : value}</span>;
}

export function PricingPage({ auth, platform }) {
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [loadingKey, setLoadingKey] = useState('');
  const membership = auth.user ? resolveMembership(auth, platform) : { tier: 'free', creatorPlan: null };
  const activeCreator = getCreatorPlan(membership.creatorPlan || 'creator_basic');
  const creatorProfile = platform.creators.find((item) => item.profileId === auth?.user?.id) || platform.creators[0];
  const billingSnapshot = getBillingSummarySnapshot({ platform, creatorId: creatorProfile?.id, membership });

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
      <OnboardingGuide role="viewer" />
      <section className="panel">
        <h1>Pricing & Monetization</h1>
        <p className="small-text">Early creator program 已开启：平台收入优先来自广告与服务，不依赖高抽成。Creator-friendly launch policy：低抽成且仅在创作者产生收入后生效。</p>
        <p className="small-text">当前 Viewer Subscription: {getViewerPlan(membership.tier).name} · 当前 Creator Plan: {membership.creatorPlan ? getCreatorPlan(membership.creatorPlan).name : 'None'}</p>
        {auth.isLoggedIn ? <MembershipBadge auth={auth} membership={membership} /> : null}
      </section>

      <section className="panel stack-md">
        <h2>For Viewers <GlossaryTerm id="viewer_subscription" /></h2>
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
                <li>抢先看 <GlossaryTerm id="early_access" />：<FeatureCell value={plan.earlyAccess} /></li>
                <li>会员专属内容 <GlossaryTerm id="exclusive_content" />：<FeatureCell value={plan.exclusiveContent} /></li>
                <li>继续观看/收藏/历史：<FeatureCell value={plan.watchTools} /></li>
              </ul>
              <button type="button" className="btn btn-primary" disabled={loadingKey === `viewer-${plan.id}`} onClick={() => handleViewerCheckout(plan)}>
                {loadingKey === `viewer-${plan.id}` ? '跳转支付中...' : membership.tier === plan.id ? 'Current Plan' : `升级到 ${plan.name}`}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="panel stack-md">
        <h2>For Creators <GlossaryTerm id="creator_plan" /></h2>
        <p className="small-text">月费是 Creator 工具/额度/优先服务费；平台抽成 <GlossaryTerm id="platform_commission" /> 仅在你真正赚到收入后才发生。</p>
        <div className="grid cards-3">
          {CREATOR_PLANS.map((plan) => (
            <article className={`pricing-card ${membership.creatorPlan === plan.id ? 'active-card' : ''}`} key={plan.id}>
              {membership.creatorPlan === plan.id ? <span className="status ok">Current Plan</span> : null}
              <h3><PlanIdentityBadge badgeKey={plan.id} subtle /></h3>
              <p className="price">{formatUsd(plan.monthlyPrice)}<small className="small-text"> /month</small></p>
              <p className="small-text">Platform Commission: {formatCommission(plan.commissionRate)} · {plan.commissionPolicy}</p>
              <ul>
                <li>审核优先级：{plan.reviewPriority}</li>
                <li>活跃剧集上限：{plan.maxActiveSeries}</li>
                <li>分集总上限：{plan.maxTotalEpisodes}</li>
                <li>月素材存储：{formatStorageGb(plan.monthlyAssetStorageLimitGb)}</li>
                <li>广告分成资格 <GlossaryTerm id="ad_revenue_share" />：{plan.adRevenueShareEligible ? 'Included' : '—'}</li>
                <li>Motion Poster <GlossaryTerm id="motion_poster" />：<FeatureCell value={plan.motionPoster} /></li>
                <li>推荐位资格 <GlossaryTerm id="featured_placement" />：<FeatureCell value={plan.featuredPlacementEligibility} /></li>
              </ul>
              {plan.id !== activeCreator.id ? <p className="small-text">增量权益：+{plan.maxActiveSeries - activeCreator.maxActiveSeries} series · +{plan.monthlyAssetStorageLimitGb - activeCreator.monthlyAssetStorageLimitGb}GB · 佣金降低 {Math.max(Math.round((activeCreator.commissionRate - plan.commissionRate) * 100), 0)}%。</p> : null}
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
            <h4>Platform Revenue Priority</h4>
            {REVENUE_MODEL.platform.map((item, idx) => <p key={item.key} className="small-text">{idx + 1}. {item.label}: {item.detail}</p>)}
          </article>
          <article className="mini-card">
            <h4>Creator Earnings Priority</h4>
            {REVENUE_MODEL.creator.map((item, idx) => <p key={item} className="small-text">{idx + 1}. {item}</p>)}
          </article>
        </div>
      </section>

      <HowPricingWorksPanel viewerSummary={billingSnapshot.viewer} creatorSummary={billingSnapshot.creator} />
      <section className="panel">
        <div className="grid cards-2">
          <RevenueFlowDiagram lines={billingSnapshot.creator.lines} netPayout={billingSnapshot.creator.netPayout} />
          <FeeBreakdownCard gross={billingSnapshot.creator.gross} deductions={billingSnapshot.creator.deductions} net={billingSnapshot.creator.netPayout} />
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
          <li>Early creator program：冷启动阶段保持 8% / 5% / 3% 低抽成。</li>
          <li>抽成只在创作者有收入后发生；无收入不抽成。</li>
          <li>月费与抽成分离：月费用于工具、额度、优先审核与支持服务。</li>
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
