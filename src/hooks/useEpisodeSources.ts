
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
  
  // Handle the case where episodeId has a question mark
  const formattedEpisodeId = episodeId.includes('?') ? 
    episodeId.replace('?', '%3F') : 
    episodeId;
    
  const response = await fetch(`https://aniwatch-api-jet.vercel.app/api/v2/hianime/episode/sources?animeEpisodeId=${formattedEpisodeId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch episode sources');
  }
  
  const data = await response.json();
  console.log('API Response for episode sources:', data);
  return data;
};

export const useEpisodeSources = (episodeId: string) => {
  return useQuery({
    queryKey: ['episodeSources', episodeId],
    queryFn: () => fetchEpisodeSources(episodeId),
    enabled: !!episodeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
