import { useState } from 'react';

const serviceTypes = ['Trailer Editing', 'Cover Design', 'Listing Packaging', 'TikTok Promo Pack', 'Subtitle / Localization'];

export function ServiceOrdersPage({ auth, platform }) {
  const [form, setForm] = useState({ serviceType: serviceTypes[0], projectTitle: '', requestDetails: '', budget: '$200-$500', contact: '' });

  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>Services</h1>
        <p className="small-text">提交服务订单后会进入 Admin 队列，可持续更新状态。</p>
      </section>

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
        </label>
        <label>
          request details
          <textarea className="input" placeholder="需求描述" value={form.requestDetails} onChange={(e) => setForm((p) => ({ ...p, requestDetails: e.target.value }))} />
        </label>
        <label>
          budget
          <input className="input" placeholder="预算" value={form.budget} onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))} />
        </label>
        <label>
          contact
          <input className="input" placeholder="联系方式" value={form.contact} onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))} />
        </label>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (!form.projectTitle || !form.requestDetails || !form.contact) return;
            platform.actions.createServiceOrder({ ...form, requesterId: auth.user?.id || 'guest' });
            setForm({ serviceType: serviceTypes[0], projectTitle: '', requestDetails: '', budget: '$200-$500', contact: '' });
          }}
        >
          提交需求
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
            {platform.serviceOrders.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.serviceType}</td>
                <td>{item.projectTitle}</td>
                <td>{item.budget}</td>
                <td>{item.contact}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
