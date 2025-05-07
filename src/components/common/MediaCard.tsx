import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Plus, Check, Info } from 'lucide-react';
import { Movie, TVShow, MediaType } from '../../types';
import { getImageUrl, formatDate, truncateString, formatVoteAverage } from '../../utils';
import { useUserStore } from '../../store';

interface MediaCardProps {
  media: Movie | TVShow;
  type: MediaType;
  variant?: 'default' | 'hero' | 'small';
}

const MediaCard: React.FC<MediaCardProps> = ({ media, type, variant = 'default' }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useUserStore();
  const isMovie = type === 'movie';
  
  const title = isMovie ? (media as Movie).title : (media as TVShow).name;
  const releaseDate = isMovie ? (media as Movie).release_date : (media as TVShow).first_air_date;
  const inWatchlist = isInWatchlist(media.id, type);

  // Toggle watchlist function
  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWatchlist) {
      removeFromWatchlist(media.id, type);
    } else {
      addToWatchlist(media.id, type);
    }
  };

  // Handle play button click
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navigate to player page
    if (isMovie) {
      window.location.href = `/watch/movie/${media.id}`;
    } else {
      window.location.href = `/watch/tv/${media.id}/season/1/episode/1`;
    }
  };

  // Handle info button click
  const handleInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navigate to detail page
    window.location.href = `/${type}/${media.id}`;
  };

  if (variant === 'hero') {
    return (
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={getImageUrl(media.backdrop_path, 'original')} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end px-4 sm:px-8 pb-16 sm:pb-24 container mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 max-w-3xl">{title}</h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <span className="flex items-center bg-primary-500 text-white px-2 py-0.5 rounded text-sm font-medium">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {media.vote_average.toFixed(1)}
            </span>
            <span className="text-gray-300">{formatDate(releaseDate)}</span>
          </div>
          
          <p className="text-gray-200 max-w-2xl mb-6 text-base sm:text-lg">
            {truncateString(media.overview, 200)}
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handlePlay}
              className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Play className="w-5 h-5 mr-2" fill="currentColor" />
              Watch Now
            </button>
            
            <button
              onClick={handleInfo}
              className="flex items-center bg-gray-800/70 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </button>
            
            <button
              onClick={handleWatchlistToggle}
              className={`flex items-center ${
                inWatchlist 
                  ? 'bg-gray-700 hover:bg-gray-800' 
                  : 'bg-gray-800/70 hover:bg-gray-800'
              } text-white px-6 py-3 rounded-lg font-medium transition-colors`}
            >
              {inWatchlist ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  In Watchlist
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Watchlist
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === 'small') {
    return (
      <div className="group block w-full">
        <div className="relative aspect-video overflow-hidden rounded-md bg-gray-200 dark:bg-dark-300">
          <img
            src={getImageUrl(media.backdrop_path || media.poster_path, 'w500')}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="flex gap-2">
              <button
                onClick={handlePlay}
                className="w-10 h-10 rounded-full bg-primary-600/90 flex items-center justify-center hover:bg-primary-600"
              >
                <Play className="w-5 h-5 text-white" fill="currentColor" />
              </button>
              <button
                onClick={handleInfo}
                className="w-10 h-10 rounded-full bg-gray-800/90 flex items-center justify-center hover:bg-gray-800"
              >
                <Info className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
          {title}
        </h3>
        <div className="flex items-center mt-1">
          <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
          <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
            {media.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    );
  }
  
  // Default card style
  return (
    <div className="group block w-full overflow-hidden">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-200 dark:bg-dark-300">
        <img 
          src={getImageUrl(media.poster_path, 'w500')} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              <span className="text-white text-sm font-medium">
                {formatVoteAverage(media.vote_average)}
              </span>
            </div>
            <button
              onClick={handleWatchlistToggle}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                inWatchlist ? 'bg-primary-600' : 'bg-gray-800/80 hover:bg-gray-800'
              }`}
              aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {inWatchlist ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Plus className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <button
              onClick={handlePlay}
              className="w-10 h-10 rounded-full bg-primary-600/90 flex items-center justify-center hover:bg-primary-600"
              aria-label="Play"
            >
              <Play className="w-5 h-5 text-white" fill="currentColor" />
            </button>
            <button
              onClick={handleInfo}
              className="w-10 h-10 rounded-full bg-gray-800/90 flex items-center justify-center hover:bg-gray-800"
              aria-label="More info"
            >
              <Info className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
      <h3 className="mt-2 font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {formatDate(releaseDate, 'yyyy')}
      </p>
    </div>
  );
};

export default MediaCard;
