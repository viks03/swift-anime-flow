
import React from 'react';
import { EpisodeSourcesResponse } from '@/hooks/useEpisodeSources';
import VideoPlayerProxy from './VideoPlayerProxy';

interface VideoPlayerProps {
  sourcesData: EpisodeSourcesResponse | undefined;
  isLoadingSources: boolean;
}

const VideoPlayer = ({ sourcesData, isLoadingSources }: VideoPlayerProps) => {
  return <VideoPlayerProxy sourcesData={sourcesData} isLoadingSources={isLoadingSources} />;
};

export default VideoPlayer;
