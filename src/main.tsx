import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useAuthStore } from './store/useAuthStore';
import { initializeCourseListener } from './store/useCourseStore';

function AuthInitializer() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const isAdmin = currentUser.email === 'admin@rlms.com';
        setUser(currentUser, isAdmin);
      } else {
        setUser(null, false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return null; // This component doesn't render anything itself
}

initializeCourseListener();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <AuthInitializer />
    <App />
  </>
);