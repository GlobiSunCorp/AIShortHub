import { useEffect, useMemo, useState } from 'react';
import { Link } from '../lib/router';
import { SectionTitle } from '../components/SectionTitle';
import { SeriesCard } from '../components/SeriesCard';
import { OnboardingGuide } from '../components/OnboardingGuide';
import { getCatalogSnapshot } from '../lib/selectors/getCatalogSnapshot';
import { resolveMembership } from '../hooks/usePlanAccess';
import { publicHeroPoster } from '../assets/publicHeroPoster';

const PUBLIC_HERO_DEFAULTS = {
  title: 'The Hub for AI-Powered Short Videos',
  synopsis:
    'Discover cinematic AI shorts, vertical videos, trailers, music videos, animations, commercials, and experimental stories from creators around the world.',
  primaryCtaLabel: 'Explore AI Shorts',
  secondaryCtaLabel: 'Submit Your Work',
  creatorCtaLabel: 'For Creators',
  eyebrow: 'AI shorts discovery',
};

function useHeroViewport() {
  const readViewport = () => {
    if (typeof window === 'undefined') return { isMobile: false, isTablet: false };
    const width = window.innerWidth || 1440;
    return { isMobile: width <= 640, isTablet: width > 640 && width <= 900 };
  };

  const [viewport, setViewport] = useState(readViewport);

  useEffect(() => {
    const onResize = () => setViewport(readViewport());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return viewport;
}

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

function PublicHeroPoster({ src, alt, imageStyle }) {
  const [resolvedSrc, setResolvedSrc] = useState(src || publicHeroPoster);

  useEffect(() => {
    setResolvedSrc(src || publicHeroPoster);
  }, [src]);

  return (
    <img
      className="public-home-poster-image"
      src={resolvedSrc || publicHeroPoster}
      alt={alt}
      style={imageStyle}
      onError={() => setResolvedSrc(publicHeroPoster)}
    />
  );
}

function PublicHome({ catalog, platformConfig }) {
  const heroConfig = platformConfig?.homeHero || {};
  const { isMobile, isTablet } = useHeroViewport();
  const featuredTitle = heroConfig.title || PUBLIC_HERO_DEFAULTS.title;
  const featuredSynopsis = heroConfig.synopsis || PUBLIC_HERO_DEFAULTS.synopsis;
  const posterUrl = heroConfig.posterUrl || publicHeroPoster;
  const primaryCtaLabel = heroConfig.primaryCtaLabel || PUBLIC_HERO_DEFAULTS.primaryCtaLabel;
  const secondaryCtaLabel = heroConfig.secondaryCtaLabel || PUBLIC_HERO_DEFAULTS.secondaryCtaLabel;
  const creatorCtaLabel = heroConfig.creatorCtaLabel || PUBLIC_HERO_DEFAULTS.creatorCtaLabel;
  const eyebrow = heroConfig.eyebrow || PUBLIC_HERO_DEFAULTS.eyebrow;

  const heroFrameStyle = useMemo(() => {
    if (isMobile) return { minHeight: '0' };
    if (isTablet) return { minHeight: '0' };
    return { minHeight: '0' };
  }, [isMobile, isTablet]);

  const heroImageStyle = useMemo(
    () => ({ objectPosition: isMobile ? 'center 24%' : isTablet ? 'center 28%' : 'center 32%' }),
    [isMobile, isTablet]
  );

  return (
    <div className="ds-page home-public">
      <section className="public-home-shell">
        <div className="public-home-poster" style={heroFrameStyle}>
          <div className="public-home-format-tabs" aria-label="Content formats">
            <span className="format-tab active">Vertical Short Drama</span>
            <span className="format-tab">Horizontal Short Drama</span>
            <span className="format-tab muted">Cinematic <small>In development</small></span>
          </div>

          <div className="public-home-hero-layout">
            <div className="public-home-title-block">
              <p className="public-home-eyebrow">{eyebrow}</p>
              <h1>{featuredTitle}</h1>
              <p className="public-home-description">{featuredSynopsis}</p>
              <div className="row wrap public-home-actions">
                <Link className="btn btn-primary btn-cta public-home-primary" to="/browse">{primaryCtaLabel}</Link>
                <Link className="btn btn-ghost btn-cta-secondary public-home-secondary" to="/submit">{secondaryCtaLabel}</Link>
                <Link className="btn btn-ghost public-home-tertiary" to="/pricing?intent=creator&plan=creator_pro">{creatorCtaLabel}</Link>
              </div>
            </div>

            <div className="format-showcase-scroll" aria-label="Short drama format showcase">
              <article className="format-window format-window-vertical">
                <PublicHeroPoster src={posterUrl} alt="I Swapped Bodies With the Football Captain vertical series" imageStyle={heroImageStyle} />
                <div className="format-window-scrim" />
                <div className="format-window-copy">
                  <span className="status ok">9:16 · Episode 1</span>
                  <h2>I Swapped Bodies With the Football Captain</h2>
                  <p>Original vertical AI short drama.</p>
                  <Link className="btn btn-primary" to="/browse">Explore the series</Link>
                </div>
              </article>

              <article className="format-window format-window-horizontal">
                <PublicHeroPoster src={posterUrl} alt="Horizontal AI short drama showcase" imageStyle={{ objectPosition: 'center 32%' }} />
                <div className="format-window-scrim" />
                <div className="format-window-copy">
                  <span className="status">16:9 · Coming soon</span>
                  <h2>Horizontal Short Drama</h2>
                  <p>Widescreen stories and cinematic trailers are in production.</p>
                </div>
              </article>
            </div>
          </div>
        </div>

        <section className="panel company-intro" aria-labelledby="company-intro-title">
          <p className="kicker">Operated by</p>
          <h2 className="ds-h2" id="company-intro-title">GlobiSun Multimedia Corp.</h2>
          <p className="ds-meta">
            AIShortHub is an AI-native entertainment studio operated by GlobiSun Multimedia Corp., creating original cinematic short-form series for global audiences.
          </p>
        </section>

        <section className="grid cards-3 public-home-note-grid">
          <article className="mini-card public-home-note-card">
            <p className="kicker">Current Project</p>
            <h3 className="ds-h3">I Swapped Bodies With the Football Captain</h3>
            <p className="ds-meta">An original cinematic AI short drama series.</p>
          </article>
          <article className="mini-card public-home-note-card">
            <h3 className="ds-h3">For global audiences</h3>
            <p className="ds-meta">Discover original AI-powered cinematic stories and short-form entertainment.</p>
          </article>
          <article className="mini-card public-home-note-card">
            <p className="kicker">Contact</p>
            <h3 className="ds-h3">GlobiSun Multimedia Corp.</h3>
            <a className="info-link" href="mailto:contact@globisunmultimedia.com">contact@globisunmultimedia.com</a>
          </article>
        </section>
      </section>

      <HomeCollection title="Start with these" desc="The first row below the hero should feel immediate, clean, and easy to choose from." items={catalog.firstBatch} episodeMap={catalog.episodeMap} columns="cards-2" emptyText="No featured AI short yet. Start with one strong poster, one trailer, and one preview-ready video." />
      <HomeCollection title="Free preview lane" desc="Let strangers sample first before asking them to pay." items={catalog.trending} episodeMap={catalog.episodeMap} emptyText="Add more preview-ready AI shorts so the preview lane feels alive." />

      <section className="home-split-callout grid cards-2">
        <article className="panel home-callout-card">
          <h3 className="ds-h2">Viewer path</h3>
          <p className="ds-meta">Poster → trailer → preview → follow the creator or unlock more.</p>
          <Link className="info-link" to="/browse">Open AI shorts catalog</Link>
        </article>
        <article className="panel home-callout-card">
          <h3 className="ds-h2">Creator path</h3>
          <p className="ds-meta">Submit work, upload assets, set monetization, then request review.</p>
          <Link className="info-link" to="/submit">Submit your work</Link>
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
          <p className="ds-meta">Hi {auth.user?.name || 'Viewer'}, your signed-in home is now all about AI shorts: continue watching, free previews, trending picks, and one obvious next tap.</p>
          <div className="row wrap home-stage-actions">
            <Link className="btn btn-primary btn-cta" to={heroTitle ? `/watch/${heroTitle.id}/1` : '/browse'}>Continue watching</Link>
            <Link className="btn btn-ghost btn-cta-secondary" to="/browse">Open all titles</Link>
          </div>
        </div>
        <Link className="viewer-feature-frame cover-link from-purple" to={heroTitle ? `/series/${heroTitle.id}` : '/browse'}>
          <span className="status ok">Featured tonight</span>
          <h2>{heroTitle?.title || 'Add a featured AI short'}</h2>
          <p>{heroTitle?.synopsis || 'Your signed-in viewer home should always open with a strong AI short.'}</p>
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

      <HomeCollection title="Free previews" desc="Low-friction entries for people who just want to click and sample." items={freePreview} episodeMap={catalog.episodeMap} emptyText="No preview lane yet. Flag at least one preview episode per launch title." />
      <HomeCollection title="Trending now" desc="The row that should always feel alive after login." items={catalog.latest} episodeMap={catalog.episodeMap} emptyText="Trending will show here after you have a few active titles and fresh updates." />
      <HomeCollection title="Because you like bold AI shorts" desc="A more playful recommendation lane for signed-in viewers." items={romanceLane} episodeMap={catalog.episodeMap} emptyText="Add more genres and tags so this lane can feel personal." />
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
          <p className="ds-meta">Hi {auth.user?.name || 'Creator'}, this home answers three things fast: what AI short is unfinished, what can be published, and where your revenue will appear once it starts moving.</p>
          <div className="row wrap home-stage-actions">
            <Link className="btn btn-primary btn-cta" to="/creator#content">Open my workspace</Link>
            <Link className="btn btn-ghost btn-cta-secondary" to="/creator#review">Submit when ready</Link>
          </div>
        </div>
        <div className="grid cards-3 creator-home-metrics">
          <article className="card-primary home-metric-card"><p className="small-text">Creator plan</p><strong>{planName}</strong></article>
          <article className="card-secondary home-metric-card"><p className="small-text">Titles in motion</p><strong>{creatorSeries.length}</strong></article>
          <article className="card-data home-metric-card"><p className="small-text">Main objective</p><strong>Launch faster</strong></article>
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

      <HomeCollection title="Your launch candidates" desc="The titles that should be pushed into review, promo, or publish next." items={creatorSeries} episodeMap={catalog.episodeMap} columns="cards-3" emptyText="No title yet. Create one strong pilot, one trailer, and one clear poster first." />
    </div>
  );
}

export function HomePage({ auth, platform }) {
  const catalog = getCatalogSnapshot(platform);
  const membership = resolveMembership(auth, platform);
  const creatorMode = auth?.isLoggedIn && (['creator', 'admin'].includes(auth.userState) || Boolean(membership.creatorPlan));
  const viewerMode = auth?.isLoggedIn && !creatorMode;

  if (creatorMode) return <CreatorHome auth={auth} membership={membership} catalog={catalog} />;
  if (viewerMode) return <ViewerHome auth={auth} catalog={catalog} />;
  return <PublicHome catalog={catalog} platformConfig={platform?.platformConfig} />;
}
