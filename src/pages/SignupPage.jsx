import { AuthFormCard } from '../components/AuthFormCard';

export function SignupPage({ auth }) {
  const submit = (event) => {
    event.preventDefault();
    auth.login('newviewer@aishorthub.com');
    window.location.assign('/browse');
  };

  return (
    <div className="auth-page">
      <AuthFormCard
        mode="signup"
        title="Create your account"
        subtitle="Start free and unlock premium short-drama drops with one profile."
        cta="Create account"
        onSubmit={submit}
        footer={
          <>
            <a href="/login">Already have an account?</a>
            <a href="/pricing">Compare plans</a>
          </>
        }
      />
    </div>
  );
}
