
import { useQuery } from '@tanstack/react-query';

export type EpisodeSource = {
  url: string;
  type: string;
};

export type EpisodeTrack = {
  file: string;
  label?: string;
  kind: string;
  default?: boolean;
};

export type EpisodeTimestamp = {
  start: number;
  end: number;
};

export type EpisodeSourcesResponse = {
  success: boolean;
  data: {
    headers: {
      Referer: string;
    };
    tracks: EpisodeTrack[];
    intro?: EpisodeTimestamp;
    outro?: EpisodeTimestamp;
    sources: EpisodeSource[];
    anilistID?: number;
    malID?: number;
  };
};

const fetchEpisodeSources = async (episodeId: string): Promise<EpisodeSourcesResponse> => {
  console.log(`Fetching sources for episode ID: ${episodeId}`);
  
  if (!episodeId) {
    throw new Error('Episode ID is required');
  }
  
  // The API expects the episodeId to be properly URL encoded
  const encodedEpisodeId = encodeURIComponent(episodeId);
  
  const url = `https://aniwatch-api-jet.vercel.app/api/v2/hianime/episode/sources?animeEpisodeId=${encodedEpisodeId}`;
  console.log(`Requesting URL: ${url}`);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    console.error(`API returned status: ${response.status}`);
    throw new Error('Failed to fetch episode sources');
  }
  
  const data = await response.json();
  console.log('API Response for episode sources:', data);
  
  // Validate that we have sources
  if (!data.success || !data.data || !data.data.sources || data.data.sources.length === 0) {
    console.error('No valid sources found in response:', data);
    throw new Error('No valid sources found for this episode');
  }
  
  return data;
};

export const useEpisodeSources = (episodeId: string) => {
  return useQuery({
    queryKey: ['episodeSources', episodeId],
    queryFn: () => fetchEpisodeSources(episodeId),
    enabled: !!episodeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2, // Retry failed requests twice
  });
};
