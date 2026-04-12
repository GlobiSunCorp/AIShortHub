import { AuthFormCard } from '../components/AuthFormCard';
import { Link, useRouter } from '../lib/router';

export function SignupPage({ auth }) {
  const { navigate } = useRouter();

  const submit = (form) => {
    auth.signup(form);
    navigate('/profile');
  };

  return (
    <div className="auth-page">
      <AuthFormCard
        mode="signup"
        title="注册"
        subtitle="创建账户后可体验试看、会员、创作者上传与服务订单。"
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
