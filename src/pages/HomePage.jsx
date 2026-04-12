import { Link } from '../lib/router';
import { SectionTitle } from '../components/SectionTitle';
import { SeriesCard } from '../components/SeriesCard';
import { continueWatching, homepageRows, seriesData } from '../data/series';

export function HomePage({ auth }) {
  const byId = Object.fromEntries(seriesData.map((item) => [item.id, item]));
  const heroSeries = byId[homepageRows.trending[0]];

  return (
    <div className="stack-lg">
      <section className="hero premium-hero">
        <div>
          <span className="kicker">Premium Vertical Storyverse</span>
          <h1>High-stakes short dramas built for one-more-episode nights.</h1>
          <p>
            AIShortHub delivers daily cinematic drops, quick episode pacing, and locked premium arcs that feel like a real modern
            streaming product.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>4.8★</strong>
              <span>Audience rating</span>
            </div>
            <div className="hero-stat">
              <strong>120+</strong>
              <span>Episodes this week</span>
            </div>
            <div className="hero-stat">
              <strong>18m</strong>
              <span>Avg session time</span>
            </div>
          </div>

          <div className="row wrap">
            <Link className="btn btn-primary" to="/browse">
              Start watching
            </Link>
            <Link className="btn btn-ghost" to="/signup">
              Create free account
            </Link>
          </div>
        </div>

        <div className={`hero-cover ${heroSeries.posterTone}`}>
          <span className="status">Now featuring</span>
          <h3>{heroSeries.title}</h3>
          <p>{heroSeries.hook}</p>
          <small>{heroSeries.trailerLabel}</small>
        </div>
      </section>

      <section className="featured-strip">
        <article className="featured-panel">
          <SectionTitle title="Tonight’s Cinematic Pick" desc="Editorial spotlight with strong completion and replay intent." />
          <h3>{heroSeries.title}</h3>
          <p className="small-text">{heroSeries.synopsis}</p>
          <div className="row wrap">
            <Link className="btn btn-primary" to={`/series/${heroSeries.id}`}>
              View series
            </Link>
            <Link className="btn btn-ghost" to={`/watch/${heroSeries.id}/1`}>
              Watch episode 1
            </Link>
          </div>
        </article>

        <article className="insight-panel">
          <span className="kicker">Platform Pulse</span>
          <h3>Trending in your market</h3>
          <p className="small-text">Romance-revenge and historical thrillers are leading retention among mobile-first viewers.</p>
          <div className="meta-row">
            <span className="meta-pill">Peak hour: 9:00 PM</span>
            <span className="meta-pill">Top source: Creator referral</span>
          </div>
        </article>
      </section>

      <section>
        <SectionTitle title="Trending Premieres" desc="High-completion short dramas with active promotion pushes." />
        <div className="grid cards-3">
          {homepageRows.trending.map((id) => (
            <SeriesCard key={id} series={byId[id]} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Continue Watching" desc="Personal timeline sync with logged-in profile state." />
        <div className="grid cards-2">
          {continueWatching.map((item) => (
            <article className="watchlist-card" key={item.seriesId}>
              <h3>{byId[item.seriesId].title}</h3>
              <p>
                Episode {item.episode} · Progress {item.progress}%
              </p>
              {auth.isLoggedIn ? (
                <span className="status ok">Resume from saved progress</span>
              ) : (
                <span className="status">Sign up to sync watch progress</span>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
