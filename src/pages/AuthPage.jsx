export function AuthPage({ mode, auth }) {
  const isSignup = mode === 'signup';
  const isForgot = mode === 'forgot';

  const submit = (event) => {
    event.preventDefault();
    if (!isForgot) {
      auth.login();
      window.location.assign('/');
    }
  };

  return (
    <div className="auth-page">
      <form className="panel auth-form" onSubmit={submit}>
        <h1>{isSignup ? 'Create account' : isForgot ? 'Forgot password' : 'Log in'}</h1>
        <p>{isSignup ? 'Unlock watchlist and full episodes.' : 'Future auth provider can be plugged in here.'}</p>
        <label>
          Email
          <input className="input" type="email" required />
        </label>
        {!isForgot ? (
          <label>
            Password
            <input className="input" type="password" required />
          </label>
        ) : null}
        {isSignup ? (
          <label>
            Confirm password
            <input className="input" type="password" required />
          </label>
        ) : null}
        <button className="btn btn-primary" type="submit">
          {isSignup ? 'Sign up' : isForgot ? 'Send reset email' : 'Log in'}
        </button>
        <div className="row wrap small-text">
          {!isSignup && !isForgot ? <a href="/forgot-password">Forgot password?</a> : null}
          {!isSignup ? <a href="/signup">Need an account?</a> : <a href="/login">Already have one?</a>}
        </div>
      </form>
    </div>
  );
}
