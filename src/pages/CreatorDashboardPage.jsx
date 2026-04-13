import { useMemo, useState } from 'react';
import { AccessGuidePanel } from '../components/AccessGuidePanel';
import { CreatorPlanCard, MembershipBadge, UsageQuotaBadge } from '../components/EntitlementBadges';
import { Link } from '../lib/router';
import { ADD_ON_SERVICES, CREATOR_ASSETS, REFUND_POLICY_CONFIG, getServiceEntitlement } from '../data/monetization';
import { canAccessCreatorStudio, isHighTierCreator, resolveMembership } from '../hooks/usePlanAccess';
import { isValidUrl, minLength } from '../lib/validation';
import { evaluateQuotaLimits, getCreatorQuotaSnapshot } from '../lib/services/quotaService';

const STEPS = ['Basic Info', 'Assets', 'Episodes', 'Publishing & Review'];
const bucketByAssetType = { static_poster: 'posters', motion_poster: 'motion-posters', thumbnail: 'thumbnails', trailer: 'trailers', video: 'episodes' };

const initialDraft = { title: '', synopsis: '', tags: '', category: 'Romance', audience: '', staticPoster: '', motionPoster: '', thumbnail: '', trailer: '', episodeTitle: '', episodeNumber: 1, episodeUrl: '', episodeDuration: 60, episodePreview: true, checklistReady: false };

