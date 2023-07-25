import { create } from "zustand";

interface useStoreModalStore {
  isOpen: boolean;
  isForceClose: boolean;
  onOpen: () => void;
  onClose: () => void;
  onForceClose: () => void;
}

export const useStoreModal = create<useStoreModalStore>((set) => ({
  isOpen: false,
  isForceClose: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
  onForceClose: () => set({ isForceClose: true, isOpen: false }),
}));
