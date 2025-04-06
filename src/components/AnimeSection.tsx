
import React from 'react';
import AnimeCard from './AnimeCard';
import { AnimeItem } from '@/hooks/useAnimeData';
import { Skeleton } from '@/components/ui/skeleton';

type AnimeSectionProps = {
  title: string;
  viewAllLink?: string;
  animeList: AnimeItem[] | undefined;
  isLoading?: boolean;
  error?: Error | null;
};

const AnimeSection = ({ title, viewAllLink, animeList, isLoading, error }: AnimeSectionProps) => {
  if (error) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <div className="p-4 bg-red-500/10 rounded-md text-red-500">
          Error loading anime data. Please try again later.
        </div>
      </div>
    );
  }
  
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
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <Skeleton className="h-[200px] w-full rounded-md" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))
        ) : animeList && animeList.length > 0 ? (
          animeList.map((anime) => (
            <AnimeCard
              key={anime.id}
              id={anime.id}
              title={anime.name}
              image={anime.poster}
              episode={anime.episodes?.sub}
              rating={anime.rating || undefined}
              isCompleted={anime.type === "MOVIE"}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">No anime found</div>
        )}
      </div>
    </div>
  );
};

export default AnimeSection;
