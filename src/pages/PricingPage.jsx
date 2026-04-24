import { useMemo, useState } from 'react';
import { Link, useRouter } from '../lib/router';
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

function PlanChangeModal({ open, title, description, confirmLabel, cancelLabel = '再想想', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="panel stack-md" style={{ maxWidth: 560, width: 'calc(100% - 24px)' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <p className="small-text" style={{ margin: 0 }}>{description}</p>
        <div className="row wrap">
          <button type="button" className="btn btn-primary" onClick={onConfirm}>{confirmLabel}</button>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>{cancelLabel}</button>
        </div>
      </div>
    </div>
  );
}

const BASE_PRICING_CARD_STYLE = {
  transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease',
  transform: 'translateY(0) scale(1)',
  boxShadow: '0 0 0 rgba(0,0,0,0)',
};

const BASE_BUTTON_STYLE = {
  transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease, filter 150ms ease',
};

function getPricingCardStyle({ hovered, current, featured }) {
  if (hovered) {
    return {
      ...BASE_PRICING_CARD_STYLE,
      transform: 'translateY(-4px) scale(1.02)',
      borderColor: featured ? 'rgba(214, 174, 255, 0.56)' : 'rgba(176, 188, 255, 0.48)',
      background: featured
        ? 'linear-gradient(155deg, rgba(42, 28, 68, 0.9), rgba(12, 14, 30, 0.97))'
        : 'linear-gradient(155deg, rgba(27, 35, 66, 0.86), rgba(11, 14, 28, 0.96))',
      boxShadow: featured
        ? '0 28px 56px rgba(28, 14, 48, 0.42)'
        : '0 24px 48px rgba(8, 10, 24, 0.42)',
    };
  }

  if (current) {
    return {
      ...BASE_PRICING_CARD_STYLE,
      borderColor: featured ? 'rgba(194, 156, 255, 0.44)' : 'rgba(145, 163, 255, 0.42)',
      background: featured
        ? 'linear-gradient(155deg, rgba(36, 24, 58, 0.84), rgba(10, 13, 25, 0.95))'
        : 'linear-gradient(155deg, rgba(25, 32, 60, 0.82), rgba(10, 13, 25, 0.94))',
      boxShadow: featured
        ? '0 16px 34px rgba(28, 16, 50, 0.24)'
        : '0 12px 28px rgba(10, 12, 28, 0.22)',
    };
  }

  if (featured) {
    return {
      ...BASE_PRICING_CARD_STYLE,
      borderColor: 'rgba(191, 144, 255, 0.34)',
      background: 'linear-gradient(155deg, rgba(28, 22, 50, 0.78), rgba(10, 13, 25, 0.94))',
      boxShadow: '0 10px 24px rgba(25, 15, 42, 0.14)',
    };
  }

  return BASE_PRICING_CARD_STYLE;
}

function getButtonStyle({ hovered, primary }) {
  if (hovered) {
    return {
      ...BASE_BUTTON_STYLE,
      transform: 'translateY(-1px) scale(1.01)',
      boxShadow: primary ? '0 16px 32px rgba(123, 92, 255, 0.34)' : '0 12px 24px rgba(10, 12, 28, 0.22)',
      borderColor: primary ? 'transparent' : 'rgba(176, 188, 255, 0.4)',
      filter: 'brightness(1.04)',
    };
  }

  return BASE_BUTTON_STYLE;
}

function getCurrentPlanBadgeStyle({ featured }) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.38rem',
    width: 'fit-content',
    borderRadius: '999px',
    padding: '0.35rem 0.72rem',
    fontSize: '0.74rem',
    fontWeight: 700,
    letterSpacing: '0.01em',
    color: '#f6f8ff',
    border: featured ? '1px solid rgba(209, 163, 255, 0.4)' : '1px solid rgba(160, 177, 255, 0.34)',
    background: featured
      ? 'linear-gradient(135deg, rgba(122, 61, 199, 0.34), rgba(25, 18, 42, 0.78))'
      : 'linear-gradient(135deg, rgba(83, 101, 194, 0.28), rgba(18, 24, 43, 0.8))',
    boxShadow: featured ? '0 10px 24px rgba(88, 46, 142, 0.18)' : '0 10px 22px rgba(34, 47, 92, 0.14)',
  };
}

function getFeaturedPillStyle(kind) {
  const featured = kind === 'viewer-premium' || kind === 'creator-studio';
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    width: 'fit-content',
    borderRadius: '999px',
    padding: '0.32rem 0.68rem',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.03em',
    color: '#f5f8ff',
    border: featured ? '1px solid rgba(255, 215, 123, 0.34)' : '1px solid rgba(196, 159, 255, 0.34)',
    background: featured
      ? 'linear-gradient(135deg, rgba(125, 87, 20, 0.38), rgba(33, 25, 12, 0.72))'
      : 'linear-gradient(135deg, rgba(121, 83, 222, 0.3), rgba(28, 22, 50, 0.72))',
  };
}

