
import React from 'react';
import AnimeCard from './AnimeCard';

type AnimeSectionProps = {
  title: string;
  viewAllLink?: string;
  animeList: Array<{
    id: number;
    title: string;
    image: string;
    episode?: number;
    rating?: number;
    isCompleted?: boolean;
  }>;
};

const AnimeSection = ({ title, viewAllLink, animeList }: AnimeSectionProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {viewAllLink && (
          <a href={viewAllLink} className="text-sm text-[#9b87f5] hover:text-[#F43F5E]">
            View All
          </a>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {animeList.map((anime) => (
          <AnimeCard
            key={anime.id}
            id={anime.id}
            title={anime.title}
            image={anime.image || "https://cdn.myanimelist.net/images/anime/1015/138006.jpg"}
            episode={anime.episode}
            rating={anime.rating}
            isCompleted={anime.isCompleted}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimeSection;
