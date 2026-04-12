import { DemoRoleSwitcher } from '../components/DemoRoleSwitcher';
import { Link } from '../lib/router';
import { ADD_ON_SERVICES, formatCommission, getCreatorPlan, getServiceEntitlement, getViewerPlan } from '../data/monetization';
import { getCommissionForUser, resolveMembership } from '../hooks/usePlanAccess';
import { getStatusLabel } from '../lib/roleDisplay';

export function ProfilePage({ auth, platform }) {
  if (!auth.isLoggedIn) {
    return (
      <section className="panel">
        <h1>账号中心</h1>
        <p className="small-text">请先登录。</p>
        <Link className="btn btn-primary" to="/login">去登录</Link>
      </section>
    );
  }

  const membership = resolveMembership(auth, platform);
  const viewerPlan = getViewerPlan(membership.tier);
  const creatorPlan = membership.creatorPlan ? getCreatorPlan(membership.creatorPlan) : null;
  const statusLabel = getStatusLabel(auth.userState, membership.tier, auth.user?.tier, membership.creatorPlan);
  const commission = creatorPlan ? formatCommission(getCommissionForUser(auth, platform)) : 'N/A';
  const orders = platform.serviceOrders.filter((item) => item.requesterId === auth.user.id).slice(0, 3);
  const creator = platform.creators.find((item) => item.profileId === auth.user.id);
  const uploads = creator ? platform.series.filter((item) => item.creatorId === creator.id).slice(0, 3) : [];

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <h1>{auth.user.name}</h1>
        <p className="small-text">{auth.user.email}</p>
        <div className="grid cards-3">
          <article className="mini-card"><h3>Status</h3><p className="small-text">{statusLabel}</p></article>
          <article className="mini-card"><h3>Viewer Subscription</h3><p className="small-text">{viewerPlan.name}</p></article>
          <article className="mini-card"><h3>Creator Plan</h3><p className="small-text">{creatorPlan?.name || 'None'}</p></article>
          <article className="mini-card"><h3>Platform Commission</h3><p className="small-text">{commission}</p></article>
          <article className="mini-card"><h3>Included Benefits</h3><p className="small-text">{creatorPlan ? creatorPlan.reviewPriority : 'Viewer-only account'}</p></article>
          <article className="mini-card"><h3>审核速度</h3><p className="small-text">{creatorPlan?.reviewPriority || 'Standard member support'}</p></article>
        </div>
        <DemoRoleSwitcher auth={auth} />
      </section>

      <section className="grid cards-2">
        <article className="panel stack-md">
          <h3>订阅与方案概览</h3>
          <p className="small-text">Viewer Subscription: {viewerPlan.name}</p>
          <p className="small-text">Creator Plan: {creatorPlan?.name || 'Not activated'}</p>
          <p className="small-text">推荐位申请：{creatorPlan?.featuredPlacementRequest ? 'Supported' : 'Not available'}</p>
        </article>
        <article className="panel stack-md">
          <h3>Add-on Services</h3>
          {ADD_ON_SERVICES.slice(0, 4).map((item) => (
            <p key={item.id} className="small-text">{item.name}: {getServiceEntitlement(item, membership.creatorPlan || 'creator_basic')}</p>
          ))}
        </article>
      </section>

      <section className="grid cards-2">
        <article className="panel">
          <h3>最近服务订单</h3>
          {orders.length ? orders.map((item) => <p className="small-text" key={item.id}>{item.id} · {item.serviceType} · {item.status}</p>) : <p className="small-text">暂无服务订单。</p>}
        </article>
        <article className="panel">
          <h3>最近上传内容</h3>
          {uploads.length ? uploads.map((item) => <p className="small-text" key={item.id}>{item.title} · {item.status}</p>) : <p className="small-text">暂无上传内容。</p>}
          <p className="small-text">收益/解锁/订单占位：$1,240 / 12 / {orders.length}</p>
          <p className="small-text">最近计划变更：2026-04-12（mock）</p>
        </article>
      </section>
    </div>
  );
}
