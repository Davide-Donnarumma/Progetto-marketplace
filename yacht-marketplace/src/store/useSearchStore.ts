import { create } from "zustand";

export interface SearchFilters {
  startDate: string | null;
  endDate: string | null;
  minLength: number;
  minGuests: number;
  minLuxuryTier: number;
  minPrice: number;
  maxPrice: number;
}

interface SearchStore {
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: SearchFilters = {
  startDate: null,
  endDate: null,
  minLength: 0,
  minGuests: 1,
  minLuxuryTier: 1,
  minPrice: 0,
  maxPrice: 999999,
};

export const useSearchStore = create<SearchStore>((set) => ({
  filters: defaultFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
