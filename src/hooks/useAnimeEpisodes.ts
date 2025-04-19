
import { useQuery } from '@tanstack/react-query';

export type AnimeEpisode = {
  title: string;
  episodeId: string;
  number: number;
  isFiller: boolean;
};

export type AnimeEpisodesResponse = {
  success: boolean;
  data: {
    totalEpisodes: number;
    episodes: AnimeEpisode[];
  };
};

const fetchAnimeEpisodes = async (animeId: string): Promise<AnimeEpisodesResponse> => {
  console.log(`Fetching episodes for anime ID: ${animeId}`);
  
  if (!animeId) {
    throw new Error('Anime ID is required');
  }
  
  // Handle trailing slashes in animeId which would break the API call
  const cleanAnimeId = animeId.replace(/\/$/, '');
  
  console.log(`Making request to: https://aniwatch-api-jet.vercel.app/api/v2/hianime/anime/${cleanAnimeId}/episodes`);
  const response = await fetch(`https://aniwatch-api-jet.vercel.app/api/v2/hianime/anime/${cleanAnimeId}/episodes`);
  
  if (!response.ok) {
    console.error(`API returned error status: ${response.status}`);
    throw new Error('Failed to fetch anime episodes');
  }
  
  const data = await response.json();
  console.log('API Response for anime episodes:', data);
  return data;
};

export const useAnimeEpisodes = (animeId: string) => {
  return useQuery({
    queryKey: ['animeEpisodes', animeId],
    queryFn: () => fetchAnimeEpisodes(animeId),
    enabled: !!animeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
