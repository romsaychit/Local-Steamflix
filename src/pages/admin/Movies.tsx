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
  Star
} from 'lucide-react';
import { Movie } from '../../types';
import axios from 'axios';

interface MovieFormData {
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
  releaseDate: string;
  runtime: number;
  voteAverage: number;
  voteCount: number;
  popularity: number;
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
}

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
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
  { id: 1, name: "Netflix" },
  { id: 2, name: "Amazon Prime" },
  { id: 3, name: "Disney+" },
  { id: 4, name: "HBO Max" },
  { id: 5, name: "Hulu" },
  { id: 6, name: "Apple TV+" }
];

const AdminMovies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tmdbId, setTmdbId] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'videos' | 'subtitles'>('details');
  const [movieCredits, setMovieCredits] = useState<any>(null);

  const searchTMDB = async () => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    
    if (!apiKey) {
      alert('Please configure your TMDB API key in the .env file');
      return;
    }

    setIsLoading(true);
    try {
      let endpoint = searchQuery 
        ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery)}`
        : `https://api.themoviedb.org/3/movie/${tmdbId}`;
        
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
      alert('Failed to search movies. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovieCredits = async (movieId: number) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
        params: {
          api_key: import.meta.env.VITE_TMDB_API_KEY
        }
      });
      setMovieCredits(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      return null;
    }
  };

  const fetchMovieVideos = async (movieId: number) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
        params: {
          api_key: import.meta.env.VITE_TMDB_API_KEY
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      return [];
    }
  };

  const handleSelectMovie = async (movie: any) => {
    const credits = await fetchMovieCredits(movie.id);
    const videos = await fetchMovieVideos(movie.id);
    
    const trailer = videos.find((video: any) => 
      video.type === "Trailer" && video.site === "YouTube"
    );

    setSelectedMovie({
      title: movie.title,
      originalTitle: movie.original_title,
      subTitle: '',
      isPremium: false,
      isPinned: false,
      enablePushNotification: false,
      enableDownload: false,
      enableAdsUnlock: false,
      enableStream: true,
      hasSkipRecap: false,
      startTime: 0,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      backdropPathTV: movie.backdrop_path,
      genres: movie.genre_ids?.map((id: number) => {
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
      externalImdbId: movie.imdb_id || '',
      details: movie.overview || '',
      releaseDate: movie.release_date || '',
      runtime: movie.runtime || 0,
      voteAverage: movie.vote_average || 0,
      voteCount: movie.vote_count || 0,
      popularity: movie.popularity || 0,
      videos: [],
      subtitles: []
    });
    setShowForm(true);
  };

  const handleAddVideo = () => {
    if (!selectedMovie) return;
    setSelectedMovie({
      ...selectedMovie,
      videos: [
        ...selectedMovie.videos,
        {
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
        }
      ]
    });
  };

  const handleAddSubtitle = () => {
    if (!selectedMovie) return;
    setSelectedMovie({
      ...selectedMovie,
      subtitles: [
        ...selectedMovie.subtitles,
        {
          language: 'en',
          type: 'srt',
          path: '',
          isZip: false
        }
      ]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving movie:', selectedMovie);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Add New Movie
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
                placeholder="Enter movie title..."
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
              <Film className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="border dark:border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                  onClick={() => handleSelectMovie(movie)}
                >
                  <div className="aspect-[2/3] relative">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {movie.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showForm && selectedMovie && (
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
                onClick={() => setActiveTab('videos')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'videos'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Videos
              </button>
              <button
                onClick={() => setActiveTab('subtitles')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'subtitles'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Subtitles
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
                        Movie Title
                      </label>
                      <input
                        type="text"
                        value={selectedMovie.title}
                        onChange={(e) => setSelectedMovie({...selectedMovie, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Original Title
                      </label>
                      <input
                        type="text"
                        value={selectedMovie.originalTitle}
                        onChange={(e) => setSelectedMovie({...selectedMovie, originalTitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sub Title
                      </label>
                      <input
                        type="text"
                        value={selectedMovie.subTitle}
                        onChange={(e) => setSelectedMovie({...selectedMovie, subTitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Details
                      </label>
                      <textarea
                        value={selectedMovie.details}
                        onChange={(e) => setSelectedMovie({...selectedMovie, details: e.target.value})}
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
                          checked={selectedMovie.isPremium}
                          onChange={(e) => setSelectedMovie({...selectedMovie, isPremium: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Premium Only</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedMovie.isPinned}
                          onChange={(e) => setSelectedMovie({...selectedMovie, isPinned: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Pinned</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedMovie.enablePushNotification}
                          onChange={(e) => setSelectedMovie({...selectedMovie, enablePushNotification: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Push Notification</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedMovie.enableDownload}
                          onChange={(e) => setSelectedMovie({...selectedMovie, enableDownload: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Enable Download</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedMovie.hasSkipRecap}
                          onChange={(e) => setSelectedMovie({...selectedMovie, hasSkipRecap: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Has Skip Recap</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedMovie.enableStream}
                          onChange={(e) => setSelectedMovie({...selectedMovie, enableStream: e.target.checked})}
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
                        value={selectedMovie.startTime}
                        onChange={(e) => setSelectedMovie({...selectedMovie, startTime: parseInt(e.target.value)})}
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
                        {selectedMovie.posterPath && (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${selectedMovie.posterPath}`}
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
                        {selectedMovie.backdropPath && (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${selectedMovie.backdropPath}`}
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
                      value={selectedMovie.genres}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setSelectedMovie({...selectedMovie, genres: selected});
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
                      value={selectedMovie.languages}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setSelectedMovie({...selectedMovie, languages: selected});
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
                      value={selectedMovie.networks}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setSelectedMovie({...selectedMovie, networks: selected});
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
                    {selectedMovie.casters.map((caster, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-dark-200 rounded-full text-sm flex items-center"
                      >
                        {caster}
                        <button
                          type="button"
                          onClick={() => {
                            const newCasters = selectedMovie.casters.filter((_, i) => i !== index);
                            setSelectedMovie({...selectedMovie, casters: newCasters});
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
                          setSelectedMovie({
                            ...selectedMovie,
                            casters: [...selectedMovie.casters, newCaster]
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
                        value={selectedMovie.trailerYoutubeId}
                        onChange={(e) => setSelectedMovie({...selectedMovie, trailerYoutubeId: e.target.value})}
                        placeholder="Enter YouTube video ID"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                      {selectedMovie.trailerYoutubeId && (
                        <div className="mt-2">
                          <iframe
                            width="100%"
                            height="200"
                            src={`https://www.youtube.com/embed/${selectedMovie.trailerYoutubeId}`}
                            title="Movie Trailer"
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
                          value={selectedMovie.trailerSelfHosted}
                          onChange={(e) => setSelectedMovie({...selectedMovie, trailerSelfHosted: e.target.value})}
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

            {activeTab === 'videos' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Video Sources
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddVideo}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Add Video Source
                  </button>
                </div>

                {selectedMovie.videos.map((video, index) => (
                  <div key={index} className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Server
                        </label>
                        <select
                          value={video.server}
                          onChange={(e) => {
                            const newVideos = [...selectedMovie.videos];
                            newVideos[index].server = e.target.value;
                            setSelectedMovie({...selectedMovie, videos: newVideos});
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        >
                          <option value="">Select Server</option>
                          <option value="main">Main Server</option>
                          <option value="backup">Backup Server</option>
                          <option value="cdn">CDN</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Language
                        </label>
                        <select
                          value={video.language}
                          onChange={(e) => {
                            const newVideos = [...selectedMovie.videos];
                            newVideos[index].language = e.target.value;
                            setSelectedMovie({...selectedMovie, videos: newVideos});
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        >
                          <option value="">Select Language</option>
                          {languages.map(lang => (
                            <option key={lang.code} value={lang.code}>
                              {lang.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Headers
                        </label>
                        <input
                          type="text"
                          value={video.headers}
                          onChange={(e) => {
                            const newVideos = [...selectedMovie.videos];
                            newVideos[index].headers = e.target.value;
                            setSelectedMovie({...selectedMovie, videos: newVideos});
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          User Agent
                        </label>
                        <input
                          type="text"
                          value={video.userAgent}
                          onChange={(e) => {
                            const newVideos = [...selectedMovie.videos];
                            newVideos[index].userAgent = e.target.value;
                            setSelectedMovie({...selectedMovie, videos: newVideos});
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Video URL
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={video.link}
                          onChange={(e) => {
                            const newVideos = [...selectedMovie.videos];
                            newVideos[index].link = e.target.value;
                            setSelectedMovie({...selectedMovie, videos: newVideos});
                          }}
                          placeholder="Enter video URL or upload"
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

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={video.supportedHosts}
                          onChange={(e) => {
                            const newVideos = [...selectedMovie.videos];
                            newVideos[index].supportedHosts = e.target.checked;
                            setSelectedMovie({...selectedMovie, videos: newVideos});
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Supported Hosts</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={video.drm}
                          onChange={(e) => {
                            const newVideos = [...selectedMovie.videos];
                            newVideos[index].drm = e.target.checked;
                            setSelectedMovie({...selectedMovie, videos: newVideos});
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">DRM</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={video.embed}
                          onChange={(e) => {
                            const newVideos = [...selectedMovie.videos];
                            newVideos[index].embed = e.target.checked;
                            setSelectedMovie({...selectedMovie, videos: newVideos});
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Embed</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={video.hls}
                          onChange={(e) => {
                            const newVideos = [...selectedMovie.videos];
                            newVideos[index].hls = e.target.checked;
                            setSelectedMovie({...selectedMovie, videos: newVideos});
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">HLS</span>
                      </label>
                    </div>

                    {video.drm && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            DRM UUID
                          </label>
                          <input
                            type="text"
                            value={video.drmUUID}
                            onChange={(e) => {
                              const newVideos = [...selectedMovie.videos];
                              newVideos[index].drmUUID = e.target.value;
                              setSelectedMovie({...selectedMovie, videos: newVideos});
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            DRM License URI
                          </label>
                          <input
                            type="text"
                            value={video.drmLicenseUri}
                            onChange={(e) => {
                              const newVideos = [...selectedMovie.videos];
                              newVideos[index].drmLicenseUri = e.target.value;
                              setSelectedMovie({...selectedMovie, videos: newVideos});
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const newVideos = selectedMovie.videos.filter((_, i) => i !== index);
                        setSelectedMovie({...selectedMovie, videos: newVideos});
                      }}
                      className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove Video Source
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'subtitles' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Subtitles
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddSubtitle}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Add Subtitle
                  </button>
                </div>

                {selectedMovie.subtitles.map((subtitle, index) => (
                  <div key={index} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Language
                        </label>
                        <select
                          value={subtitle.language}
                          onChange={(e) => {
                            const newSubtitles = [...selectedMovie.subtitles];
                            newSubtitles[index].language = e.target.value;
                            setSelectedMovie({...selectedMovie, subtitles: newSubtitles});
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
                          Type
                        </label>
                        <select
                          value={subtitle.type}
                          onChange={(e) => {
                            const newSubtitles = [...selectedMovie.subtitles];
                            newSubtitles[index].type = e.target.value;
                            setSelectedMovie({...selectedMovie, subtitles: newSubtitles});
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        >
                          <option value="srt">SRT</option>
                          <option value="vtt">VTT</option>
                          <option value="ass">ASS</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Subtitle File
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={subtitle.path}
                            onChange={(e) => {
                              const newSubtitles = [...selectedMovie.subtitles];
                              newSubtitles[index].path = e.target.value;
                              setSelectedMovie({...selectedMovie, subtitles: newSubtitles});
                            }}
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

                    <div className="mt-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={subtitle.isZip}
                          onChange={(e) => {
                            const newSubtitles = [...selectedMovie.subtitles];
                            newSubtitles[index].isZip = e.target.checked;
                            setSelectedMovie({...selectedMovie, subtitles: newSubtitles});
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Zip Format</span>
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newSubtitles = selectedMovie.subtitles.filter((_, i) => i !== index);
                        setSelectedMovie({...selectedMovie, subtitles: newSubtitles});
                      }}
                      className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove Subtitle
                    </button>
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
                  Save Movie
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;
