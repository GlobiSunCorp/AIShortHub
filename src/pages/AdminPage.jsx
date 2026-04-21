import { useMemo, useState } from 'react';
import { AccessGuidePanel } from '../components/AccessGuidePanel';
import { minLength } from '../lib/validation';
import { DarkSelect } from '../components/DarkSelect';
import { OnboardingGuide } from '../components/OnboardingGuide';
import { Link } from '../lib/router';
import { getOperatorDashboardSnapshot } from '../lib/selectors/getOperatorDashboardSnapshot';
import { formatUsd } from '../data/monetization';
import { PLATFORM_CONFIG } from '../data/mockData';

const orderStatuses = ['pending', 'in_progress', 'pending_payment', 'completed', 'cancelled'];
const reviewStatuses = ['draft', 'pending_review', 'published', 'rejected'];
const MAX_HERO_POSTER_BYTES = 5 * 1024 * 1024;

const defaultHeroDraft = {
  featuredSeriesId: PLATFORM_CONFIG.homeHero.featuredSeriesId,
  kicker: PLATFORM_CONFIG.homeHero.kicker,
  eyebrow: PLATFORM_CONFIG.homeHero.eyebrow,
  title: PLATFORM_CONFIG.homeHero.title,
  synopsis: PLATFORM_CONFIG.homeHero.synopsis,
  posterUrl: PLATFORM_CONFIG.homeHero.posterUrl,
  primaryCtaLabel: PLATFORM_CONFIG.homeHero.primaryCtaLabel,
  secondaryCtaLabel: PLATFORM_CONFIG.homeHero.secondaryCtaLabel,
  creatorCtaLabel: PLATFORM_CONFIG.homeHero.creatorCtaLabel,
};

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

function verifyImageUrl(url) {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve(true);
      return;
    }
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => reject(new Error('Image failed to load. Please upload a file or use a direct public image URL.'));
    image.src = url;
  });
}

