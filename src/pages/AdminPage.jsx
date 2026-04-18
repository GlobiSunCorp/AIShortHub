import { useMemo, useState } from 'react';
import { AccessGuidePanel } from '../components/AccessGuidePanel';
import { minLength } from '../lib/validation';
import { DarkSelect } from '../components/DarkSelect';
import { OnboardingGuide } from '../components/OnboardingGuide';

const orderStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
const reviewStatuses = ['draft', 'pending_review', 'published', 'rejected'];
const launchChecklist = [
  'Custom domain setup',
  'Production env vars setup',
  'Supabase production checklist',
  'Stripe production checklist',
  'Support email / pilot contact mode',
  'Terms / Privacy / Refund / Content Policy review',
  'First content batch readiness',
  'Payment and checkout testing',
  'Creator upload testing',
  'Soft launch rehearsal',
];

export function AdminPage({ platform, auth }) {
  const [reviewNote, setReviewNote] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const pending = platform.series.filter((item) => item.status === 'pending_review');
  const filteredSeries = useMemo(
    () => platform.series.filter((item) => (filterStatus === 'all' ? true : item.status === filterStatus)),
    [platform.series, filterStatus]
  );

  if (!auth.isLoggedIn) return <AccessGuidePanel currentRoleLabel="Guest" requiredRoleLabel="Admin" reason="管理台需要 Admin 角色。" action={<button type="button" className="btn btn-primary" onClick={() => auth.switchDemoRole('admin')}>切换为 Admin</button>} />;
  if (auth.userState !== 'admin') return <AccessGuidePanel currentRoleLabel={auth.userState} requiredRoleLabel="Admin" reason="当前角色无权审核内容或更新服务订单状态。" action={<button type="button" className="btn btn-primary" onClick={() => auth.switchDemoRole('admin')}>一键切换为 Admin</button>} />;

  return (
    <div className="stack-lg">
      <OnboardingGuide role="admin" />
      <section className="panel">
        <h1>Admin Review Workbench</h1>
        <p className="small-text">状态流：draft → pending_review → approved/published 或 rejected。预留 report_count / flagged 字段用于下一轮举报审核。</p>
      </section>
      {feedback.message ? <section className="panel"><p className={`form-feedback ${feedback.type}`}>{feedback.message}</p></section> : null}

      <section className="panel stack-md">
        <h2>Production Readiness (Read-only)</h2>
        <p className="small-text">详细版本见 docs/LAUNCH_CHECKLIST.md。此处用于运营巡检时快速核对。</p>
        <div className="grid cards-2">
          {launchChecklist.map((item) => <article key={item} className="mini-card"><p className="small-text">□ {item}</p></article>)}
        </div>
      </section>

      <section className="grid cards-4">
        <article className="stat-card"><p className="small-text">Draft</p><h3>{platform.series.filter((s) => s.status === 'draft').length}</h3></article>
        <article className="stat-card"><p className="small-text">Pending</p><h3>{pending.length}</h3></article>
        <article className="stat-card"><p className="small-text">Published</p><h3>{platform.series.filter((s) => s.status === 'published').length}</h3></article>
        <article className="stat-card"><p className="small-text">Rejected</p><h3>{platform.series.filter((s) => s.status === 'rejected').length}</h3></article>
      </section>

      <section className="panel">
        <h2>Review Queue</h2>
        <div className="row wrap">
          <DarkSelect
            id="admin-review-filter"
            value={filterStatus}
            onChange={setFilterStatus}
            options={[{ value: 'all', label: 'All status' }, ...reviewStatuses.map((s) => ({ value: s, label: s }))]}
          />
          <input className="input" placeholder="审核备注（reject 必填）" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} />
        </div>
        <div className="table-wrap"><table><thead><tr><th>Series</th><th>Status</th><th>Report</th><th>Flagged</th><th>Action</th></tr></thead><tbody>
          {filteredSeries.length ? filteredSeries.map((item) => (
            <tr key={item.id}><td>{item.title}</td><td>{item.status}</td><td>{item.report_count || 0}</td><td>{item.flagged ? 'Yes' : 'No'}</td><td><div className="row wrap">
              <button className="btn btn-primary" type="button" onClick={async () => { await platform.actions.reviewSeries(item.id, 'approved', minLength(reviewNote, 2) ? reviewNote : 'Approved by admin'); setFeedback({ type: 'success', message: `《${item.title}》已通过审核。` }); setReviewNote(''); }}>approve</button>
              <button className="btn btn-ghost" type="button" onClick={async () => { if (!minLength(reviewNote, 4)) return setFeedback({ type: 'error', message: 'Reject 时请填写至少 4 个字符的审核备注。' }); await platform.actions.reviewSeries(item.id, 'rejected', reviewNote); setFeedback({ type: 'success', message: `《${item.title}》已驳回。` }); setReviewNote(''); }}>reject</button>
            </div></td></tr>
          )) : <tr><td colSpan={5} className="small-text">暂无内容，可等待 Creator 提交或调整筛选条件。</td></tr>}
        </tbody></table></div>
      </section>

      <section className="panel">
        <h2>服务订单管理</h2>
        <p className="small-text">状态更新记录会携带更新时间与备注占位（便于后续 SLA/审计）。</p>
        <input className="input" placeholder="订单状态备注" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
        <div className="table-wrap"><table><thead><tr><th>ID</th><th>Type</th><th>Project</th><th>Status</th><th>Updated</th><th>Update</th></tr></thead><tbody>
          {platform.serviceOrders.length ? platform.serviceOrders.map((order) => (
            <tr key={order.id}><td>{order.id}</td><td>{order.serviceType}</td><td>{order.projectTitle}</td><td>{order.status}</td><td>{order.updated_at || order.updatedAt || '-'}</td><td>
              <DarkSelect
                id={`admin-order-status-${order.id}`}
                value={order.status}
                onChange={async (next) => { await platform.actions.updateServiceOrderStatus(order.id, next, orderNote); setFeedback({ type: 'success', message: `订单 ${order.id} 状态更新为 ${next}。` }); }}
                options={orderStatuses.map((s) => ({ value: s, label: s }))}
              />
            </td></tr>
          )) : <tr><td colSpan={6} className="small-text">暂无服务订单，等待用户提交。</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}
