import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { API_ENDPOINTS } from '../../config/api';
import PickupModal from '../../components/PickupModal';
import ReturnModal from '../../components/ReturnModal';
import { MapPinned, ChevronDown, ChevronUp } from 'lucide-react';

const OfficeStaffDashboard = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('pending');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejecting, setRejecting] = useState(false);
    const [expandedCards, setExpandedCards] = useState({});

    const toggleCardExpansion = (bookingId) => {
        setExpandedCards(prev => ({
            ...prev,
            [bookingId]: !prev[bookingId]
        }));
    };

    // Utility: parse various date string formats and return a local Date at 00:00
    const parseDateLocal = (s) => {
        if (!s || typeof s !== 'string') return null;
        const str = s.trim();
        // YYYY-MM-DD -> local date
        const ymd = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (ymd) {
            const y = parseInt(ymd[1], 10);
            const m = parseInt(ymd[2], 10) - 1;
            const d = parseInt(ymd[3], 10);
            return new Date(y, m, d);
        }
        // ISO with time
        if (str.includes('T')) {
            const iso = new Date(str);
            if (!isNaN(iso)) return new Date(iso.getFullYear(), iso.getMonth(), iso.getDate());
        }
        // DD/MM/YYYY or MM/DD/YYYY
        const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (dmy) {
            let a = parseInt(dmy[1], 10);
            let b = parseInt(dmy[2], 10);
            const y = parseInt(dmy[3], 10);
            let day, month;
            if (a > 12 && b <= 12) { day = a; month = b; }
            else if (b > 12 && a <= 12) { day = b; month = a; }
            else { day = a; month = b; }
            return new Date(y, month - 1, day);
        }
        const nat = new Date(str);
        return isNaN(nat) ? null : new Date(nat.getFullYear(), nat.getMonth(), nat.getDate());
    };

    const formatDateDDMMYYYY = (input) => {
        const d = parseDateLocal(input);
        if (!d) return '';
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };

    useEffect(() => {
        if (authLoading) {
            return;
        }
        // Check if user is authenticated and is office staff
        if (!isAuthenticated || !user || user.role !== 'office_staff') {
            navigate('/');
            return;
        }
        fetchBookings();
    }, [activeTab, navigate, isAuthenticated, user, authLoading]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            let status = '';
            if (activeTab === 'pending') status = 'booking_requested';
            if (activeTab === 'active') status = 'picked_up';
            if (activeTab === 'completed') status = 'returned';

            const url = status ? `${API_ENDPOINTS.officeStaffRequests}?status=${status}` : API_ENDPOINTS.officeStaffRequests;

            const response = await fetch(url, {
                credentials: 'include'
            });
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

    const handleReject = (booking) => {
        setSelectedBooking(booking);
        setRejectionReason('');
        setShowRejectDialog(true);
    };

    const handleRejectConfirm = async () => {
        if (!rejectionReason || rejectionReason.trim() === '') {
            toast.warning('Please provide a rejection reason');
            return;
        }

        try {
            setRejecting(true);
            const response = await fetch(API_ENDPOINTS.rejectBooking(selectedBooking._id), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ rejection_reason: rejectionReason })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Booking rejected successfully');
                setShowRejectDialog(false);
                setSelectedBooking(null);
                setRejectionReason('');
                fetchBookings();
            } else {
                toast.error(data.message || 'Error rejecting booking');
            }
        } catch (error) {
            console.error('Error rejecting booking:', error);
            toast.error('Error rejecting booking: ' + error.message);
        } finally {
            setRejecting(false);
        }
    };

    const handleRejectCancel = () => {
        setShowRejectDialog(false);
        setSelectedBooking(null);
        setRejectionReason('');
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

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    {/* Mobile and Desktop Layout */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                        {/* Logo - Left on desktop, top on mobile */}
                        <div className="flex items-center justify-between md:justify-start mb-6">
                            <div className="flex items-center space-x-2 group">
                                <div className="bg-linear-to-r from-primary-500 to-secondary-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
                                    <MapPinned className="w-6 h-6 text-white" />
                                </div>
                                <div className='flex flex-col'>
                                    <span className="text-xl md:text-2xl font-display font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                        YatraMate
                                    </span>
                                    <p className='text-xs text-gray-500 font-medium -mt-1'>
                                        Travel made effortless <span className='text-red-500 font-bold'>~</span>
                                    </p>
                                </div>
                            </div>
                            {/* Logout button - visible on mobile only */}
                            <button
                                onClick={handleLogout}
                                className="md:hidden px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-secondary-500 transition-colors text-sm font-medium flex items-center"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>

                        {/* Title - Center */}
                        <div className='text-center md:flex-1'>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Office Staff <span className='text-red-600'>Dashboard</span></h1>
                            <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600">Manage vehicle pickups and returns</p>
                        </div>

                        {/* Logout button - visible on desktop only */}
                        <button
                            onClick={handleLogout}
                            className="hidden md:flex px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-secondary-500 transition-colors text-sm font-medium items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white border border-primary-200 rounded-lg shadow-sm mb-6 overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`shrink-0 px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'pending'
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
                                className={`shrink-0 px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'active'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Active Bookings
                            </button>
                            <button
                                onClick={() => setActiveTab('completed')}
                                className={`shrink-0 px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'completed'
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
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                <div className="p-4 md:p-6">
                                    {/* Collapsible Header for Completed Tab */}
                                    {activeTab === 'completed' ? (
                                        <>
                                            <div 
                                                className="flex items-center justify-between cursor-pointer"
                                                onClick={() => toggleCardExpansion(booking._id)}
                                                data-testid={`toggle-card-${booking._id}`}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
                                                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                                                        {booking.vehicle_id.name} - {booking.vehicle_id.model_name}
                                                    </h3>
                                                    
                                                </div>
                                                <button 
                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                    aria-label={expandedCards[booking._id] ? "Collapse details" : "Expand details"}
                                                >
                                                    {expandedCards[booking._id] ? (
                                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                                    )}
                                                </button>
                                            </div>

                                            {/* Collapsed Summary - Always visible */}
                                            {!expandedCards[booking._id] && (
                                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                                    <span>Customer: <span className="font-medium text-gray-900">{booking.user_id.name}</span></span>
                                                    <span>•</span>
                                                    <span>Returned: <span className="font-medium text-gray-900">{formatDateDDMMYYYY(booking.return_details?.actual_return_date)}</span></span>
                                                    {booking.bill_id && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Bill: <span className="font-medium text-blue-600">{booking.bill_id}</span></span>
                                                        </>
                                                    )}
                                                    {booking.final_cost && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Cost: <span className="font-medium text-green-600">₹{booking.final_cost.toFixed(2)}</span></span>
                                                        </>
                                                        
                                                    )}
                                                </div>
                                            )}

                                            {/* Expandable Content */}
                                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCards[booking._id] ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                                <div className="border-t border-gray-100 pt-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                                        <div>
                                                            <p className="text-gray-500">Customer</p>
                                                            <p className="font-medium text-gray-900">{booking.user_id.name}</p>
                                                            <p className="text-gray-600 wrap-break-words">{booking.user_id.email}</p>
                                                            <p className="text-gray-600">{booking.user_id.phone}</p>
                                                        </div>

                                                        <div>
                                                            <p className="text-gray-500">Vehicle Details</p>
                                                            <p className="font-medium text-gray-900">{booking.vehicle_id.registration_number}</p>
                                                            <p className="text-gray-600">{booking.vehicle_id.type} - {booking.vehicle_id.cc_engine}cc</p>
                                                        </div>

                                                        <div>
                                                            <p className="text-gray-500">Pickup Location</p>
                                                            <p className="font-medium text-gray-900">{booking.start_location}</p>
                                                        </div>

                                                        {booking.package_id && (
                                                            <div>
                                                                <p className="text-gray-500">Package</p>
                                                                <p className="font-medium text-gray-900">{booking.package_id.name}</p>
                                                                <p className="text-gray-600">₹{booking.package_id.price_per_hour}/hr | ₹{booking.package_id.price_per_km}/km</p>
                                                            </div>
                                                        )}

                                                        <div>
                                                            <p className="text-gray-500">Vehicle Pickup</p>
                                                            <p className="font-medium text-gray-900" data-testid="pickup-schedule-date">
                                                                {formatDateDDMMYYYY(booking.pickup_details?.actual_pickup_date || booking.requested_pickup_date)}
                                                            </p>
                                                            <p className="text-gray-600" data-testid="pickup-schedule-time">{booking.pickup_details?.actual_pickup_time || booking.requested_pickup_time}</p>
                                                        </div>

                                                        {booking.return_details && (
                                                            <>
                                                                <div>
                                                                    <p className="text-gray-500">Vehicle Returned</p>
                                                                    <p className="font-medium text-gray-900">
                                                                        Date: {formatDateDDMMYYYY(booking.return_details.actual_return_date)}
                                                                    </p>
                                                                    <p className="text-gray-600">Time: {booking.return_details.actual_return_time}</p>
                                                                </div>
                                                                {booking.pickup_details && (
                                                                    <div>
                                                                        <p className="text-gray-500">Customer ID Details</p>
                                                                        <p className="text-gray-600">Govt. ID: <span className="text-gray-900">{booking.pickup_details.id_proof_type?.replace('_', ' ').toUpperCase()}</span></p>
                                                                        <p className="text-gray-600">ID Number: {booking.pickup_details.id_number || 'N/A'}</p>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}

                                                        {booking.pickup_details?.staff_id && (
                                                            <div>
                                                                <p className="text-gray-500">Pickup Staff</p>
                                                                <p className="font-medium text-gray-900" data-testid="pickup-staff-name">{booking.pickup_details.staff_id.name}</p>
                                                            </div>
                                                        )}

                                                        {booking.return_details?.staff_id && (
                                                            <div>
                                                                <p className="text-gray-500">Return Staff</p>
                                                                <p className="font-medium text-gray-900" data-testid="return-staff-name">{booking.return_details.staff_id.name}</p>
                                                            </div>
                                                        )}

                                                        {booking.bill_id && (
                                                            <div>
                                                                <p className="text-gray-500">Bill ID</p>
                                                                <p className="font-medium text-blue-600" data-testid="bill-id-display">{booking.bill_id}</p>
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
                                            </div>
                                        </>
                                    ) : (
                                        /* Non-collapsible layout for Pending and Active tabs */
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mb-3">
                                                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                                                        {booking.vehicle_id.name} - {booking.vehicle_id.model_name}
                                                    </h3>
                                                    {getStatusBadge(booking.status)}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                                    <div>
                                                        <p className="text-gray-500">Customer</p>
                                                        <p className="font-medium text-gray-900">{booking.user_id.name}</p>
                                                        <p className="text-gray-600 wrap-break-words">{booking.user_id.email}</p>
                                                        <p className="text-gray-600">{booking.user_id.phone}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">Vehicle Details</p>
                                                        <p className="font-medium text-gray-900">{booking.vehicle_id.registration_number}</p>
                                                        <p className="text-gray-600">{booking.vehicle_id.type} - {booking.vehicle_id.cc_engine}cc</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">Pickup Location</p>
                                                        <p className="font-medium text-gray-900">{booking.start_location}</p>
                                                    </div>

                                                    {booking.package_id && (
                                                        <div>
                                                            <p className="text-gray-500">Package</p>
                                                            <p className="font-medium text-gray-900">{booking.package_id.name}</p>
                                                            <p className="text-gray-600">₹{booking.package_id.price_per_hour}/hr | ₹{booking.package_id.price_per_km}/km</p>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="text-gray-500">Vehicle Pickup</p>
                                                        <p className="font-medium text-gray-900" data-testid="pickup-schedule-date">
                                                            {formatDateDDMMYYYY(booking.pickup_details?.actual_pickup_date || booking.requested_pickup_date)}
                                                        </p>
                                                        <p className="text-gray-600" data-testid="pickup-schedule-time">{booking.pickup_details?.actual_pickup_time || booking.requested_pickup_time}</p>
                                                    </div>

                                                    {booking.pickup_details && (
                                                        <div>
                                                            <p className="text-gray-500">Pickup Info</p>
                                                            <p className="font-medium text-gray-900">
                                                                Odometer: {booking.pickup_details.odometer_reading_start} km
                                                            </p>
                                                            <p className="text-gray-600">Govt. ID: {booking.pickup_details.id_proof_type?.replace('_', ' ').toUpperCase()}</p>
                                                            <p className="text-gray-600">ID Number: {booking.pickup_details.id_number || 'N/A'}</p>
                                                        </div>
                                                    )}

                                                    {booking.pickup_details?.staff_id && (
                                                        <div>
                                                            <p className="text-gray-500">Pickup Staff</p>
                                                            <p className="font-medium text-gray-900" data-testid="pickup-staff-name">{booking.pickup_details.staff_id.name}</p>
                                                        </div>
                                                    )}

                                                    {booking.return_details?.staff_id && (
                                                        <div>
                                                            <p className="text-gray-500">Return Staff</p>
                                                            <p className="font-medium text-gray-900" data-testid="return-staff-name">{booking.return_details.staff_id.name}</p>
                                                        </div>
                                                    )}

                                                    {booking.bill_id && (
                                                        <div>
                                                            <p className="text-gray-500">Bill ID</p>
                                                            <p className="font-medium text-blue-600" data-testid="bill-id-display">{booking.bill_id}</p>
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

                                            <div className="lg:ml-6 flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                                                {booking.status === 'booking_requested' && (
                                                    <>
                                                        <button
                                                            onClick={() => handlePickup(booking)}
                                                            className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                                                            data-testid="complete-pickup-btn"
                                                        >
                                                            Complete Pickup
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(booking)}
                                                            className="flex-1 lg:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium whitespace-nowrap"
                                                            data-testid="reject-booking-btn"
                                                        >
                                                            Reject Booking
                                                        </button>
                                                    </>
                                                )}

                                                {booking.status === 'picked_up' && (
                                                    <button
                                                        onClick={() => handleReturn(booking)}
                                                        className="flex-1 lg:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
                                                        data-testid="verify-return-btn"
                                                    >
                                                        Verify Return
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
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

            {/* Rejection Dialog */}
            {showRejectDialog && selectedBooking && (
                <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-150 p-4">
                    <div className="bg-white border-2 border-primary-200 rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-red-600 mb-4">Reject Booking</h3>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">
                                Customer: <span className="font-medium text-gray-900">{selectedBooking.user_id.name}</span>
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                                Vehicle: <span className="font-medium text-gray-900">{selectedBooking.vehicle_id.name}</span>
                            </p>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700 mb-2">
                                Rejection Reason <span className='text-red-500'>*</span>
                            </label>
                            <textarea
                                id="rejection-reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Please provide a reason for rejecting this booking..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                rows="4"
                                data-testid="rejection-reason-input"
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={handleRejectCancel}
                                disabled={rejecting}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                data-testid="cancel-reject-btn"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectConfirm}
                                disabled={rejecting || !rejectionReason.trim()}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                data-testid="confirm-reject-btn"
                            >
                                {rejecting ? 'Rejecting...' : 'Confirm Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfficeStaffDashboard;
