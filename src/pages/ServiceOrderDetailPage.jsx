import { Link } from '../lib/router';

export function ServiceOrderDetailPage({ id, platform }) {
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
      <h1>提交成功</h1>
      <p className="form-feedback success">你的服务订单已创建，管理员会在队列中跟进处理。</p>
      <div className="grid cards-2">
        <article className="mini-card">
          <h3>订单编号</h3>
          <p className="small-text">{order.id}</p>
        </article>
        <article className="mini-card">
          <h3>服务类型</h3>
          <p className="small-text">{order.serviceType}</p>
        </article>
        <article className="mini-card">
          <h3>项目标题</h3>
          <p className="small-text">{order.projectTitle}</p>
        </article>
        <article className="mini-card">
          <h3>当前状态</h3>
          <p className="small-text">{order.status}</p>
        </article>
      </div>
      <div className="row wrap">
        <Link className="btn btn-ghost" to="/services">
          返回服务页
        </Link>
        <Link className="btn btn-primary" to="/profile">
          去个人中心查看
        </Link>
      </div>
    </section>
  );
}
