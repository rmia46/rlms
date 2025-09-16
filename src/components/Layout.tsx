import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LayoutDashboard, LogOut, Settings, X } from 'lucide-react';
import Toast from './Toast';
import RLMSLogo from '../assets/logo.png';

interface LayoutProps {
  component: React.ReactNode;
  isAdminOnly?: boolean;
}

const Layout = ({ component, isAdminOnly = false }: LayoutProps) => {
  const { isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isAdminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col p-4">
        {/* New header for smaller screens */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gradient">RLMS</h2>
          <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </label>
        </div>
        
        {/* Main content of the page */}
        {component}
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full bg-base-200 text-base-content pt-16">
          <label htmlFor="my-drawer-2" className="btn btn-ghost btn-sm drawer-button absolute top-4 right-4 lg:hidden">
            <X className="w-6 h-6" />
          </label>
          <div className="flex items-center space-x-4 mb-8 pl-4">
            <img src={RLMSLogo} alt="RLMS Logo" className="w-12 h-12" />
            <h2 className="text-2xl font-bold text-gradient">RLMS</h2>
          </div>
          <li>
            <Link to="/dashboard" className="flex items-center space-x-2">
              <LayoutDashboard className="w-6 h-6 text-gradient" />
              <span>Dashboard</span>
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/admin" className="flex items-center space-x-2">
                <Settings className="w-6 h-6 text-gradient" />
                <span>Admin Panel</span>
              </Link>
            </li>
          )}
          <div className="divider"></div>
          <li>
            <button onClick={handleLogout} className="flex items-center space-x-2">
              <LogOut className="w-6 h-6 text-gradient" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
      <Toast />
    </div>
  );
};

export default Layout;