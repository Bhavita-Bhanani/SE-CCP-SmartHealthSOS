import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ socketConnected }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadgeColors = {
    patient: 'bg-blue-100 text-blue-800',
    responder: 'bg-emerald-100 text-emerald-800',
    admin: 'bg-purple-100 text-purple-800',
  };

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={user ? `/${user.role}` : '/login'}
            className="flex items-center gap-2 font-bold text-lg text-red-600"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white text-sm font-extrabold">
              SOS
            </span>
            <span className="hidden sm:inline text-slate-900">
              Smart Health &amp; SOS Portal
            </span>
          </Link>

          {user?.role === 'patient' && (
            <div className="flex items-center gap-2 ml-4">
              <Link
                to="/patient"
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  location.pathname === '/patient'
                    ? 'bg-red-50 text-red-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/health-profile"
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  location.pathname === '/health-profile'
                    ? 'bg-red-50 text-red-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Health Profile
              </Link>
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-3">
            {typeof socketConnected === 'boolean' && (
              <span
                className={`hidden md:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                  socketConnected
                    ? 'bg-green-100 text-green-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    socketConnected ? 'bg-green-600' : 'bg-amber-500'
                  }`}
                />
                {socketConnected ? 'Live Socket Connected' : 'Connecting...'}
              </span>
            )}

            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-800">
                {user.name}
              </div>
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                  roleBadgeColors[user.role] || 'bg-slate-100 text-slate-700'
                }`}
              >
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;