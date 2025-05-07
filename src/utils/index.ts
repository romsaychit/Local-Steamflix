import { format, parseISO } from 'date-fns';
import { MediaType } from '../types';

// Format a date string
export const formatDate = (dateString: string, formatPattern = 'MMM dd, yyyy') => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), formatPattern);
  } catch (error) {
    console.error('Date format error:', error);
    return 'Invalid Date';
  }
};

// Format runtime in minutes to hours and minutes
export const formatRuntime = (minutes: number) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Format a number to a readable format with K, M for thousands and millions
export const formatNumber = (num: number) => {
  if (num === undefined || num === null) return 'N/A';
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Format vote average to a percentage
export const formatVoteAverage = (vote: number) => {
  if (vote === undefined || vote === null) return 'N/A';
  return `${Math.round(vote * 10)}%`;
};

// Truncate a string to a given length and add ellipsis if needed
export const truncateString = (str: string, num: number) => {
  if (!str) return '';
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};

// Create a URL-friendly slug
export const createSlug = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Get URL for a media type and ID
export const getMediaUrl = (type: MediaType, id: number) => {
  return `/${type}/${id}`;
};

// Get image URL from TMDB
export const getImageUrl = (path: string, size = 'w500') => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Create a delay promise
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get random items from an array
export const getRandomItems = <T>(array: T[], count: number): T[] => {
  if (!array || array.length === 0) return [];
  if (count >= array.length) return [...array];
  
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Group an array by a key
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};
