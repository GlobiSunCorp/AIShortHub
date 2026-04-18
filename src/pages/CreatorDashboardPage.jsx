import { useMemo, useState } from 'react';
import { AccessGuidePanel } from '../components/AccessGuidePanel';
import { CreatorPlanCard, MembershipBadge, UsageQuotaBadge } from '../components/EntitlementBadges';
import { CreatorActionCenter, PlanHealthCard, QuotaAlertBar, SubmissionReadinessChecklist } from '../components/CreatorOpsPanels';
import { Link } from '../lib/router';
import { GlossaryTerm } from '../components/GlossaryTerm';
import { OnboardingGuide } from '../components/OnboardingGuide';
import { ADD_ON_SERVICES, CREATOR_ASSETS, REFUND_POLICY_CONFIG, REVENUE_MODEL, formatUsd, getCreatorPlan, getServiceEntitlement } from '../data/monetization';
import { canAccessCreatorStudio, isHighTierCreator, resolveMembership } from '../hooks/usePlanAccess';
import { isValidUrl, minLength } from '../lib/validation';
import { evaluateQuotaLimits, getCreatorQuotaSnapshot } from '../lib/services/quotaService';
import { buildCreatorActions, buildQuotaAlerts, getCycleDates, getHealthStatus, getSubmissionChecklist } from '../lib/services/creatorHealthService';
import { getCreatorEarningsSnapshot, getEarningsBreakdown, getPeriodComparison } from '../lib/services/earningsService';
import { normalizePricingConfig, validateSeriesWorkflow } from '../lib/services/uploadWorkflowService';
import { getCreatorDashboardSnapshot } from '../lib/selectors/getCreatorDashboardSnapshot';
import { getBillingSummarySnapshot } from '../lib/selectors/getBillingSummarySnapshot';
import { HowPricingWorksPanel } from '../components/billing/HowPricingWorksPanel';
import { RevenueFlowDiagram } from '../components/billing/RevenueFlowDiagram';

const STEPS = ['Basic Info', 'Trailer Assets', 'Main Episodes', 'Pricing & QC', 'Publishing & Review'];
const bucketByAssetType = {
  static_poster: 'posters',
  motion_poster: 'motion-posters',
  vertical_cover: 'vertical-covers',
  square_thumbnail: 'thumbnails',
  trailer: 'trailers',
  subtitle_file: 'subtitles',
  caption_pack: 'captions',
  promo_pack: 'promo',
  video: 'episodes',
};

const initialDraft = {
  title: '', synopsis: '', tags: '', category: 'Romance', audience: '',
  staticPoster: '', motionPoster: '', verticalCover: '', squareThumbnail: '',
  trailer: { title: '', url: '', coverUrl: '', durationSeconds: 30, cta: 'Watch full series', aspectRatio: '9:16', resolutions: ['720p', '1080p'] },
  episodes: [{ number: 1, title: 'Episode 1 - Untitled', url: '', durationSeconds: 60, isPreview: true, isPaid: false, unlockPriceUsd: 0.99, publishAt: '', subtitleLanguages: ['en'], reviewStatus: 'draft', resolutions: ['360p', '540p', '720p'], aspectRatio: '9:16', fileSizeMb: 80 }],
  pricing: { titlePriceUsd: 7.99, episodeUnlockPriceUsd: 0.99, finaleUnlockEnabled: false, finaleUnlockPriceUsd: 1.99, freePreviewEpisodes: [1] },
  checklistReady: false,
};

const assetEntitlementText = {
  static_poster: ['Included', 'Included in all creator plans.'],
  motion_poster: ['Plan based', 'Included in Studio · Discounted for Creator Pro · Add-on for Basic.'],
  trailer: ['Growth core', 'Trailer is primary ad/social acquisition asset.'],
  subtitle_file: ['Recommended', 'Missing subtitles can delay review and reduce payout efficiency.'],
};

