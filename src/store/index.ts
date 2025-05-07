import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MediaType, WatchHistoryItem, WatchlistItem } from '../types';

interface UserState {
  isAuthenticated: boolean;
  watchlist: WatchlistItem[];
  watchHistory: WatchHistoryItem[];
  setAuthenticated: (value: boolean) => void;
  addToWatchlist: (mediaId: number, mediaType: MediaType) => void;
  removeFromWatchlist: (mediaId: number, mediaType: MediaType) => void;
  isInWatchlist: (mediaId: number, mediaType: MediaType) => boolean;
  addToWatchHistory: (mediaId: number, mediaType: MediaType, progress: number) => void;
  clearWatchHistory: () => void;
  clearWatchlist: () => void;
}

// Create a user store with persistence
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      watchlist: [],
      watchHistory: [],
      
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      
      addToWatchlist: (mediaId, mediaType) => {
        const { watchlist } = get();
        const isAlreadyInWatchlist = watchlist.some(
          (item) => item.mediaId === mediaId && item.mediaType === mediaType
        );
        
        if (!isAlreadyInWatchlist) {
          set({
            watchlist: [
              ...watchlist,
              {
                id: `${mediaType}-${mediaId}`,
                mediaId,
                mediaType,
                addedAt: new Date().toISOString(),
              },
            ],
          });
        }
      },
      
      removeFromWatchlist: (mediaId, mediaType) => {
        const { watchlist } = get();
        set({
          watchlist: watchlist.filter(
            (item) => !(item.mediaId === mediaId && item.mediaType === mediaType)
          ),
        });
      },
      
      isInWatchlist: (mediaId, mediaType) => {
        const { watchlist } = get();
        return watchlist.some(
          (item) => item.mediaId === mediaId && item.mediaType === mediaType
        );
      },
      
      addToWatchHistory: (mediaId, mediaType, progress) => {
        const { watchHistory } = get();
        const existingIndex = watchHistory.findIndex(
          (item) => item.mediaId === mediaId && item.mediaType === mediaType
        );
        
        const newItem = {
          id: `${mediaType}-${mediaId}`,
          mediaId,
          mediaType,
          watchedAt: new Date().toISOString(),
          progress,
        };
        
        if (existingIndex !== -1) {
          const updatedHistory = [...watchHistory];
          updatedHistory[existingIndex] = newItem;
          set({ watchHistory: updatedHistory });
        } else {
          set({
            watchHistory: [newItem, ...watchHistory].slice(0, 100), // Limit history to 100 items
          });
        }
      },
      
      clearWatchHistory: () => set({ watchHistory: [] }),
      clearWatchlist: () => set({ watchlist: [] }),
    }),
    {
      name: 'user-storage',
    }
  )
);

interface UIState {
  isMiniplayer: boolean;
  currentMedia: {
    id: number | null;
    type: MediaType | null;
    title: string;
    season?: number;
    episode?: number;
  };
  setMiniplayer: (value: boolean) => void;
  setCurrentMedia: (media: UIState['currentMedia']) => void;
  resetPlayer: () => void;
}

// Create a UI store for application state
export const useUIStore = create<UIState>((set) => ({
  isMiniplayer: false,
  currentMedia: {
    id: null,
    type: null,
    title: '',
    season: undefined,
    episode: undefined,
  },
  
  setMiniplayer: (value) => set({ isMiniplayer: value }),
  
  setCurrentMedia: (media) => set({ currentMedia: media }),
  
  resetPlayer: () => set({
    isMiniplayer: false,
    currentMedia: {
      id: null,
      type: null,
      title: '',
      season: undefined,
      episode: undefined,
    },
  }),
}));
