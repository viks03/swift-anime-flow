
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAnimeDetails } from '@/hooks/useAnimeDetails';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Star, Clock, Film, Tv, Play, ExternalLink } from 'lucide-react';

const AnimeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useAnimeDetails(id || '');
  
  React.useEffect(() => {
    if (error) {
      toast.error('Failed to load anime details');
      console.error('Error fetching anime details:', error);
    }
  }, [error]);
  
  const animeInfo = data?.data?.anime?.info;
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="h-[400px] w-[280px] rounded-md" />
            <div className="flex flex-col space-y-4 flex-1">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !animeInfo) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="p-4 bg-red-500/10 rounded-md text-red-500">
            Error loading anime details: {(error as Error)?.message || 'Anime not found'}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Anime Poster */}
          <div className="flex-shrink-0">
            <img 
              src={animeInfo.poster} 
              alt={animeInfo.name} 
              className="w-full max-w-[280px] rounded-md shadow-lg"
            />
            
            {/* Watch Now Button */}
            <Link to={`/watch/${animeInfo.id}`}>
              <Button 
                className="mt-4 w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-bold"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" /> Watch Now
              </Button>
            </Link>
          </div>
          
          {/* Anime Info */}
          <div className="flex flex-col space-y-6 flex-1">
            <div>
              <h1 className="text-3xl font-bold">{animeInfo.name}</h1>
              {animeInfo.jname && animeInfo.jname !== animeInfo.name && (
                <p className="text-anime-muted mt-1">{animeInfo.jname}</p>
              )}
              <p className="text-anime-muted text-sm mt-1">ID: {animeInfo.id}</p>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[#9b87f5]">{animeInfo.stats.type}</Badge>
              <Badge className="bg-[#7E69AB]">{animeInfo.stats.duration}</Badge>
              <Badge className="bg-[#6E59A5]">{animeInfo.stats.rating}</Badge>
              <Badge className="bg-[#8B5CF6]">{animeInfo.stats.quality}</Badge>
              
              {animeInfo.stats.episodes.sub !== null && (
                <Badge className="bg-[#D946EF]">SUB: {animeInfo.stats.episodes.sub} eps</Badge>
              )}
              
              {animeInfo.stats.episodes.dub !== null && (
                <Badge className="bg-[#F97316]">DUB: {animeInfo.stats.episodes.dub} eps</Badge>
              )}
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Tv className="h-6 w-6 text-[#9b87f5] mb-2" />
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-lg font-bold">{animeInfo.stats.type}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Clock className="h-6 w-6 text-[#9b87f5] mb-2" />
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-lg font-bold">{animeInfo.stats.duration}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Star className="h-6 w-6 text-[#9b87f5] mb-2" />
                  <p className="text-sm font-medium">Rating</p>
                  <p className="text-lg font-bold">{animeInfo.stats.rating}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Film className="h-6 w-6 text-[#9b87f5] mb-2" />
                  <p className="text-sm font-medium">Quality</p>
                  <p className="text-lg font-bold">{animeInfo.stats.quality}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-anime-foreground/80 whitespace-pre-line">
                {animeInfo.description}
              </p>
            </div>
            
            {/* External IDs */}
            <div className="flex flex-wrap gap-4">
              {animeInfo.malId && (
                <a 
                  href={`https://myanimelist.net/anime/${animeInfo.malId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-[#9b87f5] hover:text-[#F43F5E]"
                >
                  <ExternalLink className="h-4 w-4 mr-1" /> MyAnimeList
                </a>
              )}
              {animeInfo.anilistId && (
                <a 
                  href={`https://anilist.co/anime/${animeInfo.anilistId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-[#9b87f5] hover:text-[#F43F5E]"
                >
                  <ExternalLink className="h-4 w-4 mr-1" /> AniList
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnimeDetails;
