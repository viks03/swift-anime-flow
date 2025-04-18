
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { EpisodeSourcesResponse } from '@/hooks/useEpisodeSources';
import { toast } from 'sonner';

interface VideoPlayerProps {
  sourcesData: EpisodeSourcesResponse | undefined;
  isLoadingSources: boolean;
}

const VideoPlayer = ({ sourcesData, isLoadingSources }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hls, setHls] = useState<Hls | null>(null);

  useEffect(() => {
    if (sourcesData?.data?.sources && sourcesData.data.sources.length > 0 && videoRef.current) {
      const source = sourcesData.data.sources[0];
      const referer = sourcesData.data.headers.Referer;
      
      console.log('Setting up HLS player with source:', source);
      console.log('Using referer:', referer);
      
      if (hls) {
        hls.destroy();
      }
      
      if (Hls.isSupported()) {
        try {
          const newHls = new Hls({
            manifestLoadPolicy: {
              default: {
                maxTimeToFirstByteMs: 10000,
                maxLoadTimeMs: 20000,
                timeoutRetry: {
                  maxNumRetry: 4,
                  retryDelayMs: 500,
                  maxRetryDelayMs: 2000
                },
                errorRetry: {
                  maxNumRetry: 6,
                  retryDelayMs: 1000,
                  maxRetryDelayMs: 8000
                }
              }
            },
            playlistLoadPolicy: {
              default: {
                maxTimeToFirstByteMs: 10000,
                maxLoadTimeMs: 20000,
                timeoutRetry: {
                  maxNumRetry: 4,
                  retryDelayMs: 500,
                  maxRetryDelayMs: 2000
                },
                errorRetry: {
                  maxNumRetry: 6,
                  retryDelayMs: 1000,
                  maxRetryDelayMs: 8000
                }
              }
            },
            fragLoadPolicy: {
              default: {
                maxTimeToFirstByteMs: 10000,
                maxLoadTimeMs: 120000,
                timeoutRetry: {
                  maxNumRetry: 4,
                  retryDelayMs: 500,
                  maxRetryDelayMs: 2000
                },
                errorRetry: {
                  maxNumRetry: 6,
                  retryDelayMs: 1000,
                  maxRetryDelayMs: 8000
                }
              }
            },
            xhrSetup: function(xhr, url) {
              xhr.setRequestHeader('Referer', referer);
              console.log(`HLS request to: ${url} with Referer: ${referer}`);
            },
            debug: true,
            enableWorker: true,
            backBufferLength: 90,
            maxBufferLength: 30,
            maxMaxBufferLength: 600
          });
          
          newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
            console.log('HLS: Media element attached');
            newHls.loadSource(source.url);
            console.log('HLS: Loading source', source.url);
          });
          
          newHls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
            console.log(`HLS: Manifest parsed, found ${data.levels.length} quality levels`);
            newHls.currentLevel = 0;
            videoRef.current?.play().catch(error => {
              console.error("Autoplay failed:", error);
              toast.error("Autoplay blocked. Please click play to start the video.");
            });
          });
          
          newHls.on(Hls.Events.ERROR, (event, data) => {
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
            }
          });
          
          newHls.attachMedia(videoRef.current);
          setHls(newHls);
        } catch (error) {
          console.error('Error setting up HLS.js:', error);
          toast.error('Failed to initialize video player');
        }
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegURL')) {
        toast.warning('Using native HLS player which may not support all features');
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
      
      if (sourcesData.data.tracks && videoRef.current) {
        while(videoRef.current.firstChild) {
          videoRef.current.removeChild(videoRef.current.firstChild);
        }
        
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
    }
    
    return () => {
      if (hls) {
        console.log('Destroying HLS instance');
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

export default VideoPlayer;
