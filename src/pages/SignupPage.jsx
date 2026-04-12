import { AuthFormCard } from '../components/AuthFormCard';
import { Link, useRouter } from '../lib/router';

export function SignupPage({ auth }) {
  const { navigate } = useRouter();

  const submit = (event) => {
    event.preventDefault();
    auth.login('newviewer@aishorthub.com');
    navigate('/browse');
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
            <Link to="/login">Already have an account?</Link>
            <Link to="/pricing">Compare plans</Link>
          </>
        }
      />
    </div>
  );
}
