
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { EpisodeSourcesResponse } from '@/hooks/useEpisodeSources';
import { toast } from 'sonner';

interface VideoPlayerProxyProps {
  sourcesData: EpisodeSourcesResponse | undefined;
  isLoadingSources: boolean;
}

const VideoPlayerProxy = ({ sourcesData, isLoadingSources }: VideoPlayerProxyProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hls, setHls] = useState<Hls | null>(null);
  const [playbackInitialized, setPlaybackInitialized] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    // Clean up function to handle component unmounting
    return () => {
      if (hls) {
        console.log('Cleanup: Destroying HLS instance');
        hls.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!sourcesData?.data?.sources || sourcesData.data.sources.length === 0 || !videoRef.current) {
      return;
    }

    // Reset error count when trying new sources
    setErrorCount(0);
    
    const source = sourcesData.data.sources[0];
    const referer = sourcesData.data.headers.Referer;
    
    console.log('Setting up HLS player with source:', source.url);
    console.log('Using referer:', referer);
    
    // Destroy previous Hls instance if exists
    if (hls) {
      console.log('Destroying previous HLS instance');
      hls.destroy();
      setHls(null);
    }
    
    if (Hls.isSupported()) {
      try {
        // Create a new Hls instance with the Referer header
        const newHls = new Hls({
          xhrSetup: function(xhr, url) {
            xhr.setRequestHeader('Referer', referer);
            console.log(`HLS Request to: ${url} with Referer: ${referer}`);
          },
          // More permissive configuration for better compatibility
          manifestLoadPolicy: {
            default: {
              maxTimeToFirstByteMs: 30000, // Increased timeout
              maxLoadTimeMs: 60000,
              timeoutRetry: {
                maxNumRetry: 6, // More retries
                retryDelayMs: 2000,
                maxRetryDelayMs: 10000
              },
              errorRetry: {
                maxNumRetry: 6,
                retryDelayMs: 2000,
                maxRetryDelayMs: 10000
              }
            }
          },
          fragLoadPolicy: {
            default: {
              maxTimeToFirstByteMs: 30000,
              maxLoadTimeMs: 120000,
              timeoutRetry: {
                maxNumRetry: 8,
                retryDelayMs: 2000,
                maxRetryDelayMs: 10000
              },
              errorRetry: {
                maxNumRetry: 8,
                retryDelayMs: 2000,
                maxRetryDelayMs: 10000
              }
            }
          },
          debug: true, // Enable debugging
          enableWorker: true,
          maxBufferLength: 60,
          maxMaxBufferLength: 600,
          backBufferLength: 90
        });
        
        // Set up event handlers
        newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('HLS: Media element attached');
          newHls.loadSource(source.url);
          console.log('HLS: Loading source', source.url);
        });
        
        newHls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          console.log(`HLS: Manifest parsed, found ${data.levels.length} quality levels`);
          setPlaybackInitialized(true);
          
          // Set initial quality level (auto)
          newHls.currentLevel = -1;
          
          // Try to play the video
          const playPromise = videoRef.current?.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.warn("Autoplay failed:", error);
              // Don't show error toast for autoplay - this is expected in many browsers
            });
          }
        });
        
        newHls.on(Hls.Events.LEVEL_LOADED, () => {
          console.log('HLS: Level loaded');
          setPlaybackInitialized(true);
        });
        
        // Error handling with more detailed logging
        newHls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data.type, data.details, data);
          
          if (data.fatal) {
            setErrorCount(prev => prev + 1);
            
            // If we've had too many errors, show a more permanent error
            if (errorCount > 5) {
              toast.error('Playback failed after multiple attempts. Try another episode or source.');
              return;
            }
            
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Fatal network error', data);
                toast.error('Network error. Attempting to recover...');
                setTimeout(() => {
                  console.log('Attempting to recover from network error...');
                  newHls.startLoad();
                }, 2000);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Fatal media error', data);
                toast.error('Media playback error. Attempting to recover...');
                setTimeout(() => {
                  console.log('Attempting to recover from media error...');
                  newHls.recoverMediaError();
                }, 2000);
                break;
              default:
                console.error('Fatal unrecoverable error', data);
                toast.error('Playback error. Please try another episode or source.');
                newHls.destroy();
                setHls(null);
                break;
            }
          } else {
            // Non-fatal error
            console.warn('Non-fatal HLS error:', data.details);
          }
        });
        
        // Attach the media element
        newHls.attachMedia(videoRef.current);
        setHls(newHls);
        
      } catch (error) {
        console.error('Error setting up HLS.js:', error);
        toast.error('Failed to initialize video player');
      }
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegURL')) {
      // Native HLS support (Safari)
      try {
        videoRef.current.src = source.url;
        videoRef.current.addEventListener('loadedmetadata', () => {
          setPlaybackInitialized(true);
          videoRef.current?.play().catch(e => console.warn('Autoplay failed:', e));
        });
      } catch (error) {
        console.error('Error with native HLS playback:', error);
        toast.error('Failed to play with native HLS support');
      }
    } else {
      toast.error('Your browser does not support HLS playback');
    }
    
    // Add subtitle tracks
    if (sourcesData.data.tracks && videoRef.current) {
      // Remove any existing tracks
      while(videoRef.current.firstChild) {
        videoRef.current.removeChild(videoRef.current.firstChild);
      }
      
      // Add new tracks
      sourcesData.data.tracks
        .filter(track => track.kind === 'captions' || track.kind === 'subtitles')
        .forEach(track => {
          const trackElement = document.createElement('track');
          trackElement.kind = track.kind;
          trackElement.label = track.label || 'Unknown';
          trackElement.src = track.file;
          trackElement.default = track.default || false;
          videoRef.current?.appendChild(trackElement);
          console.log(`Added subtitle track: ${track.label || 'Unknown'}`);
        });
    }
  }, [sourcesData]);

  return (
    <div className="relative aspect-video bg-black rounded-md overflow-hidden mb-6">
      {isLoadingSources ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#9b87f5]"></div>
        </div>
      ) : !playbackInitialized ? (
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
          <div className="text-white text-lg">
            {sourcesData ? 'Initializing player...' : 'No video source available'}
          </div>
          {sourcesData && (
            <div className="animate-pulse text-[#9b87f5] text-sm">
              Please wait...
            </div>
          )}
        </div>
      ) : null}
      <video 
        ref={videoRef}
        className="w-full h-full" 
        controls 
        playsInline
        crossOrigin="anonymous"
      >
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
};

export default VideoPlayerProxy;
