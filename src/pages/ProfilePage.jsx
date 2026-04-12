import { Link } from '../lib/router';

export function ProfilePage({ auth, platform }) {
  if (!auth.isLoggedIn) {
    return (
      <section className="panel">
        <h1>用户资料</h1>
        <p className="small-text">请先登录。</p>
        <Link className="btn btn-primary" to="/login">
          去登录
        </Link>
      </section>
    );
  }

  const membership = platform.memberships.find((item) => item.profileId === auth.user.id);
  const unlocked = platform.unlockedContent[auth.user.id] || [];
  const orders = platform.ordersHistory.filter((item) => item.profileId === auth.user.id);

  return (
    <div className="stack-lg">
      <section className="panel">
        <h1>{auth.user.name}</h1>
        <p className="small-text">{auth.user.email}</p>
      </section>

      <section className="grid cards-3">
        <article className="panel"><h3>当前会员状态</h3><p className="small-text">{membership?.tier || 'free'}</p></article>
        <article className="panel"><h3>已解锁内容</h3><p className="small-text">{unlocked.length ? unlocked.join(', ') : '暂无'}</p></article>
        <article className="panel"><h3>订单记录</h3><p className="small-text">{orders.length} 条</p></article>
      </section>

      <section className="panel table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Item</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {orders.map((item) => (
              <tr key={item.id}><td>{item.id}</td><td>{item.item}</td><td>{item.amount}</td><td>{item.status}</td><td>{item.date}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
