import { AuthFormCard } from '../components/AuthFormCard';
import { Link, useRouter } from '../lib/router';

export function LoginPage({ auth }) {
  const { navigate } = useRouter();

  const submit = (event) => {
    event.preventDefault();
    auth.login();
    navigate('/');
  };

  return (
    <div className="auth-page">
      <AuthFormCard
        mode="login"
        title="Welcome back"
        subtitle="Log in to resume locked episodes and keep your watch history synced."
        cta="Log in"
        onSubmit={submit}
        footer={
          <>
            <Link to="/forgot-password">Forgot password?</Link>
            <Link to="/signup">Need an account?</Link>
          </>
        }
      />
    </div>
  );
}
