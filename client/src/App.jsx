import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import MobileNav from './components/common/MobileNav';
import Footer from './components/common/Footer';
import PageSkeleton from './components/common/PageSkeleton';
import './App.css';

// Lazy load all pages for better initial load performance
const HomePage = lazy(() => import('./pages/HomePage'));
const VehiclesPage = lazy(() => import('./pages/VehiclesPage'));
const VehicleDetailsPage = lazy(() => import('./pages/VehicleDetailsPage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const ProfilePage = lazy(() => import('./pages/users/ProfilePage'));
const LoginPage = lazy(() => import('./pages/users/LoginPage'));
const RegisterPage = lazy(() => import('./pages/users/RegisterPage'));
const VendorPage = lazy(() => import('./pages/VendorPage'));
const VendorDashboard = lazy(() => import('./pages/dashboards/VendorDashboard'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const OfficeStaffDashboard = lazy(() => import('./pages/dashboards/OfficeStaffDashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboards/AdminDashboard'));
const AboutUsPage = lazy(() => import('./pages/documentations/AboutUsPage'));
const FAQsPage = lazy(() => import('./pages/documentations/FAQsPage'));
const TermsPage = lazy(() => import('./pages/documentations/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/documentations/PrivacyPage'));
const HelpCenterPage = lazy(() => import('./pages/documentations/HelpCenterPage'));

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();
  const hideNavbarRoutes = ['/admin', '/office-staff', '/vendor-dashboard'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const redirectableRoutes = ['/', '/login', '/register', '/vendor'];

  useEffect(() => {
    if (loading || !isAuthenticated || !user) {
      return;
    }

    const dashboardRoutes = {
      admin: '/admin',
      vendor: '/vendor-dashboard',
      office_staff: '/office-staff'
    };

    const targetRoute = dashboardRoutes[user.role];

    if (targetRoute && redirectableRoutes.includes(location.pathname) && location.pathname !== targetRoute) {
      navigate(targetRoute, { replace: true });
    }
  }, [loading, isAuthenticated, user, location.pathname, navigate]);

  return (
    <div className="App">
      {!shouldHideNavbar && <Navbar />}
      <main className="pb-16 md:pb-0">
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/vendor" element={<VendorPage />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/office-staff" element={<OfficeStaffDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/faq" element={<FAQsPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
          </Routes>
        </Suspense>
      </main>
      {!shouldHideNavbar && <MobileNav />}
      {!shouldHideNavbar && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
