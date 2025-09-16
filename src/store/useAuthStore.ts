import { create } from 'zustand';
import { signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth } from '../firebase';
import { useToastStore } from './useToastStore'; // Import the toast store

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: User | null, isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  loading: true,
  setUser: (user, isAdmin) => set({ user, isAdmin }),
  setLoading: (loading) => set({ loading }),
  login: async (email, password) => {
    set({ loading: true });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    set({ loading: true });
    try {
      await signOut(auth);
      useToastStore.getState().setToast('Logged out successfully.', 'info'); // Trigger toast on success
    } catch (error) {
      console.error("Logout failed:", error);
      useToastStore.getState().setToast('Logout failed.', 'error'); // Trigger toast on error
    } finally {
      set({ loading: false });
    }
  },
}));