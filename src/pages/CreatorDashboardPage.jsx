import { useMemo, useState } from 'react';
import { AccessGuidePanel } from '../components/AccessGuidePanel';
import { isValidUrl, minLength } from '../lib/validation';

export function CreatorDashboardPage({ auth, platform }) {
  const [seriesForm, setSeriesForm] = useState({ title: '', synopsis: '', tags: '', category: 'Romance', tiktokHook: '', coverUrl: '', trailerUrl: '' });
  const [episodeForm, setEpisodeForm] = useState({ seriesId: '', title: '', number: 1, videoUrl: '', isPreview: true, durationSeconds: 60 });

  const [seriesErrors, setSeriesErrors] = useState({});
  const [episodeErrors, setEpisodeErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isSavingSeries, setIsSavingSeries] = useState(false);
  const [isSavingEpisode, setIsSavingEpisode] = useState(false);

  const myCreator = platform.creators.find((item) => item.profileId === auth.user?.id) || platform.creators[0];
  const mySeries = platform.series.filter((item) => item.creatorId === myCreator.id);
  const totalPlays = mySeries.length * 1200;

  const metrics = useMemo(
    () => [
      ['我的剧集', mySeries.length],
      ['总播放', totalPlays],
      ['待审核', mySeries.filter((item) => item.status === 'pending_review').length],
      ['已发布', mySeries.filter((item) => item.status === 'published').length],
    ],
    [mySeries, totalPlays]
  );

  const validateSeriesForm = () => {
    const errors = {};
    if (!minLength(seriesForm.title, 2)) errors.title = '标题至少 2 个字符。';
    if (!minLength(seriesForm.synopsis, 12)) errors.synopsis = '简介至少 12 个字符。';
    if (!minLength(seriesForm.tags, 2)) errors.tags = '请至少填写一个标签。';
    if (seriesForm.coverUrl && !isValidUrl(seriesForm.coverUrl)) errors.coverUrl = '封面 URL 格式错误。';
    if (seriesForm.trailerUrl && !isValidUrl(seriesForm.trailerUrl)) errors.trailerUrl = 'Trailer URL 格式错误。';
    setSeriesErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEpisodeForm = () => {
    const errors = {};
    if (!episodeForm.seriesId) errors.seriesId = '请选择要上传的剧集。';
    if (!minLength(episodeForm.title, 2)) errors.title = '分集标题至少 2 个字符。';
    if (!isValidUrl(episodeForm.videoUrl)) errors.videoUrl = '视频 URL 格式错误。';
    if (Number(episodeForm.durationSeconds) < 10) errors.durationSeconds = '时长至少 10 秒。';
    setEpisodeErrors(errors);
    return Object.keys(errors).length === 0;
  };

  if (!auth.isLoggedIn) {
    return (
      <AccessGuidePanel
        currentRoleLabel="Guest"
        requiredRoleLabel="Creator / Admin"
        reason="创作者中心需要登录后才能创建剧集与上传分集。"
        action={
          <button type="button" className="btn btn-primary" onClick={() => auth.switchDemoRole('creator')}>
            切换为 Creator
          </button>
        }
      />
    );
  }

  if (!['creator', 'admin'].includes(auth.userState)) {
    return (
      <AccessGuidePanel
        currentRoleLabel={auth.userState}
        requiredRoleLabel="Creator / Admin"
        reason="当前角色没有内容上传权限，请切换到 Creator 或 Admin 以测试上传与提审流程。"
        action={
          <button type="button" className="btn btn-primary" onClick={() => auth.switchDemoRole('creator')}>
            一键切换为 Creator
          </button>
        }
      />
    );
  }

  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>Creator Dashboard</h1>
        <p className="small-text">创建新剧集、上传分集、填写 trailer / cover / description / tags，并提交 admin 审核。</p>
      </section>

      {feedback.message ? <section className="panel"><p className={`form-feedback ${feedback.type}`}>{feedback.message}</p></section> : null}

      <section className="grid cards-4">
        {metrics.map(([label, value]) => (
          <article className="stat-card" key={label}>
            <p className="small-text">{label}</p>
            <h3>{value}</h3>
          </article>
        ))}
      </section>

      <section className="panel form-grid">
        <h2>创建剧集</h2>
        <input className="input" placeholder="标题" value={seriesForm.title} onChange={(e) => setSeriesForm((p) => ({ ...p, title: e.target.value }))} />
        {seriesErrors.title ? <span className="form-feedback error">{seriesErrors.title}</span> : null}
        <textarea className="input" placeholder="简介（description）" value={seriesForm.synopsis} onChange={(e) => setSeriesForm((p) => ({ ...p, synopsis: e.target.value }))} />
        {seriesErrors.synopsis ? <span className="form-feedback error">{seriesErrors.synopsis}</span> : null}
        <input className="input" placeholder="标签（tags，逗号分隔）" value={seriesForm.tags} onChange={(e) => setSeriesForm((p) => ({ ...p, tags: e.target.value }))} />
        {seriesErrors.tags ? <span className="form-feedback error">{seriesErrors.tags}</span> : null}
        <input className="input" placeholder="Cover URL" value={seriesForm.coverUrl} onChange={(e) => setSeriesForm((p) => ({ ...p, coverUrl: e.target.value }))} />
        {seriesErrors.coverUrl ? <span className="form-feedback error">{seriesErrors.coverUrl}</span> : null}
        <input className="input" placeholder="Trailer URL" value={seriesForm.trailerUrl} onChange={(e) => setSeriesForm((p) => ({ ...p, trailerUrl: e.target.value }))} />
        {seriesErrors.trailerUrl ? <span className="form-feedback error">{seriesErrors.trailerUrl}</span> : null}
        <input className="input" placeholder="TikTok 引流话题/钩子" value={seriesForm.tiktokHook} onChange={(e) => setSeriesForm((p) => ({ ...p, tiktokHook: e.target.value }))} />
        <button
          type="button"
          className="btn btn-primary"
          disabled={isSavingSeries}
          onClick={async () => {
            if (!validateSeriesForm()) {
              setFeedback({ type: 'error', message: '创建剧集失败，请修正表单后重试。' });
              return;
            }

            setIsSavingSeries(true);
            const id = seriesForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const trailerId = `t_${id}`;
            platform.actions.createSeries({
              id,
              creatorId: myCreator.id,
              title: seriesForm.title,
              synopsis: seriesForm.synopsis,
              tags: seriesForm.tags.split(',').map((item) => item.trim()).filter(Boolean),
              category: seriesForm.category,
              tiktokHook: seriesForm.tiktokHook,
              coverUrl: seriesForm.coverUrl,
              trailerId,
            });

            if (seriesForm.trailerUrl) {
              platform.actions.upsertTrailer({
                id: trailerId,
                seriesId: id,
                title: `${seriesForm.title} Trailer`,
                videoUrl: seriesForm.trailerUrl,
                durationSeconds: 30,
              });
            }

            setSeriesForm({ title: '', synopsis: '', tags: '', category: 'Romance', tiktokHook: '', coverUrl: '', trailerUrl: '' });
            setSeriesErrors({});
            setFeedback({ type: 'success', message: '保存草稿成功，已加入你的剧集列表。' });
            setIsSavingSeries(false);
          }}
        >
          {isSavingSeries ? '保存中...' : '保存草稿'}
        </button>
      </section>

      <section className="panel form-grid">
        <h2>上传分集</h2>
        <select className="input" value={episodeForm.seriesId} onChange={(e) => setEpisodeForm((p) => ({ ...p, seriesId: e.target.value }))}>
          <option value="">选择剧集</option>
          {mySeries.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
        {episodeErrors.seriesId ? <span className="form-feedback error">{episodeErrors.seriesId}</span> : null}
        <input className="input" placeholder="分集标题" value={episodeForm.title} onChange={(e) => setEpisodeForm((p) => ({ ...p, title: e.target.value }))} />
        {episodeErrors.title ? <span className="form-feedback error">{episodeErrors.title}</span> : null}
        <input className="input" type="number" min={1} placeholder="排序" value={episodeForm.number} onChange={(e) => setEpisodeForm((p) => ({ ...p, number: Number(e.target.value) }))} />
        <input
          className="input"
          type="number"
          min={10}
          placeholder="时长（秒）"
          value={episodeForm.durationSeconds}
          onChange={(e) => setEpisodeForm((p) => ({ ...p, durationSeconds: Number(e.target.value) }))}
        />
        {episodeErrors.durationSeconds ? <span className="form-feedback error">{episodeErrors.durationSeconds}</span> : null}
        <input className="input" placeholder="视频 URL" value={episodeForm.videoUrl} onChange={(e) => setEpisodeForm((p) => ({ ...p, videoUrl: e.target.value }))} />
        {episodeErrors.videoUrl ? <span className="form-feedback error">{episodeErrors.videoUrl}</span> : null}
        <label className="small-text">
          <input type="checkbox" checked={episodeForm.isPreview} onChange={(e) => setEpisodeForm((p) => ({ ...p, isPreview: e.target.checked }))} /> 试看开关
        </label>
        <button
          type="button"
          className="btn btn-primary"
          disabled={isSavingEpisode}
          onClick={() => {
            if (!validateEpisodeForm()) {
              setFeedback({ type: 'error', message: '上传分集失败，请修正字段后重试。' });
              return;
            }
            setIsSavingEpisode(true);
            platform.actions.createEpisode(episodeForm);
            setEpisodeForm({ seriesId: '', title: '', number: 1, videoUrl: '', isPreview: true, durationSeconds: 60 });
            setEpisodeErrors({});
            setFeedback({ type: 'success', message: '上传分集成功，分集已加入待发布列表。' });
            setIsSavingEpisode(false);
          }}
        >
          {isSavingEpisode ? '上传中...' : '上传分集'}
        </button>
      </section>

      <section className="panel">
        <h2>提交审核（pending review）</h2>
        <div className="row wrap">
          {mySeries.length ? (
            mySeries.map((item) => (
              <button
                className="btn btn-ghost"
                type="button"
                key={item.id}
                onClick={() => {
                  platform.actions.submitForReview(item.id);
                  setFeedback({ type: 'success', message: `《${item.title}》已提交审核，等待 Admin 处理。` });
                }}
              >
                提交《{item.title}》审核（当前：{item.status}）
              </button>
            ))
          ) : (
            <p className="small-text">暂无剧集草稿，请先创建剧集。</p>
          )}
        </div>
      </section>
    </div>
  );
}
