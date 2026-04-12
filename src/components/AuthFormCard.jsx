import { useState } from 'react';
import { isValidEmail, minLength } from '../lib/validation';

export function AuthFormCard({ title, subtitle, cta, mode, onSubmit, footer }) {
  const isForgot = mode === 'forgot';
  const isSignup = mode === 'signup';
  const [form, setForm] = useState({ email: '', password: '', role: 'member' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const validate = () => {
    const next = {};
    if (!form.email.trim()) {
      next.email = 'Email 为必填项。';
    } else if (!isValidEmail(form.email)) {
      next.email = '请输入合法的邮箱格式。';
    }

    if (!isForgot) {
      if (!form.password.trim()) {
        next.password = 'Password 为必填项。';
      } else if (!minLength(form.password, 6)) {
        next.password = 'Password 至少需要 6 个字符。';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      setFeedback({ type: 'error', message: '请先修正表单中的错误项。' });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });
    try {
      const result = await onSubmit(form);
      if (result?.ok === false) {
        setFeedback({ type: 'error', message: result.message || '提交失败，请重试。' });
      } else {
        setFeedback({ type: 'success', message: result?.message || '提交成功。' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: error?.message || '提交失败，请稍后重试。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-layout">
      <aside className="auth-showcase auth-surface">
        <span className="kicker">Platform Access</span>
        <h2>登录后可访问 Viewer Subscription、Creator Plan 与管理流程。</h2>
        <p>支持 Status: Guest / Member / Creator / Admin 状态切换。当前为 mock 认证流程，便于本地验证。</p>
      </aside>

      <form className="panel auth-form" onSubmit={submit}>
        <h1>{title}</h1>
        <p>{subtitle}</p>

        <label>
          Email
          <input className="input" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
          {errors.email ? <span className="form-feedback error">{errors.email}</span> : null}
        </label>

        {!isForgot ? (
          <label>
            Password
            <input className="input" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
            {errors.password ? <span className="form-feedback error">{errors.password}</span> : null}
          </label>
        ) : null}

        {isSignup ? (
          <label>
            Account Type
            <select className="input" value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}>
              <option value="member">Member</option>
              <option value="creator">Creator</option>
            </select>
          </label>
        ) : null}

        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : cta}
        </button>

        {feedback.message ? <p className={`form-feedback ${feedback.type === 'error' ? 'error' : 'success'}`}>{feedback.message}</p> : null}
        <div className="row wrap small-text">{footer}</div>
      </form>
    </section>
  );
}
