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
        </div>
        <div>
          <h1>{series.title}</h1>
          <p>{series.synopsis}</p>
          <div className="row wrap">
            {series.genres.map((genre) => (
              <GenreTag key={genre} label={genre} />
            ))}
          </div>
          <div className="row wrap">
            <a className="btn btn-primary" href={`/watch/${series.id}/1`}>
              Start episode 1
            </a>
            <button className="btn btn-ghost">Add to watchlist</button>
          </div>
          <p className="small-text">
            {series.episodes} episodes · {series.freeEpisodes} free to watch · locked episodes include signup/login CTAs.
          </p>
        </div>
      </section>

      <section className="panel">
        <h2>Episode lineup</h2>
        <EpisodeList series={series} currentEpisode={1} onSelect={() => {}} />
      </section>
    </div>
  );
}
