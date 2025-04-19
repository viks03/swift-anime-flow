
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

  // Clean up function to destroy HLS instance when component unmounts
  useEffect(() => {
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
    setPlaybackInitialized(false);
    
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

    // Create a new video element to replace the current one
    // This is a workaround for better cross-browser compatibility
    if (videoRef.current) {
      const oldVideo = videoRef.current;
      const newVideo = document.createElement('video');
      
      // Copy attributes from the old video element
      newVideo.className = oldVideo.className;
      newVideo.controls = oldVideo.controls;
      newVideo.playsInline = oldVideo.playsInline;
      newVideo.crossOrigin = oldVideo.crossOrigin;
      
      // Replace the old video with the new one
      if (oldVideo.parentNode) {
        oldVideo.parentNode.replaceChild(newVideo, oldVideo);
        videoRef.current = newVideo;
      }
    }
    
    if (Hls.isSupported()) {
      try {
        // Create a new Hls instance with custom configuration
        const newHls = new Hls({
          // Important: Setup proper headers for each request
          xhrSetup: function(xhr, url) {
            // Always send the required referer header
            xhr.setRequestHeader('Referer', referer);
            // Use withCredentials to maintain cookies across requests if needed
            xhr.withCredentials = false;
          },
          // More permissive configuration for better compatibility
          manifestLoadPolicy: {
            default: {
              maxTimeToFirstByteMs: 20000, // 20 seconds timeout
              maxLoadTimeMs: 30000,
              timeoutRetry: {
                maxNumRetry: 4,
                retryDelayMs: 1000,
                maxRetryDelayMs: 8000
              },
              errorRetry: {
                maxNumRetry: 4,
                retryDelayMs: 1000,
                maxRetryDelayMs: 8000
              }
            }
          },
          fragLoadPolicy: {
            default: {
              maxTimeToFirstByteMs: 20000,
              maxLoadTimeMs: 30000,
              timeoutRetry: {
                maxNumRetry: 4,
                retryDelayMs: 1000,
                maxRetryDelayMs: 8000
              },
              errorRetry: {
                maxNumRetry: 4,
                retryDelayMs: 1000,
                maxRetryDelayMs: 8000
              }
            }
          },
          debug: false, // Disable debug logs for production
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          maxBufferSize: 60 * 1000 * 1000, // 60MB
          startLevel: -1, // Auto level selection
          abrEwmaFastLive: 3.0,
          abrEwmaSlowLive: 9.0
        });
        
        // Event listeners to track stream status
        newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('HLS: Media element attached');
          newHls.loadSource(source.url);
          console.log('HLS: Loading source', source.url);
        });
        
        newHls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          console.log(`HLS: Manifest parsed, found ${data.levels.length} quality levels`);
          setPlaybackInitialized(true);
          
          // Attempt to play automatically
          videoRef.current?.play().catch(e => {
            console.log('Auto-play prevented by browser policy', e);
          });
        });
        
        newHls.on(Hls.Events.FRAG_LOADED, () => {
          // Fragment loaded successfully - playback is working
          setPlaybackInitialized(true);
        });
        
        // Error handling
        newHls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data.type, data.details, data);
          
          // Handle fatal errors
          if (data.fatal) {
            setErrorCount(prev => prev + 1);
            
            if (errorCount >= 5) {
              toast.error('Unable to play video after multiple attempts');
              return;
            }
            
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Fatal network error', data);
                toast.error('Network error occurred. Retrying...');
                setTimeout(() => {
                  console.log('Attempting to recover from network error...');
                  newHls.startLoad();
                }, 1000);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Fatal media error', data);
                toast.error('Media error occurred. Retrying...');
                setTimeout(() => {
                  console.log('Attempting to recover from media error...');
                  newHls.recoverMediaError();
                }, 1000);
                break;
              default:
                console.error('Fatal unrecoverable error', data);
                toast.error('Playback error. Please try again or select another episode');
                newHls.destroy();
                setHls(null);
                break;
            }
          }
        });
        
        // Attach to video element and store HLS instance
        newHls.attachMedia(videoRef.current);
        setHls(newHls);
        
      } catch (error) {
        console.error('Error setting up HLS.js:', error);
        toast.error('Failed to initialize video player');
      }
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegURL')) {
      // Native HLS support (Safari)
      try {
        // For Safari, we need to set up a fetch with the right headers
        // and then create a Blob URL
        fetch(source.url, {
          headers: {
            'Referer': referer
          }
        })
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          videoRef.current!.src = url;
          videoRef.current!.addEventListener('loadedmetadata', () => {
            setPlaybackInitialized(true);
            videoRef.current?.play().catch(e => console.warn('Autoplay failed:', e));
          });
        })
        .catch(error => {
          console.error('Error with native HLS fetch:', error);
          toast.error('Failed to load video in Safari');
        });
      } catch (error) {
        console.error('Error with native HLS playback:', error);
        toast.error('Failed to play with native HLS support');
      }
    } else {
      toast.error('Your browser does not support HLS playback');
    }
    
    // Add subtitle tracks if available
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
