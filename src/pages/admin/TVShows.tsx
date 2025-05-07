import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search,
  Edit,
  Trash2,
  Plus,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Upload,
  Youtube,
  Film,
  Save,
  X,
  Video,
  Subtitles,
  Lock,
  Globe,
  Server,
  Star,
  Tv
} from 'lucide-react';
import { TVShow } from '../../types';
import axios from 'axios';

interface TVShowFormData {
  title: string;
  originalTitle: string;
  subTitle: string;
  isPremium: boolean;
  isPinned: boolean;
  enablePushNotification: boolean;
  enableDownload: boolean;
  enableAdsUnlock: boolean;
  enableStream: boolean;
  hasSkipRecap: boolean;
  startTime: number;
  posterPath: string;
  backdropPath: string;
  backdropPathTV: string;
  genres: string[];
  languages: string[];
  networks: string[];
  collections: string[];
  certifications: string[];
  casters: string[];
  trailerYoutubeId: string;
  trailerSelfHosted: string;
  externalImdbId: string;
  details: string;
  firstAirDate: string;
  lastAirDate: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  episodeRuntime: number;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  seasons: {
    seasonNumber: number;
    name: string;
    overview: string;
    airDate: string;
    episodes: {
      episodeNumber: number;
      name: string;
      overview: string;
      airDate: string;
      runtime: number;
      videos: {
        server: string;
        language: string;
        headers: string;
        userAgent: string;
        link: string;
        supportedHosts: boolean;
        drm: boolean;
        embed: boolean;
        hls: boolean;
        drmUUID: string;
        drmLicenseUri: string;
      }[];
      subtitles: {
        language: string;
        type: string;
        path: string;
        isZip: boolean;
      }[];
    }[];
  }[];
}

const genres = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" }
];

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "hi", name: "Hindi" },
  { code: "ar", name: "Arabic" }
];

const networks = [
  { id: 213, name: "Netflix" },
  { id: 1024, name: "Amazon Prime Video" },
  { id: 2739, name: "Disney+" },
  { id: 49, name: "HBO" },
  { id: 453, name: "Hulu" },
  { id: 2552, name: "Apple TV+" },
  { id: 67, name: "Showtime" },
  { id: 4, name: "BBC" },
  { id: 56, name: "Cartoon Network" },
  { id: 19, name: "FOX" }
];

