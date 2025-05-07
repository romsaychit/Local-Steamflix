import React, { useEffect, useState } from 'react';
import HeroSlider from '../components/home/HeroSlider';
import Carousel from '../components/home/Carousel';
import TopTen from '../components/home/TopTen';
import { 
  getTrendingMovies, 
  getTrendingTVShows, 
  getTopRatedMovies, 
  getTopRatedTVShows,
  getMoviesById, 
  getTVShowsById
} from '../services/tmdb';
import { Movie, TVShow } from '../types';

const movieIds = [11653, 8584, 56238, 10257, 492008, 615453, 452196, 579974, 49529, 87101, 296, 51497, 198663, 574302, 505513, 602666, 14756, 449924, 9460, 81870, 10618, 18665, 11143, 17809, 224141, 280, 14863, 18672, 66657, 53168];

const tvShowIds = [96997, 5953, 216445, 137870, 76557, 48393, 99317, 123794, 222671, 210732, 49051, 71673, 106617, 127138, 32231, 214997, 86051, 90403, 61670];

const Home: React.FC = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<TVShow[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<TVShow[]>([]);
  const [sampleMovies, setSampleMovies] = useState<Movie[]>([]);
  const [sampleTVShows, setSampleTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data in parallel
        const [
          trendingMoviesData,
          trendingTVData,
          topMoviesData,
          topTVData,
          moviesById,
          tvShowsById
        ] = await Promise.all([
          getTrendingMovies(),
          getTrendingTVShows(),
          getTopRatedMovies(),
          getTopRatedTVShows(),
          getMoviesById(movieIds.slice(0, 15)),
          getTVShowsById(tvShowIds.slice(0, 15))
        ]);
        
        setTrendingMovies(trendingMoviesData.results);
        setTrendingTVShows(trendingTVData.results);
        setTopRatedMovies(topMoviesData.results);
        setTopRatedTVShows(topTVData.results);
        setSampleMovies(moviesById.filter(Boolean));
        setSampleTVShows(tvShowsById.filter(Boolean));
        
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Combine trending and top rated content for hero
  const heroContent = [...trendingMovies.slice(0, 3), ...trendingTVShows.slice(0, 2)];
  
  return (
    <main className="pt-0 pb-12">
      {/* Hero Slider Section */}
      <HeroSlider items={heroContent} type="movie" />
      
      {/* Main Content */}
      <div className="mt-8">
        {/* Trending Movies */}
        <Carousel 
          title="Trending Movies" 
          items={trendingMovies} 
          type="movie" 
          viewAllUrl="/movies/trending" 
        />
        
        {/* Top 10 Movies */}
        <TopTen items={topRatedMovies} type="movie" />
        
        {/* Trending TV Shows */}
        <Carousel 
          title="Trending TV Shows" 
          items={trendingTVShows} 
          type="tv" 
          viewAllUrl="/tv/trending" 
        />
        
        {/* Sample Movies Carousel (From provided IDs) */}
        <Carousel 
          title="Featured Movies" 
          items={sampleMovies} 
          type="movie" 
        />
        
        {/* Top 10 TV Shows */}
        <TopTen items={topRatedTVShows} type="tv" />
        
        {/* Sample TV Shows Carousel (From provided IDs) */}
        <Carousel 
          title="Featured TV Shows" 
          items={sampleTVShows} 
          type="tv" 
        />
      </div>
    </main>
  );
};

export default Home;
