import axios from 'axios';
import { TMDBResponse, Movie, TVShow, Episode } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Create axios instance with default configs
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Helper function to handle API errors
const handleError = (error: any) => {
  console.error('TMDB API Error:', error);
  return Promise.reject(error);
};

// Get trending movies
export const getTrendingMovies = async () => {
  try {
    const response = await api.get<TMDBResponse<Movie>>('/trending/movie/day');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get trending TV shows
export const getTrendingTVShows = async () => {
  try {
    const response = await api.get<TMDBResponse<TVShow>>('/trending/tv/day');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get top rated movies
export const getTopRatedMovies = async () => {
  try {
    const response = await api.get<TMDBResponse<Movie>>('/movie/top_rated');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get top rated TV shows
export const getTopRatedTVShows = async () => {
  try {
    const response = await api.get<TMDBResponse<TVShow>>('/tv/top_rated');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get movie details
export const getMovieDetails = async (id: number) => {
  try {
    const response = await api.get<Movie>(`/movie/${id}`, {
      params: {
        append_to_response: 'videos,credits,similar,recommendations',
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get TV show details
export const getTVShowDetails = async (id: number) => {
  try {
    const response = await api.get<TVShow>(`/tv/${id}`, {
      params: {
        append_to_response: 'videos,credits,similar,recommendations',
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get TV season details
export const getTVSeasonDetails = async (tvId: number, seasonNumber: number) => {
  try {
    const response = await api.get(`/tv/${tvId}/season/${seasonNumber}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get TV episode details
export const getTVEpisodeDetails = async (
  tvId: number,
  seasonNumber: number,
  episodeNumber: number
) => {
  try {
    const response = await api.get<Episode>(
      `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Search for movies and TV shows
export const searchMedia = async (query: string, page = 1) => {
  try {
    const response = await api.get('/search/multi', {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get specific movie IDs
export const getMoviesById = async (ids: number[]) => {
  try {
    const promises = ids.map((id) => getMovieDetails(id));
    return await Promise.all(promises);
  } catch (error) {
    return handleError(error);
  }
};

// Get specific TV show IDs
export const getTVShowsById = async (ids: number[]) => {
  try {
    const promises = ids.map((id) => getTVShowDetails(id));
    return await Promise.all(promises);
  } catch (error) {
    return handleError(error);
  }
};

// Helper function to get full image URL
export const getImageUrl = (path: string | null, size = 'original') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Helper function to create embed URL for movies
export const getMovieEmbedUrl = (id: number) => {
  return `https://animzoon.com/embed/${id}`;
};

// Helper function to create embed URL for TV episodes
export const getTVEmbedUrl = (id: number, season: number, episode: number) => {
  return `https://animzoon.com/embed/${id}-${season}-${episode}`;
};
