export function AuthFormCard({
  title,
  subtitle,
  cta,
  mode,
  onSubmit,
  footer,
}) {
  const isForgot = mode === 'forgot';
  const isSignup = mode === 'signup';

  return (
    <section className="auth-layout">
      <aside className="auth-showcase panel">
        <span className="kicker">Premium Access</span>
        <h2>Unlock cinematic short dramas on every device.</h2>
        <p>
          Keep your progress synced, unlock VIP episodes, and get personalized launch alerts for new short-drama releases.
        </p>
        <ul className="stack-md small-text">
          <li>• Early access to trailer drops and behind-the-scenes notes</li>
          <li>• Personalized continue-watching timeline</li>
          <li>• Campaign perks tied to creator promotions</li>
        </ul>
      </aside>

      <form className="panel auth-form" onSubmit={onSubmit}>
        <h1>{title}</h1>
        <p>{subtitle}</p>

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
          {cta}
        </button>

        <div className="row wrap small-text">{footer}</div>
      </form>
    </section>
  );
}
