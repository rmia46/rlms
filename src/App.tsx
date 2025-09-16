import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import CourseView from './pages/CourseView'; // Import the new component
import { useAuthStore } from './store/useAuthStore';
import Layout from './components/Layout';

const ProtectedRoute = () => {
  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/" />;
};

function App() {
  const isAdmin = useAuthStore(state => state.isAdmin);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout component={<Dashboard />} />} />
          <Route path="/courses/:courseId" element={<Layout component={<CourseView />} />} />
          <Route path="/admin" element={isAdmin ? <Layout component={<AdminPanel />} isAdminOnly /> : <Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;