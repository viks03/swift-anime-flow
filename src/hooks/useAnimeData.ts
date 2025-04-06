
import { useQuery } from '@tanstack/react-query';

export type AnimeEpisode = {
  sub: number | null;
  dub: number | null;
};

export type AnimeItem = {
  id: string;
  name: string;
  jname: string;
  poster: string;
  duration: string;
  type: string;
  rating: number | null;
  episodes: AnimeEpisode;
};

export type AnimeApiResponse = {
  success: boolean;
  data: {
    latestEpisodeAnimes: AnimeItem[];
    spotlightAnimes: any[];
    trendingAnimes: any[];
    // Add other fields as needed
  };
};

const fetchAnimeData = async (): Promise<AnimeApiResponse> => {
  console.log('Fetching anime data...');
  const response = await fetch('https://aniwatch-api-jet.vercel.app/api/v2/hianime/home');
  
  if (!response.ok) {
    throw new Error('Failed to fetch anime data');
  }
  
  const data = await response.json();
  console.log('API Response:', data);
  return data;
};

export const useAnimeData = () => {
  return useQuery({
    queryKey: ['animeData'],
    queryFn: fetchAnimeData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
