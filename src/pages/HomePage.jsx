import { Link } from '../lib/router';
import { SectionTitle } from '../components/SectionTitle';
import { SeriesCard } from '../components/SeriesCard';
import { OnboardingGuide } from '../components/OnboardingGuide';
import { getCatalogSnapshot } from '../lib/selectors/getCatalogSnapshot';
import { resolveMembership } from '../hooks/usePlanAccess';
import { publicHeroPoster } from '../assets/publicHeroPoster';

function HomeCollection({ title, desc, items, episodeMap, columns = 'cards-3', emptyText }) {
  return (
    <section className="ds-section home-collection">
      <SectionTitle title={title} desc={desc} />
      <div className={`grid ${columns}`}>
        {items.length ? (
          items.map((item) => (
            <SeriesCard
              key={item.id}
              series={item}
              episodeCount={episodeMap[item.id]?.total}
              previewCount={episodeMap[item.id]?.preview}
            />
          ))
        ) : (
          <article className="empty-state">
            <p className="ds-meta">{emptyText}</p>
          </article>
        )}
      </div>
    </section>
  );
}

function PublicHome({ catalog, takeRate }) {
  const featured = catalog.firstBatch[0] || catalog.trending[0] || catalog.latest[0] || null;

  return (
    <div className="ds-page home-public">
      <section className="public-home-hero panel">
        <Link
          className="public-home-poster cover-link"
          to={featured ? `/series/${featured.id}` : '/browse'}
          style={{ backgroundImage: `url(${publicHeroPoster})` }}
        >
          <div className="public-home-poster-scrim" />
          <div className="public-home-poster-center">
            <span className="public-home-kicker">Featured launch title</span>
            <div className="public-home-play-button" aria-hidden="true">
              <span className="public-home-play-icon">▶</span>
            </div>
            <p className="public-home-play-text">Watch trailer</p>
          </div>
        </Link>

        <div className="public-home-supporting">
          <div className="public-home-copy">
            <span className="kicker">Viewer-first landing</span>
            <h1>See the drama first, then decide what to do next.</h1>
            <p className="ds-meta public-home-lead">The first screen should feel like a place to watch, not a place to read instructions. Creator tools stay available, but they no longer interrupt the first impression.</p>
            <div className="row wrap public-home-actions">
              <Link className="btn btn-primary btn-cta public-home-primary" to={featured ? `/watch/${featured.id}/1` : '/browse'}>Start watching</Link>
              <Link className="btn btn-ghost btn-cta-secondary public-home-secondary" to="/browse">Browse all titles</Link>
              <Link className="btn btn-ghost public-home-tertiary" to="/pricing">For creators</Link>
            </div>
          </div>
          <div className="grid cards-3 public-home-notes">
            <article className="mini-card public-home-note-card">
              <h3 className="ds-h3">For viewers</h3>
              <p className="ds-meta">Click poster → play trailer → sample preview → unlock the rest.</p>
            </article>
            <article className="mini-card public-home-note-card">
              <h3 className="ds-h3">For creators</h3>
              <p className="ds-meta">Creator Studio is still here, just not yelling over the hero image.</p>
            </article>
            <article className="mini-card public-home-note-card">
              <h3 className="ds-h3">Soft-launch economics</h3>
              <p className="ds-meta">Platform take rate is {(takeRate * 100).toFixed(0)}% by default and can launch lower by creator tier.</p>
            </article>
          </div>
        </div>
      </section>

      <HomeCollection
        title="Start with these"
        desc="The row right below the hero should feel obvious, fast, and clickable."
        items={catalog.firstBatch}
        episodeMap={catalog.episodeMap}
        columns="cards-2"
        emptyText="No featured title yet. Use one strong poster, one trailer, and one preview episode first."
      />

      <HomeCollection
        title="Free preview lane"
        desc="Let strangers sample before asking them to subscribe."
        items={catalog.trending}
        episodeMap={catalog.episodeMap}
        emptyText="Add more preview-ready episodes so this row feels alive."
      />

      <section className="home-split-callout grid cards-2">
        <article className="panel home-callout-card">
          <h3 className="ds-h2">Viewer path</h3>
          <p className="ds-meta">Watch first, read less, decide later.</p>
          <Link className="info-link" to="/browse">Open viewer catalog</Link>
        </article>
        <article className="panel home-callout-card">
          <h3 className="ds-h2">Creator path</h3>
          <p className="ds-meta">Upload trailer, set monetization, then submit to review.</p>
          <Link className="info-link" to="/pricing">See creator plans</Link>
        </article>
      </section>
    </div>
  );
}

