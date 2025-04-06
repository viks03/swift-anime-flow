
import React from 'react';
import { Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

type AnimeCardProps = {
  id: string | number;
  title: string;
  image: string;
  episode?: number;
  rating?: number;
  isCompleted?: boolean;
};

const AnimeCard = ({ id, title, image, episode, rating, isCompleted }: AnimeCardProps) => {
  return (
    <Link to={`/anime/${id}`} className="block">
      <div className="anime-card group">
        <div className="relative aspect-[2/3] overflow-hidden rounded-md">
          <img 
            src={image || "https://cdn.myanimelist.net/images/anime/1015/138006.jpg"} 
            alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-[#9b87f5]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="bg-white rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform">
              <Play className="h-6 w-6 text-[#9b87f5]" fill="currentColor" />
            </button>
          </div>
          
          {/* Episode Badge */}
          {episode && !isCompleted && (
            <div className="absolute top-2 left-2 bg-[#9b87f5] text-white text-xs font-semibold px-2 py-1 rounded-md">
              EP {episode}
            </div>
          )}
          
          {/* Completed Badge */}
          {isCompleted && (
            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
              Completed
            </div>
          )}
          
          {/* Rating */}
          {rating && (
            <div className="absolute top-2 right-2 bg-anime-muted/80 text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center">
              <Star className="h-3 w-3 mr-1 text-yellow-400" fill="currentColor" />
              {rating}
            </div>
          )}
        </div>
        
        <div className="p-2">
          <h3 className="font-medium text-sm line-clamp-2 mt-1">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
