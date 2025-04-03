
import React, { useState, useEffect } from 'react';
import { Play, Star } from 'lucide-react';
import { cn } from "@/lib/utils";

type AnimeSlide = {
  id: number;
  title: string;
  description: string;
  image: string;
  episodeLength: string;
  quality: string;
  rating: number;
};

const featuredAnime: AnimeSlide[] = [
  {
    id: 1,
    title: "Attack on Titan: Final Season",
    description: "Eren and the Survey Corps wage one final battle to complete their mission and save humanity.",
    image: "https://via.placeholder.com/1200x500/171923/E2E8F0?text=Attack+on+Titan",
    episodeLength: "24 min",
    quality: "HD",
    rating: 9.8,
  },
  {
    id: 2,
    title: "Demon Slayer: Entertainment District Arc",
    description: "Tanjiro and his friends join Tengen Uzui on a mission in the Entertainment District to hunt demons.",
    image: "https://via.placeholder.com/1200x500/171923/E2E8F0?text=Demon+Slayer",
    episodeLength: "26 min",
    quality: "4K",
    rating: 9.5,
  },
  {
    id: 3,
    title: "Jujutsu Kaisen: The Movie",
    description: "A prequel story focusing on Yuta Okkotsu, a high school student who becomes a sorcerer and seeks to control the cursed spirit of his childhood friend.",
    image: "https://via.placeholder.com/1200x500/171923/E2E8F0?text=Jujutsu+Kaisen",
    episodeLength: "105 min",
    quality: "HD",
    rating: 9.7,
  },
];

const AnimeCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredAnime.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-lg">
      {featuredAnime.map((anime, index) => (
        <div
          key={anime.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-anime-background to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-anime-background to-transparent z-10" />
          <img
            src={anime.image}
            alt={anime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 z-20 p-6 md:p-10 w-full md:w-2/3">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">{anime.title}</h2>
            <p className="text-sm md:text-base text-gray-300 mb-4 line-clamp-2 md:line-clamp-3">
              {anime.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="anime-badge bg-anime-muted">
                <Star className="h-3 w-3 mr-1 text-yellow-400" />
                {anime.rating}
              </span>
              <span className="anime-badge">{anime.episodeLength}</span>
              <span className="anime-badge">{anime.quality}</span>
            </div>
            <button className="bg-anime-primary hover:bg-anime-secondary text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
              <Play className="h-4 w-4" />
              Watch Now
            </button>
          </div>
        </div>
      ))}
      
      {/* Carousel Indicators */}
      <div className="absolute bottom-4 right-4 z-30 flex space-x-2">
        {featuredAnime.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentSlide
                ? "bg-anime-primary w-6"
                : "bg-gray-400 bg-opacity-50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimeCarousel;
