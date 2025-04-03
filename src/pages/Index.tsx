
import React from 'react';
import Layout from '@/components/Layout';
import AnimeCarousel from '@/components/AnimeCarousel';
import AnimeSection from '@/components/AnimeSection';
import { recentlyUpdatedAnime, trendingAnime, completedAnime } from '@/data/animeData';

const Index = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Main Content (70%) */}
        <div className="lg:col-span-5">
          <AnimeCarousel />
          
          <div className="mt-8">
            <AnimeSection 
              title="Recently Updated" 
              viewAllLink="#"
              animeList={recentlyUpdatedAnime} 
            />
          </div>
        </div>
        
        {/* Sidebar Content (30%) */}
        <div className="lg:col-span-2">
          <div className="bg-anime-muted/30 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold mb-4">Latest Completed</h2>
            <div className="space-y-4">
              {completedAnime.map((anime) => (
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
          
          <div className="bg-anime-muted/30 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Trending Now</h2>
            <div className="space-y-4">
              {trendingAnime.map((anime) => (
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
    </Layout>
  );
};

export default Index;
