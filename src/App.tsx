import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import MovieDetail from './pages/MovieDetail';
import TVShowDetail from './pages/TVShowDetail';
import WatchMovie from './pages/WatchMovie';
import WatchTVShow from './pages/WatchTVShow';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMovies from './pages/admin/Movies';
import AdminTVShows from './pages/admin/TVShows';
import MiniPlayer from './components/player/MiniPlayer';
import { useUIStore } from './store';
import { getTVEmbedUrl, getMovieEmbedUrl } from './services/tmdb';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const { isMiniplayer, currentMedia } = useUIStore();
  
  const getEmbedUrl = () => {
    if (!currentMedia.id || !currentMedia.type) return '';
    
    if (currentMedia.type === 'movie') {
      return getMovieEmbedUrl(currentMedia.id);
    } else if (currentMedia.type === 'tv' && currentMedia.season && currentMedia.episode) {
      return getTVEmbedUrl(currentMedia.id, currentMedia.season, currentMedia.episode);
    }
    
    return '';
  };
  
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-white dark:bg-dark-100 text-gray-900 dark:text-gray-100">
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Header />} />
        </Routes>
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TVShows />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv/:id" element={<TVShowDetail />} />
            <Route path="/watch/movie/:id" element={<WatchMovie />} />
            <Route path="/watch/tv/:id/season/:seasonNumber/episode/:episodeNumber" element={<WatchTVShow />} />
            <Route path="/search" element={<Search />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/movies" element={<AdminMovies />} />
            <Route path="/admin/tv-shows" element={<AdminTVShows />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
        
        {isMiniplayer && currentMedia.id && (
          <MiniPlayer 
            src={getEmbedUrl()} 
            title={currentMedia.title}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
