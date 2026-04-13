import { useMemo, useState } from 'react';
import { Link, useRouter } from '../lib/router';
import { isValidEmail, minLength } from '../lib/validation';
import { ADD_ON_SERVICES, REFUND_POLICY_CONFIG, getCreatorPlan, getServiceEntitlement } from '../data/monetization';
import { resolveMembership } from '../hooks/usePlanAccess';
import { startAddonCheckout } from '../lib/services/billingService';

export function ServiceOrdersPage({ auth, platform }) {
  const { navigate } = useRouter();
  const membership = resolveMembership(auth, platform);
  const creatorPlanId = membership.creatorPlan || 'creator_basic';
  const [selectedServiceId, setSelectedServiceId] = useState(ADD_ON_SERVICES[0].id);
  const [form, setForm] = useState({ projectTitle: '', requestDetails: '', budget: '$200-$500', contact: auth.user?.email || '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const selectedService = useMemo(() => ADD_ON_SERVICES.find((item) => item.id === selectedServiceId) || ADD_ON_SERVICES[0], [selectedServiceId]);
  const entitlement = getServiceEntitlement(selectedService, creatorPlanId);

  const validate = () => {
    const next = {};
    if (!minLength(form.projectTitle, 3)) next.projectTitle = '项目标题至少 3 个字符。';
    if (!minLength(form.requestDetails, 12)) next.requestDetails = '需求描述至少 12 个字符。';
    if (!isValidEmail(form.contact)) next.contact = '请填写合法邮箱作为联系方式。';
    if (!minLength(form.budget, 2)) next.budget = '预算为必填项。';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>Creator Services Center</h1>
        <p className="small-text">选择 Add-on Services，查看当前 Creator Plan 的 Included / Discounted 权益，然后提交服务订单。</p>
        <p className="small-text">退款策略：{REFUND_POLICY_CONFIG.addon.short} <Link className="text-link" to="/refund">查看规则 →</Link></p>
      </section>

      <section className="grid cards-3">
        {ADD_ON_SERVICES.map((item) => (
          <article key={item.id} className={`pricing-card ${selectedServiceId === item.id ? 'active-card' : ''}`}>
            <h3>{item.name}</h3>
            <p className="small-text">{item.description}</p>
            <p className="price">{item.price}</p>
            <p className="small-text">{getServiceEntitlement(item, creatorPlanId)} · {item.includedIn.length ? `Included in ${item.includedIn.join(', ')}` : 'Not included in base plans'}</p>
            <button className="btn btn-ghost" type="button" onClick={() => setSelectedServiceId(item.id)}>选择此服务</button>
          </article>
        ))}
      </section>

      <section className="panel form-grid">
        <h2>服务需求表单</h2>
        <p className="small-text">Selected Service: {selectedService.name} · Current Creator Plan: {getCreatorPlan(creatorPlanId).name} · Entitlement: {entitlement}</p>
        <label>project title
          <input className="input" value={form.projectTitle} onChange={(e) => setForm((p) => ({ ...p, projectTitle: e.target.value }))} />
          {errors.projectTitle ? <span className="form-feedback error">{errors.projectTitle}</span> : null}
        </label>
        <label>request details
          <textarea className="input" value={form.requestDetails} onChange={(e) => setForm((p) => ({ ...p, requestDetails: e.target.value }))} />
          {errors.requestDetails ? <span className="form-feedback error">{errors.requestDetails}</span> : null}
        </label>
        <label>budget
          <input className="input" value={form.budget} onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))} />
          {errors.budget ? <span className="form-feedback error">{errors.budget}</span> : null}
        </label>
        <label>contact email
          <input className="input" value={form.contact} onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))} />
          {errors.contact ? <span className="form-feedback error">{errors.contact}</span> : null}
        </label>
        <button
          type="button"
          className="btn btn-primary"
          disabled={isSubmitting}
          onClick={async () => {
            if (!validate()) {
              setFeedback({ type: 'error', message: '提交失败，请修正错误后重试。' });
              return;
            }
            setIsSubmitting(true);
            setFeedback({ type: '', message: '' });
            try {
              const created = await platform.actions.createServiceOrder({
                requesterId: auth.user?.id || 'guest',
                serviceType: selectedService.name,
                projectTitle: form.projectTitle,
                requestDetails: form.requestDetails,
                budget: form.budget,
                contact: form.contact,
                entitlement,
                addOnPrice: entitlement === 'Included' ? '$0' : selectedService.price,
                nextStep: entitlement === 'Included' ? '服务团队将在 24h 内回传项目排期。' : '请完成支付后进入服务排期。',
                status: entitlement === 'Included' ? 'pending' : 'pending_payment',
              });
              if (entitlement !== 'Included' && auth.isLoggedIn) {
                const session = await startAddonCheckout({ service: selectedService, user: auth.user, orderId: created.id });
                if (session.url) {
                  window.location.href = session.url;
                  return;
                }
              }
              setFeedback({ type: 'success', message: `服务下单成功，订单号 ${created.id}` });
              navigate(`/services/${created.id}`);
            } catch (error) {
              setFeedback({ type: 'error', message: `下单失败：${error.message}` });
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {isSubmitting ? '提交中...' : '提交服务订单'}
        </button>
        {feedback.message ? <p className={`form-feedback ${feedback.type}`}>{feedback.message}</p> : null}
      </section>
    </div>
  );
}
