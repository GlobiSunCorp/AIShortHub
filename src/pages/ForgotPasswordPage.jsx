import { AuthFormCard } from '../components/AuthFormCard';

export function ForgotPasswordPage() {
  const submit = (event) => {
    event.preventDefault();
    window.location.assign('/login');
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
            <a href="/login">Back to login</a>
            <a href="/signup">Create new account</a>
          </>
        }
      />
    </div>
  );
}
