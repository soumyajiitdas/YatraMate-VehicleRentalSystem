import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import PickupModal from '../components/PickupModal';
import ReturnModal from '../components/ReturnModal';

const OfficeStaffDashboard = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('pending');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);

    useEffect(() => {
        // Check if user is authenticated and is office staff
        if (!isAuthenticated || !user || user.role !== 'office_staff') {
            navigate('/');
            return;
        }
        fetchBookings();
    }, [activeTab, navigate, isAuthenticated, user]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            let status = '';
            if (activeTab === 'pending') status = 'booking_requested';
            if (activeTab === 'active') status = 'picked_up';
            if (activeTab === 'completed') status = 'returned';

            const url = status ? `${API_ENDPOINTS.officeStaffRequests}?status=${status}` : API_ENDPOINTS.officeStaffRequests;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'success') {
                setBookings(data.data.bookings);
            } else {
                setBookings([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setBookings([]);
            setLoading(false);
        }
    };

    const handlePickup = (booking) => {
        setSelectedBooking(booking);
        setShowPickupModal(true);
    };

    const handleReturn = (booking) => {
        setSelectedBooking(booking);
        setShowReturnModal(true);
    };

    const handlePickupSuccess = () => {
        setShowPickupModal(false);
        setSelectedBooking(null);
        fetchBookings();
    };

    const handleReturnSuccess = () => {
        setShowReturnModal(false);
        setSelectedBooking(null);
        fetchBookings();
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getStatusBadge = (status) => {
        const badges = {
            booking_requested: 'bg-yellow-100 text-yellow-800',
            picked_up: 'bg-blue-100 text-blue-800',
            returned: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        const labels = {
            booking_requested: 'Pending',
            picked_up: 'Active',
            returned: 'Completed',
            cancelled: 'Cancelled'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 group">
                        <div className="bg-linear-to-r from-primary-500 to-secondary-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-display font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            YatraMate
                        </span>
                    </div>
                    <div className='text-center'>
                        <h1 className="text-3xl font-bold text-gray-900">Office Staff Dashboard</h1>
                        <p className="mt-2 text-gray-600">Manage vehicle pickups and returns</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-secondary-500 transition-colors text-sm font-medium flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pending'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Pending Requests
                                {bookings.length > 0 && activeTab === 'pending' && (
                                    <span className="ml-2 bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs">
                                        {bookings.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'active'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Active Bookings
                            </button>
                            <button
                                onClick={() => setActiveTab('completed')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'completed'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Completed
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Bookings List */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {activeTab === 'pending' && 'No pending requests at the moment.'}
                            {activeTab === 'active' && 'No active bookings at the moment.'}
                            {activeTab === 'completed' && 'No completed bookings yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {booking.vehicle_id.name} - {booking.vehicle_id.model_name}
                                                </h3>
                                                {getStatusBadge(booking.status)}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Customer</p>
                                                    <p className="font-medium text-gray-900">{booking.user_id.name}</p>
                                                    <p className="text-gray-600">{booking.user_id.email}</p>
                                                    <p className="text-gray-600">{booking.user_id.phone}</p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-500">Vehicle Details</p>
                                                    <p className="font-medium text-gray-900">{booking.vehicle_id.registration_number}</p>
                                                    <p className="text-gray-600">{booking.vehicle_id.type} - {booking.vehicle_id.cc_engine}cc</p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-500">Route</p>
                                                    <p className="font-medium text-gray-900">From: {booking.start_location}</p>
                                                    <p className="font-medium text-gray-900">To: {booking.end_location}</p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-500">Pickup Schedule</p>
                                                    <p className="font-medium text-gray-900">
                                                        {new Date(booking.requested_pickup_date).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-gray-600">{booking.requested_pickup_time}</p>
                                                </div>

                                                {booking.package_id && (
                                                    <div>
                                                        <p className="text-gray-500">Package</p>
                                                        <p className="font-medium text-gray-900">{booking.package_id.name}</p>
                                                        <p className="text-gray-600">₹{booking.package_id.price_per_hour}/hr | ₹{booking.package_id.price_per_km}/km</p>
                                                    </div>
                                                )}

                                                {booking.pickup_details && (
                                                    <div>
                                                        <p className="text-gray-500">Pickup Info</p>
                                                        <p className="font-medium text-gray-900">
                                                            Odometer: {booking.pickup_details.odometer_reading_start} km
                                                        </p>
                                                        <p className="text-gray-600">ID: {booking.pickup_details.id_proof_type}</p>
                                                    </div>
                                                )}

                                                {booking.final_cost && (
                                                    <div>
                                                        <p className="text-gray-500">Final Cost</p>
                                                        <p className="font-medium text-xl text-green-600">₹{booking.final_cost.toFixed(2)}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="ml-6 flex flex-col space-y-2">
                                            {booking.status === 'booking_requested' && (
                                                <button
                                                    onClick={() => handlePickup(booking)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                >
                                                    Confirm Pickup
                                                </button>
                                            )}

                                            {booking.status === 'picked_up' && (
                                                <button
                                                    onClick={() => handleReturn(booking)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                >
                                                    Confirm Return
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showPickupModal && selectedBooking && (
                <PickupModal
                    booking={selectedBooking}
                    onClose={() => setShowPickupModal(false)}
                    onSuccess={handlePickupSuccess}
                />
            )}

            {showReturnModal && selectedBooking && (
                <ReturnModal
                    booking={selectedBooking}
                    onClose={() => setShowReturnModal(false)}
                    onSuccess={handleReturnSuccess}
                />
            )}
        </div>
    );
};

export default OfficeStaffDashboard;
