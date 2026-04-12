import { useMemo, useState } from 'react';

export function CreatorDashboardPage({ auth, platform }) {
  const [seriesForm, setSeriesForm] = useState({ title: '', synopsis: '', tags: '', category: 'Romance', tiktokHook: '', coverUrl: '', trailerUrl: '' });
  const [episodeForm, setEpisodeForm] = useState({ seriesId: '', title: '', number: 1, videoUrl: '', isPreview: true, durationSeconds: 60 });

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

  if (!auth.isLoggedIn) return <section className="panel">请先登录创作者账户。</section>;
  if (!['creator', 'admin'].includes(auth.userState)) return <section className="panel">当前账号不是 creator，无法上传与提交审核。</section>;

  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>Creator Dashboard</h1>
        <p className="small-text">创建新剧集、上传分集、填写 trailer / cover / description / tags，并提交 admin 审核。</p>
      </section>

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
        <textarea className="input" placeholder="简介（description）" value={seriesForm.synopsis} onChange={(e) => setSeriesForm((p) => ({ ...p, synopsis: e.target.value }))} />
        <input className="input" placeholder="标签（tags，逗号分隔）" value={seriesForm.tags} onChange={(e) => setSeriesForm((p) => ({ ...p, tags: e.target.value }))} />
        <input className="input" placeholder="Cover URL" value={seriesForm.coverUrl} onChange={(e) => setSeriesForm((p) => ({ ...p, coverUrl: e.target.value }))} />
        <input className="input" placeholder="Trailer URL" value={seriesForm.trailerUrl} onChange={(e) => setSeriesForm((p) => ({ ...p, trailerUrl: e.target.value }))} />
        <input className="input" placeholder="TikTok 引流话题/钩子" value={seriesForm.tiktokHook} onChange={(e) => setSeriesForm((p) => ({ ...p, tiktokHook: e.target.value }))} />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (!seriesForm.title) return;
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
          }}
        >
          保存草稿
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
        <input className="input" placeholder="分集标题" value={episodeForm.title} onChange={(e) => setEpisodeForm((p) => ({ ...p, title: e.target.value }))} />
        <input className="input" type="number" min={1} placeholder="排序" value={episodeForm.number} onChange={(e) => setEpisodeForm((p) => ({ ...p, number: Number(e.target.value) }))} />
        <input className="input" type="number" min={10} placeholder="时长（秒）" value={episodeForm.durationSeconds} onChange={(e) => setEpisodeForm((p) => ({ ...p, durationSeconds: Number(e.target.value) }))} />
        <input className="input" placeholder="视频 URL" value={episodeForm.videoUrl} onChange={(e) => setEpisodeForm((p) => ({ ...p, videoUrl: e.target.value }))} />
        <label className="small-text">
          <input type="checkbox" checked={episodeForm.isPreview} onChange={(e) => setEpisodeForm((p) => ({ ...p, isPreview: e.target.checked }))} /> 试看开关
        </label>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (!episodeForm.seriesId || !episodeForm.title) return;
            platform.actions.createEpisode(episodeForm);
            setEpisodeForm({ seriesId: '', title: '', number: 1, videoUrl: '', isPreview: true, durationSeconds: 60 });
          }}
        >
          上传分集
        </button>
      </section>

      <section className="panel">
        <h2>提交审核（pending review）</h2>
        <div className="row wrap">
          {mySeries.map((item) => (
            <button className="btn btn-ghost" type="button" key={item.id} onClick={() => platform.actions.submitForReview(item.id)}>
              提交《{item.title}》审核（当前：{item.status}）
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
