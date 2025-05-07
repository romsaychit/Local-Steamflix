import React, { useEffect, useState } from 'react';
import HeroSlider from '../components/home/HeroSlider';
import Carousel from '../components/home/Carousel';
import TopTen from '../components/home/TopTen';
import MediaCard from '../components/common/MediaCard';
import { getTopRatedMovies, getTrendingMovies, getMoviesById } from '../services/tmdb';
import { Movie } from '../types';

// Sample movie IDs from the request
const movieIds = [11653, 8584, 56238, 10257, 492008, 615453, 452196, 579974, 49529, 87101, 296, 51497, 198663, 574302, 505513, 602666, 14756, 449924, 9460, 81870, 10618, 18665, 11143, 17809, 224141, 280, 14863, 18672, 66657, 53168];

const Movies: React.FC = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const moviesPerPage = 28;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, topRatedData, moviesData] = await Promise.all([
          getTrendingMovies(),
          getTopRatedMovies(),
          getMoviesById(movieIds)
        ]);
        
        setTrendingMovies(trendingData.results);
        setTopRatedMovies(topRatedData.results);
        setRecentMovies(moviesData.filter(Boolean));
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Pagination logic
  const totalPages = Math.ceil(recentMovies.length / moviesPerPage);
  const paginatedMovies = recentMovies.slice(
    (page - 1) * moviesPerPage,
    page * moviesPerPage
  );
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <main className="pt-0 pb-12">
      {/* Hero Slider (Top 5 trending movies) */}
      <HeroSlider items={trendingMovies.slice(0, 5)} type="movie" />
      
      {/* Top 10 Movies */}
      <TopTen items={topRatedMovies} type="movie" />
      
      {/* Categories Carousel */}
      <Carousel 
        title="Trending Now" 
        items={trendingMovies} 
        type="movie" 
      />
      
      {/* Recent Movies Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Recently Added Movies
          </h2>
          
          {/* Movie Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 sm:gap-6">
            {paginatedMovies.map((movie) => (
              <div key={movie.id}>
                <MediaCard media={movie} type="movie" />
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    page === 1
                      ? 'bg-gray-200 dark:bg-dark-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
                  }`}
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // If we have more than 5 pages, show a different set based on current page
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (page > 3 && page < totalPages - 1) {
                      pageNum = i + page - 2;
                    } else if (page >= totalPages - 1) {
                      pageNum = totalPages - 4 + i;
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 text-sm font-medium ${
                        page === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    page === totalPages
                      ? 'bg-gray-200 dark:bg-dark-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Movies;
