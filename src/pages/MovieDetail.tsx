import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Clock, 
  Star, 
  Calendar, 
  Play, 
  Plus, 
  Check,
  ArrowUpRight
} from 'lucide-react';
import { getMovieDetails, getImageUrl, getMovieEmbedUrl } from '../services/tmdb';
import { Movie, Cast } from '../types';
import { formatDate, formatRuntime } from '../utils';
import MediaCard from '../components/common/MediaCard';
import { useUserStore, useUIStore } from '../store';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useUserStore();
  const { setCurrentMedia, setMiniplayer } = useUIStore();
  
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (id) {
          const movieData = await getMovieDetails(parseInt(id, 10));
          setMovie(movieData);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [id]);
  
  // Track if the movie is in watchlist
  const inWatchlist = id ? isInWatchlist(parseInt(id, 10), 'movie') : false;
  
  // Toggle watchlist function
  const handleWatchlistToggle = () => {
    if (!id) return;
    
    const movieId = parseInt(id, 10);
    if (inWatchlist) {
      removeFromWatchlist(movieId, 'movie');
    } else {
      addToWatchlist(movieId, 'movie');
    }
  };
  
  // Handle play button click
  const handlePlay = () => {
    if (!movie) return;
    
    // Set current media in store for player
    setCurrentMedia({
      id: movie.id,
      type: 'movie',
      title: movie.title,
    });
    
    // Navigate to player page
    window.location.href = `/watch/movie/${movie.id}`;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Movie Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn't find the movie you're looking for.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    );
  }
  
  // Get embed URL for the movie
  const embedUrl = getMovieEmbedUrl(movie.id);
  
  return (
    <main className="pb-12">
      {/* Hero Banner */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={getImageUrl(movie.backdrop_path, 'original')} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end px-4 sm:px-8 pb-16 sm:pb-24 container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            {/* Poster */}
            <div className="hidden md:block w-52 h-72 flex-shrink-0">
              <img 
                src={getImageUrl(movie.poster_path, 'w342')} 
                alt={movie.title}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
            
            {/* Movie Info */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm text-gray-300">
                {movie.release_date && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(movie.release_date)}
                  </div>
                )}
                
                {movie.runtime && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatRuntime(movie.runtime)}
                  </div>
                )}
                
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" />
                  <span>{movie.vote_average.toFixed(1)} ({movie.vote_count})</span>
                </div>
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres?.map((genre) => (
                  <span 
                    key={genre.id} 
                    className="px-3 py-1 bg-gray-800/70 text-gray-300 rounded-full text-xs font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-200 max-w-2xl mb-6 text-sm sm:text-base line-clamp-3 sm:line-clamp-none">
                {movie.overview}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={handlePlay}
                  className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Play className="w-5 h-5 mr-2" fill="currentColor" />
                  Watch Now
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
                
                {movie.videos && movie.videos.results.length > 0 && (
                  <a
                    href={`https://www.youtube.com/watch?v=${movie.videos.results[0].key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <ArrowUpRight className="w-5 h-5 mr-2" />
                    Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 mt-12">
        {/* Cast */}
        {movie.credits && movie.credits.cast.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Cast
            </h2>
            
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {movie.credits.cast.slice(0, 12).map((person: Cast) => (
                <div key={person.id} className="flex-shrink-0 w-24 sm:w-32">
                  <div className="w-full aspect-[2/3] rounded-lg bg-gray-200 dark:bg-dark-300 overflow-hidden mb-2">
                    {person.profile_path ? (
                      <img
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-dark-400">
                        <span className="text-gray-500 dark:text-gray-600">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
                    {person.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Similar Movies */}
        {movie.similar && movie.similar.results.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Similar Movies
              </h2>
              <Link
                to="/movies"
                className="flex items-center text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {movie.similar.results.slice(0, 6).map((similarMovie) => (
                <MediaCard
                  key={similarMovie.id}
                  media={similarMovie}
                  type="movie"
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Recommendations */}
        {movie.recommendations && movie.recommendations.results.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Recommended for You
              </h2>
              <Link
                to="/movies"
                className="flex items-center text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {movie.recommendations.results.slice(0, 6).map((recMovie) => (
                <MediaCard
                  key={recMovie.id}
                  media={recMovie}
                  type="movie"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default MovieDetail;
