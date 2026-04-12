import { SectionTitle } from '../components/SectionTitle';
import { SeriesCard } from '../components/SeriesCard';
import { continueWatching, homepageRows, seriesData } from '../data/series';

export function HomePage({ auth }) {
  const byId = Object.fromEntries(seriesData.map((item) => [item.id, item]));

  return (
    <div className="stack-lg">
      <section className="hero">
        <div>
          <span className="kicker">AI Short Drama Platform</span>
          <h1>Discover binge-ready mini dramas built for mobile attention.</h1>
          <p>
            AIShortHub connects viewers, creators, and operators in one scalable front-end shell.
            Built to plug into auth, playback, distribution, and billing services.
          </p>
          <div className="row wrap">
            <a className="btn btn-primary" href="/browse">
              Start browsing
            </a>
            <a className="btn btn-ghost" href="/submit">
              Creator submission
            </a>
          </div>
        </div>
        <div className="hero-cover from-purple">
          <p>Trending now</p>
          <h3>{byId[homepageRows.trending[0]].title}</h3>
          <small>Teaser / trailer / promo asset ready</small>
        </div>
      </section>

      <section>
        <SectionTitle title="Trending" desc="Hot short dramas with high completion rate." />
        <div className="grid cards-3">
          {homepageRows.trending.map((id) => (
            <SeriesCard key={id} series={byId[id]} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Continue Watching" desc="Synced with account in future auth flow." />
        <div className="grid cards-2">
          {continueWatching.map((item) => (
            <article className="mini-card" key={item.seriesId}>
              <h3>{byId[item.seriesId].title}</h3>
              <p>
                Episode {item.episode} · Progress {item.progress}%
              </p>
              {auth.isLoggedIn ? <span className="status ok">Resume now</span> : <span className="status">Login to sync</span>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