function ViewerHome({ auth, catalog }) {
  const heroTitle = catalog.trending[0] || catalog.firstBatch[0] || catalog.latest[0] || null;
  const continueWatching = (catalog.latest.length ? catalog.latest : catalog.trending).slice(0, 3);
  const freePreview = catalog.trending.slice(0, 4);
  const romanceLane = [...catalog.firstBatch, ...catalog.latest].filter((item, index, arr) => arr.findIndex((candidate) => candidate.id === item.id) === index).slice(0, 4);

  return (
    <div className="ds-page home-viewer-auth">
      <OnboardingGuide role="viewer" />
      <section className="panel viewer-hero">
        <div className="viewer-hero-copy">
          <span className="kicker">Welcome back</span>
          <h1>Press play fast.</h1>
          <p className="ds-meta">Hi {auth.user?.name || 'Viewer'}, your signed-in home is now all about content: continue watching, free previews, trending picks, and one obvious next tap.</p>
          <div className="row wrap home-stage-actions">
            <Link className="btn btn-primary btn-cta" to={heroTitle ? `/watch/${heroTitle.id}/1` : '/browse'}>Continue watching</Link>
            <Link className="btn btn-ghost btn-cta-secondary" to="/browse">Open all titles</Link>
          </div>
        </div>
        <Link className="viewer-feature-frame cover-link from-purple" to={heroTitle ? `/series/${heroTitle.id}` : '/browse'}>
          <span className="status ok">Featured tonight</span>
          <h2>{heroTitle?.title || 'Add a featured series'}</h2>
          <p>{heroTitle?.synopsis || 'Your signed-in viewer home should always open with a strong title.'}</p>
          <div className="play-overlay">▶ Resume</div>
        </Link>
      </section>

      <section className="grid cards-3 home-progress-grid">
        {continueWatching.map((item, index) => (
          <Link key={item.id} className="mini-card viewer-progress-card" to={`/watch/${item.id}/1`}>
            <p className="small-text">Continue watching</p>
            <strong>{item.title}</strong>
            <div className="meter"><span style={{ width: `${55 + index * 12}%` }} /></div>
            <span className="ds-caption">{55 + index * 12}% watched</span>
          </Link>
        ))}
      </section>

      <HomeCollection
        title="Free previews"
        desc="Low-friction entries for people who just want to click and sample."
        items={freePreview}
        episodeMap={catalog.episodeMap}
        emptyText="No preview lane yet. Flag at least one preview episode per launch series."
      />

      <HomeCollection
        title="Trending now"
        desc="The row that should always feel alive after login."
        items={catalog.latest}
        episodeMap={catalog.episodeMap}
        emptyText="Trending will show here after you have a few active titles and fresh updates."
      />

      <HomeCollection
        title="Because you like dramatic chaos"
        desc="A more playful recommendation lane for signed-in viewers."
        items={romanceLane}
        episodeMap={catalog.episodeMap}
        emptyText="Add more genres and tags so this lane can feel personal."
      />
    </div>
  );
}

