import { useState } from 'react';

export function AuthFormCard({ title, subtitle, cta, mode, onSubmit, footer }) {
  const isForgot = mode === 'forgot';
  const isSignup = mode === 'signup';
  const [form, setForm] = useState({ email: '', password: '', role: 'viewer' });

  const submit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <section className="auth-layout">
      <aside className="auth-showcase auth-surface">
        <span className="kicker">Member Access</span>
        <h2>登录后即可进入观看、创作与管理流程。</h2>
        <p>本项目采用 Supabase Auth 结构预留。当前默认 mock 登录，便于本地验证业务链路。</p>
      </aside>

      <form className="panel auth-form" onSubmit={submit}>
        <h1>{title}</h1>
        <p>{subtitle}</p>

        <label>
          Email
          <input className="input" type="email" required value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
        </label>

        {!isForgot ? (
          <label>
            Password
            <input className="input" type="password" required value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
          </label>
        ) : null}

        {isSignup ? (
          <label>
            Role
            <select className="input" value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}>
              <option value="viewer">Viewer</option>
              <option value="creator">Creator</option>
            </select>
          </label>
        ) : null}

        <button className="btn btn-primary" type="submit">
          {cta}
        </button>

        <div className="row wrap small-text">{footer}</div>
      </form>
    </section>
  );
}
