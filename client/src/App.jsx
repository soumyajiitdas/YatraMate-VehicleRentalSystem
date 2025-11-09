import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VendorPage from './pages/VendorPage';
import VendorDashboard from './pages/VendorDashboard';
import PricingPage from './pages/PricingPage';
import OfficeStaffDashboard from './pages/OfficeStaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/admin', '/office-staff', '/vendor-dashboard'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="App">
      {!shouldHideNavbar && <Navbar />}
      <main>
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
