
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAnimeDetails } from '@/hooks/useAnimeDetails';
import { useAnimeEpisodes } from '@/hooks/useAnimeEpisodes';
import { useEpisodeSources } from '@/hooks/useEpisodeSources';
import { Skeleton } from '@/components/ui/skeleton';
import VideoPlayer from '@/components/VideoPlayer';
import EpisodeInfo from '@/components/EpisodeInfo';
import EpisodeList from '@/components/EpisodeList';
import { toast } from 'sonner';

const WatchAnime = () => {
  const { id } = useParams<{ id: string }>();
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);
  const [currentEpisodeId, setCurrentEpisodeId] = useState<string>('');
  
  const { data: animeDetails, isLoading: isLoadingDetails, error: detailsError } = useAnimeDetails(id || '');
  const { data: episodesData, isLoading: isLoadingEpisodes, error: episodesError } = useAnimeEpisodes(id || '');
  const { data: sourcesData, isLoading: isLoadingSources, error: sourcesError } = useEpisodeSources(currentEpisodeId);
  
  // Initialize with the first episode when episodes data is loaded
  useEffect(() => {
    if (episodesData?.data?.episodes && episodesData.data.episodes.length > 0) {
      console.log('Episodes data loaded, setting up first episode');
      
      // Find episode 1 or use the first available episode
      const firstEpisode = episodesData.data.episodes.find(ep => ep.number === 1) || 
        episodesData.data.episodes[0];
      
      console.log('Selected episode:', firstEpisode);
      setCurrentEpisodeId(firstEpisode.episodeId);
      setCurrentEpisode(firstEpisode.number);
    }
  }, [episodesData]);
  
  // Handle episode selection
  const handleEpisodeChange = (episodeId: string, episodeNumber: number) => {
    console.log(`Changing to episode ${episodeNumber} with id: ${episodeId}`);
    setCurrentEpisodeId(episodeId);
    setCurrentEpisode(episodeNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle navigation between episodes
  const handlePreviousEpisode = () => {
    const prevEp = episodesData?.data.episodes.find(ep => ep.number === currentEpisode - 1);
    if (prevEp) {
      handleEpisodeChange(prevEp.episodeId, prevEp.number);
    }
  };
  
  const handleNextEpisode = () => {
    const nextEp = episodesData?.data.episodes.find(ep => ep.number === currentEpisode + 1);
    if (nextEp) {
      handleEpisodeChange(nextEp.episodeId, nextEp.number);
    }
  };
  
  // Handle errors
  useEffect(() => {
    if (detailsError) {
      console.error('Anime details error:', detailsError);
      toast.error('Failed to load anime details');
    }
    
    if (episodesError) {
      console.error('Episodes error:', episodesError);
      toast.error('Failed to load episodes list');
    }
    
    if (sourcesError) {
      console.error('Sources error:', sourcesError);
      toast.error('Failed to load video sources');
    }
  }, [detailsError, episodesError, sourcesError]);
  
  // Loading state
  const isLoading = isLoadingDetails || isLoadingEpisodes || (currentEpisodeId && isLoadingSources);
  
  if (isLoading && (!animeDetails || !episodesData)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-[500px] w-full rounded-md mb-4" />
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-8 w-1/6" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-md" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }
  
  const animeInfo = animeDetails?.data?.anime?.info;
  const episodes = episodesData?.data?.episodes || [];
  const currentEpisodeData = episodes.find(ep => ep.number === currentEpisode);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <VideoPlayer 
          sourcesData={sourcesData} 
          isLoadingSources={isLoadingSources} 
        />
        
        {animeInfo && (
          <EpisodeInfo 
            animeInfo={animeInfo}
            currentEpisode={currentEpisode}
            totalEpisodes={episodesData?.data?.totalEpisodes || 0}
            episodeData={currentEpisodeData}
            onPreviousEpisode={handlePreviousEpisode}
            onNextEpisode={handleNextEpisode}
          />
        )}
        
        <EpisodeList 
          episodes={episodes}
          currentEpisode={currentEpisode}
          onEpisodeSelect={handleEpisodeChange}
        />
      </div>
    </Layout>
  );
};

export default WatchAnime;