export function CreatorDashboardPage({ auth, platform }) {
  const membership = resolveMembership(auth, platform);
  const hasStudioAccess = canAccessCreatorStudio(auth, platform);
  const highTier = isHighTierCreator(auth, platform);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(initialDraft);
  const [uploading, setUploading] = useState({});
  const [files, setFiles] = useState({});
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const creatorSnapshot = getCreatorDashboardSnapshot({ platform, auth });
  const myCreator = creatorSnapshot.creator || platform.creators[0];
  const mySeries = creatorSnapshot.series;
  const quota = getCreatorQuotaSnapshot({ creatorPlanId: membership.creatorPlan || 'creator_basic', creatorId: myCreator?.id, profileId: auth.user?.id, platform });
  const metrics = useMemo(() => [['我的剧集', mySeries.length], ['待审核', mySeries.filter((item) => item.status === 'pending_review').length], ['已发布', mySeries.filter((item) => item.status === 'published').length]], [mySeries]);
  const cycle = getCycleDates(platform.memberships.find((m) => m.profileId === auth.user?.id)?.renewAt);
  const healthStatus = getHealthStatus(quota);
  const alerts = buildQuotaAlerts({ snapshot: quota, renewAt: cycle.renewalDate, unpaidOrders: platform.serviceOrders.filter((o) => o.requesterId === auth.user?.id && o.status === 'pending_payment') });
  const actions = buildCreatorActions({ snapshot: quota, pendingSeriesCount: mySeries.filter((item) => item.status === 'pending_review').length, unpaidOrdersCount: platform.serviceOrders.filter((o) => o.requesterId === auth.user?.id && o.status === 'pending_payment').length, draft });
  const checklist = getSubmissionChecklist({ draft: { ...draft, trailer: draft.trailer.url }, snapshot: quota, creatorPlanName: getCreatorPlan(membership.creatorPlan || 'creator_basic').name });
  const workflowQc = validateSeriesWorkflow({ draft });
  const earnings = getCreatorEarningsSnapshot({ platform, creatorId: myCreator?.id });
  const breakdown = getEarningsBreakdown(earnings);
  const period = getPeriodComparison(earnings);
  const billingSnapshot = getBillingSummarySnapshot({ platform, creatorId: myCreator?.id, membership });

  const uploadAsset = async (assetType, onDone) => {
    const file = files[assetType];
    if (!file) return setFeedback({ type: 'error', message: '请先选择文件。' });
    if (quota.usage.monthlyUploads >= quota.limits.monthlyUploadLimit) return setFeedback({ type: 'error', message: `已达到月上传次数上限（${quota.limits.monthlyUploadLimit}）。` });
    if (quota.usage.usedStorageGb >= quota.limits.monthlyAssetStorageLimitGb) return setFeedback({ type: 'error', message: `已达到月素材存储上限（${quota.limits.monthlyAssetStorageLimitGb}GB）。` });
    setUploading((prev) => ({ ...prev, [assetType]: true }));
    const res = await platform.actions.uploadAssetFile({ bucket: bucketByAssetType[assetType], seriesId: draft.title || 'draft', assetType, file });
    setUploading((prev) => ({ ...prev, [assetType]: false }));
    if (res.error) return setFeedback({ type: 'error', message: `上传失败：${res.error}` });
    onDone(res.data.publicUrl);
    setFeedback({ type: 'success', message: `${assetType} 上传成功。` });
  };

  const updateEpisode = (index, patch) => setDraft((prev) => ({ ...prev, episodes: prev.episodes.map((item, i) => (i === index ? { ...item, ...patch } : item)) }));
  const addEpisode = () => setDraft((prev) => ({ ...prev, episodes: [...prev.episodes, { ...initialDraft.episodes[0], number: prev.episodes.length + 1, title: `Episode ${prev.episodes.length + 1} - Untitled`, isPreview: false, isPaid: true, publishAt: '' }] }));

  if (!auth.isLoggedIn) return <AccessGuidePanel currentRoleLabel="Guest" requiredRoleLabel="Creator / Admin" reason="Creator Studio 需要登录后进入。" action={<button className="btn btn-primary" onClick={() => auth.switchDemoRole('creator_pro')}>切换为 Creator</button>} />;
  if (!hasStudioAccess) return <AccessGuidePanel currentRoleLabel={auth.userState} requiredRoleLabel="Creator Plan" reason="当前账号没有 Creator Plan，请先升级。" action={<button className="btn btn-primary" onClick={() => auth.switchDemoRole('creator_basic')}>开启 Creator Basic</button>} />;

  return (
    <div className="stack-lg">
      <OnboardingGuide role="creator" />
      <QuotaAlertBar alerts={alerts.slice(0, 4)} />
      <PlanHealthCard
        hoverHint="Hover to review entitlement details and renewal dates."
        data={{
          healthStatus,
          cycleLabel: cycle.cycleLabel,
          metrics: [
            { label: 'Series', value: `${quota.usage.activeSeries}/${quota.limits.maxActiveSeries}`, tone: quota.remaining.seriesLeft <= 1 ? 'warn' : 'ok', details: [['Used', quota.usage.activeSeries], ['Left', quota.remaining.seriesLeft]] },
            { label: 'Episodes', value: `${quota.usage.totalEpisodes}/${quota.limits.maxTotalEpisodes}`, details: [['Used', quota.usage.totalEpisodes], ['Left', quota.remaining.episodesLeft]] },
            { label: 'Storage', value: `${quota.usage.usedStorageGb.toFixed(1)}GB/${quota.limits.monthlyAssetStorageLimitGb}GB`, tone: quota.remaining.storageGbLeft <= 2 ? 'warn' : 'ok', details: [['Used', `${quota.usage.usedStorageGb.toFixed(1)}GB`], ['Left', `${quota.remaining.storageGbLeft.toFixed(1)}GB`]] },
          ],
          summary: [
            ['Viewer Plan', membership.tier],
            ['Creator Plan', quota.plan.name],
            ['Platform Commission', `${Math.round(quota.plan.commissionRate * 100)}% · only after revenue`],
            ['Review Priority', quota.plan.reviewPriority],
            ['Billing Renewal', cycle.renewalDate],
            ['Quota Reset Date', cycle.quotaResetDate],
          ],
        }}
      />

      <section className="panel stack-md">
        <h1>Creator Studio</h1>
        <p className="small-text">{STEPS[step]}（{platform.mode === 'real' ? 'Real Data Mode' : 'Mock Fallback Mode'}）· 广告优先 + 服务 + 订阅 + 低抽成。</p>
        <div className="row wrap">
          <MembershipBadge auth={auth} membership={membership} />
          <UsageQuotaBadge label="Series" value={`${quota.usage.activeSeries}/${quota.limits.maxActiveSeries} Series`} tone={quota.remaining.seriesLeft <= 1 ? 'warn' : 'ok'} details={[["Used", quota.usage.activeSeries], ["Remaining", quota.remaining.seriesLeft]]} cta={quota.upgradeHint} />
          <UsageQuotaBadge label="Episodes" value={`${quota.usage.totalEpisodes}/${quota.limits.maxTotalEpisodes} Episodes`} details={[["Used", quota.usage.totalEpisodes], ["Remaining", quota.remaining.episodesLeft]]} />
          <UsageQuotaBadge label="Storage" value={`${quota.usage.usedStorageGb.toFixed(1)}GB/${quota.limits.monthlyAssetStorageLimitGb}GB`} tone={quota.remaining.storageGbLeft <= 2 ? 'warn' : 'ok'} details={[["Used", `${quota.usage.usedStorageGb.toFixed(1)}GB`], ["Remaining", `${quota.remaining.storageGbLeft.toFixed(1)}GB`]]} />
        </div>
      </section>

      <section className="panel stack-md">
        <h3>Earnings Breakdown</h3>
        <p className="small-text">Period {earnings.period} · 净收入 <GlossaryTerm id="net_earnings" /> {formatUsd(breakdown.netEarnings)} · Pending payout <GlossaryTerm id="pending_payout" /> {formatUsd(earnings.pendingPayout)} · Paid out {formatUsd(earnings.paidOut)}</p>
        <div className="stacked-bar">
          {breakdown.incomeItems.map(([label, value]) => <span key={label} style={{ width: `${(value / (breakdown.grossIncome || 1)) * 100}%` }} title={`${label}: ${formatUsd(value)}`} />)}
        </div>
        <div className="grid cards-3">
          {breakdown.incomeItems.map(([label, value]) => <article key={label} className="mini-card"><p className="small-text">{label}</p><strong>{formatUsd(value)}</strong></article>)}
          {breakdown.deductions.map(([label, value]) => <article key={label} className="mini-card"><p className="small-text">{label}</p><strong>-{formatUsd(value)}</strong></article>)}
          <article className="mini-card"><p className="small-text">Net earnings</p><strong>{formatUsd(earnings.netEarnings)}</strong></article>
          <article className="mini-card"><p className="small-text">Pending payout</p><strong>{formatUsd(earnings.pendingPayout)}</strong></article>
          <article className="mini-card"><p className="small-text">Paid out</p><strong>{formatUsd(earnings.paidOut)}</strong></article>
          <article className="mini-card"><p className="small-text">Period vs previous</p><strong>{period.delta >= 0 ? '+' : ''}{formatUsd(period.delta)} ({period.ratio.toFixed(1)}%)</strong></article>
        </div>
        <RevenueFlowDiagram lines={billingSnapshot.creator.lines} netPayout={billingSnapshot.creator.netPayout} />
      </section>
      <HowPricingWorksPanel viewerSummary={billingSnapshot.viewer} creatorSummary={billingSnapshot.creator} />

      <CreatorActionCenter actions={actions} />
      <CreatorPlanCard snapshot={quota} />
      <section className="grid cards-3">{metrics.map(([label, value]) => <article className="stat-card" key={label}><p className="small-text">{label}</p><h3>{value}</h3></article>)}</section>

      <section className="panel form-grid">
        {step === 0 ? <>
          <h2>Step 1: Basic Info</h2>
          <input className="input" placeholder="剧名" value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} />
          <textarea className="input" placeholder="简介" value={draft.synopsis} onChange={(e) => setDraft((p) => ({ ...p, synopsis: e.target.value }))} />
          <input className="input" placeholder="标签(逗号分隔)" value={draft.tags} onChange={(e) => setDraft((p) => ({ ...p, tags: e.target.value }))} />
          <input className="input" placeholder="Audience（required）" value={draft.audience} onChange={(e) => setDraft((p) => ({ ...p, audience: e.target.value }))} />
        </> : null}

        {step === 1 ? <>
          <h2>Step 2: Trailer & Marketing Assets</h2>
          <p className="small-text">Assets: {CREATOR_ASSETS.join(' · ')}</p>
          <div className="grid cards-2">{Object.entries(assetEntitlementText).map(([key, [label, desc]]) => <article key={key} className="mini-card"><h4>{key.replace('_', ' ')}</h4><p className="small-text">{label}</p><p className="small-text">{desc}</p></article>)}</div>
          <input className="input" placeholder="Static Poster URL" value={draft.staticPoster} onChange={(e) => setDraft((p) => ({ ...p, staticPoster: e.target.value }))} />
          <label className="small-text">Static Poster file<input type="file" onChange={(e) => setFiles((p) => ({ ...p, static_poster: e.target.files?.[0] }))} /></label><button className="btn btn-ghost" type="button" disabled={uploading.static_poster} onClick={() => uploadAsset('static_poster', (url) => setDraft((p) => ({ ...p, staticPoster: url })))}>上传 Static Poster</button>
          <input className="input" placeholder="Trailer Title" value={draft.trailer.title} onChange={(e) => setDraft((p) => ({ ...p, trailer: { ...p.trailer, title: e.target.value } }))} />
          <input className="input" placeholder="Trailer URL" value={draft.trailer.url} onChange={(e) => setDraft((p) => ({ ...p, trailer: { ...p.trailer, url: e.target.value } }))} />
          <input className="input" placeholder="Trailer Cover URL" value={draft.trailer.coverUrl} onChange={(e) => setDraft((p) => ({ ...p, trailer: { ...p.trailer, coverUrl: e.target.value } }))} />
          <input className="input" placeholder="Trailer CTA" value={draft.trailer.cta} onChange={(e) => setDraft((p) => ({ ...p, trailer: { ...p.trailer, cta: e.target.value } }))} />
          <label className="small-text">Trailer file<input type="file" onChange={(e) => setFiles((p) => ({ ...p, trailer: e.target.files?.[0] }))} /></label><button className="btn btn-ghost" type="button" disabled={uploading.trailer} onClick={() => uploadAsset('trailer', (url) => setDraft((p) => ({ ...p, trailer: { ...p.trailer, url } })))}>上传 Trailer</button>
          <div className="grid cards-2">{ADD_ON_SERVICES.map((s) => <article key={s.id} className="mini-card"><h4>{s.name}</h4><p className="small-text">{getServiceEntitlement(s, membership.creatorPlan || 'creator_basic')}</p></article>)}</div>
        </> : null}

        {step === 2 ? <>
          <h2>Step 3: Main Episodes Workflow</h2>
          {draft.episodes.map((item, index) => (
            <article key={`${item.number}-${index}`} className="mini-card stack-md">
              <h4>Episode {item.number}</h4>
              <input className="input" value={item.title} onChange={(e) => updateEpisode(index, { title: e.target.value })} />
              <input className="input" placeholder="Video URL" value={item.url} onChange={(e) => updateEpisode(index, { url: e.target.value })} />
              <div className="row wrap">
                <label className="small-text"><input type="checkbox" checked={item.isPreview} onChange={(e) => updateEpisode(index, { isPreview: e.target.checked })} /> 试看</label>
                <label className="small-text"><input type="checkbox" checked={item.isPaid} onChange={(e) => updateEpisode(index, { isPaid: e.target.checked })} /> 收费</label>
              </div>
              <input className="input" type="number" placeholder="单集价格" value={item.unlockPriceUsd} onChange={(e) => updateEpisode(index, { unlockPriceUsd: Number(e.target.value) })} />
              <input className="input" type="date" value={item.publishAt} onChange={(e) => updateEpisode(index, { publishAt: e.target.value })} />
              <input className="input" placeholder="字幕语言（逗号）" value={item.subtitleLanguages.join(',')} onChange={(e) => updateEpisode(index, { subtitleLanguages: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} />
              <input className="input" placeholder="Aspect Ratio" value={item.aspectRatio} onChange={(e) => updateEpisode(index, { aspectRatio: e.target.value })} />
              <input className="input" placeholder="Resolutions（逗号）" value={item.resolutions.join(',')} onChange={(e) => updateEpisode(index, { resolutions: e.target.value.split(',').map((x) => x.trim()) })} />
              <label className="small-text">Episode video file<input type="file" onChange={(e) => setFiles((p) => ({ ...p, video: e.target.files?.[0] }))} /></label>
              <button className="btn btn-ghost" type="button" disabled={uploading.video} onClick={() => uploadAsset('video', (url) => updateEpisode(index, { url }))}>上传 Episode</button>
            </article>
          ))}
          <button className="btn btn-ghost" type="button" onClick={addEpisode}>+ 新增分集</button>
        </> : null}

        {step === 3 ? <>
          <h2>Step 4: Creator-set Pricing & QC</h2>
          <p className="small-text">订阅与单买分离：Pro/Premium 可完整观看；非订阅用户可按整剧或单集解锁。平台前期执行 low-friction onboarding + low commission policy。</p>
          <input className="input" type="number" placeholder="Entire title price (整剧价)" value={draft.pricing.titlePriceUsd} onChange={(e) => setDraft((p) => ({ ...p, pricing: { ...p.pricing, titlePriceUsd: Number(e.target.value) } }))} />
          <input className="input" type="number" placeholder="Episode unlock price (单集价)" value={draft.pricing.episodeUnlockPriceUsd} onChange={(e) => setDraft((p) => ({ ...p, pricing: { ...p.pricing, episodeUnlockPriceUsd: Number(e.target.value) } }))} />
          <label className="small-text"><input type="checkbox" checked={draft.pricing.finaleUnlockEnabled} onChange={(e) => setDraft((p) => ({ ...p, pricing: { ...p.pricing, finaleUnlockEnabled: e.target.checked } }))} /> 启用结局额外包</label>
          {draft.pricing.finaleUnlockEnabled ? <input className="input" type="number" value={draft.pricing.finaleUnlockPriceUsd} onChange={(e) => setDraft((p) => ({ ...p, pricing: { ...p.pricing, finaleUnlockPriceUsd: Number(e.target.value) } }))} /> : null}
          <input className="input" placeholder="Free preview episodes (e.g. 1,2)" value={draft.pricing.freePreviewEpisodes.join(',')} onChange={(e) => setDraft((p) => ({ ...p, pricing: { ...p.pricing, freePreviewEpisodes: e.target.value.split(',').map((x) => Number(x.trim())).filter(Boolean) } }))} />
          <article className="mini-card">
            <h4>QC / Validation</h4>
            {workflowQc.issues.length ? workflowQc.issues.map((item) => <p key={item} className="small-text">• {item}</p>) : <p className="small-text">已通过核心质量检查。</p>}
          </article>
        </> : null}

        {step === 4 ? <>
          <h2>Step 5: Publishing & Review</h2>
          <SubmissionReadinessChecklist checklist={checklist} />
          <label className="small-text"><input type="checkbox" checked={draft.checklistReady} onChange={(e) => setDraft((p) => ({ ...p, checklistReady: e.target.checked }))} /> 提交审核前检查清单已完成</label>
          <button className="btn btn-primary" type="button" onClick={async () => {
            const quotaFailures = evaluateQuotaLimits(quota);
            if (quotaFailures.length) return setFeedback({ type: 'error', message: `提交失败：${quotaFailures.join('；')}。` });
            if (!minLength(draft.title, 2) || !minLength(draft.synopsis, 12)) return setFeedback({ type: 'error', message: '请至少完成标题和简介。' });
            if (!draft.checklistReady || checklist.missing || workflowQc.issues.length) return setFeedback({ type: 'error', message: '请先完成提交前检查清单和 QC 检查。' });
            if (draft.staticPoster && !isValidUrl(draft.staticPoster)) return setFeedback({ type: 'error', message: '海报 URL 格式错误。' });
            const id = `${draft.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now().toString().slice(-4)}`;
            const normalizedPricing = normalizePricingConfig(draft.pricing);
            await platform.actions.createSeries({
              id, creatorId: myCreator?.id, creator_id: myCreator?.id, title: draft.title, synopsis: draft.synopsis,
              tags: draft.tags.split(',').map((t) => t.trim()).filter(Boolean), category: draft.category,
              coverUrl: draft.staticPoster, cover_url: draft.staticPoster,
              trailer_url: draft.trailer.url, trailer_title: draft.trailer.title, trailer_cover_url: draft.trailer.coverUrl,
              monetization: { ...normalizedPricing, subscriptionAccess: { proViewer: 'full_access', premiumViewer: 'full_access_plus_early' } },
              status: 'draft',
            });
            for (const ep of draft.episodes) {
              await platform.actions.createEpisode({
                id: `ep_${Date.now()}_${ep.number}`,
                series_id: id,
                seriesId: id,
                number: ep.number,
                title: ep.title,
                video_url: ep.url,
                videoUrl: ep.url,
                is_preview: ep.isPreview,
                isPreview: ep.isPreview,
                is_paid: ep.isPaid,
                unlock_price_usd: ep.unlockPriceUsd,
                publish_at: ep.publishAt,
                subtitle_languages: ep.subtitleLanguages,
                review_status: ep.reviewStatus,
                aspect_ratio: ep.aspectRatio,
                available_resolutions: ep.resolutions,
                duration_seconds: Number(ep.durationSeconds) || 60,
              });
            }
            await platform.actions.submitForReview(id);
            setDraft(initialDraft); setStep(0); setFeedback({ type: 'success', message: '提交审核成功，内容已进入待审核队列。' });
          }}>提交审核</button>
        </> : null}

        <div className="row wrap">
          <button className="btn btn-ghost" type="button" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>上一步</button>
          <button className="btn btn-primary" type="button" onClick={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))} disabled={step === STEPS.length - 1}>下一步</button>
        </div>
      </section>

      <section className="panel stack-md">
        <h3>Revenue Model / Platform Monetization</h3>
        <div className="grid cards-2">
          <article className="mini-card"><h4>Platform收入优先级</h4>{REVENUE_MODEL.platform.map((item) => <p key={item.key} className="small-text">• {item.label}: {item.detail}</p>)}</article>
          <article className="mini-card"><h4>Creator收入路径（低抽成后）</h4>{REVENUE_MODEL.creator.map((item) => <p key={item} className="small-text">• {item}</p>)}</article>
        </div>
      </section>

      <section className="panel"><h3>当前草稿摘要</h3><p className="small-text">{draft.title || '未命名草稿'} · {highTier ? '高阶 Creator 权益已开启' : '基础 Creator 权益'}</p><p className="small-text">退款提示：{REFUND_POLICY_CONFIG.creator.short} <Link className="text-link" to="/refund">查看详情 →</Link></p></section>
    </div>
  );
}
