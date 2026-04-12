import { useMemo, useState } from 'react';

export function useWatchState(series) {
  const [episode, setEpisode] = useState(1);

  const canWatch = useMemo(() => episode <= series.freeEpisodes, [episode, series.freeEpisodes]);

  const nextEpisode = () => {
    setEpisode((old) => Math.min(old + 1, series.episodes));
  };

  return { episode, setEpisode, canWatch, nextEpisode };
}
