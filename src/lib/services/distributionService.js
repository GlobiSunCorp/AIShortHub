import { apiClient } from '../apiClient';

export const distributionService = {
  getCampaignOverview() {
    return apiClient.get('/distribution/campaigns');
  },
};
