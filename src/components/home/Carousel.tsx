import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaType, Movie, TVShow } from '../../types';
import MediaCard from '../common/MediaCard';

interface CarouselProps {
  title: string;
  items: (Movie | TVShow)[];
  type: MediaType;
  viewAllUrl?: string;
}

const Carousel: React.FC<CarouselProps> = ({ title, items, type, viewAllUrl }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate max scroll position on mount and resize
  useEffect(() => {
    const updateMaxScroll = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.scrollWidth;
        const viewportWidth = containerRef.current.clientWidth;
        setMaxScroll(containerWidth - viewportWidth);
      }
    };
    
    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);
    
    return () => {
      window.removeEventListener('resize', updateMaxScroll);
    };
  }, [items]);
  
  // Scroll functions
  const scrollLeft = () => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.9;
      const newPosition = Math.max(0, scrollPosition - scrollAmount);
      containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  const scrollRight = () => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.9;
      const newPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
      containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  // Track scroll position manually
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };
  
  // Add scroll event listener
  useEffect(() => {
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => {
        currentRef.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        {/* Header with title and navigation */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          
          <div className="flex items-center space-x-2">
            {/* Navigation arrows */}
            <button
              onClick={scrollLeft}
              disabled={scrollPosition <= 0}
              className={`p-2 rounded-full ${
                scrollPosition <= 0
                  ? 'bg-gray-200 dark:bg-dark-300 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-300'
              } transition-colors`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={scrollRight}
              disabled={scrollPosition >= maxScroll}
              className={`p-2 rounded-full ${
                scrollPosition >= maxScroll
                  ? 'bg-gray-200 dark:bg-dark-300 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-300'
              } transition-colors`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Scrollable container */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex-shrink-0 w-[160px] sm:w-[200px]"
            >
              <MediaCard media={item} type={type} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
