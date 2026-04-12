import { useState } from 'react';
import { AuthFormCard } from '../components/AuthFormCard';
import { Link } from '../lib/router';

export function ForgotPasswordPage({ auth }) {
  const [message, setMessage] = useState('');

  return (
    <div className="auth-page stack-md">
      <AuthFormCard
        mode="forgot"
        title="忘记密码"
        subtitle="按 Supabase Auth reset 密码流程预留，当前为可演示 mock 流程。"
        cta="Send reset link"
        onSubmit={(form) => {
          auth.requestPasswordReset(form.email);
          setMessage(`已发送重置邮件到 ${form.email}`);
        }}
        footer={
          <>
            <Link to="/login">Back to login</Link>
          </>
        }
      />
      {message ? <section className="panel"><p className="status ok">{message}</p></section> : null}
    </div>
  );
}
