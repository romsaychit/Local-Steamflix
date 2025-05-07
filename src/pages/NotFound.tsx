import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center">
      <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-500 opacity-50">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-md">
        We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Go Home
        </Link>
        <Link
          to="/search"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-dark-300 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-400 transition-colors"
        >
          <Search className="w-5 h-5" />
          Search
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
