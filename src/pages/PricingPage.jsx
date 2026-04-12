import { useState } from 'react';
import { createStripeCheckoutSession } from '../lib/stripeClient';

const plans = [
  { id: 'free', title: 'Free', price: '$0', desc: '试看预告与首集', benefits: ['预告片', '有限试看', '可提交服务需求'] },
  { id: 'pro_monthly', title: 'Pro Monthly', price: '$19/mo', desc: '按月订阅', benefits: ['全集观看', '优先更新', '跨端进度同步'], priceId: 'price_monthly_placeholder' },
  { id: 'pro_yearly', title: 'Pro Yearly', price: '$149/yr', desc: '按年订阅，节省 34%', benefits: ['全集观看', '年度优惠', '会员专属活动'], priceId: 'price_yearly_placeholder' },
];

export function PricingPage({ auth, platform }) {
  const [notice, setNotice] = useState('');
  const membership = platform.memberships.find((item) => item.profileId === auth.user?.id) || { tier: 'free' };
  const accountState = auth.userState;

  const handleCheckout = async (plan) => {
    if (!auth.isLoggedIn) {
      setNotice('请先登录后再发起支付。');
      return;
    }

    if (plan.id === 'free') {
      platform.actions.setMembershipTier(auth.user.id, 'free');
      setNotice('当前已切换为 Free。');
      return;
    }

    try {
      const session = await createStripeCheckoutSession({ priceId: plan.priceId, email: auth.user.email });
      platform.actions.setMembershipTier(auth.user.id, plan.id);
      setNotice(session.mode === 'mock' ? `Mock checkout: ${session.message}` : 'Checkout session created.');
    } catch (error) {
      setNotice(`支付初始化失败：${error.message}`);
    }
  };

  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>会员订阅</h1>
        <p className="small-text">支持 Free / Pro Monthly / Pro Yearly。Stripe 走 checkout session 结构，当前无后端时使用 mock 流程。</p>
        <p className="small-text">当前身份：{accountState} · 当前会员：{membership.tier}</p>
      </section>

      <section className="grid cards-3">
        {plans.map((plan) => (
          <article key={plan.id} className="pricing-card">
            <h3>{plan.title}</h3>
            <p className="price">{plan.price}</p>
            <p className="small-text">{plan.desc}</p>
            <ul>
              {plan.benefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button type="button" className="btn btn-primary" onClick={() => handleCheckout(plan)}>
              选择 {plan.title}
            </button>
          </article>
        ))}
      </section>

      <section className="panel">
        <h3>权益说明</h3>
        <p className="small-text">Pro 会员可观看完整剧集内容。Free 用户可看预告和试看分集。</p>
        {notice ? <p className="status ok">{notice}</p> : null}
      </section>
    </div>
  );
}
