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

function PublicHome({ catalog, takeRate, platformConfig }) {
  const heroConfig = platformConfig?.homeHero || {};
  const featured =
    catalog.series.find((item) => item.id === heroConfig.featuredSeriesId) ||
    catalog.firstBatch[0] ||
    catalog.trending[0] ||
    catalog.latest[0] ||
    null;
  const featuredTitle = heroConfig.title || featured?.title || 'Her Hidden Return';
  const featuredSynopsis =
    heroConfig.synopsis ||
    featured?.synopsis ||
    'A viewer-first launch page: one strong poster, one obvious play button, and just enough context to make the next click easy.';
  const previewCount = catalog.episodeMap[featured?.id]?.preview || 1;
  const totalCount = catalog.episodeMap[featured?.id]?.total || 12;
  const posterUrl = heroConfig.posterUrl || publicHeroPoster;
  const primaryCtaLabel = heroConfig.primaryCtaLabel || 'Watch trailer';
  const secondaryCtaLabel = heroConfig.secondaryCtaLabel || 'Browse titles';
  const creatorCtaLabel = heroConfig.creatorCtaLabel || 'For creators';
  const eyebrow = heroConfig.eyebrow || 'Viewer-first landing';
  const kicker = heroConfig.kicker || 'Featured launch title';

  return (
    <div className="ds-page home-public">
      <section className="public-home-shell">
        <Link
          className="public-home-poster cover-link"
          to={featured ? `/series/${featured.id}` : '/browse'}
          style={{ backgroundImage: `url(${posterUrl})` }}
        >
          <div className="public-home-poster-scrim" />
          <div className="public-home-poster-top">
            <span className="public-home-kicker">{kicker}</span>
          </div>

          <div className="public-home-poster-center">
            <div className="public-home-play-button" aria-hidden="true">
              <span className="public-home-play-icon">▶</span>
            </div>
          </div>

          <div className="public-home-poster-bottom">
            <div className="public-home-title-block">
              <p className="public-home-eyebrow">{eyebrow}</p>
              <h1>{featuredTitle}</h1>
              <p className="public-home-description">{featuredSynopsis}</p>
            </div>

            <div className="public-home-hero-meta">
              <span className="meta-pill">{previewCount} free preview</span>
              <span className="meta-pill">{totalCount} episodes</span>
              <span className="meta-pill">Creator take rate starts low</span>
            </div>

            <div className="row wrap public-home-actions">
              <span className="btn btn-primary btn-cta public-home-primary">{primaryCtaLabel}</span>
              <span className="btn btn-ghost btn-cta-secondary public-home-secondary">{secondaryCtaLabel}</span>
              <span className="btn btn-ghost public-home-tertiary">{creatorCtaLabel}</span>
            </div>
          </div>
        </Link>

        <section className="grid cards-3 public-home-note-grid">
          <article className="mini-card public-home-note-card">
            <h3 className="ds-h3">For viewers</h3>
            <p className="ds-meta">See the poster, hit play, then decide whether to keep watching.</p>
          </article>
          <article className="mini-card public-home-note-card">
            <h3 className="ds-h3">For creators</h3>
            <p className="ds-meta">Creator Studio still exists, but it no longer hijacks the first impression.</p>
          </article>
          <article className="mini-card public-home-note-card">
            <h3 className="ds-h3">Soft-launch economics</h3>
            <p className="ds-meta">Default take rate is {(takeRate * 100).toFixed(0)}% now, with room to launch lower by plan tier.</p>
          </article>
        </section>
      </section>

      <HomeCollection
        title="Start with these"
        desc="The first row below the hero should feel immediate, clean, and easy to choose from."
        items={catalog.firstBatch}
        episodeMap={catalog.episodeMap}
        columns="cards-2"
        emptyText="No featured title yet. Start with one strong poster, one trailer, and one preview-ready episode."
      />

      <HomeCollection
        title="Free preview lane"
        desc="Let strangers sample first before asking them to pay."
        items={catalog.trending}
        episodeMap={catalog.episodeMap}
        emptyText="Add more preview-ready episodes so the preview lane feels alive."
      />

      <section className="home-split-callout grid cards-2">
        <article className="panel home-callout-card">
          <h3 className="ds-h2">Viewer path</h3>
          <p className="ds-meta">Poster → trailer → preview → unlock the rest.</p>
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
  return <PublicHome catalog={catalog} takeRate={takeRate} platformConfig={platform?.platformConfig} />;
}
