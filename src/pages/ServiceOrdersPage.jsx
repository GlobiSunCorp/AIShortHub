import { useState } from 'react';
import { useRouter } from '../lib/router';
import { isValidEmail, minLength } from '../lib/validation';

const serviceTypes = ['Trailer Editing', 'Cover Design', 'Listing Packaging', 'TikTok Promo Pack', 'Subtitle / Localization'];

export function ServiceOrdersPage({ auth, platform }) {
  const { navigate } = useRouter();
  const [form, setForm] = useState({ serviceType: serviceTypes[0], projectTitle: '', requestDetails: '', budget: '$200-$500', contact: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

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
        <h1>Services</h1>
        <p className="small-text">提交服务订单后会进入 Admin 队列，可持续更新状态。</p>
      </section>

      {feedback.message ? <section className="panel"><p className={`form-feedback ${feedback.type}`}>{feedback.message}</p></section> : null}

      <section className="panel form-grid">
        <label>
          service type
          <select className="input" value={form.serviceType} onChange={(e) => setForm((p) => ({ ...p, serviceType: e.target.value }))}>
            {serviceTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          project title
          <input className="input" placeholder="项目标题" value={form.projectTitle} onChange={(e) => setForm((p) => ({ ...p, projectTitle: e.target.value }))} />
          {errors.projectTitle ? <span className="form-feedback error">{errors.projectTitle}</span> : null}
        </label>
        <label>
          request details
          <textarea className="input" placeholder="需求描述" value={form.requestDetails} onChange={(e) => setForm((p) => ({ ...p, requestDetails: e.target.value }))} />
          {errors.requestDetails ? <span className="form-feedback error">{errors.requestDetails}</span> : null}
        </label>
        <label>
          budget
          <input className="input" placeholder="预算" value={form.budget} onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))} />
          {errors.budget ? <span className="form-feedback error">{errors.budget}</span> : null}
        </label>
        <label>
          contact email
          <input className="input" placeholder="联系方式邮箱" value={form.contact} onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))} />
          {errors.contact ? <span className="form-feedback error">{errors.contact}</span> : null}
        </label>
        <button
          type="button"
          className="btn btn-primary"
          disabled={isSubmitting}
          onClick={() => {
            if (!validate()) {
              setFeedback({ type: 'error', message: '提交失败，请修正错误后重试。' });
              return;
            }

            setIsSubmitting(true);
            const created = platform.actions.createServiceOrder({ ...form, requesterId: auth.user?.id || 'guest' });
            setForm({ serviceType: serviceTypes[0], projectTitle: '', requestDetails: '', budget: '$200-$500', contact: '' });
            setErrors({});
            setFeedback({ type: 'success', message: `提交成功，订单号 ${created.id}。` });
            setIsSubmitting(false);
            navigate(`/services/${created.id}`);
          }}
        >
          {isSubmitting ? '提交中...' : '提交需求'}
        </button>
      </section>

      <section className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>service type</th>
              <th>project title</th>
              <th>budget</th>
              <th>contact</th>
              <th>status</th>
            </tr>
          </thead>
          <tbody>
            {platform.serviceOrders.length ? (
              platform.serviceOrders.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.serviceType}</td>
                  <td>{item.projectTitle}</td>
                  <td>{item.budget}</td>
                  <td>{item.contact}</td>
                  <td>{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="small-text">还没有服务订单，先提交一个需求试试看。</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
