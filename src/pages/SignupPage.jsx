import { AuthFormCard } from '../components/AuthFormCard';
import { Link, useRouter } from '../lib/router';

function getPostSignupDestination(result) {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const redirectTo = params.get('redirectTo');
  if (redirectTo) return decodeURIComponent(redirectTo);

  const role = result?.user?.role || 'member';
  if (role === 'admin') return '/admin';
  if (role === 'creator') return '/creator#overview';
  return '/profile';
}

export function SignupPage({ auth }) {
  const { navigate } = useRouter();

  const submit = async (form) => {
    const result = await auth.signup(form);
    if (result.ok) {
      navigate(getPostSignupDestination(result));
    }
    return result;
  };

  const currentParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const redirectSuffix = currentParams.get('redirectTo') ? `?redirectTo=${encodeURIComponent(currentParams.get('redirectTo'))}` : '';

  return (
    <div className="auth-page">
      <AuthFormCard
        mode="signup"
        title="注册"
        subtitle="创建账户后可体验 Viewer Subscription、Creator Plan、上传工作流与服务下单。"
        cta="Create account"
        onSubmit={submit}
        footer={
          <>
            <Link to={`/login${redirectSuffix}`}>Already have account?</Link>
            <Link to="/pricing">Compare plans</Link>
          </>
        }
      />
    </div>
  );
}
