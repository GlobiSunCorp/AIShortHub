import { AuthFormCard } from '../components/AuthFormCard';
import { Link, useRouter } from '../lib/router';

export function LoginPage({ auth }) {
  const { navigate } = useRouter();

  const submit = (form) => {
    auth.login(form.email);
    navigate('/');
  };

  return (
    <div className="auth-page stack-md">
      <AuthFormCard
        mode="login"
        title="登录"
        subtitle="输入邮箱和密码即可进入平台。示例：mia@example.com / creator@example.com / admin@example.com"
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
