import { create } from "zustand";

interface useMobileNavDrawerStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useMobileNavDrawer = create<useMobileNavDrawerStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));