function CreatorHome({ auth, membership, catalog }) {
  const planName = membership.creatorPlan || 'creator_basic';
  const creatorSeries = catalog.firstBatch.slice(0, 3);
  const actionCards = [
    { title: 'Upload trailer', desc: 'Your hook does the selling before the explanation starts.', to: '/creator#assets', badge: 'Core' },
    { title: 'Finish pricing', desc: 'Decide preview, subscription, and paid unlock logic clearly.', to: '/creator#pricing', badge: 'Revenue' },
    { title: 'Submit for review', desc: 'Don’t let a draft rot in the corner. Ship it.', to: '/creator#review', badge: 'Ready' },
  ];
  const workspaceCards = [
    { title: 'My Series', desc: 'Drafts, release pacing, and episode structure.', to: '/creator#content' },
    { title: 'Upload Assets', desc: 'Poster, motion poster, trailer, subtitles, and promo inputs.', to: '/creator#assets' },
    { title: 'Earnings', desc: 'Gross, payout, deductions, and what is still pending.', to: '/creator#earnings' },
    { title: 'Promo Tools', desc: 'Hook packs, copy blocks, and launch support.', to: '/creator#promo-tools' },
  ];

  return (
    <div className="ds-page home-creator-auth">
      <OnboardingGuide role="creator" />
      <section className="panel creator-home-hero">
        <div className="creator-home-copy">
          <span className="kicker">Creator Studio home</span>
          <h1>Keep the first glance clean. Keep the workbench sharp.</h1>
          <p className="ds-meta">Hi {auth.user?.name || 'Creator'}, this home answers three things fast: what is unfinished, what can be published, and where your revenue will appear once it starts moving.</p>
          <div className="row wrap home-stage-actions">
            <Link className="btn btn-primary btn-cta" to="/creator#content">Open my workspace</Link>
            <Link className="btn btn-ghost btn-cta-secondary" to="/creator#review">Submit when ready</Link>
          </div>
        </div>
        <div className="grid cards-3 creator-home-metrics">
          <article className="card-primary home-metric-card">
            <p className="small-text">Creator plan</p>
            <strong>{planName}</strong>
          </article>
          <article className="card-secondary home-metric-card">
            <p className="small-text">Series in motion</p>
            <strong>{creatorSeries.length}</strong>
          </article>
          <article className="card-data home-metric-card">
            <p className="small-text">Main objective</p>
            <strong>Launch faster</strong>
          </article>
        </div>
      </section>

      <section className="grid cards-3 creator-action-grid">
        {actionCards.map((item) => (
          <Link key={item.title} className="panel creator-action-card" to={item.to}>
            <span className="status">{item.badge}</span>
            <h3 className="ds-h3">{item.title}</h3>
            <p className="ds-meta">{item.desc}</p>
          </Link>
        ))}
      </section>

      <section className="panel creator-home-workbench">
        <div className="section-title">
          <div>
            <h2 className="ds-h2">Creator workbench</h2>
            <p className="ds-meta">Nothing hidden. Nothing vague. Everything should point to the next useful move.</p>
          </div>
          <Link className="info-link" to="/creator#overview">Open full Creator Studio</Link>
        </div>
        <div className="grid cards-2">
          {workspaceCards.map((item) => (
            <Link key={item.title} className="mini-card creator-workbench-card" to={item.to}>
              <strong>{item.title}</strong>
              <p className="ds-meta">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <HomeCollection
        title="Your launch candidates"
        desc="The titles that should be pushed into review, promo, or publish next."
        items={creatorSeries}
        episodeMap={catalog.episodeMap}
        columns="cards-3"
        emptyText="No series yet. Create one strong pilot, one trailer, and one clear poster first."
      />
    </div>
  );
}

export function HomePage({ auth, platform }) {
  const catalog = getCatalogSnapshot(platform);
  const takeRate = Number(platform?.platformConfig?.platformTakeRate ?? 0.2);
  const membership = resolveMembership(auth, platform);
  const creatorMode = auth?.isLoggedIn && (['creator', 'admin'].includes(auth.userState) || Boolean(membership.creatorPlan));
  const viewerMode = auth?.isLoggedIn && !creatorMode;

  if (creatorMode) return <CreatorHome auth={auth} membership={membership} catalog={catalog} />;
  if (viewerMode) return <ViewerHome auth={auth} catalog={catalog} />;
  return <PublicHome catalog={catalog} takeRate={takeRate} />;
}
