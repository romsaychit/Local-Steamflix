export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres?: Genre[];
  runtime?: number;
  credits?: Credits;
  videos?: {
    results: Video[];
  };
  similar?: {
    results: Movie[];
  };
  recommendations?: {
    results: Movie[];
  };
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genres?: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
  credits?: Credits;
  videos?: {
    results: Video[];
  };
  similar?: {
    results: TVShow[];
  };
  recommendations?: {
    results: TVShow[];
  };
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string;
  overview: string;
}

export interface Episode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  overview: string;
  still_path: string;
  vote_average: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type MediaType = 'movie' | 'tv';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface WatchlistItem {
  id: string;
  mediaId: number;
  mediaType: MediaType;
  addedAt: string;
}

export interface WatchHistoryItem {
  id: string;
  mediaId: number;
  mediaType: MediaType;
  watchedAt: string;
  progress: number;
}
