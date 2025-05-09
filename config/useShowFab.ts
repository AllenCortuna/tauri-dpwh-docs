import { create } from 'zustand';

/**
 * Zustand store for managing floating action button visibility
 */
interface FabStore {
  showFab: boolean;
  handleToggle: () => void;
}

const useShowFab = create<FabStore>((set) => {
  // Initialize with value from localStorage or default to true
  const savedValue = typeof window !== 'undefined' 
    ? localStorage.getItem('showFab') 
    : null;
  
  return {
    showFab: savedValue ? savedValue === 'true' : true,
    handleToggle: () => {
      set((state) => {
        const newValue = !state.showFab;
        // Update localStorage when state changes
        if (typeof window !== 'undefined') {
          localStorage.setItem('showFab', String(newValue));
        }
        return { showFab: newValue };
      });
    }
  };
});

export default useShowFab;