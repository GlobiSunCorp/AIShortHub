import { useMemo, useState } from 'react';
import { AccessGuidePanel } from '../components/AccessGuidePanel';
import { ADD_ON_SERVICES, CREATOR_ASSETS, getServiceEntitlement } from '../data/monetization';
import { canAccessCreatorStudio, isHighTierCreator, resolveMembership } from '../hooks/usePlanAccess';
import { isValidUrl, minLength } from '../lib/validation';

const STEPS = ['Basic Info', 'Assets', 'Episodes', 'Publishing & Review'];

const initialDraft = {
  title: '', synopsis: '', tags: '', category: 'Romance', language: 'English', seriesStatus: 'ongoing', audience: '',
  staticPoster: '', motionPoster: '', thumbnail: '', trailer: '', tiktokHook: '', landscapeCover: '', portraitCover: '',
  episodeTitle: '', episodeNumber: 1, episodeUrl: '', episodeDuration: 60, episodePreview: true, episodeSynopsis: '',
  visibility: 'private', recommendSlot: false, selectedServices: [], checklistReady: false,
};

export function CreatorDashboardPage({ auth, platform }) {
  const membership = resolveMembership(auth, platform);
  const hasStudioAccess = canAccessCreatorStudio(auth, platform);
  const highTier = isHighTierCreator(auth, platform);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(initialDraft);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const myCreator = platform.creators.find((item) => item.profileId === auth.user?.id) || platform.creators[0];
  const mySeries = platform.series.filter((item) => item.creatorId === myCreator.id);

  const metrics = useMemo(() => [['我的剧集', mySeries.length], ['待审核', mySeries.filter((item) => item.status === 'pending_review').length], ['已发布', mySeries.filter((item) => item.status === 'published').length]], [mySeries]);

  const validateStep = () => {
    const next = {};
    if (step === 0) {
      if (!minLength(draft.title, 2)) next.title = '剧名至少 2 个字符';
      if (!minLength(draft.synopsis, 12)) next.synopsis = '简介至少 12 个字符';
      if (!minLength(draft.tags, 2)) next.tags = '请填写标签';
      if (!minLength(draft.audience, 2)) next.audience = '请填写面向受众';
    }
    if (step === 1) {
      if (!isValidUrl(draft.staticPoster)) next.staticPoster = 'Static Poster URL 格式错误';
      if (draft.motionPoster && !isValidUrl(draft.motionPoster)) next.motionPoster = 'Motion Poster URL 格式错误';
      if (!isValidUrl(draft.thumbnail)) next.thumbnail = 'Thumbnail URL 格式错误';
    }
    if (step === 2) {
      if (!minLength(draft.episodeTitle, 2)) next.episodeTitle = '分集标题至少 2 字';
      if (!isValidUrl(draft.episodeUrl)) next.episodeUrl = '视频 URL 格式错误';
      if (Number(draft.episodeDuration) < 10) next.episodeDuration = '时长至少 10 秒';
    }
    if (step === 3 && !draft.checklistReady) next.checklistReady = '提交审核前请勾选检查清单';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return setFeedback({ type: 'error', message: '当前步骤校验未通过，请修正后继续。' });
    setFeedback({ type: 'success', message: `${STEPS[step]} 已完成。` });
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  if (!auth.isLoggedIn) return <AccessGuidePanel currentRoleLabel="Guest" requiredRoleLabel="Creator / Admin" reason="Creator Studio 需要登录后进入。" action={<button className="btn btn-primary" onClick={() => auth.switchDemoRole('creator_pro')}>切换为 Creator</button>} />;
  if (!hasStudioAccess) return <AccessGuidePanel currentRoleLabel={auth.userState} requiredRoleLabel="Creator Plan" reason="当前账号没有 Creator Plan，请先升级。" action={<button className="btn btn-primary" onClick={() => auth.switchDemoRole('creator_basic')}>开启 Creator Basic</button>} />;

  return (
    <div className="stack-lg">
      <section className="panel"><h1>Creator Studio</h1><p className="small-text">专业化上传工作流：{STEPS[step]}（Step {step + 1}/4）</p></section>
      {feedback.message ? <section className="panel"><p className={`form-feedback ${feedback.type}`}>{feedback.message}</p></section> : null}
      <section className="grid cards-3">{metrics.map(([label, value]) => <article className="stat-card" key={label}><p className="small-text">{label}</p><h3>{value}</h3></article>)}</section>
      <section className="panel"><div className="row wrap">{STEPS.map((item, idx) => <span key={item} className={`status ${idx === step ? 'ok' : ''}`}>Step {idx + 1}: {item}</span>)}</div></section>

      <section className="panel form-grid">
        {step === 0 ? <>
          <h2>Step 1: Basic Info</h2><p className="small-text">填写核心元数据：剧名、简介、标签、分类、语言、状态和受众。</p>
          <input className="input" placeholder="剧名" value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} />{errors.title ? <span className="form-feedback error">{errors.title}</span> : null}
          <textarea className="input" placeholder="简介" value={draft.synopsis} onChange={(e) => setDraft((p) => ({ ...p, synopsis: e.target.value }))} />{errors.synopsis ? <span className="form-feedback error">{errors.synopsis}</span> : null}
          <input className="input" placeholder="标签" value={draft.tags} onChange={(e) => setDraft((p) => ({ ...p, tags: e.target.value }))} />{errors.tags ? <span className="form-feedback error">{errors.tags}</span> : null}
          <input className="input" placeholder="面向受众" value={draft.audience} onChange={(e) => setDraft((p) => ({ ...p, audience: e.target.value }))} />{errors.audience ? <span className="form-feedback error">{errors.audience}</span> : null}
        </> : null}

        {step === 1 ? <>
          <h2>Step 2: Assets</h2><p className="small-text">内容资产与服务拆分：Assets 为上传内容的一部分，服务为平台加购。</p>
          <p className="small-text">Assets: {CREATOR_ASSETS.join(' · ')}</p>
          <input className="input" placeholder="Static Poster URL" value={draft.staticPoster} onChange={(e) => setDraft((p) => ({ ...p, staticPoster: e.target.value }))} />{errors.staticPoster ? <span className="form-feedback error">{errors.staticPoster}</span> : null}
          <input className="input" placeholder="Motion Poster URL" value={draft.motionPoster} onChange={(e) => setDraft((p) => ({ ...p, motionPoster: e.target.value }))} />{errors.motionPoster ? <span className="form-feedback error">{errors.motionPoster}</span> : null}
          <input className="input" placeholder="Cover Thumbnail URL" value={draft.thumbnail} onChange={(e) => setDraft((p) => ({ ...p, thumbnail: e.target.value }))} />{errors.thumbnail ? <span className="form-feedback error">{errors.thumbnail}</span> : null}
          <input className="input" placeholder="Trailer URL" value={draft.trailer} onChange={(e) => setDraft((p) => ({ ...p, trailer: e.target.value }))} />
          <input className="input" placeholder="TikTok Hook URL" value={draft.tiktokHook} onChange={(e) => setDraft((p) => ({ ...p, tiktokHook: e.target.value }))} />
          <div className="grid cards-2">{ADD_ON_SERVICES.map((s) => <article key={s.id} className="mini-card"><h4>{s.name}</h4><p className="small-text">{getServiceEntitlement(s, membership.creatorPlan || 'creator_basic')}</p></article>)}</div>
        </> : null}

        {step === 2 ? <>
          <h2>Step 3: Episodes</h2><p className="small-text">上传分集信息：标题、排序、视频 URL、时长、试看、简介。</p>
          <input className="input" placeholder="分集标题" value={draft.episodeTitle} onChange={(e) => setDraft((p) => ({ ...p, episodeTitle: e.target.value }))} />{errors.episodeTitle ? <span className="form-feedback error">{errors.episodeTitle}</span> : null}
          <input className="input" type="number" value={draft.episodeNumber} onChange={(e) => setDraft((p) => ({ ...p, episodeNumber: Number(e.target.value) }))} />
          <input className="input" placeholder="视频 URL" value={draft.episodeUrl} onChange={(e) => setDraft((p) => ({ ...p, episodeUrl: e.target.value }))} />{errors.episodeUrl ? <span className="form-feedback error">{errors.episodeUrl}</span> : null}
          <input className="input" type="number" value={draft.episodeDuration} onChange={(e) => setDraft((p) => ({ ...p, episodeDuration: Number(e.target.value) }))} />{errors.episodeDuration ? <span className="form-feedback error">{errors.episodeDuration}</span> : null}
          <label className="small-text"><input type="checkbox" checked={draft.episodePreview} onChange={(e) => setDraft((p) => ({ ...p, episodePreview: e.target.checked }))} /> 是否试看</label>
          <textarea className="input" placeholder="每集简介" value={draft.episodeSynopsis} onChange={(e) => setDraft((p) => ({ ...p, episodeSynopsis: e.target.value }))} />
        </> : null}

        {step === 3 ? <>
          <h2>Step 4: Publishing & Review</h2><p className="small-text">设置可见范围、推荐位申请、附加服务并提交审核。</p>
          <label>可见范围<select className="input" value={draft.visibility} onChange={(e) => setDraft((p) => ({ ...p, visibility: e.target.value }))}><option value="private">Private</option><option value="public">Public</option></select></label>
          <label className="small-text"><input type="checkbox" checked={draft.recommendSlot} onChange={(e) => setDraft((p) => ({ ...p, recommendSlot: e.target.checked }))} /> 申请推荐位</label>
          <label className="small-text"><input type="checkbox" checked={draft.checklistReady} onChange={(e) => setDraft((p) => ({ ...p, checklistReady: e.target.checked }))} /> 提交审核前检查清单已完成</label>{errors.checklistReady ? <span className="form-feedback error">{errors.checklistReady}</span> : null}
          <button className="btn btn-primary" type="button" onClick={() => {
            if (!validateStep()) return setFeedback({ type: 'error', message: '提交失败，请完成检查清单。' });
            const id = draft.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            platform.actions.createSeries({ id, creatorId: myCreator.id, title: draft.title, synopsis: draft.synopsis, tags: draft.tags.split(',').map((t) => t.trim()).filter(Boolean), category: draft.category, tiktokHook: draft.tiktokHook, coverUrl: draft.staticPoster, trailerId: `t_${id}` });
            platform.actions.createEpisode({ seriesId: id, number: draft.episodeNumber, title: draft.episodeTitle, videoUrl: draft.episodeUrl, isPreview: draft.episodePreview, durationSeconds: draft.episodeDuration });
            platform.actions.submitForReview(id);
            setDraft(initialDraft);
            setStep(0);
            setFeedback({ type: 'success', message: '提交审核成功，内容已进入待审核队列。' });
          }}>提交审核</button>
        </> : null}

        <div className="row wrap">
          <button className="btn btn-ghost" type="button" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>上一步</button>
          <button className="btn btn-ghost" type="button" onClick={() => setFeedback({ type: 'success', message: '保存草稿成功。' })}>保存草稿</button>
          <button className="btn btn-primary" type="button" onClick={nextStep} disabled={step === STEPS.length - 1}>下一步</button>
        </div>
      </section>

      <section className="panel"><h3>当前草稿摘要</h3><p className="small-text">{draft.title || '未命名草稿'} · {draft.tags || '无标签'} · {highTier ? '高阶 Creator 权益已开启' : '基础 Creator 权益'}</p></section>
    </div>
  );
}
