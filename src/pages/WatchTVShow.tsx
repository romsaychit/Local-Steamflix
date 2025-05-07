import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  ThumbsUp,
  ThumbsDown,
  Share2,
  Flag,
  Heart,
  Play,
  ChevronDown
} from 'lucide-react';
import { getTVShowDetails, getTVSeasonDetails, getTVEpisodeDetails, getImageUrl, getTVEmbedUrl } from '../services/tmdb';
import { TVShow, Episode, Season } from '../types';
import VideoPlayer from '../components/player/VideoPlayer';
import { useUIStore } from '../store';
import { formatDate } from '../utils';

const WatchTVShow: React.FC = () => {
  const { id, seasonNumber, episodeNumber } = useParams<{
    id: string;
    seasonNumber: string;
    episodeNumber: string;
  }>();
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [season, setSeason] = useState<Season | null>(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'episodes' | 'related' | 'popular'>('episodes');
  const { setCurrentMedia } = useUIStore();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id && seasonNumber && episodeNumber) {
          const tvId = parseInt(id, 10);
          const sNum = parseInt(seasonNumber, 10);
          const eNum = parseInt(episodeNumber, 10);
          
          const [tvData, seasonData, episodeData] = await Promise.all([
            getTVShowDetails(tvId),
            getTVSeasonDetails(tvId, sNum),
            getTVEpisodeDetails(tvId, sNum, eNum)
          ]);
          
          setTVShow(tvData);
          setSeason(seasonData);
          setEpisode(episodeData);
          setSeasonEpisodes(seasonData.episodes || []);
          
          setCurrentMedia({
            id: tvId,
            type: 'tv',
            title: `${tvData.name} - S${sNum}E${eNum}`,
            season: sNum,
            episode: eNum,
          });
        }
      } catch (error) {
        console.error('Error fetching TV data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, seasonNumber, episodeNumber, setCurrentMedia]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!tvShow || !episode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Episode Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn't find the episode you're looking for.
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
  
  const embedUrl = getTVEmbedUrl(
    tvShow.id,
    parseInt(seasonNumber || '1', 10),
    parseInt(episodeNumber || '1', 10)
  );
  
  return (
    <main className="pt-16 h-[calc(100vh-64px)] overflow-hidden">
      <div className="max-w-[1800px] mx-auto h-full">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Main Content - Video Player and Info */}
          <div className="flex-1 lg:w-2/3 h-full flex flex-col">
            {/* Video Player - Fixed on all screens */}
            <div className="w-full bg-black">
              <div style={{ aspectRatio: '16/9' }}>
                <VideoPlayer
                  src={embedUrl}
                  poster={getImageUrl(episode.still_path, 'original')}
                  mediaId={tvShow.id}
                  mediaType="tv"
                  title={`${tvShow.name} - S${seasonNumber}E${episodeNumber}`}
                />
              </div>
            </div>

            {/* Content - Scrollable only on mobile/tablet */}
            <div className="flex-1 lg:flex-none bg-white dark:bg-dark-100 lg:overflow-hidden overflow-y-auto">
              <div className="p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {tvShow.name} • Season {seasonNumber} • Episode {episodeNumber}
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {episode.name}
                </h1>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{formatDate(episode.air_date)}</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                      <span>{episode.vote_average.toFixed(1)}</span>
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

                <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
                  {episode.overview || "No overview available for this episode."}
                </p>

                {/* Cast Section */}
                {tvShow.credits && tvShow.credits.cast.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Cast</h2>
                    <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                      {tvShow.credits.cast.map((person) => (
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
                {tvShow.credits && tvShow.credits.crew.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Crew</h2>
                    <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                      {tvShow.credits.crew
                        .filter(member => ['Director', 'Producer', 'Writer'].includes(member.job))
                        .map((person) => (
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
          <div className="lg:w-1/3 bg-white dark:bg-dark-100 lg:h-full border-l border-gray-200 dark:border-dark-300 flex flex-col">
            {/* Tabs */}
            <div className="sticky top-16 z-10 bg-white dark:bg-dark-100">
              <div className="flex border-b border-gray-200 dark:border-dark-300">
                <button
                  onClick={() => setActiveTab('episodes')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'episodes'
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Episodes
                </button>
                <button
                  onClick={() => setActiveTab('related')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'related'
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Related
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

            {/* Tab Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'episodes' ? (
                <div className="p-4">
                  {/* Season Selection */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Season {seasonNumber}
                    </h3>
                    <select
                      value={seasonNumber}
                      onChange={(e) => {
                        window.location.href = `/watch/tv/${tvShow.id}/season/${e.target.value}/episode/1`;
                      }}
                      className="text-sm border border-gray-300 dark:border-dark-400 rounded-md bg-white dark:bg-dark-200 text-gray-700 dark:text-gray-300 py-1.5 pl-3 pr-8"
                    >
                      {tvShow.seasons
                        ?.filter((s) => s.season_number > 0)
                        .map((s) => (
                          <option key={s.id} value={s.season_number}>
                            Season {s.season_number}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Episodes List */}
                  <div className="space-y-2">
                    {seasonEpisodes.map((ep) => {
                      const isCurrentEpisode = ep.episode_number === parseInt(episodeNumber || '1', 10);
                      return (
                        <Link
                          key={ep.id}
                          to={`/watch/tv/${tvShow.id}/season/${seasonNumber}/episode/${ep.episode_number}`}
                          className={`flex p-3 rounded-lg transition-colors ${
                            isCurrentEpisode
                              ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                              : 'hover:bg-gray-100 dark:hover:bg-dark-200'
                          }`}
                        >
                          <div className="relative w-40 h-24 flex-shrink-0 bg-gray-200 dark:bg-dark-300 rounded-md overflow-hidden mr-3">
                            {ep.still_path ? (
                              <img
                                src={getImageUrl(ep.still_path, 'w300')}
                                alt={`Episode ${ep.episode_number}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xs text-gray-500 dark:text-gray-600">No Preview</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Play className="w-8 h-8 text-white" fill="currentColor" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs ${
                                isCurrentEpisode
                                  ? 'text-primary-700 dark:text-primary-400 font-medium'
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                Episode {ep.episode_number}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(ep.air_date)}
                              </span>
                            </div>
                            <h4 className={`text-sm mt-1 ${
                              isCurrentEpisode
                                ? 'text-gray-900 dark:text-gray-100 font-medium'
                                : 'text-gray-800 dark:text-gray-200'
                            } line-clamp-2`}>
                              {ep.name}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {ep.overview || "No overview available."}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : activeTab === 'related' ? (
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4">
                    {tvShow.similar?.results.slice(0, 15).map((similarShow) => (
                      <Link
                        key={similarShow.id}
                        to={`/watch/tv/${similarShow.id}/season/1/episode/1`}
                        className="flex gap-4 group"
                      >
                        <div className="relative w-40 h-24 flex-shrink-0 bg-gray-200 dark:bg-dark-300 rounded-lg overflow-hidden">
                          <img
                            src={getImageUrl(similarShow.backdrop_path || similarShow.poster_path, 'w300')}
                            alt={similarShow.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" fill="currentColor" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2">
                            {similarShow.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {formatDate(similarShow.first_air_date, 'yyyy')}
                          </p>
                          <div className="flex items-center mt-1">
                            <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                              {similarShow.vote_average.toFixed(1)}
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
                    {tvShow.recommendations?.results.slice(0, 15).map((recShow) => (
                      <Link
                        key={recShow.id}
                        to={`/watch/tv/${recShow.id}/season/1/episode/1`}
                        className="flex gap-4 group"
                      >
                        <div className="relative w-40 h-24 flex-shrink-0 bg-gray-200 dark:bg-dark-300 rounded-lg overflow-hidden">
                          <img
                            src={getImageUrl(recShow.backdrop_path || recShow.poster_path, 'w300')}
                            alt={recShow.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" fill="currentColor" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2">
                            {recShow.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {formatDate(recShow.first_air_date, 'yyyy')}
                          </p>
                          <div className="flex items-center mt-1">
                            <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                              {recShow.vote_average.toFixed(1)}
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

export default WatchTVShow;
