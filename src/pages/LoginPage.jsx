import { AuthFormCard } from '../components/AuthFormCard';

export function LoginPage({ auth }) {
  const submit = (event) => {
    event.preventDefault();
    auth.login();
    window.location.assign('/');
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
            <a href="/forgot-password">Forgot password?</a>
            <a href="/signup">Need an account?</a>
          </>
        }
      />
    </div>
  );
}
