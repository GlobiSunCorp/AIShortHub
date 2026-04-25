import { Link } from '../lib/router';

function statusTone(status) {
  if (status === 'completed') return 'ok';
  if (status === 'in_progress') return 'upgrade';
  if (status === 'pending_payment') return 'warn';
  return 'neutral';
}

function toneStyle(tone) {
  const styles = {
    ok: { borderColor: 'rgba(139, 225, 172, 0.3)', background: 'linear-gradient(145deg, rgba(23, 56, 45, 0.28), rgba(13, 16, 30, 0.94))' },
    upgrade: { borderColor: 'rgba(181, 139, 255, 0.35)', background: 'linear-gradient(145deg, rgba(43, 30, 73, 0.38), rgba(13, 16, 30, 0.94))' },
    warn: { borderColor: 'rgba(255, 193, 104, 0.34)', background: 'linear-gradient(145deg, rgba(72, 47, 15, 0.3), rgba(13, 16, 30, 0.94))' },
    neutral: { borderColor: 'rgba(144, 161, 255, 0.2)', background: 'linear-gradient(145deg, rgba(24, 31, 58, 0.34), rgba(13, 16, 30, 0.94))' },
  };
  return styles[tone] || styles.neutral;
}

function formatTime(value) {
  if (!value) return 'Recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleString();
}

function buildOrderTimeline(order) {
  const timeline = [
    {
      id: 'created',
      title: 'Order created',
      body: `${order.serviceType || 'Service'} request entered AIShortHub service queue.`,
      time: formatTime(order.createdAt || order.created_at),
      tone: 'ok',
    },
  ];

  if (order.status === 'pending_payment') {
    timeline.push({ id: 'payment', title: 'Payment required', body: 'Complete checkout to unlock production scheduling.', time: 'Current step', tone: 'warn' });
  } else {
    timeline.push({ id: 'payment', title: 'Payment / entitlement checked', body: order.entitlement === 'Included' ? 'This service is included in your current creator plan.' : 'Payment or service entitlement has been recorded.', time: formatTime(order.updatedAt || order.updated_at), tone: 'ok' });
  }

  if (['pending', 'in_progress', 'completed'].includes(order.status)) {
    timeline.push({ id: 'queue', title: 'Ops queue', body: order.nextStep || 'Service team reviews scope, assets, timing, and delivery notes.', time: order.status === 'pending' ? 'Current step' : formatTime(order.updatedAt || order.updated_at), tone: order.status === 'pending' ? 'upgrade' : 'ok' });
  }

  if (['in_progress', 'completed'].includes(order.status)) {
    timeline.push({ id: 'production', title: 'Production started', body: order.reviewNote || order.admin_note || 'Work is in progress. Check back here for the latest admin update.', time: order.status === 'in_progress' ? 'Current step' : formatTime(order.updatedAt || order.updated_at), tone: order.status === 'in_progress' ? 'upgrade' : 'ok' });
  }

  if (order.status === 'completed') {
    timeline.push({ id: 'done', title: 'Completed', body: 'Delivery is marked complete. Keep screenshots and final files attached to the project record.', time: formatTime(order.updatedAt || order.updated_at), tone: 'ok' });
  }

  return timeline;
}

export function ServiceOrderDetailPage({ id, platform, auth }) {
  const order = platform.serviceOrders.find((item) => item.id === id);

  if (!order) {
    return (
      <section className="panel stack-md">
        <h1>订单不存在</h1>
        <p className="small-text">未找到订单编号 {id}，可能尚未创建或链接已失效。</p>
        <Link className="btn btn-primary" to="/services">
          返回服务页
        </Link>
      </section>
    );
  }

  const timeline = buildOrderTimeline(order);
  const tone = statusTone(order.status);

  return (
    <section className="panel stack-md">
      <div className="row wrap center" style={{ justifyContent: 'space-between' }}>
        <div>
          <p className="ds-caption">Service Order Detail</p>
          <h1>服务订单创建成功</h1>
          <p className="form-feedback success">你的服务订单已进入处理队列，状态会在 Profile 与 Admin 页面同步更新。</p>
        </div>
        <span className="meta-pill" style={{ ...toneStyle(tone), padding: '0.55rem 0.9rem' }}>Status · {order.status}</span>
      </div>

      <div className="grid cards-3">
        <article className="mini-card"><h3>订单编号</h3><p className="small-text">{order.id}</p></article>
        <article className="mini-card"><h3>服务类型</h3><p className="small-text">{order.serviceType}</p></article>
        <article className="mini-card"><h3>项目标题</h3><p className="small-text">{order.projectTitle}</p></article>
        <article className="mini-card"><h3>当前状态</h3><p className="small-text">{order.status}</p></article>
        <article className="mini-card"><h3>Plan Entitlement</h3><p className="small-text">{order.entitlement || 'Optional'}</p></article>
        <article className="mini-card"><h3>Add-on Price</h3><p className="small-text">{order.addOnPrice || 'TBD'}</p></article>
      </div>

      <article className="panel stack-sm" style={toneStyle(tone)}>
        <h3>下一步建议</h3>
        <p className="small-text">{order.nextStep || '等待服务团队分配。'}</p>
        {order.reviewNote || order.admin_note ? <p className="small-text">Admin note: {order.reviewNote || order.admin_note}</p> : null}
      </article>

      <article className="panel stack-md">
        <div className="ds-section-heading">
          <h2 className="ds-h2">Order Timeline</h2>
          <p className="ds-meta">A clear record of payment, queue, production, and delivery updates.</p>
        </div>
        <div className="stack-md">
          {timeline.map((item) => (
            <article key={item.id} className="mini-card" style={{ borderRadius: '24px', ...toneStyle(item.tone) }}>
              <div className="row wrap center" style={{ justifyContent: 'space-between' }}>
                <strong>{item.title}</strong>
                <span className="meta-pill">{item.time}</span>
              </div>
              <p className="ds-meta">{item.body}</p>
            </article>
          ))}
        </div>
      </article>

      <div className="row wrap">
        <Link className="btn btn-ghost" to="/services">返回服务页</Link>
        <Link className="btn btn-primary" to="/profile">去个人中心</Link>
        {auth?.userState === 'admin' ? <Link className="btn btn-ghost" to="/admin">去 Admin 查看</Link> : null}
      </div>
    </section>
  );
}
