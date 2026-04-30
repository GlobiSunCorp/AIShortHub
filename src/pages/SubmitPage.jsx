import { Link } from '../lib/router';

export function SubmitPage() {
  const acceptedFormats = [
    'Cinematic AI shorts and vertical short-form video projects',
    'AI-generated trailers, teasers, launch cuts, and hook edits',
    'AI music videos, animation shorts, and experimental storytelling',
    'Branded, commercial, and product-focused AI short videos with clear disclosure',
  ];

  const requirements = [
    'A completed screener, main video, or trailer link (public or private access)',
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
    'Genre / format carousel features (Cinematic, Vertical, Music Video, Experimental)',
    'Creator interview and showcase highlights',
    'Priority trial campaigns for high-retention launches',
  ];

  const creatorBenefits = [
    'Low-commission launch policy with creator-friendly economics',
    'Optional add-on services for trailer editing, motion poster, promo packs, and localization',
    'Creator dashboard with quota, pricing, review, earnings, and service order tracking',
  ];

  return (
    <div className="ds-page stack-lg">
      <section className="panel ds-section stack-md">
        <span className="kicker">Creator submissions</span>
        <h1>Submit your AI-powered short videos</h1>
        <p className="ds-meta">
          AIShortHub helps creators launch and showcase AI shorts for discovery, audience growth, and monetization. The platform is open to story-led work, commercial experiments, music-driven pieces, animation, and creator showcase projects.
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

      <section className="grid cards-3 ds-section">
        <article className="mini-card" style={{ borderRadius: '24px' }}>
          <p className="ds-caption">Submission lane</p>
          <p className="stat-value">Open</p>
          <p className="ds-meta">Pilot submissions are open for curated creator onboarding and early showcase placement.</p>
        </article>
        <article className="mini-card" style={{ borderRadius: '24px' }}>
          <p className="ds-caption">Best fit</p>
          <p className="stat-value">AI Shorts</p>
          <p className="ds-meta">Short-form projects with strong poster, hook, trailer, and creator presentation quality.</p>
        </article>
        <article className="mini-card" style={{ borderRadius: '24px' }}>
          <p className="ds-caption">Review target</p>
          <p className="stat-value">24-72h</p>
          <p className="ds-meta">Faster if metadata, rights, and content labeling are complete on first pass.</p>
        </article>
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

      <section className="grid cards-2 ds-section">
        <article className="panel stack-md">
          <h2 className="ds-h2">What strengthens an application</h2>
          <ul className="small-text">
            <li>Poster, trailer / teaser, and at least one main video already prepared</li>
            <li>Clear audience, format, tag, and monetization intent</li>
            <li>Strong first-click package: hook image, short synopsis, creator credibility</li>
            <li>Rights and commercial disclosures already explained</li>
          </ul>
        </article>
        <article className="panel stack-md">
          <h2 className="ds-h2">Creator benefits</h2>
          <ul className="small-text">
            {creatorBenefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="panel ds-section stack-md">
        <h2 className="ds-h2">Before you apply</h2>
        <p className="ds-meta">Make sure your project package is ready for public discovery, creator showcase review, and platform-safe publishing. That means clear rights, safe claims, a strong title package, and at least one watchable AI short video asset.</p>
        <div className="row wrap">
          <Link className="btn btn-primary" to="/creator">
            Continue to Creator Dashboard
          </Link>
          <Link className="btn btn-ghost" to="/creator-guidelines">
            Review Creator Guidelines
          </Link>
        </div>
      </section>
    </div>
  );
}
