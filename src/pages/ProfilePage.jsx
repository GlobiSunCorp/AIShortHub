import { DemoRoleSwitcher } from '../components/DemoRoleSwitcher';
import { Link } from '../lib/router';
import { formatTierLabel, getStatusLabel } from '../lib/roleDisplay';

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
  const statusLabel = getStatusLabel(auth.userState, membership?.tier, auth.user?.tier);

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <h1>{auth.user.name}</h1>
        <p className="small-text">{auth.user.email}</p>
        <div className="grid cards-3">
          <article className="mini-card">
            <h3>Account Status</h3>
            <p className="small-text">{statusLabel.replace('Status: ', '')}</p>
          </article>
          <article className="mini-card">
            <h3>Current Role</h3>
            <p className="small-text">{auth.user.role}</p>
          </article>
          <article className="mini-card">
            <h3>Membership Tier</h3>
            <p className="small-text">{formatTierLabel(auth.user?.tier || membership?.tier || 'free')}</p>
          </article>
        </div>
        <DemoRoleSwitcher auth={auth} />
      </section>

      <section className="grid cards-3">
        <article className="panel"><h3>当前会员状态</h3><p className="small-text">{membership?.tier || auth.user?.tier || 'free'}</p></article>
        <article className="panel"><h3>已解锁内容</h3><p className="small-text">{unlocked.length ? unlocked.join(', ') : '暂无已解锁内容，先去浏览页试试看。'}</p></article>
        <article className="panel"><h3>订单记录</h3><p className="small-text">{orders.length} 条</p></article>
      </section>

      <section className="panel table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Item</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {orders.length ? (
              orders.map((item) => (
                <tr key={item.id}><td>{item.id}</td><td>{item.item}</td><td>{item.amount}</td><td>{item.status}</td><td>{item.date}</td></tr>
              ))
            ) : (
              <tr><td colSpan={5} className="small-text">暂时没有订单记录，先去 Pricing 或 Services 体验一笔流程。</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
