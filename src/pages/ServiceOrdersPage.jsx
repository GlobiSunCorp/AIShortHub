import { useState } from 'react';

const serviceTypes = ['Trailer Editing', 'Cover Design', 'Listing Packaging', 'TikTok Promo Pack', 'Subtitle / Localization'];

export function ServiceOrdersPage({ auth, platform }) {
  const [form, setForm] = useState({ serviceType: serviceTypes[0], seriesTitle: '', requirement: '', budgetRange: '$200-$500', contact: '' });

  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>Service Orders</h1>
        <p className="small-text">用户或创作者可提交包装服务需求。</p>
      </section>

      <section className="panel form-grid">
        <select className="input" value={form.serviceType} onChange={(e) => setForm((p) => ({ ...p, serviceType: e.target.value }))}>
          {serviceTypes.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <input className="input" placeholder="作品名" value={form.seriesTitle} onChange={(e) => setForm((p) => ({ ...p, seriesTitle: e.target.value }))} />
        <textarea className="input" placeholder="需求描述" value={form.requirement} onChange={(e) => setForm((p) => ({ ...p, requirement: e.target.value }))} />
        <input className="input" placeholder="预算区间" value={form.budgetRange} onChange={(e) => setForm((p) => ({ ...p, budgetRange: e.target.value }))} />
        <input className="input" placeholder="联系方式" value={form.contact} onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))} />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (!form.seriesTitle) return;
            platform.actions.createServiceOrder({ ...form, requesterId: auth.user?.id || 'guest' });
            setForm({ serviceType: serviceTypes[0], seriesTitle: '', requirement: '', budgetRange: '$200-$500', contact: '' });
          }}
        >
          提交需求
        </button>
      </section>

      <section className="panel table-wrap">
        <table>
          <thead><tr><th>ID</th><th>服务类型</th><th>作品名</th><th>预算</th><th>联系方式</th><th>状态</th></tr></thead>
          <tbody>
            {platform.serviceOrders.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td><td>{item.serviceType}</td><td>{item.seriesTitle}</td><td>{item.budgetRange}</td><td>{item.contact}</td><td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
