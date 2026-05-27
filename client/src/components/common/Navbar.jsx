import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CircleUser, LogIn, LogOut, Menu, X, MapPinned } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/vehicles', label: 'Fleet' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/bookings', label: 'Bookings' },
    { path: '/vendor', label: 'Vendors' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(20,20,32,0.12)] border-b border-ink-900/5'
        : 'bg-white/60 backdrop-blur-md border-b border-transparent'
        }`}
      data-testid="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0" data-testid="navbar-logo">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-600 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="relative bg-primary-500 p-2 rounded-xl group-hover:rotate-[-8deg] transition-transform duration-500 shadow-lg">
                <MapPinned className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-display font-bold tracking-tight text-ink-900">
                Yatra<span className="text-primary-600">Mate</span>
              </span>
              <span className="text-[10px] font-display tracking-[0.1em] text-ink-400 font-medium mt-0.4">
                <span className='text-primary-500 font-bold'>~</span> Travel made effortless
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-ink-50/70 backdrop-blur-sm rounded-full p-1.5 border border-ink-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.path)
                  ? 'text-white'
                  : 'text-ink-700 hover:text-ink-900'
                  }`}
              >
                {isActive(link.path) && (
                  <span className="absolute inset-0 bg-ink-900 rounded-full shadow-lg" />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-ink-100 text-ink-700 hover:border-primary-500 hover:text-primary-600 transition-all duration-300 magnetic text-sm font-medium"
                  data-testid="navbar-profile-btn"
                >
                  <CircleUser className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-all duration-300 magnetic"
                  data-testid="navbar-logout-btn"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-ink-700 hover:text-ink-900 transition-colors duration-200 text-sm font-medium"
                  data-testid="navbar-login-btn"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  data-testid="navbar-signup-btn"
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold magnetic transition-colors"
                >
                  <span className="relative z-10">Sign Up</span>
                  <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-primary-400 group-hover:bg-white transition-colors" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="p-2.5 rounded-full bg-primary-50 border border-primary-100 text-primary-600"
                data-testid="mobile-profile-icon"
              >
                <CircleUser className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors"
                data-testid="mobile-signup-btn"
              >
                Sign Up
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2.5 rounded-full bg-white border border-ink-100 text-ink-900"
              data-testid="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-[calc(100%-0.5rem)] left-0 w-full px-4 pb-4 animate-fade-in-down" data-testid="mobile-menu">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-ink-100 p-2 shadow-2xl">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive(link.path)
                    ? 'bg-primary-50 text-primary-600 font-bold'
                    : 'text-ink-700 hover:bg-ink-50'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-50"
                >
                  Login
                </Link>
              )}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-secondary-600 hover:bg-secondary-50"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;