import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMedia } from '../services/tmdb';
import MediaCard from '../components/common/MediaCard';
import { Movie, TVShow } from '../types';
import { Search as SearchIcon, Filter } from 'lucide-react';

const Search: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Handle search when query changes
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);
  
  // Perform search with API
  const performSearch = async (query: string, pageNum = 1) => {
    setLoading(true);
    try {
      const data = await searchMedia(query, pageNum);
      
      // Filter out person results and other non-movie/tv results
      const filteredResults = data.results.filter(
        (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
      );
      
      setResults(filteredResults);
      setTotalPages(data.total_pages > 20 ? 20 : data.total_pages); // Limit to 20 pages max
      
      // Update URL with search query
      const newUrl = `/search?q=${encodeURIComponent(query)}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
      setPage(1);
    }
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    performSearch(searchQuery, newPage);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Filter results based on active filter
  const filteredResults = activeFilter === 'all'
    ? results
    : results.filter((item: any) => item.media_type === activeFilter);
  
  return (
    <main className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {initialQuery ? `Search results for "${initialQuery}"` : 'Search for Movies & TV Shows'}
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="flex w-full max-w-3xl">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies, TV shows..."
                className="bg-white dark:bg-dark-200 border border-gray-300 dark:border-dark-400 text-gray-900 dark:text-gray-100 text-base rounded-l-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-3"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center py-3 px-5 text-base font-medium text-center text-white bg-primary-600 rounded-r-lg hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
            >
              Search
            </button>
          </form>
        </div>
        
        {/* Filters */}
        {results.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300 text-sm mr-2">Filters:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeFilter === 'all'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 font-medium'
                      : 'bg-gray-100 dark:bg-dark-300 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-400'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter('movie')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeFilter === 'movie'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 font-medium'
                      : 'bg-gray-100 dark:bg-dark-300 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-400'
                  }`}
                >
                  Movies
                </button>
                <button
                  onClick={() => setActiveFilter('tv')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeFilter === 'tv'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 font-medium'
                      : 'bg-gray-100 dark:bg-dark-300 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-400'
                  }`}
                >
                  TV Shows
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredResults.length} results
            </div>
          </div>
        )}
        
        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {filteredResults.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                  {filteredResults.map((result: any) => (
                    <MediaCard
                      key={result.id}
                      media={result}
                      type={result.media_type}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="inline-flex rounded-md shadow-sm">
                      <button
                        onClick={() => handlePageChange(Math.max(1, page - 1))}
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
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                            onClick={() => handlePageChange(pageNum)}
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
                        onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                          page === totalPages
                            ? 'bg-gray-200 dark:bg-dark-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              initialQuery && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <SearchIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    No results found
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    We couldn't find any matches for "{initialQuery}". Please try different keywords or check your spelling.
                  </p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Search;
