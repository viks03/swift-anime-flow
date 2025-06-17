
import React, { useState } from 'react';
import NewLayout from '@/components/NewLayout';
import AnimeCard from '@/components/AnimeCard';
import { useAnimeData } from '@/hooks/useAnimeData';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Grid3X3, List } from 'lucide-react';

const Browse = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('all');
  const { data, isLoading, error } = useAnimeData();

  const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'Thriller'];
  
  const animeList = data?.data?.latestEpisodeAnimes || [];

  return (
    <NewLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Browse Anime</h1>
            <p className="text-muted-foreground">Discover your next favorite anime</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={filter === genre.toLowerCase() ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(genre.toLowerCase())}
            >
              {genre}
            </Button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1'}`}>
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-[300px] w-full rounded-md" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">Failed to load anime data</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1'}`}>
            {animeList.map((anime) => (
              <AnimeCard
                key={anime.id}
                id={anime.id}
                title={anime.name}
                image={anime.poster}
                episode={anime.episodes?.sub}
                rating={anime.rating || undefined}
                isCompleted={anime.type === "MOVIE"}
              />
            ))}
          </div>
        )}
      </div>
    </NewLayout>
  );
};

export default Browse;
