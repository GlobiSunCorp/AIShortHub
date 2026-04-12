export function AuthFormCard({ title, subtitle, cta, mode, onSubmit, footer }) {
  const isForgot = mode === 'forgot';
  const isSignup = mode === 'signup';

  return (
    <section className="auth-layout">
      <aside className="auth-showcase auth-surface">
        <span className="kicker">Premium Access</span>
        <h2>Unlock cinematic short dramas on every device.</h2>
        <p>
          Keep your progress synced, unlock VIP episodes, and receive personalized launch alerts for each new short-drama release.
        </p>

        <div className="auth-benefits">
          <article className="auth-benefit">
            <h4>Member timeline sync</h4>
            <p className="small-text">Continue exactly where you left off on mobile and desktop.</p>
          </article>
          <article className="auth-benefit">
            <h4>Premium unlock path</h4>
            <p className="small-text">Open locked episodes and join creator-exclusive campaign events.</p>
          </article>
          <article className="auth-benefit">
            <h4>Early drop alerts</h4>
            <p className="small-text">Get first notice when high-retention series release new arcs.</p>
          </article>
        </div>
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
