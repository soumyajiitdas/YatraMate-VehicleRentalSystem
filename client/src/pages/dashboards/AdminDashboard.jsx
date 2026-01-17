import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { API_ENDPOINTS } from '../../config/api';
import CustomDropdown from '../../components/common/CustomDropdown';
import { MapPinned, ChevronDown, ChevronUp } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('customers');
    const [users, setUsers] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [packages, setPackages] = useState([]);
    const [vehicleRequests, setVehicleRequests] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');       // 'user', 'vendor', 'package'
    const [editingItem, setEditingItem] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showVerifyVendorConfirm, setShowVerifyVendorConfirm] = useState(false);
    const [vendorToVerify, setVendorToVerify] = useState(null);

    useEffect(() => {
        if (authLoading) {
            return;
        }
        // Check if user is authenticated and is admin
        if (!isAuthenticated || !user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, [activeTab, navigate, isAuthenticated, user, authLoading]);

    const fetchData = async () => {
        try {
            setLoading(true);

            if (activeTab === 'customers' || activeTab === 'office-staff') {
                const response = await fetch(API_ENDPOINTS.users, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setUsers(data.data.users);
                }
            } else if (activeTab === 'vendors') {
                const response = await fetch(API_ENDPOINTS.vendors, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setVendors(data.data.vendors);
                }
            } else if (activeTab === 'packages') {
                const response = await fetch(API_ENDPOINTS.packages, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setPackages(data.data.packages);
                }
            } else if (activeTab === 'vehicle-requests') {
                // Fetch both vehicle requests and all vehicles for feature management
                const requestsResponse = await fetch(API_ENDPOINTS.vehicleRequests, {
                    credentials: 'include'
                });
                const requestsData = await requestsResponse.json();
                if (requestsData.status === 'success') {
                    setVehicleRequests(requestsData.data.requests);
                }

                const vehiclesResponse = await fetch(API_ENDPOINTS.vehicles, {
                    credentials: 'include'
                });
                const vehiclesData = await vehiclesResponse.json();
                if (vehiclesData.status === 'success') {
                    setVehicles(vehiclesData.data.vehicles);
                }
            } else if (activeTab === 'bookings-payments') {
                const response = await fetch(API_ENDPOINTS.bookings, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setBookings(data.data.bookings);
                }
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const getFilteredUsers = () => {
        if (activeTab === 'customers') {
            return users.filter(user => user.role === 'user');
        } else if (activeTab === 'office-staff') {
            return users.filter(user => user.role === 'office_staff');
        } else if (activeTab === 'vendors') {
            return users.filter(user => user.role === 'vendor');
        }
        return [];
    };

    const handleCreate = () => {
        setEditingItem(null);
        if (activeTab === 'packages') {
            setModalType('package');
        } else {
            setModalType('user');
        }
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        if (activeTab === 'packages') {
            setModalType('package');
        } else if (activeTab === 'vendors') {
            // Find the vendor details
            const vendorDetails = vendors.find(v => v.user_id === item._id);
            setEditingItem({ ...item, vendorDetails });
            setModalType('vendor');
        } else {
            setModalType('user');
        }
        setShowModal(true);
    };

    const handleDelete = (item) => {
        setDeleteTarget(item);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            let endpoint;
            if (activeTab === 'packages') {
                endpoint = `${API_ENDPOINTS.packageById(deleteTarget._id)}`;
            } else if (activeTab === 'vendors') {
                // Delete vendor directly
                endpoint = `${API_ENDPOINTS.vendorById(deleteTarget._id)}`;
            } else {
                endpoint = `${API_ENDPOINTS.users}/${deleteTarget._id}`;
            }

            const response = await fetch(endpoint, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setShowDeleteConfirm(false);
                setDeleteTarget(null);
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error('Failed to delete. Please try again.');
        }
    };

    const handleVerifyVendor = (vendor) => {
        setVendorToVerify(vendor);
        setShowVerifyVendorConfirm(true);
    };

    const confirmVerifyVendor = async () => {
        if (!vendorToVerify) return;
        
        try {
            const response = await fetch(API_ENDPOINTS.verifyVendor(vendorToVerify._id), {
                method: 'PATCH',
                credentials: 'include'
            });

            if (response.ok) {
                toast.success('Vendor verified successfully!');
                setShowVerifyVendorConfirm(false);
                setVendorToVerify(null);
                fetchData();
            }
        } catch (error) {
            console.error('Error verifying vendor:', error);
            toast.error('Failed to verify vendor. Please try again.');
        }
    };

    const handleViewVendorDetails = (vendor) => {
        setSelectedVendor(vendor);
        setShowVendorDetailsModal(true);
    };

    const handleViewRequestDetails = (request) => {
        setSelectedRequest(request);
        setShowRequestDetailsModal(true);
    };

    const handleApproveRequest = async (requestId) => {
        try {
            const response = await fetch(API_ENDPOINTS.approveVehicleRequest(requestId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({})
            });

            if (response.ok) {
                toast.success('Vehicle request approved successfully!');
                setShowRequestDetailsModal(false);
                fetchData();
            }
        } catch (error) {
            console.error('Error approving request:', error);
            toast.error('Failed to approve request. Please try again.');
        }
    };

    const handleRejectRequest = async (requestId) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const response = await fetch(API_ENDPOINTS.rejectVehicleRequest(requestId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ rejection_reason: reason })
            });

            if (response.ok) {
                toast.success('Vehicle request rejected.');
                setShowRequestDetailsModal(false);
                fetchData();
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            toast.error('Failed to reject request. Please try again.');
        }
    };

    const handleToggleFeature = async (vehicleId) => {
        try {
            const response = await fetch(API_ENDPOINTS.toggleFeatureVehicle(vehicleId), {
                method: 'PATCH',
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                toast.success('Vehicle feature status updated successfully!');
                fetchData();
            } else {
                toast.error(data.message || 'Failed to toggle feature status. Please try again.');
            }
        } catch (error) {
            console.error('Error toggling feature:', error);
            toast.error('Failed to toggle feature status. Please try again.');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50 py-4 md:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    {/* Mobile and Desktop Layout */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                        <div className="flex items-center justify-between md:justify-start mb-6">
                            <div className="flex items-center space-x-2 group">
                                <div className="bg-linear-to-r from-primary-500 to-secondary-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
                                    <MapPinned className='w-6 h-6 text-white' />
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
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Admin <span className='text-red-600'>Dashboard</span></h1>
                            <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600">Manage users, vendors, and packages</p>
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

                {/* Tabs - Horizontal on Mobile, Vertical on Desktop */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Mobile Horizontal Tabs */}
                    <div className="md:hidden bg-white border border-primary-200 rounded-lg shadow-sm overflow-x-auto">
                        <nav className="flex -mb-px min-w-max">
                            <button
                                onClick={() => setActiveTab('customers')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'customers'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-customers"
                            >
                                Customers
                            </button>
                            <button
                                onClick={() => setActiveTab('office-staff')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'office-staff'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-office-staff"
                            >
                                Office Staff
                            </button>
                            <button
                                onClick={() => setActiveTab('vendors')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'vendors'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-vendors"
                            >
                                Vendors
                            </button>
                            <button
                                onClick={() => setActiveTab('packages')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'packages'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-packages"
                            >
                                Packages
                            </button>
                            <button
                                onClick={() => setActiveTab('vehicle-requests')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'vehicle-requests'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-vehicle-requests"
                            >
                                Vehicle Requests
                            </button>
                            <button
                                onClick={() => setActiveTab('bookings-payments')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'bookings-payments'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-bookings-payments"
                            >
                                Bookings & Payments
                            </button>
                        </nav>
                    </div>

                    {/* Desktop Vertical Sidebar */}
                    <aside className="hidden md:block md:w-60 shrink-0">
                        <div className="bg-white border border-primary-200 rounded-lg shadow-sm overflow-hidden sticky top-4">
                            <nav className="flex flex-col">
                                <button
                                    onClick={() => setActiveTab('customers')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'customers'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-customers"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Customers
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('office-staff')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'office-staff'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-office-staff"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Office Staff
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('vendors')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'vendors'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-vendors"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Vendors
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('packages')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'packages'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-packages"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        Packages
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('vehicle-requests')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'vehicle-requests'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-vehicle-requests"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Vehicle Requests
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('bookings-payments')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'bookings-payments'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-bookings-payments"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                        Bookings & Payments
                                    </div>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* Action Button */}
                        {(activeTab === 'office-staff' || activeTab === 'packages') && (
                            <div className="mb-6">
                                <button
                                    onClick={handleCreate}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                                    data-testid="add-button"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    {activeTab === 'office-staff' ? 'Add Office Staff' : 'Create Package'}
                                </button>
                            </div>
                        )}

                        {/* Content */}
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                            </div>
                        ) : (
                            <>
                                {/* Users Table (Customers, Office Staff) */}
                                {(activeTab === 'customers' || activeTab === 'office-staff') && (
                                    <UsersTable
                                        users={getFilteredUsers()}
                                        vendors={[]}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        type={activeTab}
                                        onViewVendorDetails={handleViewVendorDetails}
                                        onVerifyVendor={handleVerifyVendor}
                                    />
                                )}

                                {/* Vendors Table */}
                                {activeTab === 'vendors' && (
                                    <VendorsTable
                                        vendors={vendors}
                                        onViewVendorDetails={handleViewVendorDetails}
                                        onVerifyVendor={handleVerifyVendor}
                                        onDelete={handleDelete}
                                    />
                                )}

                                {/* Packages Table */}
                                {activeTab === 'packages' && (
                                    <PackagesTable
                                        packages={packages}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                )}

                                {/* Vehicle Requests Table */}
                                {activeTab === 'vehicle-requests' && (
                                    <VehicleRequestsTable
                                        requests={vehicleRequests}
                                        vehicles={vehicles}
                                        onViewDetails={handleViewRequestDetails}
                                        onToggleFeature={handleToggleFeature}
                                    />
                                )}

                                {/* Bookings & Payments Table */}
                                {activeTab === 'bookings-payments' && (
                                    <BookingsPaymentsTable
                                        bookings={bookings}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <Modal
                    type={modalType}
                    item={editingItem}
                    onClose={() => {
                        setShowModal(false);
                        setEditingItem(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setEditingItem(null);
                        fetchData();
                    }}
                    userRole={activeTab === 'office-staff' ? 'office_staff' : activeTab === 'vendors' ? 'vendor' : 'user'}
                />
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <DeleteConfirmModal
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setShowDeleteConfirm(false);
                        setDeleteTarget(null);
                    }}
                />
            )}

            {/* Vendor Details Modal */}
            {showVendorDetailsModal && selectedVendor && (
                <VendorDetailsModal
                    vendor={selectedVendor}
                    onClose={() => setShowVendorDetailsModal(false)}
                />
            )}

            {/* Vehicle Request Details Modal */}
            {showRequestDetailsModal && selectedRequest && (
                <VehicleRequestDetailsModal
                    request={selectedRequest}
                    onClose={() => setShowRequestDetailsModal(false)}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                />
            )}

            {/* Vendor Verification Confirmation Modal */}
            {showVerifyVendorConfirm && vendorToVerify && (
                <VendorVerifyConfirmModal
                    vendor={vendorToVerify}
                    onConfirm={confirmVerifyVendor}
                    onCancel={() => {
                        setShowVerifyVendorConfirm(false);
                        setVendorToVerify(null);
                    }}
                />
            )}
        </div>
    );
};

// Users Table Component
const UsersTable = ({ users, vendors, onEdit, onDelete, type, onViewVendorDetails, onVerifyVendor }) => {
    if (users.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
                <p className="text-red-500">No {type} found.</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            {type === 'vendors' && (
                                <>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => {
                            const vendorDetails = type === 'vendors' ? vendors.find(v => v.email === user.email) : null;
                            return (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{user.phone || 'N/A'}</div>
                                    </td>
                                    {type === 'vendors' && (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{vendorDetails?.company_name || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vendorDetails?.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {vendorDetails?.is_verified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                        </>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(user.date_joined).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {type === 'vendors' && vendorDetails && (
                                            <>
                                                <button
                                                    onClick={() => onViewVendorDetails(vendorDetails)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    View
                                                </button>
                                                {!vendorDetails.is_verified && (
                                                    <button
                                                        onClick={() => onVerifyVendor(vendorDetails)}
                                                        className="text-green-600 hover:text-green-900"
                                                        data-testid="verify-vendor-btn"
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        <button
                                            onClick={() => onEdit(user)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(user)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {users.map((user) => {
                    const vendorDetails = type === 'vendors' ? vendors.find(v => v.email === user.email) : null;
                    return (
                        <div key={user._id} className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                                {type === 'vendors' && vendorDetails && (
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${vendorDetails.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {vendorDetails.is_verified ? 'Verified' : 'Pending'}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Phone:</span>
                                    <span className="text-gray-900">{user.phone || 'N/A'}</span>
                                </div>
                                {type === 'vendors' && vendorDetails && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Company:</span>
                                        <span className="text-gray-900">{vendorDetails.company_name || 'N/A'}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Joined:</span>
                                    <span className="text-gray-900">{new Date(user.date_joined).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
                                {type === 'vendors' && vendorDetails && (
                                    <>
                                        <button
                                            onClick={() => onViewVendorDetails(vendorDetails)}
                                            className="px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                                        >
                                            View
                                        </button>
                                        {!vendorDetails.is_verified && (
                                            <button
                                                onClick={() => onVerifyVendor(vendorDetails)}
                                                className="px-3 py-1.5 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
                                                data-testid="verify-vendor-btn-mobile"
                                            >
                                                Verify
                                            </button>
                                        )}
                                    </>
                                )}
                                <button
                                    onClick={() => onEdit(user)}
                                    className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(user)}
                                    className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

// Vendors Table Component
const VendorsTable = ({ vendors, onViewVendorDetails, onVerifyVendor, onDelete }) => {
    if (vendors.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
                <p className="text-red-500">No vendors found.</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-primary-200 rounded-lg shadow-sm overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vendors.map((vendor) => (
                            <tr key={vendor._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                                    <div className="text-sm text-gray-600">{vendor.company_name || 'Individual'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{vendor.contact_number}</div>
                                    <div className="text-sm text-gray-600">{vendor.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 capitalize">{vendor.id_type?.replace('_', ' ')}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {vendor.is_verified ? 'Verified' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(vendor.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => onViewVendorDetails(vendor)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        View
                                    </button>
                                    {!vendor.is_verified && (
                                        <button
                                            onClick={() => onVerifyVendor(vendor)}
                                            className="text-green-600 hover:text-green-900"
                                            data-testid="verify-vendor-table-btn"
                                        >
                                            Verify
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onDelete(vendor)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {vendors.map((vendor) => (
                    <div key={vendor._id} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                                <p className="text-sm text-gray-600">{vendor.company_name || 'N/A'}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${vendor.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {vendor.is_verified ? 'Verified' : 'Pending'}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Email:</span>
                                <span className="text-gray-900 truncate ml-2">{vendor.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Contact:</span>
                                <span className="text-gray-900">{vendor.contact_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">ID Type:</span>
                                <span className="text-gray-900 capitalize">{vendor.id_type?.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Joined:</span>
                                <span className="text-gray-900">{new Date(vendor.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
                            <button
                                onClick={() => onViewVendorDetails(vendor)}
                                className="px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                            >
                                View
                            </button>
                            {!vendor.is_verified && (
                                <button
                                    onClick={() => onVerifyVendor(vendor)}
                                    className="px-3 py-1.5 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
                                    data-testid="verify-vendor-card-btn"
                                >
                                    Verify
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(vendor)}
                                className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};


// Packages Table Component
const PackagesTable = ({ packages, onEdit, onDelete }) => {
    if (packages.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
                <p className="text-red-500">No packages found.</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CC Range</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Hour</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/KM</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {packages.map((pkg) => (
                            <tr key={pkg._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 capitalize">{pkg.vehicle_type}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{pkg.cc_range_min} - {pkg.cc_range_max} cc</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">₹{pkg.price_per_hour}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">₹{pkg.price_per_km}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {pkg.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => onEdit(pkg)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(pkg)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {packages.map((pkg) => (
                    <div key={pkg._id} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                                <p className="text-sm text-gray-600 capitalize">{pkg.vehicle_type}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {pkg.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">CC Range:</span>
                                <span className="text-gray-900">{pkg.cc_range_min} - {pkg.cc_range_max} cc</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Price/Hour:</span>
                                <span className="text-gray-900 font-semibold">₹{pkg.price_per_hour}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Price/KM:</span>
                                <span className="text-gray-900 font-semibold">₹{pkg.price_per_km}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-3 border-t">
                            <button
                                onClick={() => onEdit(pkg)}
                                className="flex-1 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(pkg)}
                                className="flex-1 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

// Modal Component
const Modal = ({ type, item, onClose, onSuccess, userRole }) => {
    const [formData, setFormData] = useState(
        type === 'package' && item
            ? {
                name: item.name,
                cc_range_min: item.cc_range_min,
                cc_range_max: item.cc_range_max,
                price_per_hour: item.price_per_hour,
                price_per_km: item.price_per_km,
                vehicle_type: item.vehicle_type,
                description: item.description || '',
                is_active: item.is_active
            }
            : type === 'vendor' && item
                ? {
                    name: item.name,
                    email: item.email,
                    password_hash: item.password_hash,
                    phone: item.phone || '',
                    address: item.address || '',
                    role: 'vendor',
                    company_name: item.vendorDetails?.company_name || '',
                    vendor_name: item.vendorDetails?.vendor_name || item.name,
                    contact_number: item.vendorDetails?.contact_number || item.phone || '',
                    vendor_email: item.vendorDetails?.email || item.email,
                    vendor_address: item.vendorDetails?.address || item.address || '',
                    is_verified: item.vendorDetails?.is_verified || false
                }
                : item
                    ? {
                        name: item.name,
                        email: item.email,
                        password_hash: item.password_hash,
                        phone: item.phone || '',
                        address: item.address || '',
                        role: item.role,
                        is_active: item.is_active
                    }
                    : {
                        name: '',
                        email: '',
                        password_hash: '',
                        phone: '',
                        address: '',
                        role: userRole,
                        is_active: true,
                        ...(type === 'package' && {
                            cc_range_min: 0,
                            cc_range_max: 0,
                            price_per_hour: 0,
                            price_per_km: 0,
                            vehicle_type: 'bike',
                            description: ''
                        })
                    }
    );

    const handlePhoneChange = (e, fieldName) => {
        const value = e.target.value;
        // Remove any non-digit characters
        const digitsOnly = value.replace(/[^\d]/g, '');
        // Ensure +91 prefix is always present and limit to 10 digits
        if (digitsOnly.length <= 10) {
            setFormData({ ...formData, [fieldName]: digitsOnly ? `+91${digitsOnly}` : '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let endpoint, method, body;

            if (type === 'package') {
                endpoint = item ? `${API_ENDPOINTS.packageById(item._id)}` : API_ENDPOINTS.packages;
                method = item ? 'PATCH' : 'POST';
                body = {
                    name: formData.name,
                    cc_range_min: parseInt(formData.cc_range_min),
                    cc_range_max: parseInt(formData.cc_range_max),
                    price_per_hour: parseFloat(formData.price_per_hour),
                    price_per_km: parseFloat(formData.price_per_km),
                    vehicle_type: formData.vehicle_type,
                    description: formData.description,
                    is_active: formData.is_active
                };
            } else {
                endpoint = item ? `${API_ENDPOINTS.users}/${item._id}` : API_ENDPOINTS.users;
                method = item ? 'PATCH' : 'POST';
                body = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    role: formData.role,
                    is_active: formData.is_active
                };

                // Only include password if it's provided (for create or update)
                if (formData.password_hash) {
                    body.password = formData.password_hash;
                }
            }

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.status === 'success') {
                // If creating/updating vendor, also handle vendor details
                if (type === 'vendor') {
                    const userId = item ? item._id : data.data.user._id;
                    const vendorBody = {
                        user_id: userId,
                        company_name: formData.company_name,
                        vendor_name: formData.vendor_name,
                        contact_number: formData.contact_number,
                        email: formData.vendor_email,
                        address: formData.vendor_address,
                        is_verified: formData.is_verified
                    };

                    if (item?.vendorDetails) {
                        // Update existing vendor
                        await fetch(`${API_ENDPOINTS.vendorById(item.vendorDetails._id)}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify(vendorBody),
                        });
                    } else {
                        // Create new vendor
                        await fetch(API_ENDPOINTS.vendors, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify(vendorBody),
                        });
                    }
                }
                onSuccess();
            } else {
                toast.error('Error: ' + (data.message || 'Failed to save'));
            }
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Failed to save. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-150 p-2 md:p-4">
            <div className="bg-white border-2 border-primary-200 rounded-xl max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
                <div className="p-4 md:p-6">
                    <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-4 md:mb-6">
                        {item ? 'Edit' : 'Create'} {type === 'package' ? 'Package' : type === 'vendor' ? 'Vendor' : 'Office Staff'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {type === 'package' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <CustomDropdown
                                        label={<span>Vehicle <span className='text-red-500'>*</span></span>}
                                        options={[
                                            { value: 'bike', label: 'Bike' },
                                            { value: 'car', label: 'Car' }
                                        ]}
                                        value={formData.vehicle_type}
                                        onChange={(val) => setFormData({ ...formData, vehicle_type: val })}
                                    />

                                    <CustomDropdown
                                        label={<span>Status <span className='text-red-500'>*</span></span>}
                                        options={[
                                            { value: 'true', label: 'Active' },
                                            { value: 'false', label: 'Inactive' }
                                        ]}
                                        value={String(formData.is_active)}
                                        onChange={(val) => setFormData({ ...formData, is_active: val === 'true' })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Min CC</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.cc_range_min}
                                            onChange={(e) => setFormData({ ...formData, cc_range_min: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Max CC</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.cc_range_max}
                                            onChange={(e) => setFormData({ ...formData, cc_range_max: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price per Hour (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.price_per_hour}
                                            onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price per KM (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.price_per_km}
                                            onChange={(e) => setFormData({ ...formData, price_per_km: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <input
                                            type="text"
                                            required={!item}
                                            value={formData.password_hash}
                                            onChange={(e) => setFormData({ ...formData, password_hash: e.target.value })}
                                            placeholder={item ? "Leave blank to keep current" : ""}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <span className="text-gray-700 font-medium">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                value={formData.phone.replace('+91', '')}
                                                onChange={(e) => handlePhoneChange(e, 'phone')}
                                                className="w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                placeholder="0000000000"
                                                maxLength="10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <CustomDropdown
                                            options={[
                                                { value: 'true', label: 'Active' },
                                                { value: 'false', label: 'Inactive' }
                                            ]}
                                            value={String(formData.is_active)}
                                            onChange={(val) => setFormData({ ...formData, is_active: val === 'true' })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>

                                {type === 'vendor' && (
                                    <>
                                        <div className="border-t pt-4 mt-4">
                                            <h3 className="text-lg font-semibold text-red-600 mb-4">Vendor Details</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.company_name}
                                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.vendor_name}
                                                        onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                            <span className="text-gray-700 font-medium">+91</span>
                                                        </div>
                                                        <input
                                                            type="tel"
                                                            required
                                                            value={formData.contact_number.replace('+91', '')}
                                                            onChange={(e) => handlePhoneChange(e, 'contact_number')}
                                                            className="w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                            placeholder="9876543210"
                                                            maxLength="10"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                                                    <CustomDropdown
                                                        options={[
                                                            { value: 'true', label: 'Verified' },
                                                            { value: 'false', label: 'Not Verified' }
                                                        ]}
                                                        value={String(formData.is_verified)}
                                                        onChange={(val) => setFormData({ ...formData, is_verified: val === 'true' })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                {item ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 backdrop-blur-md border-2 border-primary-200 bg-opacity-50 flex items-center justify-center z-150 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-red-600 mb-4">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// Vehicle Requests Table Component
const VehicleRequestsTable = ({ requests, vehicles, onViewDetails, onToggleFeature }) => {
    // Calculate featured count
    const featuredCount = vehicles.filter(v => v.is_featured).length;
    const maxFeatured = 3;
    const canAddMore = featuredCount < maxFeatured;

    // Helper function to get vehicle info for approved request
    const getVehicleForRequest = (request) => {
        if (request.status !== 'approved') return null;
        return vehicles.find(v => v.registration_number === request.registration_number);
    };

    if (requests.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
                <p className="text-red-500">No vehicle requests found.</p>
            </div>
        );
    }

    return (
        <>
            {/* Featured Count Badge */}
            <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-blue-900">Featured Vehicles: {featuredCount}/{maxFeatured}</span>
                </div>
                {!canAddMore && (
                    <span className="text-sm text-blue-700">Maximum featured vehicles reached</span>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {requests.map((request) => {
                            const vehicle = getVehicleForRequest(request);
                            const isFeatured = vehicle?.is_featured || false;
                            const canToggle = request.status === 'approved' && vehicle && (isFeatured || canAddMore);

                            return (
                                <tr key={request._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{request.name}</div>
                                        <div className="text-sm text-gray-500">{request.model_name}, {request.type}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{request.vendor_id?.name || 'N/A'}</div>
                                        <div className="text-sm text-gray-500">{request.vendor_id?.email || ''}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{request.registration_number}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => onViewDetails(request)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            View
                                        </button>
                                        {request.status === 'approved' && vehicle && (
                                            <button
                                                onClick={() => onToggleFeature(vehicle._id)}
                                                disabled={!canToggle}
                                                className={`${canToggle
                                                    ? isFeatured
                                                        ? 'text-orange-600 hover:text-orange-900'
                                                        : 'text-green-600 hover:text-green-900'
                                                    : 'text-gray-400 cursor-not-allowed'
                                                    }`}
                                                title={!canToggle && !isFeatured ? 'Maximum featured vehicles reached' : ''}
                                            >
                                                {isFeatured ? 'Unfeature' : 'Feature'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {requests.map((request) => {
                    const vehicle = getVehicleForRequest(request);
                    const isFeatured = vehicle?.is_featured || false;
                    const canToggle = request.status === 'approved' && vehicle && (isFeatured || canAddMore);

                    return (
                        <div key={request._id} className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{request.name}</h3>
                                    <p className="text-sm text-gray-600">{request.model_name}</p>
                                </div>
                                <div className="flex flex-col items-end space-y-1">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {request.status}
                                    </span>
                                    {request.status === 'approved' && vehicle && isFeatured && (
                                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            Featured
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Vendor:</span>
                                    <span className="text-gray-900">{request.vendor_id?.name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Type:</span>
                                    <span className="text-gray-900 capitalize">{request.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Registration:</span>
                                    <span className="text-gray-900">{request.registration_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Submitted:</span>
                                    <span className="text-gray-900">{new Date(request.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-3 border-t">
                                <button
                                    onClick={() => onViewDetails(request)}
                                    className="flex-1 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                >
                                    View Details
                                </button>
                                {request.status === 'approved' && vehicle && (
                                    <button
                                        onClick={() => onToggleFeature(vehicle._id)}
                                        disabled={!canToggle}
                                        className={`flex-1 px-3 py-2 text-sm rounded-lg ${canToggle
                                            ? isFeatured
                                                ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                                                : 'text-green-600 bg-green-50 hover:bg-green-100'
                                            : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                            }`}
                                    >
                                        {isFeatured ? 'Unfeature' : 'Feature'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

// Vendor Details Modal
const VendorDetailsModal = ({ vendor, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-150 p-4">
            <div className="bg-white border-2 border-primary-200 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-red-600">Vendor Details</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Name</label>
                                <p className="mt-1 text-gray-900">{vendor.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="mt-1 text-gray-900">{vendor.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Company Name</label>
                                <p className="mt-1 text-gray-900">{vendor.company_name || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Contact Number</label>
                                <p className="mt-1 text-gray-900">{vendor.contact_number}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">ID Type</label>
                                <p className="mt-1 text-gray-900 capitalize">{vendor.id_type?.replace('_', ' ')}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Verification Status</label>
                                <p className="mt-1">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {vendor.is_verified ? 'Verified' : 'Pending'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500">Address</label>
                            <p className="mt-1 text-gray-900">{vendor.address}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500 mb-2 block">Uploaded Document</label>
                            {vendor.document_url ? (
                                <a
                                    href={vendor.document_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    View Document
                                </a>
                            ) : (
                                <p className="text-gray-500">No document uploaded</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Vehicle Request Details Modal
const VehicleRequestDetailsModal = ({ request, onClose, onApprove, onReject }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-150 p-4">
            <div className="bg-white border-2 border-primary-200 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-red-600">Vehicle Request Details</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Vendor Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-blue-900 mb-2">Vendor Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p><span className="font-medium">Name:</span> {request.vendor_id?.name || 'N/A'}</p>
                            <p><span className="font-medium">Email:</span> {request.vendor_id?.email || 'N/A'}</p>
                            <p><span className="font-medium">Company:</span> {request.vendor_id?.company_name || 'N/A'}</p>
                            <p><span className="font-medium">Contact:</span> {request.vendor_id?.contact_number || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="space-y-4 mb-6">
                        <h3 className="font-semibold text-gray-900 text-lg">Vehicle Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Vehicle Name</label>
                                <p className="mt-1 text-gray-900">{request.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Model Name</label>
                                <p className="mt-1 text-gray-900">{request.model_name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Type</label>
                                <p className="mt-1 text-gray-900 capitalize">{request.type}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Brand</label>
                                <p className="mt-1 text-gray-900">{request.brand}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Registration Number</label>
                                <p className="mt-1 text-gray-900">{request.registration_number}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Engine Number</label>
                                <p className="mt-1 text-gray-900">{request.engine_number}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Chassis Number</label>
                                <p className="mt-1 text-gray-900">{request.chassis_number}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Engine CC</label>
                                <p className="mt-1 text-gray-900">{request.cc_engine}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Location</label>
                                <p className="mt-1 text-gray-900">{request.location}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Status</label>
                                <p className="mt-1">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {request.status}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="space-y-4 mb-6">
                        <h3 className="font-semibold text-gray-900 text-lg">Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 block mb-2">RC Document</label>
                                <a
                                    href={request.rc_document}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                                >
                                    View RC Document
                                </a>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 block mb-2">Insurance Document</label>
                                <a
                                    href={request.insurance_document}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                                >
                                    View Insurance Document
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Images */}
                    <div className="space-y-4 mb-6">
                        <h3 className="font-semibold text-gray-900 text-lg">Vehicle Images</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {request.vehicle_images?.map((image, index) => (
                                <a
                                    key={index}
                                    href={image}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <img
                                        src={image}
                                        alt={`Vehicle ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border border-gray-300 hover:border-red-500 transition-colors"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                        {request.status === 'pending' && (
                            <>
                                <button
                                    onClick={() => onReject(request._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => onApprove(request._id)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Approve
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Vendor Verification Confirmation Modal
const VendorVerifyConfirmModal = ({ vendor, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-150 p-4">
            <div className="bg-white border-2 border-primary-200 rounded-xl max-w-md w-full shadow-2xl">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Verify Vendor</h2>
                    <p className="text-gray-600 mb-6 text-center">
                        Are you sure you want to verify this vendor? This action cannot be undone.
                    </p>
                    {vendor && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-1">Vendor:</p>
                            <p className="font-semibold text-gray-900">{vendor.name || vendor.vendor_name}</p>
                            {vendor.company_name && (
                                <p className="text-sm text-gray-600 mt-1">{vendor.company_name}</p>
                            )}
                        </div>
                    )}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            data-testid="cancel-verify-vendor-btn"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            data-testid="confirm-verify-vendor-btn"
                        >
                            Verify
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Bookings & Payments Table Component
const BookingsPaymentsTable = ({ bookings }) => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedCards, setExpandedCards] = useState({});

    const toggleCardExpansion = (bookingId) => {
        setExpandedCards(prev => ({
            ...prev,
            [bookingId]: !prev[bookingId]
        }));
    };

    const filteredBookings = statusFilter === 'all' 
        ? bookings 
        : bookings.filter(booking => booking.status === statusFilter);

    if (bookings.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
                <p className="text-red-500">No bookings found.</p>
            </div>
        );
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'booking_requested':
                return 'bg-yellow-100 text-yellow-800';
            case 'picked_up':
                return 'bg-blue-100 text-blue-800';
            case 'returned':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-4">
            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        data-testid="status-filter"
                    >
                        <option value="all">All Bookings</option>
                        <option value="booking_requested">Booking Requested</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="returned">Returned</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <span className="text-sm text-gray-500">
                        Showing {filteredBookings.length} of {bookings.length} bookings
                    </span>
                </div>
            </div>

            {/* Collapsible Cards */}
            <div className="space-y-4">
                {filteredBookings.map((booking) => (
                    <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6" data-testid="booking-card">
                        {/* Card Header - Always Visible */}
                        <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleCardExpansion(booking._id)}
                            data-testid={`toggle-card-${booking._id}`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 flex-1">
                                <h4 className="text-base md:text-lg font-semibold text-gray-900">
                                    {booking.user_id?.name || 'N/A'} - <span className='font-light'>{booking.user_id?.email || 'N/A'}</span>
                                </h4>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                    {booking.status?.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                            <button 
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2"
                                aria-label={expandedCards[booking._id] ? "Collapse details" : "Expand details"}
                            >
                                {expandedCards[booking._id] ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>
                        </div>

                        {/* Collapsed Summary - Visible when not expanded */}
                        {!expandedCards[booking._id] && (
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                <span className="font-medium text-gray-900">{booking.vehicle_id?.name || 'N/A'} - {booking.vehicle_id?.model_name || 'N/A'}</span>
                                <span>•</span>
                                <span>Vendor: <span className="font-medium text-gray-900">{booking.vendor_id?.name || 'N/A'}</span></span>
                                {booking.bill_id && (
                                    <>
                                        <span>•</span>
                                        <span>Bill: <span className="font-medium text-blue-600">{booking.bill_id}</span></span>
                                    </>
                                )}
                                {booking.final_cost && (
                                    <>
                                        <span>•</span>
                                        <span>Total: <span className="font-medium text-green-600">₹{booking.final_cost.toFixed(2)}</span></span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Expandable Content - Full Details */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCards[booking._id] ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                            <div className="border-t border-gray-200 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                    {/* Booking Reference */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Booking Reference</p>
                                        <p className="font-bold text-blue-600 text-lg">{booking.bill_id || 'Pending'}</p>
                                        <p className="text-xs text-gray-500 mt-1">ID: {booking._id?.slice(-12)}</p>
                                    </div>

                                    {/* Customer Information */}
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Customer Information</p>
                                        <p className="font-semibold text-gray-900">{booking.user_id?.name || 'N/A'}</p>
                                        <p className="text-gray-600 text-xs mt-1">{booking.user_id?.email || 'N/A'}</p>
                                        <p className="text-gray-600 text-xs">{booking.user_id?.phone || 'N/A'}</p>
                                    </div>

                                    {/* Vendor Information */}
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Vendor Information</p>
                                        <p className="font-semibold text-gray-900">{booking.vendor_id?.name || 'N/A'}</p>
                                        <p className="text-gray-600 text-xs mt-1">{booking.vendor_id?.email || 'N/A'}</p>
                                        <p className="text-gray-600 text-xs">{booking.vendor_id?.contact_number || 'N/A'}</p>
                                    </div>

                                    {/* Vehicle Details */}
                                    <div className="bg-yellow-50 p-3 rounded-lg">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Vehicle Details</p>
                                        <p className="font-semibold text-gray-900">{booking.vehicle_id?.name || 'N/A'}</p>
                                        <p className="text-gray-600 text-xs mt-1">Model: {booking.vehicle_id?.model_name || 'N/A'}</p>
                                        <p className="text-gray-600 text-xs">Reg: {booking.vehicle_id?.registration_number || 'N/A'}</p>
                                        <p className="text-gray-600 text-xs">Type: {booking.vehicle_id?.type || 'N/A'} - {booking.vehicle_id?.cc_engine || 'N/A'}cc</p>
                                    </div>

                                    {/* Advance Payment */}
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Adv. Payment <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${getPaymentStatusBadge(booking.advance_payment?.status)}`}>
                                            {booking.advance_payment?.status || 'pending'}
                                        </span></p>
                                        <p className="font-bold text-green-700 text-lg">₹{booking.advance_payment?.amount || 0}</p>
                                        <p className="text-gray-600 text-xs mt-1">
                                            Transaction ID: <span className="font-mono">{booking.advance_payment?.razorpay_payment_id || 'N/A'}</span>
                                        </p>
                                        {booking.advance_payment?.paid_at && (
                                            <p className="text-gray-600 text-xs mt-1">Paid: {formatDateTime(booking.advance_payment.paid_at)}</p>
                                        )}
                                    </div>

                                    {/* Final Payment */}
                                    <div className="bg-orange-50 p-3 rounded-lg">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Final Payment <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${getPaymentStatusBadge(booking.final_payment?.status)}`}>
                                            {booking.final_payment?.status || 'pending'}
                                        </span></p>
                                        <p className="font-bold text-orange-700 text-lg">₹{booking.final_payment?.amount || 0}</p>
                                        <p className="text-gray-600 text-xs mt-1">
                                            Transaction ID: <span className="font-mono">{booking.final_payment?.razorpay_payment_id || (booking.final_payment?.method === 'cash' ? 'Cash Payment' : 'N/A')}</span>
                                        </p>
                                        <p className="text-gray-600 text-xs">
                                            Mode: <span className="font-semibold uppercase">{booking.final_payment?.method || 'N/A'}</span>
                                        </p>
                                        {booking.final_payment?.paid_at && (
                                            <p className="text-gray-600 text-xs mt-1">Paid: {formatDateTime(booking.final_payment.paid_at)}</p>
                                        )}
                                    </div>

                                    {/* Total Amount */}
                                    <div className="bg-indigo-50 p-3 rounded-lg border-2 border-indigo-200">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Total Amount</p>
                                        <p className="font-bold text-indigo-700 text-2xl">₹{booking.final_cost || booking.estimated_cost || 0}</p>
                                        {booking.estimated_cost && !booking.final_cost && (
                                            <p className="text-xs text-gray-600 mt-1">(Estimated)</p>
                                        )}
                                    </div>

                                    {/* Dates - Booking Created */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Booking Created</p>
                                        <p className="font-medium text-gray-900">{formatDate(booking.createdAt)}</p>
                                        <p className="text-gray-600 text-xs">{new Date(booking.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>

                                    {/* Pickup Date */}
                                    {booking.pickup_details?.actual_pickup_date && (
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <p className="text-gray-500 text-xs font-medium uppercase mb-1">Pickup Date</p>
                                            <p className="font-medium text-gray-900">{formatDate(booking.pickup_details.actual_pickup_date)}, {booking.pickup_details.actual_pickup_time || 'N/A'}</p>
                                            {booking.pickup_details.staff_id && (
                                                <p className="text-gray-600 text-xs mt-1">Staff: {booking.pickup_details.staff_id.name}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Return Date */}
                                    {booking.return_details?.actual_return_date && (
                                        <div className="bg-green-50 p-3 rounded-lg">
                                            <p className="text-gray-500 text-xs font-medium uppercase mb-1">Return Date</p>
                                            <p className="font-medium text-gray-900">{formatDate(booking.return_details.actual_return_date)}, {booking.return_details.actual_return_time || 'N/A'}</p>
                                            {booking.return_details.staff_id && (
                                                <p className="text-gray-600 text-xs mt-1">Staff: {booking.return_details.staff_id.name}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Additional Info */}
                                    {booking.distance_traveled_km && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-gray-500 text-xs font-medium uppercase mb-1">Trip Details</p>
                                            <p className="text-gray-900">Distance: <span className="font-semibold">{booking.distance_traveled_km} km</span></p>
                                            <p className="text-gray-900">Duration: <span className="font-semibold">{booking.duration_hours} hours</span></p>
                                        </div>
                                    )}

                                    {/* Package Info */}
                                    {booking.package_id && (
                                        <div className="bg-yellow-50 p-3 rounded-lg">
                                            <p className="text-gray-500 text-xs font-medium uppercase mb-1">Package</p>
                                            <p className="font-semibold text-gray-900">{booking.package_id.name}</p>
                                            <p className="text-gray-600 text-xs">₹{booking.package_id.price_per_hour}/hr | ₹{booking.package_id.price_per_km}/km</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBookings.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-500">No bookings found for the selected filter.</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
