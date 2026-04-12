import { Link } from '../lib/router';

export function AccessGuidePanel({ currentRoleLabel, requiredRoleLabel, reason, action }) {
  return (
    <section className="panel stack-md">
      <h1>暂时无法访问此页面</h1>
      <p className="small-text">当前角色：{currentRoleLabel}</p>
      <p className="small-text">需要角色：{requiredRoleLabel}</p>
      <p className="small-text">{reason}</p>
      <div className="row wrap center">
        {action}
        <Link className="btn btn-ghost" to="/profile">
          去 Profile 切换 Demo 角色
        </Link>
      </div>
    </section>
  );
}
