import { AuthFormCard } from '../components/AuthFormCard';
import { Link, useRouter } from '../lib/router';

export function ForgotPasswordPage() {
  const { navigate } = useRouter();

  const submit = (event) => {
    event.preventDefault();
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <AuthFormCard
        mode="forgot"
        title="Reset password"
        subtitle="We'll send you a secure reset link so you can continue watching instantly."
        cta="Send reset link"
        onSubmit={submit}
        footer={
          <>
            <Link to="/login">Back to login</Link>
            <Link to="/signup">Create new account</Link>
          </>
        }
      />
    </div>
  );
}
