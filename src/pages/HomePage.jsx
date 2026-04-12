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
          <span className="kicker">Premium Short-Drama Platform</span>
          <h1>Cinematic vertical stories crafted for binge nights and commute breaks.</h1>
          <p>
            Stream daily mini-episodes, unlock premium arcs, and track campaign-driven releases in one modular product shell.
          </p>
          <div className="row wrap">
            <a className="btn btn-primary" href="/browse">
              Watch now
            </a>
            <a className="btn btn-ghost" href="/signup">
              Create free account
            </a>
          </div>
        </div>
        <div className={`hero-cover ${heroSeries.posterTone}`}>
          <p>Now featuring</p>
          <h3>{heroSeries.title}</h3>
          <small>{heroSeries.trailerLabel}</small>
        </div>
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
            <article className="mini-card" key={item.seriesId}>
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
