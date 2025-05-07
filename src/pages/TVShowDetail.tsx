import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Calendar, 
  Star, 
  Play, 
  Plus, 
  Check,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { getTVShowDetails, getImageUrl, getTVEmbedUrl } from '../services/tmdb';
import { TVShow, Cast, Season } from '../types';
import { formatDate } from '../utils';
import MediaCard from '../components/common/MediaCard';
import { useUserStore } from '../store';

const TVShowDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useUserStore();
  
  useEffect(() => {
    const fetchTVShow = async () => {
      try {
        if (id) {
          const tvData = await getTVShowDetails(parseInt(id, 10));
          setTVShow(tvData);
        }
      } catch (error) {
        console.error('Error fetching TV show:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTVShow();
  }, [id]);
  
  // Track if the TV show is in watchlist
  const inWatchlist = id ? isInWatchlist(parseInt(id, 10), 'tv') : false;
  
  // Toggle watchlist function
  const handleWatchlistToggle = () => {
    if (!id) return;
    
    const tvId = parseInt(id, 10);
    if (inWatchlist) {
      removeFromWatchlist(tvId, 'tv');
    } else {
      addToWatchlist(tvId, 'tv');
    }
  };
  
  // Toggle season expansion
  const toggleSeason = (seasonNumber: number) => {
    if (expandedSeason === seasonNumber) {
      setExpandedSeason(null);
    } else {
      setExpandedSeason(seasonNumber);
    }
  };
  
  // Handle play button click for an episode
  const handlePlayEpisode = (seasonNumber: number, episodeNumber: number) => {
    if (!tvShow) return;
    
    // Navigate to player page
    window.location.href = `/watch/tv/${tvShow.id}/season/${seasonNumber}/episode/${episodeNumber}`;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!tvShow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          TV Show Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn't find the TV show you're looking for.
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
  
  // Get embed URL for the first episode
  const firstEpisodeUrl = getTVEmbedUrl(tvShow.id, 1, 1);
  
  return (
    <main className="pb-12">
      {/* Hero Banner */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={getImageUrl(tvShow.backdrop_path, 'original')} 
            alt={tvShow.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end px-4 sm:px-8 pb-16 sm:pb-24 container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            {/* Poster */}
            <div className="hidden md:block w-52 h-72 flex-shrink-0">
              <img 
                src={getImageUrl(tvShow.poster_path, 'w342')} 
                alt={tvShow.name}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
            
            {/* TV Show Info */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">{tvShow.name}</h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm text-gray-300">
                {tvShow.first_air_date && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(tvShow.first_air_date)}
                  </div>
                )}
                
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" />
                  <span>{tvShow.vote_average.toFixed(1)} ({tvShow.vote_count})</span>
                </div>
                
                <span>{tvShow.number_of_seasons} Seasons</span>
                <span>{tvShow.number_of_episodes} Episodes</span>
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {tvShow.genres?.map((genre) => (
                  <span 
                    key={genre.id} 
                    className="px-3 py-1 bg-gray-800/70 text-gray-300 rounded-full text-xs font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-200 max-w-2xl mb-6 text-sm sm:text-base line-clamp-3 sm:line-clamp-none">
                {tvShow.overview}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link 
                  to={`/watch/tv/${tvShow.id}/season/1/episode/1`}
                  className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Play className="w-5 h-5 mr-2" fill="currentColor" />
                  Watch Now
                </Link>
                
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
                
                {tvShow.videos && tvShow.videos.results.length > 0 && (
                  <a
                    href={`https://www.youtube.com/watch?v=${tvShow.videos.results[0].key}`}
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
        {/* Episodes */}
        {tvShow.seasons && tvShow.seasons.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Seasons & Episodes
            </h2>
            
            <div className="space-y-4">
              {tvShow.seasons
                .filter((season: Season) => season.season_number > 0) // Filter out specials
                .map((season: Season) => (
                  <div 
                    key={season.id} 
                    className="border dark:border-dark-300 rounded-lg overflow-hidden"
                  >
                    {/* Season Header */}
                    <button
                      onClick={() => toggleSeason(season.season_number)}
                      className="flex items-center justify-between w-full bg-gray-100 dark:bg-dark-200 px-4 py-3 text-left focus:outline-none"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-16 rounded overflow-hidden">
                          <img
                            src={getImageUrl(season.poster_path, 'w92')}
                            alt={season.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            {season.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {season.episode_count} episodes
                          </p>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                          expandedSeason === season.season_number ? 'transform rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {/* Episodes List */}
                    {expandedSeason === season.season_number && (
                      <div className="px-4 py-3 bg-white dark:bg-dark-100">
                        <div className="space-y-3">
                          {Array.from({ length: season.episode_count }, (_, i) => i + 1).map((episodeNumber) => (
                            <div 
                              key={episodeNumber} 
                              className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-dark-200 rounded-md"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-dark-300 rounded-full text-gray-700 dark:text-gray-300 text-sm font-medium">
                                  {episodeNumber}
                                </span>
                                <span className="text-gray-800 dark:text-gray-200">
                                  Episode {episodeNumber}
                                </span>
                              </div>
                              <button
                                onClick={() => handlePlayEpisode(season.season_number, episodeNumber)}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                                aria-label={`Play episode ${episodeNumber}`}
                              >
                                <Play className="w-4 h-4" fill="currentColor" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}
        
        {/* Cast */}
        {tvShow.credits && tvShow.credits.cast.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Cast
            </h2>
            
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {tvShow.credits.cast.slice(0, 12).map((person: Cast) => (
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
        
        {/* Similar TV Shows */}
        {tvShow.similar && tvShow.similar.results.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Similar TV Shows
              </h2>
              <Link
                to="/tv"
                className="flex items-center text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {tvShow.similar.results.slice(0, 6).map((similarShow) => (
                <MediaCard
                  key={similarShow.id}
                  media={similarShow}
                  type="tv"
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Recommendations */}
        {tvShow.recommendations && tvShow.recommendations.results.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Recommended for You
              </h2>
              <Link
                to="/tv"
                className="flex items-center text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {tvShow.recommendations.results.slice(0, 6).map((recShow) => (
                <MediaCard
                  key={recShow.id}
                  media={recShow}
                  type="tv"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default TVShowDetail;
