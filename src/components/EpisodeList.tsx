
import React from 'react';
import { Button } from '@/components/ui/button';
import { AnimeEpisode } from '@/hooks/useAnimeEpisodes';

interface EpisodeListProps {
  episodes: AnimeEpisode[];
  currentEpisode: number;
  onEpisodeSelect: (episodeId: string, episodeNumber: number) => void;
}

const EpisodeList = ({ episodes, currentEpisode, onEpisodeSelect }: EpisodeListProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Episodes</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {episodes.map(episode => (
          <Button
            key={episode.episodeId}
            variant={episode.number === currentEpisode ? "default" : "outline"}
            className={`${episode.number === currentEpisode ? 'bg-[#9b87f5] text-white' : ''} ${episode.isFiller ? 'border-orange-500' : ''}`}
            onClick={() => onEpisodeSelect(episode.episodeId, episode.number)}
          >
            Ep {episode.number}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default EpisodeList;
