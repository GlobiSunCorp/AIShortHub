import { AuthFormCard } from '../components/AuthFormCard';
import { Link, useRouter } from '../lib/router';

export function SignupPage({ auth }) {
  const { navigate } = useRouter();

  const submit = async (form) => {
    const result = auth.signup(form);
    if (result.ok) {
      navigate('/profile');
    }
    return result;
  };

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
            <Link to="/login">Already have account?</Link>
            <Link to="/pricing">Compare plans</Link>
          </>
        }
      />
    </div>
  );
}
