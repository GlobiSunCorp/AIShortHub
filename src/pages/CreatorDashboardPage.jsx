import { useMemo, useState } from 'react';

const serviceTypes = ['Trailer Editing', 'Cover Design', 'Listing Packaging', 'TikTok Promo Pack', 'Subtitle / Localization'];

export function CreatorDashboardPage({ auth, platform }) {
  const [seriesForm, setSeriesForm] = useState({ title: '', synopsis: '', tags: '', category: 'Romance', tiktokHook: '' });
  const [episodeForm, setEpisodeForm] = useState({ seriesId: '', title: '', number: 1, videoUrl: '', isPreview: true });
  const [serviceForm, setServiceForm] = useState({ serviceType: serviceTypes[0], seriesTitle: '', requirement: '', budgetRange: '$200-$500', contact: '' });

  const myCreator = platform.creators.find((item) => item.profileId === auth.user?.id) || platform.creators[0];
  const mySeries = platform.series.filter((item) => item.creatorId === myCreator.id);
  const totalPlays = mySeries.length * 1200;

  const metrics = useMemo(
    () => [
      ['我的剧集', mySeries.length],
      ['总播放', totalPlays],
      ['会员观看(占位)', `${Math.round(totalPlays * 0.41)}`],
      ['服务订单', platform.serviceOrders.filter((o) => o.requesterId === auth.user?.id).length],
    ],
    [mySeries.length, totalPlays, platform.serviceOrders, auth.user?.id]
  );

  if (!auth.isLoggedIn) return <section className="panel">请先登录创作者账户。</section>;

  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>Creator Dashboard</h1>
        <p className="small-text">支持创建剧集、上传分集、提交审核、查看收益与服务订单入口（含 TikTok Promo Pack）。</p>
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
        <textarea className="input" placeholder="简介" value={seriesForm.synopsis} onChange={(e) => setSeriesForm((p) => ({ ...p, synopsis: e.target.value }))} />
        <input className="input" placeholder="标签(逗号分隔)" value={seriesForm.tags} onChange={(e) => setSeriesForm((p) => ({ ...p, tags: e.target.value }))} />
        <input className="input" placeholder="TikTok 引流话题/钩子" value={seriesForm.tiktokHook} onChange={(e) => setSeriesForm((p) => ({ ...p, tiktokHook: e.target.value }))} />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (!seriesForm.title) return;
            const id = seriesForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            platform.actions.createSeries({
              id,
              creatorId: myCreator.id,
              title: seriesForm.title,
              synopsis: seriesForm.synopsis,
              tags: seriesForm.tags.split(',').map((item) => item.trim()).filter(Boolean),
              category: seriesForm.category,
              tiktokHook: seriesForm.tiktokHook,
            });
            setSeriesForm({ title: '', synopsis: '', tags: '', category: 'Romance', tiktokHook: '' });
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
            setEpisodeForm({ seriesId: '', title: '', number: 1, videoUrl: '', isPreview: true });
          }}
        >
          上传分集
        </button>
      </section>

      <section className="panel">
        <h2>提交审核</h2>
        <div className="row wrap">
          {mySeries.map((item) => (
            <button className="btn btn-ghost" type="button" key={item.id} onClick={() => platform.actions.submitForReview(item.id)}>
              提交《{item.title}》审核
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>收益页面</h2>
        <p className="small-text">可提现余额（占位）：$992 · 累计收益（占位）：$1,240</p>
        <p className="small-text">平台抽成：{(platform.platformConfig.platformTakeRate * 100).toFixed(0)}%（可配置）。</p>
      </section>

      <section className="panel form-grid">
        <h2>服务订单入口（含 TikTok Promo Pack）</h2>
        <select className="input" value={serviceForm.serviceType} onChange={(e) => setServiceForm((p) => ({ ...p, serviceType: e.target.value }))}>
          {serviceTypes.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <input className="input" placeholder="作品名" value={serviceForm.seriesTitle} onChange={(e) => setServiceForm((p) => ({ ...p, seriesTitle: e.target.value }))} />
        <textarea className="input" placeholder="需求描述" value={serviceForm.requirement} onChange={(e) => setServiceForm((p) => ({ ...p, requirement: e.target.value }))} />
        <input className="input" placeholder="预算区间" value={serviceForm.budgetRange} onChange={(e) => setServiceForm((p) => ({ ...p, budgetRange: e.target.value }))} />
        <input className="input" placeholder="联系方式" value={serviceForm.contact} onChange={(e) => setServiceForm((p) => ({ ...p, contact: e.target.value }))} />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (!serviceForm.seriesTitle) return;
            platform.actions.createServiceOrder({ ...serviceForm, requesterId: auth.user.id });
            setServiceForm({ serviceType: serviceTypes[0], seriesTitle: '', requirement: '', budgetRange: '$200-$500', contact: '' });
          }}
        >
          提交服务需求
        </button>
      </section>
    </div>
  );
}
