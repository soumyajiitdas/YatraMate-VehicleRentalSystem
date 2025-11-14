import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageSkeleton from './components/PageSkeleton';
import './App.css';

// Lazy load all pages for better initial load performance
const HomePage = lazy(() => import('./pages/HomePage'));
const VehiclesPage = lazy(() => import('./pages/VehiclesPage'));
const VehicleDetailsPage = lazy(() => import('./pages/VehicleDetailsPage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const VendorPage = lazy(() => import('./pages/VendorPage'));
const VendorDashboard = lazy(() => import('./pages/VendorDashboard'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const OfficeStaffDashboard = lazy(() => import('./pages/OfficeStaffDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/admin', '/office-staff', '/vendor-dashboard'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="App">
      {!shouldHideNavbar && <Navbar />}
      <main>
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
          </Routes>
        </Suspense>
      </main>
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
