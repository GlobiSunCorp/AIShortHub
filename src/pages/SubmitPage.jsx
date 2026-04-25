import { Link } from '../lib/router';

export function SubmitPage() {
  const acceptedFormats = [
    'Cinematic AI shorts and vertical short-form video series',
    'AI-generated trailers, teasers, and launch cuts',
    'AI music videos, animation shorts, and experimental storytelling',
    'Branded and product-focused AI short videos with narrative structure',
  ];

  const requirements = [
    'A completed screener or trailer link (public or private access)',
    'Clear title, short synopsis, and 3-8 relevant tags',
    'Creator attribution, contact email, and rights declaration',
    'Preferred distribution format (vertical, square, or widescreen)',
  ];

  const reviewProcess = [
    'Initial content and policy screening (1-2 business days)',
    'Editorial fit review for discoverability and audience matching',
    'Feedback and request-for-edits if needed',
    'Publishing recommendation plus optional creator growth opportunities',
  ];

  const featuredOpportunities = [
    'Homepage AI Shorts Spotlight',
    'Genre/format carousel features (Cinematic, Vertical, Music Video, Experimental)',
    'Creator interview and showcase highlights',
    'Priority trial campaigns for high-retention launches',
  ];

  return (
    <div className="ds-page">
      <section className="panel ds-section">
        <span className="kicker">Creator submissions</span>
        <h1>Submit your AI-powered short videos</h1>
        <p className="ds-meta">
          AIShortHub helps creators launch and showcase AI shorts for discovery, audience growth, and monetization.
        </p>
        <div className="row wrap">
          <Link className="btn btn-primary btn-cta" to="/creator">
            Apply Now
          </Link>
          <Link className="btn btn-ghost btn-cta-secondary" to="/creator">
            Open Creator Dashboard
          </Link>
        </div>
      </section>

      <section className="grid cards-2 ds-section">
        <article className="panel">
          <h2 className="ds-h2">What we accept</h2>
          <ul className="small-text">
            {acceptedFormats.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="panel">
          <h2 className="ds-h2">Submission requirements</h2>
          <ul className="small-text">
            {requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="panel">
          <h2 className="ds-h2">Review process</h2>
          <ol className="small-text">
            {reviewProcess.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
        <article className="panel">
          <h2 className="ds-h2">Featured opportunities</h2>
          <ul className="small-text">
            {featuredOpportunities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
