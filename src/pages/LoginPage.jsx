import { AuthFormCard } from '../components/AuthFormCard';
import { Link, useRouter } from '../lib/router';

function getPostAuthDestination(result, fallbackRole) {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const redirectTo = params.get('redirectTo');
  if (redirectTo) return decodeURIComponent(redirectTo);

  const role = result?.user?.role || fallbackRole;
  if (role === 'admin') return '/admin';
  if (role === 'creator') return '/creator#overview';
  return '/browse';
}

export function LoginPage({ auth }) {
  const { navigate } = useRouter();

  const submit = async (form) => {
    const result = await auth.login(form.email, form.password);
    if (result.ok) {
      navigate(getPostAuthDestination(result, auth.userState));
    }
    return result;
  };

  const currentParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const redirectSuffix = currentParams.get('redirectTo') ? `?redirectTo=${encodeURIComponent(currentParams.get('redirectTo'))}` : '';

  return (
    <div className="auth-page stack-md">
      <AuthFormCard
        mode="login"
        title="登录"
        subtitle="输入邮箱和密码进入平台。示例：mia@example.com / creator@example.com / admin@example.com。支持不同 Status 演示。"
        cta="Log in"
        onSubmit={submit}
        footer={
          <>
            <Link to="/forgot-password">Forgot password?</Link>
            <Link to={`/signup${redirectSuffix}`}>Create account</Link>
          </>
        }
      />
    </div>
  );
}
