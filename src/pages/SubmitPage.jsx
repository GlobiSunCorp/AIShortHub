import { Link } from '../lib/router';

export function SubmitPage() {
  return (
    <section className="panel">
      <h1>提交入口已合并到 Creator Dashboard</h1>
      <p className="small-text">为避免重复流程，创建剧集、上传分集、提交审核统一在 Creator Dashboard 完成。</p>
      <Link className="btn btn-primary" to="/creator">
        前往 Creator Dashboard
      </Link>
    </section>
  );
}
