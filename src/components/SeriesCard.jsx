import { GenreTag } from './GenreTag';

export function SeriesCard({ series }) {
  return (
    <article className="series-card">
      <div className={`cover ${series.posterTone}`}>
        <span>{series.trailerLabel}</span>
      </div>
      <div className="series-card-body stack-md">
        <div className="row split center">
          <h3>{series.title}</h3>
          <span className="status">Premium</span>
        </div>
        <p>{series.hook}</p>
        <div className="row wrap">
          {series.genres.map((g) => (
            <GenreTag key={g} label={g} />
          ))}
        </div>
        <div className="row split small-text series-card-foot">
          <span>{series.episodes} Episodes</span>
          <span>Free {series.freeEpisodes}</span>
        </div>
        <a className="text-link" href={`/series/${series.id}`}>
          View detail →
        </a>
      </div>
    </article>
  );
}