const assetEntitlementText = {
  static_poster: ['Included', 'Included in all creator plans.'],
  motion_poster: ['Plan based', 'Included in Studio · Discounted for Creator Pro · Add-on for Basic.'],
  thumbnail: ['Included', 'Included in all creator plans.'],
  trailer: ['Discounted', 'Discounted for Creator Pro and Studio.'],
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

  const myCreator = platform.creators.find((item) => item.profileId === auth.user?.id) || platform.creators[0];
  const mySeries = platform.series.filter((item) => item.creatorId === myCreator?.id);
  const quota = getCreatorQuotaSnapshot({ creatorPlanId: membership.creatorPlan || 'creator_basic', creatorId: myCreator?.id, profileId: auth.user?.id, platform });
  const metrics = useMemo(() => [['我的剧集', mySeries.length], ['待审核', mySeries.filter((item) => item.status === 'pending_review').length], ['已发布', mySeries.filter((item) => item.status === 'published').length]], [mySeries]);

  const uploadAsset = async (assetType, draftField) => {
    const file = files[assetType];
    if (!file) return setFeedback({ type: 'error', message: '请先选择文件。' });
    if (quota.usage.monthlyUploads >= quota.limits.monthlyUploadLimit) return setFeedback({ type: 'error', message: `已达到月上传次数上限（${quota.limits.monthlyUploadLimit}）。` });
    if (quota.usage.usedStorageGb >= quota.limits.monthlyAssetStorageLimitGb) return setFeedback({ type: 'error', message: `已达到月素材存储上限（${quota.limits.monthlyAssetStorageLimitGb}GB）。` });
    setUploading((prev) => ({ ...prev, [assetType]: true }));
    const res = await platform.actions.uploadAssetFile({ bucket: bucketByAssetType[assetType], seriesId: draft.title || 'draft', assetType, file });
    setUploading((prev) => ({ ...prev, [assetType]: false }));
    if (res.error) return setFeedback({ type: 'error', message: `上传失败：${res.error}` });
    setDraft((prev) => ({ ...prev, [draftField]: res.data.publicUrl }));
    setFeedback({ type: 'success', message: `${assetType} 上传成功。` });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));

  if (!auth.isLoggedIn) return <AccessGuidePanel currentRoleLabel="Guest" requiredRoleLabel="Creator / Admin" reason="Creator Studio 需要登录后进入。" action={<button className="btn btn-primary" onClick={() => auth.switchDemoRole('creator_pro')}>切换为 Creator</button>} />;
  if (!hasStudioAccess) return <AccessGuidePanel currentRoleLabel={auth.userState} requiredRoleLabel="Creator Plan" reason="当前账号没有 Creator Plan，请先升级。" action={<button className="btn btn-primary" onClick={() => auth.switchDemoRole('creator_basic')}>开启 Creator Basic</button>} />;

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <h1>Creator Studio</h1>
        <p className="small-text">{STEPS[step]}（{platform.mode === 'real' ? 'Real Data Mode' : 'Mock Fallback Mode'}）</p>
        <div className="row wrap">
          <MembershipBadge auth={auth} membership={membership} />
          <UsageQuotaBadge label="Series" value={`${quota.usage.activeSeries}/${quota.limits.maxActiveSeries} Series`} tone={quota.remaining.seriesLeft <= 1 ? 'warn' : 'ok'} details={[["Used", quota.usage.activeSeries], ["Remaining", quota.remaining.seriesLeft]]} cta={quota.upgradeHint} />
          <UsageQuotaBadge label="Episodes" value={`${quota.usage.totalEpisodes}/${quota.limits.maxTotalEpisodes} Episodes`} details={[["Used", quota.usage.totalEpisodes], ["Remaining", quota.remaining.episodesLeft]]} />
          <UsageQuotaBadge label="Storage" value={`${quota.usage.usedStorageGb.toFixed(1)}GB/${quota.limits.monthlyAssetStorageLimitGb}GB`} tone={quota.remaining.storageGbLeft <= 2 ? 'warn' : 'ok'} details={[["Used", `${quota.usage.usedStorageGb.toFixed(1)}GB`], ["Remaining", `${quota.remaining.storageGbLeft.toFixed(1)}GB`]]} />
          <UsageQuotaBadge label="Motion Poster" value={`${quota.remaining.motionPosterLeft} left`} details={[["Included", quota.limits.includedMotionPosterCount], ["Used", quota.usage.usedMotionPosterCount], ["Remaining", quota.remaining.motionPosterLeft]]} />
          <UsageQuotaBadge label="Featured" value={`${quota.remaining.featuredRequestsLeft} left`} details={[["Per cycle", quota.limits.maxFeaturedRequestsPerCycle], ["Used", quota.usage.featuredRequestsUsed], ["Remaining", quota.remaining.featuredRequestsLeft]]} />
        </div>
        {quota.warning.length ? <p className="form-feedback error">{quota.warning.join(' · ')} · Upgrade recommended for uninterrupted uploads.</p> : null}
      </section>
      {feedback.message ? <section className="panel"><p className={`form-feedback ${feedback.type}`}>{feedback.message}</p></section> : null}

      <CreatorPlanCard snapshot={quota} />

      <section className="grid cards-3">{metrics.map(([label, value]) => <article className="stat-card" key={label}><p className="small-text">{label}</p><h3>{value}</h3></article>)}</section>

      <section className="panel form-grid">
        {step === 0 ? <>
          <h2>Step 1: Basic Info</h2>
          <input className="input" placeholder="剧名" value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} />
          <textarea className="input" placeholder="简介" value={draft.synopsis} onChange={(e) => setDraft((p) => ({ ...p, synopsis: e.target.value }))} />
          <input className="input" placeholder="标签(逗号分隔)" value={draft.tags} onChange={(e) => setDraft((p) => ({ ...p, tags: e.target.value }))} />
        </> : null}

        {step === 1 ? <>
          <h2>Step 2: Assets</h2>
          <p className="small-text">支持 URL fallback + Supabase Storage 上传。Assets: {CREATOR_ASSETS.join(' · ')}</p>
          <div className="grid cards-2">
            {Object.entries(assetEntitlementText).map(([key, [label, desc]]) => (
              <article key={key} className="mini-card">
                <h4>{key.replace('_', ' ')}</h4>
                <p className="small-text">{label}</p>
                <p className="small-text">{desc}</p>
              </article>
            ))}
          </div>
          <input className="input" placeholder="Static Poster URL" value={draft.staticPoster} onChange={(e) => setDraft((p) => ({ ...p, staticPoster: e.target.value }))} />
          <label className="small-text">Static Poster file<input type="file" onChange={(e) => setFiles((p) => ({ ...p, static_poster: e.target.files?.[0] }))} /></label><button className="btn btn-ghost" type="button" disabled={uploading.static_poster} onClick={() => uploadAsset('static_poster', 'staticPoster')}>上传 Static Poster</button>
          <input className="input" placeholder="Motion Poster URL" value={draft.motionPoster} onChange={(e) => setDraft((p) => ({ ...p, motionPoster: e.target.value }))} />
          <label className="small-text">Motion Poster file<input type="file" onChange={(e) => setFiles((p) => ({ ...p, motion_poster: e.target.files?.[0] }))} /></label><button className="btn btn-ghost" type="button" disabled={uploading.motion_poster} onClick={() => uploadAsset('motion_poster', 'motionPoster')}>上传 Motion Poster</button>
          <input className="input" placeholder="Thumbnail URL" value={draft.thumbnail} onChange={(e) => setDraft((p) => ({ ...p, thumbnail: e.target.value }))} />
          <label className="small-text">Thumbnail file<input type="file" onChange={(e) => setFiles((p) => ({ ...p, thumbnail: e.target.files?.[0] }))} /></label><button className="btn btn-ghost" type="button" disabled={uploading.thumbnail} onClick={() => uploadAsset('thumbnail', 'thumbnail')}>上传 Thumbnail</button>
          <input className="input" placeholder="Trailer URL" value={draft.trailer} onChange={(e) => setDraft((p) => ({ ...p, trailer: e.target.value }))} />
          <label className="small-text">Trailer file<input type="file" onChange={(e) => setFiles((p) => ({ ...p, trailer: e.target.files?.[0] }))} /></label><button className="btn btn-ghost" type="button" disabled={uploading.trailer} onClick={() => uploadAsset('trailer', 'trailer')}>上传 Trailer</button>
          <div className="grid cards-2">{ADD_ON_SERVICES.map((s) => <article key={s.id} className="mini-card"><h4>{s.name}</h4><p className="small-text">{getServiceEntitlement(s, membership.creatorPlan || 'creator_basic')}</p></article>)}</div>
        </> : null}

        {step === 2 ? <>
          <h2>Step 3: Episodes</h2>
          <input className="input" placeholder="分集标题" value={draft.episodeTitle} onChange={(e) => setDraft((p) => ({ ...p, episodeTitle: e.target.value }))} />
          <input className="input" placeholder="视频 URL（fallback）" value={draft.episodeUrl} onChange={(e) => setDraft((p) => ({ ...p, episodeUrl: e.target.value }))} />
          <label className="small-text">Episode video file (占位)<input type="file" onChange={(e) => setFiles((p) => ({ ...p, video: e.target.files?.[0] }))} /></label>
          <button className="btn btn-ghost" type="button" disabled={uploading.video} onClick={() => uploadAsset('video', 'episodeUrl')}>上传视频占位</button>
        </> : null}

        {step === 3 ? <>
          <h2>Step 4: Publishing & Review</h2>
          <label className="small-text"><input type="checkbox" checked={draft.checklistReady} onChange={(e) => setDraft((p) => ({ ...p, checklistReady: e.target.checked }))} /> 提交审核前检查清单已完成</label>
          <button className="btn btn-primary" type="button" onClick={async () => {
            const quotaFailures = evaluateQuotaLimits(quota);
            if (quotaFailures.length) return setFeedback({ type: 'error', message: `提交失败：${quotaFailures.join('；')}。` });
            if (!minLength(draft.title, 2) || !minLength(draft.synopsis, 12)) return setFeedback({ type: 'error', message: '请至少完成标题和简介。' });
            if (!draft.checklistReady) return setFeedback({ type: 'error', message: '请勾选检查清单。' });
            if (draft.staticPoster && !isValidUrl(draft.staticPoster)) return setFeedback({ type: 'error', message: '海报 URL 格式错误。' });
            const id = `${draft.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now().toString().slice(-4)}`;
            await platform.actions.createSeries({ id, creatorId: myCreator?.id, creator_id: myCreator?.id, title: draft.title, synopsis: draft.synopsis, tags: draft.tags.split(',').map((t) => t.trim()).filter(Boolean), category: draft.category, coverUrl: draft.staticPoster, cover_url: draft.staticPoster, trailer_url: draft.trailer, status: 'draft' });
            await platform.actions.createEpisode({ id: `ep_${Date.now()}`, series_id: id, seriesId: id, number: draft.episodeNumber, title: draft.episodeTitle || 'Episode 1', video_url: draft.episodeUrl, videoUrl: draft.episodeUrl, is_preview: draft.episodePreview, duration_seconds: Number(draft.episodeDuration) || 60 });
            await platform.actions.submitForReview(id);
            setDraft(initialDraft); setStep(0); setFeedback({ type: 'success', message: '提交审核成功，内容已进入待审核队列。' });
          }}>提交审核</button>
        </> : null}

        <div className="row wrap">
          <button className="btn btn-ghost" type="button" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>上一步</button>
          <button className="btn btn-primary" type="button" onClick={nextStep} disabled={step === STEPS.length - 1}>下一步</button>
        </div>
      </section>

      <section className="panel"><h3>当前草稿摘要</h3><p className="small-text">{draft.title || '未命名草稿'} · {highTier ? '高阶 Creator 权益已开启' : '基础 Creator 权益'}</p><p className="small-text">退款提示：{REFUND_POLICY_CONFIG.creator.short} <Link className="text-link" to="/refund">查看详情 →</Link></p></section>
    </div>
  );
}
