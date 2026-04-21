import { useMemo, useState } from 'react';
import { AccessGuidePanel } from '../components/AccessGuidePanel';
import { minLength } from '../lib/validation';
import { DarkSelect } from '../components/DarkSelect';
import { OnboardingGuide } from '../components/OnboardingGuide';
import { Link } from '../lib/router';
import { getOperatorDashboardSnapshot } from '../lib/selectors/getOperatorDashboardSnapshot';
import { formatUsd } from '../data/monetization';

const orderStatuses = ['pending', 'in_progress', 'pending_payment', 'completed', 'cancelled'];
const reviewStatuses = ['draft', 'pending_review', 'published', 'rejected'];

export function AdminPage({ platform, auth }) {
  const [reviewNote, setReviewNote] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [heroDraft, setHeroDraft] = useState(() => ({
    featuredSeriesId: platform?.platformConfig?.homeHero?.featuredSeriesId || 'hidden-return',
    kicker: platform?.platformConfig?.homeHero?.kicker || 'Featured launch title',
    eyebrow: platform?.platformConfig?.homeHero?.eyebrow || 'Viewer-first landing',
    title: platform?.platformConfig?.homeHero?.title || 'Her Hidden Return',
    synopsis: platform?.platformConfig?.homeHero?.synopsis || '',
    posterUrl: platform?.platformConfig?.homeHero?.posterUrl || '',
    primaryCtaLabel: platform?.platformConfig?.homeHero?.primaryCtaLabel || 'Watch trailer',
    secondaryCtaLabel: platform?.platformConfig?.homeHero?.secondaryCtaLabel || 'Browse titles',
    creatorCtaLabel: platform?.platformConfig?.homeHero?.creatorCtaLabel || 'For creators',
  }));

  const dashboard = useMemo(() => getOperatorDashboardSnapshot(platform), [platform]);
  const filteredSeries = useMemo(() => (platform.series || []).filter((item) => (filterStatus === 'all' ? true : item.status === filterStatus)), [platform.series, filterStatus]);
  const publicSeriesOptions = useMemo(
    () => (platform.series || [])
      .filter((item) => item.visibility === 'public' || item.status === 'published')
      .map((item) => ({ value: item.id, label: item.title })),
    [platform.series],
  );

  if (!auth.isLoggedIn) return <AccessGuidePanel currentRoleLabel="Guest" requiredRoleLabel="Admin" reason="Admin workspace requires login." action={<button type="button" className="btn btn-primary" onClick={() => auth.switchDemoRole('admin')}>Switch to Admin</button>} />;
  if (auth.userState !== 'admin') return <AccessGuidePanel currentRoleLabel={auth.userState} requiredRoleLabel="Admin" reason="Only admin can moderate content and service orders." action={<button type="button" className="btn btn-primary" onClick={() => auth.switchDemoRole('admin')}>Switch to Admin</button>} />;

  const readinessReady = dashboard.launchReadiness.filter((item) => item.ready);
  const readinessPending = dashboard.launchReadiness.filter((item) => !item.ready);

  const saveHomepageHero = () => {
    if (!minLength(heroDraft.title, 2)) {
      setFeedback({ type: 'error', message: 'Homepage hero title needs at least 2 characters.' });
      return;
    }
    if (!minLength(heroDraft.synopsis, 12)) {
      setFeedback({ type: 'error', message: 'Homepage hero synopsis should be more descriptive.' });
      return;
    }
    platform.actions.updatePlatformConfig({ homeHero: heroDraft });
    setFeedback({ type: 'success', message: 'Homepage hero updated. Refresh Home to verify the new poster and copy.' });
  };

  const resetHomepageHero = () => {
    platform.actions.resetPlatformConfig();
    const defaults = platform.platformConfig?.homeHero || {};
    setHeroDraft({
      featuredSeriesId: defaults.featuredSeriesId || 'hidden-return',
      kicker: defaults.kicker || 'Featured launch title',
      eyebrow: defaults.eyebrow || 'Viewer-first landing',
      title: defaults.title || 'Her Hidden Return',
      synopsis: defaults.synopsis || '',
      posterUrl: defaults.posterUrl || '',
      primaryCtaLabel: defaults.primaryCtaLabel || 'Watch trailer',
      secondaryCtaLabel: defaults.secondaryCtaLabel || 'Browse titles',
      creatorCtaLabel: defaults.creatorCtaLabel || 'For creators',
    });
    setFeedback({ type: 'success', message: 'Homepage hero reset to default config.' });
  };

  return (
    <div className="ds-page">
      <OnboardingGuide role="admin" />
      <section className="panel ds-section">
        <h1 className="ds-h1">Founder / Operator Console</h1>
        <p className="ds-meta">Run launch readiness, moderation, billing checks, support follow-up, and homepage merchandising from one workspace.</p>
      </section>
      {feedback.message ? <section className="panel"><p className={`form-feedback ${feedback.type}`}>{feedback.message}</p></section> : null}

      <section className="grid cards-4">
        <article className="card-data"><p className="ds-caption">Total users</p><p className="stat-value">{dashboard.totals.users}</p></article>
        <article className="card-data"><p className="ds-caption">Total creators</p><p className="stat-value">{dashboard.totals.creators}</p></article>
        <article className="card-data"><p className="ds-caption">Pending review</p><p className="stat-value">{dashboard.totals.pendingReview}</p></article>
        <article className="card-data"><p className="ds-caption">Pending payouts</p><p className="stat-value">{dashboard.totals.pendingPayouts}</p></article>
      </section>

      <section className="panel ds-section stack-md">
        <div className="section-title">
          <div>
            <h2 className="ds-h2">Homepage Hero Control</h2>
            <p className="ds-meta">This is step one of making the homepage editable in Admin instead of hard-coding every launch change.</p>
          </div>
          <Link className="info-link" to="/">Open Home preview</Link>
        </div>
        <div className="grid cards-2">
          <article className="mini-card stack-md">
            <h3 className="ds-h3">Content binding</h3>
            <DarkSelect
              id="homepage-hero-series"
              value={heroDraft.featuredSeriesId}
              onChange={(value) => {
                const matched = (platform.series || []).find((item) => item.id === value);
                setHeroDraft((prev) => ({
                  ...prev,
                  featuredSeriesId: value,
                  title: matched?.title || prev.title,
                  synopsis: matched?.synopsis || prev.synopsis,
                }));
              }}
              options={publicSeriesOptions.length ? publicSeriesOptions : [{ value: 'hidden-return', label: 'Her Hidden Return' }]}
            />
            <input className="input" placeholder="Hero poster URL override" value={heroDraft.posterUrl} onChange={(e) => setHeroDraft((prev) => ({ ...prev, posterUrl: e.target.value }))} />
            <input className="input" placeholder="Top kicker" value={heroDraft.kicker} onChange={(e) => setHeroDraft((prev) => ({ ...prev, kicker: e.target.value }))} />
            <input className="input" placeholder="Eyebrow" value={heroDraft.eyebrow} onChange={(e) => setHeroDraft((prev) => ({ ...prev, eyebrow: e.target.value }))} />
          </article>
          <article className="mini-card stack-md">
            <h3 className="ds-h3">Copy + CTA</h3>
            <input className="input" placeholder="Hero title" value={heroDraft.title} onChange={(e) => setHeroDraft((prev) => ({ ...prev, title: e.target.value }))} />
            <textarea className="input" placeholder="Hero synopsis" value={heroDraft.synopsis} onChange={(e) => setHeroDraft((prev) => ({ ...prev, synopsis: e.target.value }))} />
            <input className="input" placeholder="Primary CTA label" value={heroDraft.primaryCtaLabel} onChange={(e) => setHeroDraft((prev) => ({ ...prev, primaryCtaLabel: e.target.value }))} />
            <input className="input" placeholder="Secondary CTA label" value={heroDraft.secondaryCtaLabel} onChange={(e) => setHeroDraft((prev) => ({ ...prev, secondaryCtaLabel: e.target.value }))} />
            <input className="input" placeholder="Creator CTA label" value={heroDraft.creatorCtaLabel} onChange={(e) => setHeroDraft((prev) => ({ ...prev, creatorCtaLabel: e.target.value }))} />
          </article>
        </div>
        <div className="row wrap">
          <button className="btn btn-primary" type="button" onClick={saveHomepageHero}>Save Homepage Hero</button>
          <button className="btn btn-ghost" type="button" onClick={resetHomepageHero}>Reset to defaults</button>
        </div>
      </section>

      <section className="grid cards-2">
        <article className="card-action ds-section">
          <h2 className="ds-h2">Founder Quick Actions</h2>
          <div className="grid">
            <Link className="btn btn-ghost" to="/creator">Upload first content</Link>
            <button className="btn btn-ghost" type="button" onClick={() => setFilterStatus('pending_review')}>Review pending series</button>
            <Link className="btn btn-ghost" to="/pricing">Check payment flow and billing logic</Link>
            <Link className="btn btn-ghost" to="/services">Open support and service page</Link>
            <Link className="btn btn-ghost" to="/creator">Test creator workflow</Link>
            <Link className="btn btn-ghost" to="/services/orders">Inspect latest creator uploads/orders</Link>
            <Link className="btn btn-ghost" to="/faq">Review launch FAQ</Link>
          </div>
        </article>
        <article className="card-status ds-section">
          <h2 className="ds-h2">Launch Readiness</h2>
          <p className="ds-meta">Ready now: {readinessReady.length}/{dashboard.launchReadiness.length}</p>
          {readinessReady.map((item) => <p key={item.key} className="ds-caption">✅ {item.label}</p>)}
          {readinessPending.length ? readinessPending.map((item) => <p key={item.key} className="ds-caption">🟡 Setup needed: {item.label}</p>) : <p className="ds-caption">No blocking setup left.</p>}
          <p className="ds-caption">Before public launch, confirm billing, creator upload, moderation queue, support entry points, and homepage merchandising are live.</p>
        </article>
      </section>

      <section className="grid cards-3">
        <article className="card-secondary"><h3 className="ds-h3">Needs attention</h3><p className="ds-meta">{dashboard.cards.needsAttention} items need follow-up.</p></article>
        <article className="card-secondary"><h3 className="ds-h3">Revenue this cycle</h3><p className="ds-meta">{formatUsd(dashboard.cards.revenueThisCycle)}</p></article>
        <article className="card-secondary"><h3 className="ds-h3">Creators near quota</h3><p className="ds-meta">{dashboard.cards.creatorsNearQuota.map((item) => item.studioName).join(' · ') || 'No alert yet.'}</p></article>
      </section>

      <section className="panel ds-section">
        <h2 className="ds-h2">Review Queue</h2>
        <div className="row wrap">
          <DarkSelect id="admin-review-filter" value={filterStatus} onChange={setFilterStatus} options={[{ value: 'all', label: 'All status' }, ...reviewStatuses.map((s) => ({ value: s, label: s }))]} />
          <input className="input" placeholder="Review note (required for reject)" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} />
        </div>
        <div className="table-wrap"><table><thead><tr><th>Series</th><th>Status</th><th>Report</th><th>Flagged</th><th>Action</th></tr></thead><tbody>
          {filteredSeries.length ? filteredSeries.map((item) => (
            <tr key={item.id}><td>{item.title}</td><td>{item.status}</td><td>{item.report_count || 0}</td><td>{item.flagged ? 'Yes' : 'No'}</td><td><div className="row wrap">
              <button className="btn btn-primary" type="button" onClick={async () => { await platform.actions.reviewSeries(item.id, 'approved', minLength(reviewNote, 2) ? reviewNote : 'Approved by admin'); setFeedback({ type: 'success', message: `${item.title} approved.` }); setReviewNote(''); }}>Approve</button>
              <button className="btn btn-ghost" type="button" onClick={async () => { if (!minLength(reviewNote, 4)) return setFeedback({ type: 'error', message: 'Please add a clear reject note (at least 4 chars).' }); await platform.actions.reviewSeries(item.id, 'rejected', reviewNote); setFeedback({ type: 'success', message: `${item.title} rejected.` }); setReviewNote(''); }}>Reject</button>
            </div></td></tr>
          )) : <tr><td colSpan={5} className="small-text">No content in this filter yet.</td></tr>}
        </tbody></table></div>
      </section>

      <section className="panel ds-section">
        <h2 className="ds-h2">Service Orders</h2>
        <input className="input" placeholder="Order status note" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
        <div className="table-wrap"><table><thead><tr><th>ID</th><th>Type</th><th>Project</th><th>Status</th><th>Updated</th><th>Update</th></tr></thead><tbody>
          {platform.serviceOrders.length ? platform.serviceOrders.map((order) => (
            <tr key={order.id}><td>{order.id}</td><td>{order.serviceType || '-'}</td><td>{order.projectTitle || '-'}</td><td>{order.status}</td><td>{order.updatedAt || '-'}</td><td>
              <DarkSelect id={`admin-order-status-${order.id}`} value={order.status} onChange={async (next) => { await platform.actions.updateServiceOrderStatus(order.id, next, orderNote); setFeedback({ type: 'success', message: `Order ${order.id} updated to ${next}.` }); }} options={orderStatuses.map((s) => ({ value: s, label: s }))} />
            </td></tr>
          )) : <tr><td colSpan={6} className="small-text">No service orders yet.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}
