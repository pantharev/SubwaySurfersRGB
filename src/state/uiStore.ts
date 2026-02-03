import { create } from 'zustand';
import type { Screen } from '../utils/types';

interface UIStore {
  // UI state
  currentScreen: Screen;
  showGameOverModal: boolean;
  showPauseMenu: boolean;
  
  // Actions
  setScreen: (screen: Screen) => void;
  openGameOverModal: () => void;
  closeGameOverModal: () => void;
  openPauseMenu: () => void;
  closePauseMenu: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  currentScreen: 'menu',
  showGameOverModal: false,
  showPauseMenu: false,

  setScreen: (currentScreen) => set({ currentScreen }),
  
  openGameOverModal: () => set({ showGameOverModal: true }),
  closeGameOverModal: () => set({ showGameOverModal: false }),
  
  openPauseMenu: () => set({ showPauseMenu: true }),
  closePauseMenu: () => set({ showPauseMenu: false }),
}));
