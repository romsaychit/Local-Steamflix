import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils';
import { MediaType, Movie, TVShow } from '../../types';

interface TopTenProps {
  items: (Movie | TVShow)[];
  type: MediaType;
}

const TopTen: React.FC<TopTenProps> = ({ items, type }) => {
  // Take only the first 10 items
  const topItems = items.slice(0, 10);

  if (!topItems.length) return null;

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Top 10 {type === 'movie' ? 'Movies' : 'TV Shows'} Today
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {topItems.map((item, index) => {
            const title = type === 'movie' 
              ? (item as Movie).title 
              : (item as TVShow).name;
              
            return (
              <Link
                key={item.id}
                to={`/${type}/${item.id}`}
                className="group relative overflow-hidden rounded-lg bg-gray-200 dark:bg-dark-300 transition-transform duration-300 transform hover:scale-[1.02]"
              >
                <div className="relative aspect-[3/2]">
                  <img
                    src={getImageUrl(item.backdrop_path || item.poster_path, 'w780')}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Top 10 ranking */}
                  <div className="absolute bottom-0 left-0 w-full">
                    <div className="flex items-center p-3">
                      <span className="text-4xl sm:text-5xl font-bold text-white opacity-80 mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-white font-medium text-sm sm:text-base line-clamp-1">
                          {title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  
                  {/* Play overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-primary-600/90 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopTen;
