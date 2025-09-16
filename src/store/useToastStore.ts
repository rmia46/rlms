import { create } from 'zustand';

interface ToastState {
  message: string | null;
  type: 'success' | 'error' | 'info' | null;
  show: boolean;
  setToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: null,
  show: false,
  setToast: (message, type) => {
    set({ message, type, show: true });
    setTimeout(() => {
      set({ show: false, message: null, type: null });
    }, 5000); // Automatically hide after 5 seconds
  },
  hideToast: () => set({ show: false, message: null, type: null }),
}));