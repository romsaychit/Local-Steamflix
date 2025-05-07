import React, { useEffect, useState } from 'react';
import HeroSlider from '../components/home/HeroSlider';
import Carousel from '../components/home/Carousel';
import TopTen from '../components/home/TopTen';
import MediaCard from '../components/common/MediaCard';
import { getTopRatedTVShows, getTrendingTVShows, getTVShowsById } from '../services/tmdb';
import { TVShow } from '../types';

// Sample TV show IDs from the request
const tvShowIds = [96997, 5953, 216445, 137870, 76557, 48393, 99317, 123794, 222671, 210732, 49051, 71673, 106617, 127138, 32231, 214997, 86051, 90403, 61670];

const TVShows: React.FC = () => {
  const [trendingTVShows, setTrendingTVShows] = useState<TVShow[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<TVShow[]>([]);
  const [recentTVShows, setRecentTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const showsPerPage = 28;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, topRatedData, tvShowsData] = await Promise.all([
          getTrendingTVShows(),
          getTopRatedTVShows(),
          getTVShowsById(tvShowIds)
        ]);
        
        setTrendingTVShows(trendingData.results);
        setTopRatedTVShows(topRatedData.results);
        setRecentTVShows(tvShowsData.filter(Boolean));
      } catch (error) {
        console.error('Error fetching TV show data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Pagination logic
  const totalPages = Math.ceil(recentTVShows.length / showsPerPage);
  const paginatedTVShows = recentTVShows.slice(
    (page - 1) * showsPerPage,
    page * showsPerPage
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
      {/* Hero Slider (Top 5 trending TV shows) */}
      <HeroSlider items={trendingTVShows.slice(0, 5)} type="tv" />
      
      {/* Top 10 TV Shows */}
      <TopTen items={topRatedTVShows} type="tv" />
      
      {/* Categories Carousel */}
      <Carousel 
        title="Trending Now" 
        items={trendingTVShows} 
        type="tv" 
      />
      
      {/* Recent TV Shows Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Recently Added TV Shows
          </h2>
          
          {/* TV Show Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 sm:gap-6">
            {paginatedTVShows.map((show) => (
              <div key={show.id}>
                <MediaCard media={show} type="tv" />
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

export default TVShows;
