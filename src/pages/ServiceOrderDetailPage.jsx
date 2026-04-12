import { Link } from '../lib/router';

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

  return (
    <section className="panel stack-md">
      <h1>服务订单创建成功</h1>
      <p className="form-feedback success">你的服务订单已进入处理队列，状态会在 Profile 与 Admin 页面同步更新。</p>
      <div className="grid cards-2">
        <article className="mini-card"><h3>订单编号</h3><p className="small-text">{order.id}</p></article>
        <article className="mini-card"><h3>服务类型</h3><p className="small-text">{order.serviceType}</p></article>
        <article className="mini-card"><h3>项目标题</h3><p className="small-text">{order.projectTitle}</p></article>
        <article className="mini-card"><h3>当前状态</h3><p className="small-text">{order.status}</p></article>
        <article className="mini-card"><h3>Plan Entitlement</h3><p className="small-text">{order.entitlement || 'Optional'}</p></article>
        <article className="mini-card"><h3>Add-on Price</h3><p className="small-text">{order.addOnPrice || 'TBD'}</p></article>
      </div>
      <article className="panel"><h3>下一步建议</h3><p className="small-text">{order.nextStep || '等待服务团队分配。'}</p></article>
      <div className="row wrap">
        <Link className="btn btn-ghost" to="/services">返回服务页</Link>
        <Link className="btn btn-primary" to="/profile">去个人中心</Link>
        {auth?.userState === 'admin' ? <Link className="btn btn-ghost" to="/admin">去 Admin 查看</Link> : null}
      </div>
    </section>
  );
}
