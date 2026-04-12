import { EpisodeList } from '../components/EpisodeList';
import { GenreTag } from '../components/GenreTag';
import { seriesData } from '../data/series';

export function SeriesDetailPage({ id }) {
  const series = seriesData.find((item) => item.id === id) || seriesData[0];

  return (
    <div className="stack-lg">
      <section className="detail-hero">
        <div className={`detail-cover ${series.posterTone}`} />
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
              Watch now
            </a>
            <button className="btn btn-ghost">Add to watchlist</button>
          </div>
          <p className="small-text">Free episodes: {series.freeEpisodes} · Locked episodes require unlock flow.</p>
        </div>
      </section>

      <section>
        <h2>Episode list</h2>
        <EpisodeList series={series} currentEpisode={1} onSelect={() => {}} />
      </section>
    </div>
  );
}
