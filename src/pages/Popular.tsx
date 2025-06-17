
import React from 'react';
import NewLayout from '@/components/NewLayout';
import AnimeSection from '@/components/AnimeSection';
import { trendingAnime } from '@/data/animeData';

const Popular = () => {
  // Convert trending anime data to match AnimeItem format
  const popularAnime = trendingAnime.map(anime => ({
    id: anime.id.toString(),
    name: anime.title,
    jname: anime.title,
    poster: anime.image,
    duration: "24m",
    type: "TV",
    rating: anime.rating,
    episodes: { sub: anime.episode, dub: null }
  }));

  return (
    <NewLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Popular Anime</h1>
          <p className="text-muted-foreground">Most watched anime this season</p>
        </div>
        
        <AnimeSection
          title="Top Rated"
          animeList={popularAnime}
          isLoading={false}
        />
      </div>
    </NewLayout>
  );
};

export default Popular;