const AdminTVShows: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tmdbId, setTmdbId] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedTVShow, setSelectedTVShow] = useState<TVShowFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'seasons'>('details');
  const [tvShowCredits, setTVShowCredits] = useState<any>(null);
  const [activeSeason, setActiveSeason] = useState<number | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<number | null>(null);

  const searchTMDB = async () => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    
    if (!apiKey) {
      alert('Please configure your TMDB API key in the .env file');
      return;
    }

    setIsLoading(true);
    try {
      let endpoint = searchQuery 
        ? `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(searchQuery)}`
        : `https://api.themoviedb.org/3/tv/${tmdbId}`;
        
      const response = await axios.get(endpoint, {
        params: {
          api_key: apiKey
        }
      });

      if (searchQuery) {
        setSearchResults(response.data.results);
      } else {
        setSearchResults([response.data]);
      }
    } catch (error) {
      console.error('Error searching TMDB:', error);
      alert('Failed to search TV shows. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTVShowCredits = async (tvShowId: number) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${tvShowId}/credits`, {
        params: {
          api_key: import.meta.env.VITE_TMDB_API_KEY
        }
      });
      setTVShowCredits(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show credits:', error);
      return null;
    }
  };

  const fetchTVShowVideos = async (tvShowId: number) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${tvShowId}/videos`, {
        params: {
          api_key: import.meta.env.VITE_TMDB_API_KEY
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching TV show videos:', error);
      return [];
    }
  };

  const handleSelectTVShow = async (tvShow: any) => {
    const credits = await fetchTVShowCredits(tvShow.id);
    const videos = await fetchTVShowVideos(tvShow.id);
    
    const trailer = videos.find((video: any) => 
      video.type === "Trailer" && video.site === "YouTube"
    );

    setSelectedTVShow({
      title: tvShow.name,
      originalTitle: tvShow.original_name,
      subTitle: '',
      isPremium: false,
      isPinned: false,
      enablePushNotification: false,
      enableDownload: false,
      enableAdsUnlock: false,
      enableStream: true,
      hasSkipRecap: false,
      startTime: 0,
      posterPath: tvShow.poster_path,
      backdropPath: tvShow.backdrop_path,
      backdropPathTV: tvShow.backdrop_path,
      genres: tvShow.genre_ids?.map((id: number) => {
        const genre = genres.find(g => g.id === id);
        return genre ? genre.name : '';
      }).filter(Boolean) || [],
      languages: [],
      networks: [],
      collections: [],
      certifications: [],
      casters: credits?.cast?.slice(0, 10).map((actor: any) => actor.name) || [],
      trailerYoutubeId: trailer?.key || '',
      trailerSelfHosted: '',
      externalImdbId: tvShow.external_ids?.imdb_id || '',
      details: tvShow.overview || '',
      firstAirDate: tvShow.first_air_date || '',
      lastAirDate: tvShow.last_air_date || '',
      numberOfSeasons: tvShow.number_of_seasons || 0,
      numberOfEpisodes: tvShow.number_of_episodes || 0,
      episodeRuntime: tvShow.episode_run_time?.[0] || 0,
      voteAverage: tvShow.vote_average || 0,
      voteCount: tvShow.vote_count || 0,
      popularity: tvShow.popularity || 0,
      seasons: []
    });
    setShowForm(true);
  };

  const handleAddSeason = () => {
    if (!selectedTVShow) return;
    const newSeasonNumber = selectedTVShow.seasons.length + 1;
    setSelectedTVShow({
      ...selectedTVShow,
      seasons: [
        ...selectedTVShow.seasons,
        {
          seasonNumber: newSeasonNumber,
          name: `Season ${newSeasonNumber}`,
          overview: '',
          airDate: '',
          episodes: []
        }
      ]
    });
  };

  const handleAddEpisode = (seasonIndex: number) => {
    if (!selectedTVShow) return;
    const newSeasons = [...selectedTVShow.seasons];
    const newEpisodeNumber = newSeasons[seasonIndex].episodes.length + 1;
    
    newSeasons[seasonIndex].episodes.push({
      episodeNumber: newEpisodeNumber,
      name: `Episode ${newEpisodeNumber}`,
      overview: '',
      airDate: '',
      runtime: 0,
      videos: [],
      subtitles: []
    });

    setSelectedTVShow({
      ...selectedTVShow,
      seasons: newSeasons
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving TV show:', selectedTVShow);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Add New TV Show
        </h1>
      </div>

      <div className="bg-white dark:bg-dark-100 rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search by Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter TV show title..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-200 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search by TMDB ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={tmdbId}
                onChange={(e) => setTmdbId(e.target.value)}
                placeholder="Enter TMDB ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-200 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Tv className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <button
          onClick={searchTMDB}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>

        {searchResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Search Results
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {searchResults.map((tvShow) => (
                <div
                  key={tvShow.id}
                  className="border dark:border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                  onClick={() => handleSelectTVShow(tvShow)}
                >
                  <div className="aspect-[2/3] relative">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                      alt={tvShow.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {tvShow.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(tvShow.first_air_date).getFullYear()}
                    </p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {tvShow.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showForm && selectedTVShow && (
        <div className="bg-white dark:bg-dark-100 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'details'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('seasons')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'seasons'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Seasons & Episodes
              </button>
            </nav>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'details' && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        TV Show Title
                      </label>
                      <input
                        type="text"
                        value={selectedTVShow.title}
                        onChange={(e) => setSelectedTVShow({...selectedTVShow, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Original Title
                      </label>
                      <input
                        type="text"
                        value={selectedTVShow.originalTitle}
                        onChange={(e) => setSelectedTVShow({...selectedTVShow, originalTitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sub Title
                      </label>
                      <input
                        type="text"
                        value={selectedTVShow.subTitle}
                        onChange={(e) => setSelectedTVShow({...selectedTVShow, subTitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Details
                      </label>
                      <textarea
                        value={selectedTVShow.details}
                        onChange={(e) => setSelectedTVShow({...selectedTVShow, details: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedTVShow.isPremium}
                          onChange={(e) => setSelectedTVShow({...selectedTVShow, isPremium: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Premium Only</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedTVShow.isPinned}
                          onChange={(e) => setSelectedTVShow({...selectedTVShow, isPinned: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Pinned</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedTVShow.enablePushNotification}
                          onChange={(e) => setSelectedTVShow({...selectedTVShow, enablePushNotification: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Push Notification</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedTVShow.enableDownload}
                          onChange={(e) => setSelectedTVShow({...selectedTVShow, enableDownload: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Enable Download</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedTVShow.hasSkipRecap}
                          onChange={(e) => setSelectedTVShow({...selectedTVShow, hasSkipRecap: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Has Skip Recap</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedTVShow.enableStream}
                          onChange={(e) => setSelectedTVShow({...selectedTVShow, enableStream: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Enable Stream</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Time (in seconds)
                      </label>
                      <input
                        type="number"
                        value={selectedTVShow.startTime}
                        onChange={(e) => setSelectedTVShow({...selectedTVShow, startTime: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Poster Upload
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-36 bg-gray-200 dark:bg-dark-300 rounded-lg overflow-hidden">
                        {selectedTVShow.posterPath && (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${selectedTVShow.posterPath}`}
                            alt="Poster"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      >
                        Choose File
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Backdrop Upload
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-36 h-24 bg-gray-200 dark:bg-dark-300 rounded-lg overflow-hidden">
                        {selectedTVShow.backdropPath && (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${selectedTVShow.backdropPath}`}
                            alt="Backdrop"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      >
                        Choose File
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Genres
                    </label>
                    <select 
                      multiple
                      value={selectedTVShow.genres}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setSelectedTVShow({...selectedTVShow, genres: selected});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                      {genres.map(genre => (
                        <option key={genre.id} value={genre.name}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Languages
                    </label>
                    <select
                      multiple
                      value={selectedTVShow.languages}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setSelectedTVShow({...selectedTVShow, languages: selected});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Networks
                    </label>
                    <select
                      multiple
                      value={selectedTVShow.networks}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setSelectedTVShow({...selectedTVShow, networks: selected});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                      {networks.map(network => (
                        <option key={network.id} value={network.name}>
                          {network.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cast
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTVShow.casters.map((caster, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-dark-200 rounded-full text-sm flex items-center"
                      >
                        {caster}
                        <button
                          type="button"
                          onClick={() => {
                            const newCasters = selectedTVShow.casters.filter((_, i) => i !== index);
                            setSelectedTVShow({...selectedTVShow, casters: newCasters});
                          }}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm"
                      onClick={() => {
                        const newCaster = prompt('Enter cast member name');
                        if (newCaster) {
                          setSelectedTVShow({
                            ...selectedTVShow,
                            casters: [...selectedTVShow.casters, newCaster]
                          });
                        }
                      }}
                    >
                      Add Cast
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Trailer
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        YouTube Trailer ID
                      </label>
                      <input
                        type="text"
                        value={selectedTVShow.trailerYoutubeId}
                        onChange={(e) => setSelectedTVShow({...selectedTVShow, trailerYoutubeId: e.target.value})}
                        placeholder="Enter YouTube video ID"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                      {selectedTVShow.trailerYoutubeId && (
                        <div className="mt-2">
                          <iframe
                            width="100%"
                            height="200"
                            src={`https://www.youtube.com/embed/${selectedTVShow.trailerYoutubeId}`}
                            title="TV Show Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Self-hosted Trailer
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={selectedTVShow.trailerSelfHosted}
                          onChange={(e) => setSelectedTVShow({...selectedTVShow, trailerSelfHosted: e.target.value})}
                          placeholder="Upload or enter URL"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        />
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-100 dark:bg-dark-200 border border-gray-300 dark:border-gray-600 rounded-lg"
                        >
                          <Upload className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seasons' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Seasons & Episodes
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddSeason}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Add Season
                  </button>
                </div>

                {selectedTVShow.seasons.map((season, seasonIndex) => (
                  <div key={seasonIndex} className="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="p-4 bg-gray-50 dark:bg-dark-200 rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          Season {season.seasonNumber}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleAddEpisode(seasonIndex)}
                          className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
                        >
                          Add Episode
                        </button>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Season Name
                          </label>
                          <input
                            type="text"
                            value={season.name}
                            onChange={(e) => {
                              const newSeasons = [...selectedTVShow.seasons];
                              newSeasons[seasonIndex].name = e.target.value;
                              setSelectedTVShow({...selectedTVShow, seasons: newSeasons});
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Air Date
                          </label>
                          <input
                            type="date"
                            value={season.airDate}
                            onChange={(e) => {
                              const newSeasons = [...selectedTVShow.seasons];
                              newSeasons[seasonIndex].airDate = e.target.value;
                              setSelectedTVShow({...selectedTVShow, seasons: newSeasons});
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Overview
                        </label>
                        <textarea
                          value={season.overview}
                          onChange={(e) => {
                            const newSeasons = [...selectedTVShow.seasons];
                            newSeasons[seasonIndex].overview = e.target.value;
                            setSelectedTVShow({...selectedTVShow, seasons: newSeasons});
                          }}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="p-4">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                        Episodes
                      </h5>
                      
                      <div className="space-y-4">
                        {season.episodes.map((episode, episodeIndex) => (
                          <div key={episodeIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Episode Name
                                </label>
                                <input
                                  type="text"
                                  value={episode.name}
                                  onChange={(e) => {
                                    const newSeasons = [...selectedTVShow.seasons];
                                    newSeasons[seasonIndex].episodes[episodeIndex].name = e.target.value;
                                    setSelectedTVShow({...selectedTVShow, seasons: newSeasons});
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Air Date
                                </label>
                                <input
                                  type="date"
                                  value={episode.airDate}
                                  onChange={(e) => {
                                    const newSeasons = [...selectedTVShow.seasons];
                                    newSeasons[seasonIndex].episodes[episodeIndex].airDate = e.target.value;
                                    setSelectedTVShow({...selectedTVShow, seasons: newSeasons});
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Runtime (minutes)
                                </label>
                                <input
                                  type="number"
                                  value={episode.runtime}
                                  onChange={(e) => {
                                    const newSeasons = [...selectedTVShow.seasons];
                                    newSeasons[seasonIndex].episodes[episodeIndex].runtime = parseInt(e.target.value);
                                    setSelectedTVShow({...selectedTVShow, seasons: newSeasons});
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                                />
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Overview
                              </label>
                              <textarea
                                value={episode.overview}
                                onChange={(e) => {
                                  const newSeasons = [...selectedTVShow.seasons];
                                  newSeasons[seasonIndex].episodes[episodeIndex].overview = e.target.value;
                                  setSelectedTVShow({...selectedTVShow, seasons: newSeasons});
                                }}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                              />
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center">
                              <div className="flex space-x-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSeasons = [...selectedTVShow.seasons];
                                    newSeasons[seasonIndex].episodes[episodeIndex].videos.push({
                                      server: '',
                                      language: '',
                                      headers: '',
                                      userAgent: '',
                                      link: '',
                                      supportedHosts: false,
                                      drm: false,
                                      embed: false,
                                      hls: false,
                                      drmUUID: '',
                                      drmLicenseUri: ''
                                    });
                                    setSelectedTVShow({...selectedTVShow, seasons: newSeasons});
                                  }}
                                  className="text-sm text-primary-600 hover:text-primary-700"
                                >
                                  Add Video Source
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSeasons = [...selectedTVShow.seasons];
                                    newSeasons[seasonIndex].episodes[episodeIndex].subtitles.push({
                                      language: '',
                                      type: 'srt',
                                      path: '',
                                      isZip: false
                                    });
                                    setSelectedTVShow({...selectedTVShow, seasons: newSeasons});
                                  }}
                                  className="text-sm text-primary-600 hover:text-primary-700"
                                >
                                  Add Subtitle
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newSeasons = [...selectedTVShow.seasons];
                                  newSeasons[seasonIndex].episodes.splice(episodeIndex, 1);
                                  setSelectedTVShow({...selectedTVShow, seasons: newSeasons});
                                }}
                                className="text-sm text-red-600 hover:text-red-700"
                              >
                                Remove Episode
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Save className="w-5 h-5 inline-block mr-2" />
                  Save TV Show
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminTVShows;
