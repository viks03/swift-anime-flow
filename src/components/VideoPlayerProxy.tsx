
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

  useEffect(() => {
    if (!sourcesData?.data?.sources || sourcesData.data.sources.length === 0 || !videoRef.current) {
      return;
    }

    const source = sourcesData.data.sources[0];
    const referer = sourcesData.data.headers.Referer;
    
    console.log('Setting up HLS player with source:', source);
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
            // This is the key part - setting the Referer header for all HTTP requests
            xhr.setRequestHeader('Referer', referer);
            console.log(`HLS Request to: ${url} with Referer: ${referer}`);
          },
          // Configure retry and timeout parameters
          manifestLoadPolicy: {
            default: {
              maxTimeToFirstByteMs: 10000,
              maxLoadTimeMs: 20000,
              timeoutRetry: {
                maxNumRetry: 5,
                retryDelayMs: 1000,
                maxRetryDelayMs: 3000
              },
              errorRetry: {
                maxNumRetry: 5,
                retryDelayMs: 1000,
                maxRetryDelayMs: 3000
              }
            }
          },
          playlistLoadPolicy: {
            default: {
              maxTimeToFirstByteMs: 10000,
              maxLoadTimeMs: 20000,
              timeoutRetry: {
                maxNumRetry: 5,
                retryDelayMs: 1000,
                maxRetryDelayMs: 3000
              },
              errorRetry: {
                maxNumRetry: 5,
                retryDelayMs: 1000,
                maxRetryDelayMs: 3000
              }
            }
          },
          fragLoadPolicy: {
            default: {
              maxTimeToFirstByteMs: 10000,
              maxLoadTimeMs: 120000,
              timeoutRetry: {
                maxNumRetry: 5,
                retryDelayMs: 1000,
                maxRetryDelayMs: 3000
              },
              errorRetry: {
                maxNumRetry: 5,
                retryDelayMs: 1000,
                maxRetryDelayMs: 3000
              }
            }
          },
          debug: false,
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 30,
          maxMaxBufferLength: 600
        });
        
        // Set up event handlers
        newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('HLS: Media element attached');
          newHls.loadSource(source.url);
          console.log('HLS: Loading source', source.url);
          setPlaybackInitialized(true);
        });
        
        newHls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          console.log(`HLS: Manifest parsed, found ${data.levels.length} quality levels`);
          
          // Set initial quality level (auto)
          newHls.currentLevel = -1;
          
          // Try to play the video
          videoRef.current?.play().catch(error => {
            console.error("Autoplay failed:", error);
            toast.error("Autoplay blocked. Please click play to start the video.");
          });
        });
        
        // Error handling
        newHls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
          
          if (data.fatal) {
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Fatal network error', data);
                toast.error('Network error. Attempting to recover...');
                newHls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Fatal media error', data);
                toast.error('Media playback error. Attempting to recover...');
                newHls.recoverMediaError();
                break;
              default:
                console.error('Fatal unrecoverable error', data);
                toast.error('Playback error. Please try another episode or source.');
                newHls.destroy();
                break;
            }
          } else {
            // Non-fatal error
            console.warn('Non-fatal HLS error:', data);
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
      toast.warning('Using native HLS player which may not support all features');
      
      // For Safari, we need a proxy to handle the Referer header
      toast.error('Safari direct playback not supported. Please use Chrome or Firefox.');
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
    
    // Cleanup function
    return () => {
      if (hls) {
        console.log('Cleanup: Destroying HLS instance');
        hls.destroy();
      }
    };
  }, [sourcesData, hls]);

  return (
    <div className="relative aspect-video bg-black rounded-md overflow-hidden mb-6">
      {isLoadingSources ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#9b87f5]"></div>
        </div>
      ) : !playbackInitialized && !isLoadingSources ? (
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
  );
};

export default VideoPlayerProxy;
