import { create } from 'zustand';

/**
 * Zustand store for managing database type selection
 */
interface DatabaseStore {
  databaseType: string;
  handleToggle: (type: string) => void;
}

const useSelectDatabase = create<DatabaseStore>((set) => {
  // Initialize with value from localStorage or default to 'contracts'
  const savedType = typeof window !== 'undefined' 
    ? localStorage.getItem('database') 
    : null;
  
  return {
    databaseType: savedType || 'contracts',
    handleToggle: (type: string) => {
      // Update localStorage when state changes
      if (typeof window !== 'undefined') {
        localStorage.setItem('database', type);
      }
      // Update state
      set({ databaseType: type });
    }
  };
});

export default useSelectDatabase;