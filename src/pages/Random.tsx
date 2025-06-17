
import React, { useState } from 'react';
import NewLayout from '@/components/NewLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shuffle, Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Random = () => {
  const [randomAnime, setRandomAnime] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const animePool = [
    {
      id: "random-1",
      title: "Attack on Titan",
      description: "Humanity fights for survival against giant humanoid Titans.",
      image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
      rating: 9.0,
      episodes: 75,
      year: 2013
    },
    {
      id: "random-2", 
      title: "Death Note",
      description: "A high school student gains the power to kill anyone by writing their name in a supernatural notebook.",
      image: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
      rating: 9.0,
      episodes: 37,
      year: 2006
    },
    {
      id: "random-3",
      title: "One Punch Man",
      description: "A superhero who can defeat any enemy with a single punch but struggles with the mundane problems of his everyday life.",
      image: "https://cdn.myanimelist.net/images/anime/12/76049.jpg",
      rating: 8.7,
      episodes: 24,
      year: 2015
    }
  ];

  const getRandomAnime = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * animePool.length);
      setRandomAnime(animePool[randomIndex]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <NewLayout>
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Random Anime Discovery</h1>
          <p className="text-muted-foreground text-lg">
            Can't decide what to watch? Let us pick something awesome for you!
          </p>
          
          <Button 
            size="lg" 
            onClick={getRandomAnime}
            disabled={isLoading}
            className="text-lg px-8 py-6"
          >
            {isLoading ? (
              <>
                <Shuffle className="mr-2 h-6 w-6 animate-spin" />
                Finding Random Anime...
              </>
            ) : (
              <>
                <Shuffle className="mr-2 h-6 w-6" />
                Get Random Anime
              </>
            )}
          </Button>
        </div>

        {randomAnime && (
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-0">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src={randomAnime.image} 
                    alt={randomAnime.title}
                    className="w-full h-[400px] object-cover rounded-l-lg"
                  />
                </div>
                <div className="md:w-2/3 p-6 space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold">{randomAnime.title}</h2>
                    <p className="text-muted-foreground">Released: {randomAnime.year}</p>
                  </div>
                  
                  <p className="text-lg">{randomAnime.description}</p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" />
                      <span className="font-semibold">{randomAnime.rating}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Episodes: </span>
                      <span className="font-semibold">{randomAnime.episodes}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button asChild size="lg">
                      <Link to={`/watch/${randomAnime.id}`}>
                        <Play className="mr-2 h-5 w-5" />
                        Watch Now
                      </Link>
                    </Button>
                    <Button variant="outline" asChild size="lg">
                      <Link to={`/anime/${randomAnime.id}`}>
                        More Info
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!randomAnime && !isLoading && (
          <div className="text-center py-12">
            <Shuffle className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">
              Click the button above to discover a random anime!
            </p>
          </div>
        )}
      </div>
    </NewLayout>
  );
};

export default Random;
