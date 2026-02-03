import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { loadLocalData } from '../utils/localStorage';

interface AuthStore {
  // Auth state
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  guestId: string;
  guestUsername: string | null;
  
  // Actions
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setGuestUsername: (username: string) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set) => {
  const localData = loadLocalData();
  
  return {
    session: null,
    user: null,
    isLoading: true,
    guestId: localData.guestId,
    guestUsername: localData.guestUsername,

    setSession: (session) => set({ 
      session,
      user: session?.user ?? null,
    }),
    
    setUser: (user) => set({ user }),
    
    setLoading: (isLoading) => set({ isLoading }),
    
    setGuestUsername: (guestUsername) => set({ guestUsername }),
    
    initialize: () => {
      const data = loadLocalData();
      set({
        guestId: data.guestId,
        guestUsername: data.guestUsername,
      });
    },
  };
});
