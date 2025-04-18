
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimeInfo } from '@/hooks/useAnimeDetails';
import { AnimeEpisode } from '@/hooks/useAnimeEpisodes';

interface EpisodeInfoProps {
  animeInfo: AnimeInfo;
  currentEpisode: number;
  totalEpisodes: number;
  episodeData: AnimeEpisode | undefined;
  onPreviousEpisode: () => void;
  onNextEpisode: () => void;
}

const EpisodeInfo = ({ 
  animeInfo, 
  currentEpisode, 
  totalEpisodes, 
  episodeData,
  onPreviousEpisode,
  onNextEpisode 
}: EpisodeInfoProps) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold">{animeInfo.name}</h1>
          <p className="text-anime-muted">
            Episode {currentEpisode} of {totalEpisodes || '?'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            disabled={currentEpisode <= 1}
            onClick={onPreviousEpisode}
          >
            Previous
          </Button>
          <Button 
            variant="outline"
            disabled={currentEpisode >= totalEpisodes}
            onClick={onNextEpisode}
          >
            Next
          </Button>
        </div>
      </div>
      
      {episodeData && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">
              Episode {episodeData.number}: {episodeData.title || 'Unknown Title'}
            </h2>
            {episodeData.isFiller && (
              <Badge className="bg-orange-500">Filler Episode</Badge>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EpisodeInfo;
