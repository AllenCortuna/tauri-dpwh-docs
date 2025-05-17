import { create } from 'zustand';

/**
 * Zustand store for managing dashboard visibility
 */
interface DashboardStore {
  showDashboard: boolean;
  handleToggle: () => void;
}

const useShowDashboard = create<DashboardStore>((set) => {
  // Initialize with value from localStorage or default to false
  const savedValue = typeof window !== 'undefined' 
    ? localStorage.getItem('showDashboard') 
    : null;
  
  return {
    showDashboard: savedValue ? savedValue === 'true' : false, // Default to false
    handleToggle: () => {
      set((state) => {
        const newValue = !state.showDashboard;
        // Update localStorage when state changes
        if (typeof window !== 'undefined') {
          localStorage.setItem('showDashboard', String(newValue));
        }
        return { showDashboard: newValue };
      });
    }
  };
});

export default useShowDashboard;