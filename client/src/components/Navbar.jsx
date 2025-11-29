import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MapPinned, CircleUser, LogIn, LogOut  } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/vehicles', label: 'Vehicles' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/bookings', label: 'My Bookings' },
    { path: '/vendor', label: 'For Vendors' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-linear-to-r from-primary-500 to-secondary-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
              <MapPinned className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-display font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              YatraMate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                    : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-4 py-2 text-neutral-700 hover:text-primary-600 transition-colors duration-200"
                >
                  <CircleUser className="w-5 h-5 text-primary-500" />
                  <span className="font-medium">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-neutral-700 hover:text-primary-600 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5 text-primary-500" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-5 py-2 text-neutral-700 hover:text-primary-600 transition-colors duration-200"
                >
                  <LogIn className="w-5 h-5 text-primary-500" />
                  <span className='font-medium'>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Auth Icons */}
          <div className="flex md:hidden items-center space-x-2">
            {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="p-2 rounded-lg text-primary-600 bg-red-100"
                  data-testid="mobile-profile-icon"
                >
                  <CircleUser className="w-6 h-6" />
                </Link>
            ) : (
              <>
                <Link
                to="/login"
                className="p-2 rounded-lg text-primary-600 bg-red-100 hover:-rotate-7 transition-colors duration-200"
                data-testid="mobile-login-icon"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </Link>
              <Link
                  to="/register"
                  className="px-4 py-2.5 bg-linear-to-r from-primary-500 to-secondary-500 text-white text-sm rounded-lg font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Background Decorative Elements */}
        <div className="hidden absolute inset-0 pointer-events-none overflow-hidden sm:block">
          {/* Top-left cluster */}
          <div className="absolute -top-10 -left-6 w-32 h-32 bg-red-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-6 -left-12 w-20 h-20 bg-blue-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-20 left-4 w-14 h-14 bg-yellow-300 rounded-full opacity-50 blur-md" />

          {/* Center-right floating grouping */}
          <div className="absolute top-16 right-24 w-28 h-28 bg-pink-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-32 right-10 w-16 h-16 bg-purple-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-44 right-16 w-12 h-12 bg-green-300 rounded-full opacity-50 blur-md" />

          {/* Bottom-right anchor cluster */}
          <div className="absolute -bottom-10 right-8 w-24 h-24 bg-red-300 rounded-full opacity-50 blur-md" />
          <div className="absolute -bottom-4 right-24 w-16 h-16 bg-blue-300 rounded-full opacity-50 blur-md" />
          <div className="absolute -bottom-20 right-16 w-12 h-12 bg-yellow-300 rounded-full opacity-50 blur-md" />
        </div>
    </nav>
  );
};

export default Navbar;
