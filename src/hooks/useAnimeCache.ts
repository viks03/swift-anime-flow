
import { useState, useEffect } from 'react';
import { AnimeItem } from './useAnimeData';

interface CachedAnimeData {
  animes: AnimeItem[];
  lastUpdated: string;
  version: number;
}

const CACHE_KEY = 'anime_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useAnimeCache = () => {
  const [cachedData, setCachedData] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCachedData = (): CachedAnimeData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsedData: CachedAnimeData = JSON.parse(cached);
        const now = new Date().getTime();
        const cacheTime = new Date(parsedData.lastUpdated).getTime();
        
        // Check if cache is still valid
        if (now - cacheTime < CACHE_DURATION) {
          return parsedData;
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading cached data:', error);
      return null;
    }
  };

  const saveCachedData = (animes: AnimeItem[]) => {
    try {
      const existingCache = loadCachedData();
      const existingAnimes = existingCache?.animes || [];
      
      // Merge new animes with existing ones, avoiding duplicates
      const animeMap = new Map();
      
      // Add existing animes first
      existingAnimes.forEach(anime => {
        animeMap.set(anime.id, anime);
      });
      
      // Add new animes, overwriting if they exist (for updates)
      animes.forEach(anime => {
        animeMap.set(anime.id, anime);
      });
      
      const mergedAnimes = Array.from(animeMap.values());
      
      const cacheData: CachedAnimeData = {
        animes: mergedAnimes,
        lastUpdated: new Date().toISOString(),
        version: 1
      };
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      setCachedData(mergedAnimes);
      console.log(`Cached ${mergedAnimes.length} animes`);
    } catch (error) {
      console.error('Error saving cached data:', error);
    }
  };

  const fetchAndCacheAnime = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check cache first
      const cached = loadCachedData();
      if (cached) {
        console.log('Loading from cache:', cached.animes.length, 'animes');
        setCachedData(cached.animes);
        setIsLoading(false);
        return;
      }
      
      // Fetch fresh data
      console.log('Fetching fresh anime data...');
      const response = await fetch('https://aniwatch-api-jet.vercel.app/api/v2/hianime/home');
      
      if (!response.ok) {
        throw new Error('Failed to fetch anime data');
      }
      
      const data = await response.json();
      const animes = data?.data?.latestEpisodeAnimes || [];
      
      saveCachedData(animes);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching anime data:', err);
      setError(err as Error);
      
      // Try to load any existing cache as fallback
      const cached = loadCachedData();
      if (cached) {
        setCachedData(cached.animes);
      }
      setIsLoading(false);
    }
  };

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    setCachedData([]);
    console.log('Cache cleared');
  };

  useEffect(() => {
    fetchAndCacheAnime();
  }, []);

  return {
    cachedData,
    isLoading,
    error,
    refetch: fetchAndCacheAnime,
    clearCache
  };
};
