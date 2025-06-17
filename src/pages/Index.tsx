
import React from 'react';
import NewLayout from '@/components/NewLayout';
import AnimeCarousel from '@/components/AnimeCarousel';
import AnimeSection from '@/components/AnimeSection';
import { completedAnime, trendingAnime } from '@/data/animeData';
import { useAnimeCache } from '@/hooks/useAnimeCache';
import { toast } from 'sonner';

const Index = () => {
  const { cachedData, isLoading, error } = useAnimeCache();
  
  React.useEffect(() => {
    if (error) {
      toast.error('Failed to load anime data');
      console.error('Error fetching anime data:', error);
    }
  }, [error]);

  // Convert trending anime data to match AnimeItem format for sidebar
  const sidebarTrending = trendingAnime.map(anime => ({
    id: anime.id.toString(),
    title: anime.title,
    image: anime.image,
    rating: anime.rating
  }));

  const sidebarCompleted = completedAnime.map(anime => ({
    id: anime.id.toString(),
    title: anime.title,
    image: anime.image
  }));

  return (
    <NewLayout>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Main Content (70%) */}
        <div className="lg:col-span-5 space-y-8">
          <AnimeCarousel />
          
          <AnimeSection 
            title="Recently Updated" 
            viewAllLink="/browse"
            animeList={cachedData}
            isLoading={isLoading}
            error={error as Error}
          />
        </div>
        
        {/* Sidebar Content (30%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Completed section */}
          <div className="rounded-lg border bg-card p-4">
            <h2 className="text-xl font-bold mb-4">Latest Completed</h2>
            <div className="space-y-4">
              {sidebarCompleted.map((anime) => (
                <div key={anime.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-16">
                    <img 
                      src={anime.image} 
                      alt={anime.title} 
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-sm line-clamp-2">{anime.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">Completed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Trending Now section */}
          <div className="rounded-lg border bg-card p-4">
            <h2 className="text-xl font-bold mb-4">Trending Now</h2>
            <div className="space-y-4">
              {sidebarTrending.map((anime) => (
                <div key={anime.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-16">
                    <img 
                      src={anime.image} 
                      alt={anime.title} 
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-sm line-clamp-2">{anime.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-yellow-400 mr-1">★</span>
                      <span className="text-xs">{anime.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </NewLayout>
  );
};

export default Index;
