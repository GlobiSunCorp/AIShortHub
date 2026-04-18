import { useMemo, useState } from 'react';
import { AccessGuidePanel } from '../components/AccessGuidePanel';
import { minLength } from '../lib/validation';
import { DarkSelect } from '../components/DarkSelect';
import { OnboardingGuide } from '../components/OnboardingGuide';
import { getOperatorDashboardSnapshot } from '../lib/selectors/getOperatorDashboardSnapshot';
import { formatUsd } from '../data/monetization';

const orderStatuses = ['pending', 'in_progress', 'pending_payment', 'completed', 'cancelled'];
const reviewStatuses = ['draft', 'pending_review', 'published', 'rejected'];

export function AdminPage({ platform, auth }) {
  const [reviewNote, setReviewNote] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const dashboard = useMemo(() => getOperatorDashboardSnapshot(platform), [platform]);
  const filteredSeries = useMemo(
    () => (platform.series || []).filter((item) => (filterStatus === 'all' ? true : item.status === filterStatus)),
    [platform.series, filterStatus]
  );

  if (!auth.isLoggedIn) return <AccessGuidePanel currentRoleLabel="Guest" requiredRoleLabel="Admin" reason="管理台需要 Admin 角色。" action={<button type="button" className="btn btn-primary" onClick={() => auth.switchDemoRole('admin')}>切换为 Admin</button>} />;
  if (auth.userState !== 'admin') return <AccessGuidePanel currentRoleLabel={auth.userState} requiredRoleLabel="Admin" reason="当前角色无权审核内容或更新服务订单状态。" action={<button type="button" className="btn btn-primary" onClick={() => auth.switchDemoRole('admin')}>一键切换为 Admin</button>} />;

  return (
    <div className="stack-lg">
      <OnboardingGuide role="admin" />
      <section className="panel">
        <h1>Operator Overview</h1>
        <p className="small-text">Solo founder operating console: monitor users, creator plans, review queue, billing issues, payout risks, and launch readiness in one place.</p>
      </section>
      {feedback.message ? <section className="panel"><p className={`form-feedback ${feedback.type}`}>{feedback.message}</p></section> : null}

      <section className="grid cards-4">
        <article className="stat-card"><p className="small-text">Total users</p><h3>{dashboard.totals.users}</h3></article>
        <article className="stat-card"><p className="small-text">Total creators</p><h3>{dashboard.totals.creators}</h3></article>
        <article className="stat-card"><p className="small-text">Active viewer subscriptions</p><h3>{dashboard.totals.activeViewerSubscriptions}</h3></article>
        <article className="stat-card"><p className="small-text">Active creator plans</p><h3>{dashboard.totals.activeCreatorPlans}</h3></article>
        <article className="stat-card"><p className="small-text">Published series</p><h3>{dashboard.totals.publishedSeries}</h3></article>
        <article className="stat-card"><p className="small-text">Pending review</p><h3>{dashboard.totals.pendingReview}</h3></article>
        <article className="stat-card"><p className="small-text">Flagged/report count</p><h3>{dashboard.totals.flagged}</h3></article>
        <article className="stat-card"><p className="small-text">Service orders pending</p><h3>{dashboard.totals.serviceOrdersPending}</h3></article>
        <article className="stat-card"><p className="small-text">Payment issues</p><h3>{dashboard.totals.paymentIssues}</h3></article>
        <article className="stat-card"><p className="small-text">Pending payouts</p><h3>{dashboard.totals.pendingPayouts}</h3></article>
      </section>

      <section className="grid cards-3">
        <article className="mini-card"><h3>Needs attention</h3><p className="small-text">{dashboard.cards.needsAttention} items need follow-up.</p></article>
        <article className="mini-card"><h3>Awaiting review</h3><p className="small-text">{dashboard.cards.awaitingReview.map((item) => item.title).join(' · ') || 'No series waiting.'}</p></article>
        <article className="mini-card"><h3>Support / policy inbox summary</h3><p className="small-text">{dashboard.cards.supportInboxSummary} open support/order items.</p></article>
        <article className="mini-card"><h3>Revenue this cycle</h3><p className="small-text">{formatUsd(dashboard.cards.revenueThisCycle)}</p></article>
        <article className="mini-card"><h3>Top performing series</h3><p className="small-text">{dashboard.cards.topSeries.map((item) => item.title).join(' · ') || 'Waiting for published performance data.'}</p></article>
        <article className="mini-card"><h3>Creators near quota</h3><p className="small-text">{dashboard.cards.creatorsNearQuota.map((item) => item.studioName).join(' · ') || 'No alert yet.'}</p></article>
      </section>

      <section className="panel stack-md">
        <h2>Launch Readiness</h2>
        <div className="grid cards-3">
          {dashboard.launchReadiness.map((item) => <article key={item.key} className="mini-card"><p className="small-text">{item.label}: <strong>{item.ready ? 'Yes' : 'No'}</strong></p></article>)}
        </div>
      </section>

      <section className="panel stack-md">
        <h2>Recent activity feed</h2>
        <div className="grid cards-2">
          {dashboard.recentActivity.length ? dashboard.recentActivity.map((item, idx) => <article key={`${item.id || item.seriesId || idx}-${idx}`} className="mini-card"><p className="small-text">{item.createdAt || item.updatedAt || '-'} · {item.decision || item.status || 'updated'} · {item.reason || item.projectTitle || item.id}</p></article>) : <article className="mini-card"><p className="small-text">No activity yet.</p></article>}
        </div>
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
        <input className="input" placeholder="订单状态备注" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
        <div className="table-wrap"><table><thead><tr><th>ID</th><th>Type</th><th>Project</th><th>Status</th><th>Updated</th><th>Update</th></tr></thead><tbody>
          {platform.serviceOrders.length ? platform.serviceOrders.map((order) => (
            <tr key={order.id}><td>{order.id}</td><td>{order.serviceType || '-'}</td><td>{order.projectTitle || '-'}</td><td>{order.status}</td><td>{order.updatedAt || '-'}</td><td>
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