export function AdminPage({ platform, auth }) {
  const [reviewNote, setReviewNote] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [heroAssetFeedback, setHeroAssetFeedback] = useState({ type: '', message: '' });
  const [posterPreviewOk, setPosterPreviewOk] = useState(true);
  const [heroDraft, setHeroDraft] = useState(() => ({
    featuredSeriesId: platform?.platformConfig?.homeHero?.featuredSeriesId || defaultHeroDraft.featuredSeriesId,
    kicker: platform?.platformConfig?.homeHero?.kicker || defaultHeroDraft.kicker,
    eyebrow: platform?.platformConfig?.homeHero?.eyebrow || defaultHeroDraft.eyebrow,
    title: platform?.platformConfig?.homeHero?.title || defaultHeroDraft.title,
    synopsis: platform?.platformConfig?.homeHero?.synopsis || defaultHeroDraft.synopsis,
    posterUrl: platform?.platformConfig?.homeHero?.posterUrl || defaultHeroDraft.posterUrl,
    primaryCtaLabel: platform?.platformConfig?.homeHero?.primaryCtaLabel || defaultHeroDraft.primaryCtaLabel,
    secondaryCtaLabel: platform?.platformConfig?.homeHero?.secondaryCtaLabel || defaultHeroDraft.secondaryCtaLabel,
    creatorCtaLabel: platform?.platformConfig?.homeHero?.creatorCtaLabel || defaultHeroDraft.creatorCtaLabel,
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

  const handlePosterUrlChange = (value) => {
    setHeroDraft((prev) => ({ ...prev, posterUrl: value }));
    setPosterPreviewOk(true);
    setHeroAssetFeedback({ type: '', message: '' });
  };

  const handlePosterFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setHeroAssetFeedback({ type: 'error', message: 'Only image files are supported for the homepage hero poster.' });
      return;
    }

    if (file.size > MAX_HERO_POSTER_BYTES) {
      setHeroAssetFeedback({ type: 'error', message: 'Image is too large. Please keep the homepage poster under 5 MB.' });
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      if (!dataUrl) throw new Error('Image file was empty.');
      setHeroDraft((prev) => ({ ...prev, posterUrl: dataUrl }));
      setPosterPreviewOk(true);
      setHeroAssetFeedback({ type: 'success', message: `Poster uploaded: ${file.name}. Save Homepage Hero to publish this poster.` });
    } catch (error) {
      setHeroAssetFeedback({ type: 'error', message: error.message || 'Poster upload failed. Please try another file.' });
    }
  };

  const saveHomepageHero = async () => {
    if (!minLength(heroDraft.title, 2)) {
      setFeedback({ type: 'error', message: 'Homepage hero title needs at least 2 characters.' });
      return;
    }
    if (!minLength(heroDraft.synopsis, 12)) {
      setFeedback({ type: 'error', message: 'Homepage hero synopsis should be more descriptive.' });
      return;
    }

    try {
      await verifyImageUrl(heroDraft.posterUrl);
      platform.actions.updatePlatformConfig({ homeHero: heroDraft });
      setFeedback({ type: 'success', message: 'Homepage hero updated. Refresh Home to verify the new poster and copy.' });
      setHeroAssetFeedback({ type: 'success', message: 'Poster passed validation and is now connected to the homepage hero.' });
      setPosterPreviewOk(true);
    } catch (error) {
      setPosterPreviewOk(false);
      setFeedback({ type: 'error', message: error.message || 'Poster could not be validated.' });
    }
  };

  const resetHomepageHero = () => {
    platform.actions.resetPlatformConfig();
    setHeroDraft(defaultHeroDraft);
    setPosterPreviewOk(true);
    setHeroAssetFeedback({ type: '', message: '' });
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
            <p className="ds-meta">Upload a poster directly, preview it before saving, and avoid brittle third-party image links.</p>
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
            <label className="stack-sm">
              <span className="ds-caption">Upload homepage poster</span>
              <input className="input" type="file" accept="image/*" onChange={handlePosterFileChange} />
            </label>
            <label className="stack-sm">
              <span className="ds-caption">Or paste a direct public image URL</span>
              <input className="input" placeholder="Hero poster URL override" value={heroDraft.posterUrl} onChange={(e) => handlePosterUrlChange(e.target.value)} />
            </label>
            <p className="ds-caption">Best results: JPG or PNG, under 5 MB, wide hero composition. Uploaded files stay in this demo browser session.</p>
            {heroAssetFeedback.message ? <p className={`form-feedback ${heroAssetFeedback.type}`}>{heroAssetFeedback.message}</p> : null}
            <input className="input" placeholder="Top kicker" value={heroDraft.kicker} onChange={(e) => setHeroDraft((prev) => ({ ...prev, kicker: e.target.value }))} />
            <input className="input" placeholder="Eyebrow" value={heroDraft.eyebrow} onChange={(e) => setHeroDraft((prev) => ({ ...prev, eyebrow: e.target.value }))} />
          </article>
          <article className="mini-card stack-md">
            <h3 className="ds-h3">Copy + CTA</h3>
            <div className="admin-hero-preview">
              {heroDraft.posterUrl ? (
                <img
                  src={heroDraft.posterUrl}
                  alt="Homepage hero poster preview"
                  className="admin-hero-preview-image"
                  onLoad={() => setPosterPreviewOk(true)}
                  onError={() => {
                    setPosterPreviewOk(false);
                    setHeroAssetFeedback({ type: 'error', message: 'Preview failed. Upload a file or replace this URL with a direct image link.' });
                  }}
                />
              ) : (
                <div className="admin-hero-preview-empty">
                  <strong>No poster selected yet</strong>
                  <span>Upload a file or paste a direct image URL to preview the homepage hero.</span>
                </div>
              )}
              <div className="admin-hero-preview-scrim" />
              <div className="admin-hero-preview-copy">
                <span className="ds-caption">{heroDraft.kicker || 'Featured launch title'}</span>
                <strong>{heroDraft.title || 'Hero title preview'}</strong>
                <span>{heroDraft.synopsis || 'Hero synopsis preview will appear here.'}</span>
              </div>
            </div>
            {!posterPreviewOk && heroDraft.posterUrl ? <p className="form-feedback error">Poster preview is broken. Please replace this image before saving.</p> : null}
            <input className="input" placeholder="Hero title" value={heroDraft.title} onChange={(e) => setHeroDraft((prev) => ({ ...prev, title: e.target.value }))} />
            <textarea className="input" placeholder="Hero synopsis" value={heroDraft.synopsis} onChange={(e) => setHeroDraft((prev) => ({ ...prev, synopsis: e.target.value }))} />
            <input className="input" placeholder="Primary CTA label" value={heroDraft.primaryCtaLabel} onChange={(e) => setHeroDraft((prev) => ({ ...prev, primaryCtaLabel: e.target.value }))} />
            <input className="input" placeholder="Secondary CTA label" value={heroDraft.secondaryCtaLabel} onChange={(e) => setHeroDraft((prev) => ({ ...prev, secondaryCtaLabel: e.target.value }))} />
            <input className="input" placeholder="Creator CTA label" value={heroDraft.creatorCtaLabel} onChange={(e) => setHeroDraft((prev) => ({ ...prev, creatorCtaLabel: e.target.value }))} />
          </article>
        </div>
        <div className="row wrap">
          <button className="btn btn-primary" type="button" onClick={saveHomepageHero}>Save Homepage Hero</button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => {
              setHeroDraft((prev) => ({ ...prev, posterUrl: '' }));
              setPosterPreviewOk(true);
              setHeroAssetFeedback({ type: 'success', message: 'Poster cleared. Save Homepage Hero to publish the empty/default poster state.' });
            }}
          >
            Clear poster
          </button>
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
