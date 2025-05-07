import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  ThumbsUp,
  ThumbsDown,
  Share2,
  Flag,
  Heart,
  Play
} from 'lucide-react';
import { getMovieDetails, getImageUrl, getMovieEmbedUrl } from '../services/tmdb';
import { Movie } from '../types';
import VideoPlayer from '../components/player/VideoPlayer';
import { useUIStore } from '../store';
import { formatDate, formatRuntime } from '../utils';

const WatchMovie: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'related' | 'popular'>('related');
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const { setCurrentMedia, setMiniplayer } = useUIStore();
  
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (id) {
          const movieData = await getMovieDetails(parseInt(id, 10));
          setMovie(movieData);
          
          setCurrentMedia({
            id: parseInt(id, 10),
            type: 'movie',
            title: movieData.title,
          });
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [id, setCurrentMedia]);
  
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
  
  const embedUrl = getMovieEmbedUrl(movie.id);
  
  return (
    <main className="pt-16 min-h-screen bg-gray-100 dark:bg-dark-200">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Main Content - Video Player and Info */}
          <div className="flex-1 lg:w-2/3">
            {/* Video Player - Fixed on mobile/tablet */}
            <div 
              ref={videoContainerRef} 
              className="w-full bg-black sticky top-16 z-10"
              style={{ aspectRatio: '16/9' }}
            >
              <VideoPlayer
                src={embedUrl}
                poster={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
                mediaId={movie.id}
                mediaType="movie"
                title={movie.title}
              />
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto">
              {/* Video Info */}
              <div className="p-4 bg-white dark:bg-dark-100">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {movie.title}
                </h1>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{formatDate(movie.release_date)}</span>
                    {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                      <ThumbsUp className="w-5 h-5" />
                      <span className="text-sm">23K</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                      <ThumbsDown className="w-5 h-5" />
                      <span className="text-sm">1.2K</span>
                    </button>
                    <button className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="text-gray-700 dark:text-gray-300 hover:text-red-500">
                      <Flag className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:opacity-90 transition-opacity">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">Support Us</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres?.map((genre) => (
                    <span 
                      key={genre.id}
                      className="px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
                  {movie.overview}
                </p>

                {/* Cast Section */}
                {movie.credits && movie.credits.cast.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Cast</h2>
                    <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                      {movie.credits.cast.slice(0, 20).map((person) => (
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
                                <span className="text-gray-500 dark:text-gray-600">No Image</span>
                              </div>
                            )}
                          </div>
                          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                            {person.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {person.character}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Crew Section */}
                {movie.credits && movie.credits.crew.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Crew</h2>
                    <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                      {movie.credits.crew
                        .filter(member => ['Director', 'Producer', 'Writer'].includes(member.job))
                        .map((person) => (
                          <div key={person.id} className="flex-shrink-0 w-24 sm:w-32">
                            <div className="aspect-[2/3] rounded-lg bg-gray-200 dark:bg-dark-300 overflow-hidden mb-2">
                              {person.profile_path ? (
                                <img
                                  src={getImageUrl(person.profile_path, 'w185')}
                                  alt={person.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-dark-400">
                                  <span className="text-gray-500 dark:text-gray-600">No Image</span>
                                </div>
                              )}
                            </div>
                            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                              {person.name}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {person.job}
                            </p>
                          </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 bg-white dark:bg-dark-100 lg:min-h-screen border-l border-gray-200 dark:border-dark-300">
            {/* Tabs */}
            <div className="sticky top-16 z-10 bg-white dark:bg-dark-100">
              <div className="flex border-b border-gray-200 dark:border-dark-300">
                <button
                  onClick={() => setActiveTab('related')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'related'
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Related Movies
                </button>
                <button
                  onClick={() => setActiveTab('popular')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'popular'
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Popular
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="overflow-y-auto">
              {activeTab === 'related' ? (
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4">
                    {movie.similar?.results.slice(0, 15).map((relatedMovie) => (
                      <Link
                        key={relatedMovie.id}
                        to={`/watch/movie/${relatedMovie.id}`}
                        className="flex gap-4 group"
                      >
                        <div className="relative w-40 h-24 flex-shrink-0 bg-gray-200 dark:bg-dark-300 rounded-lg overflow-hidden">
                          <img
                            src={getImageUrl(relatedMovie.backdrop_path || relatedMovie.poster_path, 'w300')}
                            alt={relatedMovie.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" fill="currentColor" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2">
                            {relatedMovie.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {formatDate(relatedMovie.release_date, 'yyyy')} • {formatRuntime(relatedMovie.runtime || 0)}
                          </p>
                          <div className="flex items-center mt-1">
                            <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                              {relatedMovie.vote_average.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4">
                    {movie.recommendations?.results.slice(0, 15).map((recMovie) => (
                      <Link
                        key={recMovie.id}
                        to={`/watch/movie/${recMovie.id}`}
                        className="flex gap-4 group"
                      >
                        <div className="relative w-40 h-24 flex-shrink-0 bg-gray-200 dark:bg-dark-300 rounded-lg overflow-hidden">
                          <img
                            src={getImageUrl(recMovie.backdrop_path || recMovie.poster_path, 'w300')}
                            alt={recMovie.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" fill="currentColor" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2">
                            {recMovie.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {formatDate(recMovie.release_date, 'yyyy')} • {formatRuntime(recMovie.runtime || 0)}
                          </p>
                          <div className="flex items-center mt-1">
                            <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                              {recMovie.vote_average.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WatchMovie;
