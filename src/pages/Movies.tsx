
import React from 'react';
import NewLayout from '@/components/NewLayout';
import AnimeCard from '@/components/AnimeCard';

const Movies = () => {
  const movieData = [
    {
      id: "movie-1",
      title: "Your Name",
      image: "https://cdn.myanimelist.net/images/anime/5/87048.jpg",
      rating: 8.4,
      isCompleted: true
    },
    {
      id: "movie-2", 
      title: "Spirited Away",
      image: "https://cdn.myanimelist.net/images/anime/6/179.jpg",
      rating: 9.3,
      isCompleted: true
    },
    {
      id: "movie-3",
      title: "Princess Mononoke",
      image: "https://cdn.myanimelist.net/images/anime/7/75919.jpg",
      rating: 8.7,
      isCompleted: true
    }
  ];

  return (
    <NewLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Anime Movies</h1>
          <p className="text-muted-foreground">Feature-length anime films</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movieData.map((movie) => (
            <AnimeCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              image={movie.image}
              rating={movie.rating}
              isCompleted={movie.isCompleted}
            />
          ))}
        </div>
      </div>
    </NewLayout>
  );
};

export default Movies;
