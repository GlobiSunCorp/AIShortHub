import { useState } from 'react';

const orderStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];

export function AdminPage({ platform, auth }) {
  const [reason, setReason] = useState('');
  const pending = platform.series.filter((item) => item.status === 'pending_review');
  const published = platform.series.filter((item) => item.status === 'published');

  if (!auth.isLoggedIn) return <section className="panel">请先登录管理员账号。</section>;
  if (auth.userState !== 'admin') return <section className="panel">仅 admin 可访问审核与订单状态管理。</section>;

  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>Admin Dashboard</h1>
        <p className="small-text">审核队列、服务订单状态更新、用户角色与内容状态管理。</p>
      </section>

      <section className="grid cards-4">
        <article className="stat-card"><p className="small-text">待审核</p><h3>{pending.length}</h3></article>
        <article className="stat-card"><p className="small-text">已发布</p><h3>{published.length}</h3></article>
        <article className="stat-card"><p className="small-text">用户总数</p><h3>{platform.profiles.length}</h3></article>
        <article className="stat-card"><p className="small-text">服务订单</p><h3>{platform.serviceOrders.length}</h3></article>
      </section>

      <section className="panel">
        <h2>Review Queue</h2>
        <input className="input" placeholder="审核原因" value={reason} onChange={(e) => setReason(e.target.value)} />
        <div className="table-wrap">
          <table>
            <thead><tr><th>Series</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {pending.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.status}</td>
                  <td>
                    <div className="row wrap">
                      <button className="btn btn-primary" type="button" onClick={() => platform.actions.reviewSeries(item.id, 'approved', reason || 'Looks good')}>
                        approve
                      </button>
                      <button className="btn btn-ghost" type="button" onClick={() => platform.actions.reviewSeries(item.id, 'rejected', reason || 'Need revision')}>
                        reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>服务订单管理</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Type</th><th>Project</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {platform.serviceOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td><td>{order.serviceType}</td><td>{order.projectTitle}</td><td>{order.status}</td>
                  <td>
                    <select className="input" value={order.status} onChange={(e) => platform.actions.updateServiceOrderStatus(order.id, e.target.value)}>
                      {orderStatuses.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
