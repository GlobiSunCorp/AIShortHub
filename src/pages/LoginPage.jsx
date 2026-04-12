import { AuthFormCard } from '../components/AuthFormCard';
import { Link, useRouter } from '../lib/router';

export function LoginPage({ auth }) {
  const { navigate } = useRouter();

  const submit = (form) => {
    const role = form.email.includes('admin') ? 'admin' : form.email.includes('creator') ? 'creator' : 'viewer';
    auth.login(form.email || 'mia@example.com', role);
    navigate('/');
  };

  return (
    <div className="auth-page">
      <AuthFormCard
        mode="login"
        title="登录"
        subtitle="登录后继续观看、提交作品或进入管理后台。"
        cta="Log in"
        onSubmit={submit}
        footer={
          <>
            <Link to="/forgot-password">Forgot password?</Link>
            <Link to="/signup">Create account</Link>
          </>
        }
      />
    </div>
  );
}
