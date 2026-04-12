import { EpisodeList } from '../components/EpisodeList';
import { GenreTag } from '../components/GenreTag';
import { seriesData } from '../data/series';

export function SeriesDetailPage({ id }) {
  const series = seriesData.find((item) => item.id === id) || seriesData[0];

  return (
    <div className="stack-lg">
      <section className="detail-hero panel">
        <div className={`detail-cover ${series.posterTone}`}>
          <span className="status">{series.trailerLabel}</span>
          <h2>{series.title}</h2>
          <small>{series.subtitle}</small>
        </div>

        <div>
          <span className="kicker">Series Detail</span>
          <h1>{series.title}</h1>
          <p>{series.synopsis}</p>

          <div className="meta-row">
            <span className="meta-pill">{series.episodes} episodes</span>
            <span className="meta-pill">Free {series.freeEpisodes}</span>
            <span className="meta-pill">Creator: {series.creator}</span>
            <span className="meta-pill">Campaign: {series.campaignStatus}</span>
          </div>

          <div className="row wrap">
            {series.genres.map((genre) => (
              <GenreTag key={genre} label={genre} />
            ))}
          </div>

          <div className="row wrap detail-actions">
            <a className="btn btn-primary" href={`/watch/${series.id}/1`}>
              Start episode 1
            </a>
            <button className="btn btn-ghost">Add to watchlist</button>
          </div>
        </div>
      </section>

      <section className="grid cards-2">
        <article className="detail-callout">
          <h3>Why watch</h3>
          <p className="small-text">
            Fast-paced cliffhangers, high replay hooks, and social-ready moments designed for short-form binge viewing.
          </p>
        </article>
        <article className="detail-callout">
          <h3>Creator spotlight</h3>
          <p className="small-text">
            {series.creator} specializes in emotionally intense vertical stories optimized for audience retention and campaign growth.
          </p>
        </article>
      </section>

      <section className="panel">
        <h2>Episode lineup</h2>
        <EpisodeList series={series} currentEpisode={1} onSelect={() => {}} />
      </section>
    </div>
  );
}
