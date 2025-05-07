import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  X, 
  UserCircle,
  Home,
  Film,
  Tv,
  BookmarkCheck,
  History,
  LogIn
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useUserStore } from '../../store';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { isAuthenticated } = useUserStore();

  // Handle scroll event to change header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled || isMenuOpen
          ? 'bg-white/90 dark:bg-dark-100/90 backdrop-blur-md shadow-md'
          : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
          <Film className="h-8 w-8" />
          <span className="text-xl font-bold hidden sm:block">StreamFlix</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${
              location.pathname === '/' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Home
          </Link>
          <Link
            to="/movies"
            className={`hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${
              location.pathname.startsWith('/movie') ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Movies
          </Link>
          <Link
            to="/tv"
            className={`hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${
              location.pathname.startsWith('/tv') ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            TV Shows
          </Link>
        </nav>

        {/* Search & User Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-full bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 w-36 lg:w-48 transition-all"
            />
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3" />
          </form>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu or Login */}
          {isAuthenticated ? (
            <Link 
              to="/profile" 
              className="flex items-center justify-center w-8 h-8 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-200"
            >
              <UserCircle className="w-6 h-6" />
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="hidden sm:flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-100 shadow-lg animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center relative">
              <input
                type="text"
                placeholder="Search movies & TV shows"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
              />
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400 absolute left-3" />
            </form>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200"
              >
                <Home className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="text-gray-700 dark:text-gray-300">Home</span>
              </Link>
              <Link
                to="/movies"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200"
              >
                <Film className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="text-gray-700 dark:text-gray-300">Movies</span>
              </Link>
              <Link
                to="/tv"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200"
              >
                <Tv className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="text-gray-700 dark:text-gray-300">TV Shows</span>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/watchlist"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200"
                  >
                    <BookmarkCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span className="text-gray-700 dark:text-gray-300">My Watchlist</span>
                  </Link>
                  <Link
                    to="/history"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200"
                  >
                    <History className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span className="text-gray-700 dark:text-gray-300">Watch History</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200"
                  >
                    <UserCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span className="text-gray-700 dark:text-gray-300">My Profile</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200"
                >
                  <LogIn className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-gray-700 dark:text-gray-300">Login</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
