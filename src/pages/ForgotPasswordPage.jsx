import { AuthFormCard } from '../components/AuthFormCard';
import { Link, useRouter } from '../lib/router';

export function ForgotPasswordPage() {
  const { navigate } = useRouter();

  return (
    <div className="auth-page">
      <AuthFormCard
        mode="forgot"
        title="忘记密码"
        subtitle="Supabase Auth 可直接接入 reset email，这里保留流程占位。"
        cta="Send reset link"
        onSubmit={() => navigate('/login')}
        footer={
          <>
            <Link to="/login">Back to login</Link>
          </>
        }
      />
    </div>
  );
}