function isViewerFeatured(plan) {
  return plan.id === 'pro_viewer' || plan.id === 'premium_viewer';
}

function isCreatorFeatured(plan) {
  return plan.id === 'creator_pro' || plan.id === 'studio';
}

function getViewerPlanIndex(planId) {
  return VIEWER_SUBSCRIPTIONS.findIndex((plan) => plan.id === planId);
}

function getCreatorPlanIndex(planId) {
  return CREATOR_PLANS.findIndex((plan) => plan.id === planId);
}

export function PricingPage({ auth, platform }) {
  const { navigate } = useRouter();
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [loadingKey, setLoadingKey] = useState('');
  const [hoveredCard, setHoveredCard] = useState('');
  const [hoveredButton, setHoveredButton] = useState('');
  const [confirmState, setConfirmState] = useState(null);
  const membership = auth.user ? resolveMembership(auth, platform) : { tier: 'free', creatorPlan: null };
  const activeCreator = getCreatorPlan(membership.creatorPlan || 'creator_basic');
  const creatorProfile = platform.creators.find((item) => item.profileId === auth?.user?.id) || platform.creators[0];
  const billingSnapshot = getBillingSummarySnapshot({ platform, creatorId: creatorProfile?.id, membership });

  const goToLoginFor = (target) => {
    navigate(`/login?redirectTo=${encodeURIComponent(target)}`);
  };

  const completeViewerChange = async (plan) => {
    if (plan.id === membership.tier) {
      setNotice({ type: 'success', text: `当前已经是 ${plan.name}。` });
      return;
    }
    if (plan.id === 'free') {
      platform.actions.setMembershipTier(auth.user.id, 'free');
      setNotice({ type: 'success', text: 'Viewer Subscription 已切换为 Free。' });
      return;
    }
    setLoadingKey(`viewer-${plan.id}`);
    setNotice({ type: '', text: '' });
    try {
      const session = await startViewerCheckout({ plan, user: auth.user });
      if (session.mode === 'mock') {
        platform.actions.setMembershipTier(auth.user.id, plan.id);
        setNotice({ type: 'success', text: `${plan.name} 已模拟开通成功。` });
        navigate('/profile');
        return;
      }
      if (session.url) {
        window.location.href = session.url;
        return;
      }
      platform.actions.setMembershipTier(auth.user.id, plan.id);
      setNotice({ type: 'success', text: 'Checkout session created，正在同步状态。' });
      navigate('/profile');
    } catch (error) {
      setNotice({ type: 'error', text: `支付初始化失败：${error.message}` });
    } finally {
      setLoadingKey('');
    }
  };

  const completeCreatorChange = async (plan) => {
    if (plan.id === membership.creatorPlan) {
      setNotice({ type: 'success', text: `当前已经是 ${plan.name}。` });
      return;
    }
    if (plan.id === 'creator_basic') {
      platform.actions.setCreatorPlan(auth.user.id, plan.id);
      setNotice({ type: 'success', text: `Creator Plan 已更新为 ${plan.name}。` });
      navigate('/creator#overview');
      return;
    }
    setLoadingKey(`creator-${plan.id}`);
    setNotice({ type: '', text: '' });
    try {
      const session = await startCreatorPlanCheckout({ plan, user: auth.user });
      if (session.mode === 'mock') {
        platform.actions.setCreatorPlan(auth.user.id, plan.id);
        setNotice({ type: 'success', text: `${plan.name} 已模拟开通成功。` });
        navigate('/creator#overview');
        return;
      }
      if (session.url) {
        window.location.href = session.url;
        return;
      }
      platform.actions.setCreatorPlan(auth.user.id, plan.id);
      setNotice({ type: 'success', text: 'Creator plan checkout session created，正在同步状态。' });
      navigate('/creator#overview');
    } catch (error) {
      setNotice({ type: 'error', text: `Creator Plan 支付初始化失败：${error.message}` });
    } finally {
      setLoadingKey('');
    }
  };

  const requestViewerPlanChange = async (plan) => {
    if (!auth.isLoggedIn) {
      goToLoginFor(`/pricing?intent=viewer&plan=${plan.id}`);
      return;
    }
    const currentIndex = getViewerPlanIndex(membership.tier || 'free');
    const nextIndex = getViewerPlanIndex(plan.id);
    if (currentIndex > nextIndex) {
      setConfirmState({
        title: `更换到 ${plan.name}？`,
        description: `你当前是 ${getViewerPlan(membership.tier || 'free').name}。降到更低级别后，高级权益会在当前处理完成后切换。确认继续吗？`,
        confirmLabel: '确认更换级别',
        action: () => completeViewerChange(plan),
      });
      return;
    }
    await completeViewerChange(plan);
  };

  const requestCreatorPlanChange = async (plan) => {
    if (!auth.isLoggedIn) {
      goToLoginFor(`/pricing?intent=creator&plan=${plan.id}`);
      return;
    }
    const currentIndex = getCreatorPlanIndex(membership.creatorPlan || 'creator_basic');
    const nextIndex = getCreatorPlanIndex(plan.id);
    if (currentIndex > nextIndex) {
      setConfirmState({
        title: `切换到 ${plan.name}？`,
        description: `你当前是 ${getCreatorPlan(membership.creatorPlan || 'creator_basic').name}。切到更低级别后，可用额度、审核优先级和部分工具权限会下降。确认继续吗？`,
        confirmLabel: '确认切换方案',
        action: () => completeCreatorChange(plan),
      });
      return;
    }
    await completeCreatorChange(plan);
  };

  const closeConfirm = () => setConfirmState(null);

  return (
    <>
      <PlanChangeModal
        open={Boolean(confirmState)}
        title={confirmState?.title || ''}
        description={confirmState?.description || ''}
        confirmLabel={confirmState?.confirmLabel || '确认'}
        onConfirm={async () => {
          const action = confirmState?.action;
          closeConfirm();
          if (action) await action();
        }}
        onCancel={closeConfirm}
      />
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
            {VIEWER_SUBSCRIPTIONS.map((plan) => {
              const isCurrent = membership.tier === plan.id;
              const isFeatured = isViewerFeatured(plan);
              const cardKey = `viewer-${plan.id}`;
              const buttonKey = `viewer-btn-${plan.id}`;
              const pillKind = plan.id === 'premium_viewer' ? 'viewer-premium' : 'viewer-pro';
              return (
                <article
                  className="pricing-card"
                  key={plan.id}
                  style={getPricingCardStyle({ hovered: hoveredCard === cardKey, current: isCurrent, featured: isFeatured })}
                  onMouseEnter={() => setHoveredCard(cardKey)}
                  onMouseLeave={() => setHoveredCard('')}
                >
                  <div className="row wrap center" style={{ justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <p className="kicker" style={{ margin: 0 }}>{plan.badge}</p>
                    {isFeatured ? <span style={getFeaturedPillStyle(pillKind)}>{plan.id === 'premium_viewer' ? 'Best value' : 'Most popular'}</span> : null}
                  </div>
                  {isCurrent ? <span style={getCurrentPlanBadgeStyle({ featured: isFeatured })}>● Current Plan</span> : null}
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
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={getButtonStyle({ hovered: hoveredButton === buttonKey, primary: true })}
                    disabled={loadingKey === `viewer-${plan.id}`}
                    onMouseEnter={() => setHoveredButton(buttonKey)}
                    onMouseLeave={() => setHoveredButton('')}
                    onClick={() => requestViewerPlanChange(plan)}
                  >
                    {loadingKey === `viewer-${plan.id}` ? '跳转支付中...' : isCurrent ? 'Current Plan' : `升级到 ${plan.name}`}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="panel stack-md">
          <h2>For Creators <GlossaryTerm id="creator_plan" /></h2>
          <p className="small-text">月费是 Creator 工具/额度/优先服务费；平台抽成 <GlossaryTerm id="platform_commission" /> 仅在你真正赚到收入后才发生。</p>
          <div className="grid cards-3">
            {CREATOR_PLANS.map((plan) => {
              const isCurrent = membership.creatorPlan === plan.id;
              const isFeatured = isCreatorFeatured(plan);
              const cardKey = `creator-${plan.id}`;
              const buttonKey = `creator-btn-${plan.id}`;
              const pillKind = plan.id === 'studio' ? 'creator-studio' : 'creator-pro';
              return (
                <article
                  className="pricing-card"
                  key={plan.id}
                  style={getPricingCardStyle({ hovered: hoveredCard === cardKey, current: isCurrent, featured: isFeatured })}
                  onMouseEnter={() => setHoveredCard(cardKey)}
                  onMouseLeave={() => setHoveredCard('')}
                >
                  <div className="row wrap center" style={{ justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <div />
                    {isFeatured ? <span style={getFeaturedPillStyle(pillKind)}>{plan.id === 'studio' ? 'Top creator tier' : 'Best launch tier'}</span> : null}
                  </div>
                  {isCurrent ? <span style={getCurrentPlanBadgeStyle({ featured: isFeatured })}>● Current Plan</span> : null}
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
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={getButtonStyle({ hovered: hoveredButton === buttonKey, primary: false })}
                    disabled={loadingKey === `creator-${plan.id}`}
                    onMouseEnter={() => setHoveredButton(buttonKey)}
                    onMouseLeave={() => setHoveredButton('')}
                    onClick={() => requestCreatorPlanChange(plan)}
                  >
                    {loadingKey === `creator-${plan.id}` ? '跳转支付中...' : isCurrent ? 'Current Plan' : `升级到 ${plan.name}`}
                  </button>
                </article>
              );
            })}
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
    </>
  );
}
