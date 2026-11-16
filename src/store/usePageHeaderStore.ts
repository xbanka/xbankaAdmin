import { create } from "zustand";

/**
 * Lets a view that has no URL of its own (e.g. a support chat opened from
 * component state) replace the header breadcrumb with a back button and a
 * title. Everything else gets its breadcrumb from the pathname.
 */
export interface PageHeaderOverride {
  title: string;
  onBack: () => void;
}

interface PageHeaderState {
  override: PageHeaderOverride | null;
  setOverride: (override: PageHeaderOverride | null) => void;
}

export const usePageHeaderStore = create<PageHeaderState>((set) => ({
  override: null,
  setOverride: (override) => set({ override }),
}));
