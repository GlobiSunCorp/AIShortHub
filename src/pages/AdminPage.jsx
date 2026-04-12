import { useState } from 'react';
import { AccessGuidePanel } from '../components/AccessGuidePanel';
import { minLength } from '../lib/validation';

const orderStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];

export function AdminPage({ platform, auth }) {
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const pending = platform.series.filter((item) => item.status === 'pending_review');
  const published = platform.series.filter((item) => item.status === 'published');

  if (!auth.isLoggedIn) {
    return (
      <AccessGuidePanel
        currentRoleLabel="Guest"
        requiredRoleLabel="Admin"
        reason="管理台涉及审核与订单状态变更，需要 Admin 角色进行演示。"
        action={
          <button type="button" className="btn btn-primary" onClick={() => auth.switchDemoRole('admin')}>
            切换为 Admin
          </button>
        }
      />
    );
  }

  if (auth.userState !== 'admin') {
    return (
      <AccessGuidePanel
        currentRoleLabel={auth.userState}
        requiredRoleLabel="Admin"
        reason="当前角色无权审核内容或更新服务订单状态。"
        action={
          <button type="button" className="btn btn-primary" onClick={() => auth.switchDemoRole('admin')}>
            一键切换为 Admin
          </button>
        }
      />
    );
  }

  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>Admin Dashboard</h1>
        <p className="small-text">审核队列、服务订单状态更新、用户角色与内容状态管理。</p>
      </section>

      {feedback.message ? <section className="panel"><p className={`form-feedback ${feedback.type}`}>{feedback.message}</p></section> : null}

      <section className="grid cards-4">
        <article className="stat-card"><p className="small-text">待审核</p><h3>{pending.length}</h3></article>
        <article className="stat-card"><p className="small-text">已发布</p><h3>{published.length}</h3></article>
        <article className="stat-card"><p className="small-text">用户总数</p><h3>{platform.profiles.length}</h3></article>
        <article className="stat-card"><p className="small-text">服务订单</p><h3>{platform.serviceOrders.length}</h3></article>
      </section>

      <section className="panel">
        <h2>Review Queue</h2>
        <input className="input" placeholder="审核原因（reject 时必填）" value={reason} onChange={(e) => setReason(e.target.value)} />
        <div className="table-wrap">
          <table>
            <thead><tr><th>Series</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {pending.length ? (
                pending.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.status}</td>
                    <td>
                      <div className="row wrap">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => {
                            platform.actions.reviewSeries(item.id, 'approved', minLength(reason, 2) ? reason : 'Looks good');
                            setFeedback({ type: 'success', message: `《${item.title}》已通过审核。` });
                            setReason('');
                          }}
                        >
                          approve
                        </button>
                        <button
                          className="btn btn-ghost"
                          type="button"
                          onClick={() => {
                            if (!minLength(reason, 4)) {
                              setFeedback({ type: 'error', message: 'Reject 时请填写至少 4 个字符的审核原因。' });
                              return;
                            }
                            platform.actions.reviewSeries(item.id, 'rejected', reason);
                            setFeedback({ type: 'success', message: `《${item.title}》已驳回，原因已记录。` });
                            setReason('');
                          }}
                        >
                          reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="small-text">当前没有待审核内容。</td>
                </tr>
              )}
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
              {platform.serviceOrders.length ? (
                platform.serviceOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td><td>{order.serviceType}</td><td>{order.projectTitle}</td><td>{order.status}</td>
                    <td>
                      <select
                        className="input"
                        value={order.status}
                        onChange={(e) => {
                          platform.actions.updateServiceOrderStatus(order.id, e.target.value);
                          setFeedback({ type: 'success', message: `订单 ${order.id} 状态更新为 ${e.target.value}。` });
                        }}
                      >
                        {orderStatuses.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="small-text">暂无服务订单，等待用户提交。</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
