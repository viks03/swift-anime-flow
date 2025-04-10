
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAnimeDetails } from '@/hooks/useAnimeDetails';
import { useAnimeEpisodes } from '@/hooks/useAnimeEpisodes';
import { useEpisodeSources } from '@/hooks/useEpisodeSources';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Hls from 'hls.js';

const WatchAnime = () => {
  const { id } = useParams<{ id: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);
  const [currentEpisodeId, setCurrentEpisodeId] = useState<string>('');
  const [hls, setHls] = useState<Hls | null>(null);
  
  // Fetch anime details
  const { data: animeDetails, isLoading: isLoadingDetails, error: detailsError } = useAnimeDetails(id || '');
  
  // Fetch anime episodes
  const { data: episodesData, isLoading: isLoadingEpisodes, error: episodesError } = useAnimeEpisodes(id || '');
  
  // Fetch episode sources when episodeId is available
  const { data: sourcesData, isLoading: isLoadingSources, error: sourcesError } = 
    useEpisodeSources(currentEpisodeId);
    
  // Set the first episode ID when episodes are loaded
  useEffect(() => {
    if (episodesData?.data?.episodes && episodesData.data.episodes.length > 0) {
      const firstEpisode = episodesData.data.episodes.find(ep => ep.number === 1) || 
        episodesData.data.episodes[0];
      
      setCurrentEpisodeId(firstEpisode.episodeId);
      setCurrentEpisode(firstEpisode.number);
    }
  }, [episodesData]);
  
  // Initialize HLS player when sources are available
  useEffect(() => {
    if (sourcesData?.data?.sources && sourcesData.data.sources.length > 0 && videoRef.current) {
      const source = sourcesData.data.sources[0];
      const referer = sourcesData.data.headers.Referer;
      
      // Clean up previous HLS instance
      if (hls) {
        hls.destroy();
      }
      
      if (Hls.isSupported()) {
        const newHls = new Hls({
          xhrSetup: (xhr) => {
            xhr.setRequestHeader('Referer', referer);
          }
        });
        
        newHls.loadSource(source.url);
        newHls.attachMedia(videoRef.current);
        newHls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current?.play().catch(error => {
            console.error("Autoplay failed:", error);
            toast.error("Autoplay blocked. Please click play to start the video.");
          });
        });
        
        newHls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error('HLS error:', data);
            toast.error('Video playback error. Please try again.');
            newHls.destroy();
          }
        });
        
        setHls(newHls);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari
        videoRef.current.src = source.url;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current?.play().catch(error => {
            console.error("Autoplay failed:", error);
            toast.error("Autoplay blocked. Please click play to start the video.");
          });
        });
      } else {
        toast.error('Your browser does not support HLS playback');
      }
      
      // Add subtitles if available
      if (sourcesData.data.tracks) {
        const subtitleTracks = sourcesData.data.tracks.filter(track => 
          track.kind === 'captions' || track.kind === 'subtitles');
          
        subtitleTracks.forEach(track => {
          if (videoRef.current) {
            const trackElement = document.createElement('track');
            trackElement.kind = track.kind;
            trackElement.label = track.label || 'Unknown';
            trackElement.src = track.file;
            trackElement.default = track.default || false;
            videoRef.current.appendChild(trackElement);
          }
        });
      }
    }
    
    // Cleanup function
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [sourcesData, hls]);
  
  // Handle episode change
  const changeEpisode = (episodeId: string, episodeNumber: number) => {
    setCurrentEpisodeId(episodeId);
    setCurrentEpisode(episodeNumber);
    
    // Clean up previous HLS instance
    if (hls) {
      hls.destroy();
      setHls(null);
    }
    
    // Scroll to the top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle errors
  useEffect(() => {
    if (detailsError || episodesError || sourcesError) {
      toast.error('Failed to load content');
      console.error('Errors:', { detailsError, episodesError, sourcesError });
    }
  }, [detailsError, episodesError, sourcesError]);
  
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
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Video Player */}
        <div className="relative aspect-video bg-black rounded-md overflow-hidden mb-6">
          {isLoadingSources ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#9b87f5]"></div>
            </div>
          ) : (
            <video 
              ref={videoRef}
              className="w-full h-full" 
              controls 
              playsInline
              crossOrigin="anonymous"
            >
              Your browser does not support HTML5 video.
            </video>
          )}
        </div>
        
        {/* Episode Information */}
        {animeInfo && (
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold">{animeInfo.name}</h1>
                <p className="text-anime-muted">
                  Episode {currentEpisode} of {episodesData?.data?.totalEpisodes || '?'}
                </p>
              </div>
              
              {episodes.length > 0 && currentEpisode > 0 && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    disabled={currentEpisode <= 1}
                    onClick={() => {
                      const prevEp = episodes.find(ep => ep.number === currentEpisode - 1);
                      if (prevEp) changeEpisode(prevEp.episodeId, prevEp.number);
                    }}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline"
                    disabled={currentEpisode >= episodesData?.data?.totalEpisodes}
                    onClick={() => {
                      const nextEp = episodes.find(ep => ep.number === currentEpisode + 1);
                      if (nextEp) changeEpisode(nextEp.episodeId, nextEp.number);
                    }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
            
            {episodes.length > 0 && currentEpisode > 0 && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-2">
                    Episode {currentEpisode}: {episodes.find(ep => ep.number === currentEpisode)?.title || 'Unknown Title'}
                  </h2>
                  {episodes.find(ep => ep.number === currentEpisode)?.isFiller && (
                    <Badge className="bg-orange-500">Filler Episode</Badge>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {/* Episode List */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Episodes</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {episodes.map(episode => (
              <Button
                key={episode.episodeId}
                variant={episode.number === currentEpisode ? "default" : "outline"}
                className={`${episode.number === currentEpisode ? 'bg-[#9b87f5] text-white' : ''} ${episode.isFiller ? 'border-orange-500' : ''}`}
                onClick={() => changeEpisode(episode.episodeId, episode.number)}
              >
                Ep {episode.number}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WatchAnime;
