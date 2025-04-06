
import { useQuery } from '@tanstack/react-query';

export type AnimeStats = {
  rating: string;
  quality: string;
  episodes: {
    sub: number | null;
    dub: number | null;
  };
  type: string;
  duration: string;
};

export type AnimeInfo = {
  id: string;
  anilistId: number;
  malId: number;
  name: string;
  poster: string;
  description: string;
  stats: AnimeStats;
};

export type AnimeDetailsResponse = {
  success: boolean;
  data: {
    anime: {
      info: AnimeInfo;
    };
  };
};

const fetchAnimeDetails = async (animeId: string): Promise<AnimeDetailsResponse> => {
  console.log(`Fetching details for anime ID: ${animeId}`);
  
  if (!animeId) {
    throw new Error('Anime ID is required');
  }
  
  const response = await fetch(`https://aniwatch-api-jet.vercel.app/api/v2/hianime/anime/${animeId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch anime details');
  }
  
  const data = await response.json();
  console.log('API Response for anime details:', data);
  return data;
};

export const useAnimeDetails = (animeId: string) => {
  return useQuery({
    queryKey: ['animeDetails', animeId],
    queryFn: () => fetchAnimeDetails(animeId),
    enabled: !!animeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
