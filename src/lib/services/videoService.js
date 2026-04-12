import { apiClient } from '../apiClient';

export const videoService = {
  getPlaybackSource(seriesId, episode) {
    return apiClient.get(`/playback/${seriesId}/${episode}`);
  },
};
