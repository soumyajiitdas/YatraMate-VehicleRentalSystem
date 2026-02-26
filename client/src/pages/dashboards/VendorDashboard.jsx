import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { API_ENDPOINTS, getAuthHeader } from '../../config/api';
import { MapPinned, Mail, Shield, Settings, LockKeyhole, Car, PiggyBank } from 'lucide-react';
import CustomDropdown from '../../components/common/CustomDropdown';

const VendorDashboard = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, loading: authLoading, requestPasswordChangeOTP, verifyPasswordChangeOTP, resendPasswordChangeOTP } = useAuth();
    const { toast } = useToast();
    const [vehicles, setVehicles] = useState([]);
    const [vendorInfo, setVendorInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [activeTab, setActiveTab] = useState('vehicles'); // 'vehicles', 'earnings', or 'settings'
    const [earnings, setEarnings] = useState([]);
    const [earningsFilter, setEarningsFilter] = useState('all');
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [earningsLoading, setEarningsLoading] = useState(false);

    // Password change states
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordChangeStep, setPasswordChangeStep] = useState('form'); // 'form', 'otp'
    const [otp, setOtp] = useState('');
    const [isRequestingOTP, setIsRequestingOTP] = useState(false);
    const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
    const [isResendingOTP, setIsResendingOTP] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        model_name: '',
        type: 'bike',
        brand: '',
        registration_number: '',
        engine_number: '',
        chassis_number: '',
        cc_engine: '',
        location: ''
    });

    const [files, setFiles] = useState({
        rc_document: null,
        insurance_document: null,
        vehicle_images: []
    });

    const [packageInfo, setPackageInfo] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (authLoading) {
            return;
        }
        // Check if user is authenticated and is vendor
        if (!isAuthenticated || !user || user.role !== 'vendor') {
            navigate('/login');
            return;
        }

        fetchVendorInfo(user.id);
        fetchVehicles(user.id);
    }, [navigate, isAuthenticated, user, authLoading]);

    useEffect(() => {
        if (activeTab === 'earnings' && user) {
            fetchEarnings(earningsFilter);
            // Fetch vehicles data if not already loaded
            if (vehicles.length === 0) {
                fetchVehicles(user.id);
            }
        }
    }, [activeTab, earningsFilter, user]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const fetchVendorInfo = async (vendorId) => {
        try {
            const response = await fetch(API_ENDPOINTS.vendorById(vendorId));
            const data = await response.json();
            if (data.status === 'success') {
                setVendorInfo(data.data.vendor);
            }
        } catch (error) {
            console.error('Error fetching vendor info:', error);
        }
    };

    const fetchVehicles = async (vendorId) => {
        try {
            setLoading(true);
            const response = await fetch(API_ENDPOINTS.vehiclesByVendor(vendorId));
            const data = await response.json();

            if (data.status === 'success') {
                setVehicles(data.data.vehicles);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEarnings = async (filter) => {
        try {
            setEarningsLoading(true);
            const url = filter === 'all' 
                ? API_ENDPOINTS.vendorEarnings 
                : `${API_ENDPOINTS.vendorEarnings}?filter=${filter}`;
            
            const response = await fetch(url, {
                credentials: 'include',
                headers: { ...getAuthHeader() }
            });
            const data = await response.json();

            if (data.status === 'success') {
                setEarnings(data.data.earnings);
                setTotalEarnings(data.data.totalEarnings);
            }
        } catch (error) {
            console.error('Error fetching earnings:', error);
            toast.error('Error fetching earnings');
        } finally {
            setEarningsLoading(false);
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Fetch package info when CC engine is entered
        if (name === 'cc_engine' && value) {
            try {
                const response = await fetch(`${API_ENDPOINTS.packageForVehicle}?cc=${value}&type=${formData.type}`);
                const data = await response.json();
                if (data.status === 'success' && data.data.package) {
                    setPackageInfo(data.data.package);
                } else {
                    setPackageInfo(null);
                }
            } catch (error) {
                console.error('Error fetching package:', error);
                setPackageInfo(null);
            }
        }
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;

        if (name === 'vehicle_images') {
            // Validate file count (max 5 images)
            if (selectedFiles.length > 5) {
                toast.warning('Maximum 5 images allowed');
                return;
            }

            // Validate file sizes
            const validFiles = Array.from(selectedFiles).filter(file => {
                if (file.size > 1024 * 1024) {
                    toast.warning(`${file.name} is larger than 1MB`);
                    return false;
                }
                return true;
            });

            setFiles(prev => ({ ...prev, vehicle_images: validFiles }));
        } else {
            // Single file validation
            const file = selectedFiles[0];
            if (file && file.size > 1024 * 1024) {
                toast.warning('File size must be less than 1MB');
                return;
            }
            setFiles(prev => ({ ...prev, [name]: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const vendorId = user?.id;

        // Validate files
        if (!files.rc_document || !files.insurance_document || files.vehicle_images.length === 0) {
            toast.warning('Please upload all required documents and at least one vehicle image');
            return;
        }

        if (files.vehicle_images.length < 5) {
            toast.warning('Please upload exactly 5 images (4 sides + interior)');
            return;
        }

        try {
            setUploading(true);

            // Upload RC document
            const rcFormData = new FormData();
            rcFormData.append('file', files.rc_document);
            const rcResponse = await fetch(API_ENDPOINTS.uploadFile, {
                method: 'POST',
                body: rcFormData
            });
            const rcData = await rcResponse.json();

            // Upload Insurance document
            const insuranceFormData = new FormData();
            insuranceFormData.append('file', files.insurance_document);
            const insuranceResponse = await fetch(API_ENDPOINTS.uploadFile, {
                method: 'POST',
                body: insuranceFormData
            });
            const insuranceData = await insuranceResponse.json();

            // Upload vehicle images
            const imagesFormData = new FormData();
            files.vehicle_images.forEach(file => {
                imagesFormData.append('files', file);
            });
            const imagesResponse = await fetch(API_ENDPOINTS.uploadFiles, {
                method: 'POST',
                body: imagesFormData
            });
            const imagesData = await imagesResponse.json();

            // Create vehicle request
            const response = await fetch(API_ENDPOINTS.vehicleRequests, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: formData.name,
                    model_name: formData.model_name,
                    type: formData.type,
                    brand: formData.brand,
                    registration_number: formData.registration_number,
                    engine_number: formData.engine_number,
                    chassis_number: formData.chassis_number,
                    cc_engine: parseInt(formData.cc_engine),
                    location: formData.location,
                    rc_document: rcData.data.url,
                    insurance_document: insuranceData.data.url,
                    vehicle_images: imagesData.data.files.map(f => f.url)
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                toast.success('Vehicle request submitted successfully! It will be reviewed by admin.');
                setShowAddForm(false);
                setFormData({
                    name: '',
                    model_name: '',
                    type: 'bike',
                    brand: '',
                    registration_number: '',
                    engine_number: '',
                    chassis_number: '',
                    cc_engine: '',
                    location: ''
                });
                setFiles({
                    rc_document: null,
                    insurance_document: null,
                    vehicle_images: []
                });
                setPackageInfo(null);
            } else {
                toast.error('Error submitting vehicle request: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            toast.error('Error submitting vehicle request: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (vehicleId) => {
        if (!window.confirm('Are you sure you want to delete this vehicle?')) {
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.vehicleById(vehicleId), {
                method: 'DELETE',
                headers: {
                    ...getAuthHeader()
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Vehicle deleted successfully!');
                fetchVehicles(user.id);
            } else {
                toast.error(data.message || 'Error deleting vehicle');
            }
        } catch (error) {
            toast.error('Error deleting vehicle: ' + error.message);
        }
    };

    // Password change handlers
    const handlePasswordChange = (e) => {
        setPasswordData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleRequestPasswordChangeOTP = async () => {
        if (!passwordData.currentPassword) {
            toast.warning('Please enter your current password');
            return;
        }

        if (!passwordData.newPassword) {
            toast.warning('Please enter your new password');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.warning('Password must be at least 6 characters');
            return;
        }

        setIsRequestingOTP(true);
        try {
            const result = await requestPasswordChangeOTP(passwordData.currentPassword);

            if (result.success) {
                toast.success('Verification OTP sent to your email!');
                setPasswordChangeStep('otp');
                setResendCooldown(60);
            } else {
                toast.error(result.message || 'Failed to send OTP');
            }
        } catch (error) {
            toast.error('Error sending OTP: ' + error.message);
        } finally {
            setIsRequestingOTP(false);
        }
    };

    const handleVerifyOTPAndChangePassword = async () => {
        if (!otp || otp.length !== 6) {
            toast.warning('Please enter the 6-digit OTP');
            return;
        }

        setIsVerifyingOTP(true);
        try {
            const result = await verifyPasswordChangeOTP(otp, passwordData.newPassword);

            if (result.success) {
                toast.success('Password changed successfully!');
                // Reset all states
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setOtp('');
                setPasswordChangeStep('form');
            } else {
                toast.error(result.message || 'Failed to change password');
            }
        } catch (error) {
            toast.error('Error changing password: ' + error.message);
        } finally {
            setIsVerifyingOTP(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendCooldown > 0) return;

        setIsResendingOTP(true);
        try {
            const result = await resendPasswordChangeOTP();

            if (result.success) {
                toast.success('New OTP sent to your email!');
                setResendCooldown(60);
            } else {
                toast.error(result.message || 'Failed to resend OTP');
            }
        } catch (error) {
            toast.error('Error resending OTP: ' + error.message);
        } finally {
            setIsResendingOTP(false);
        }
    };

    const handleCancelOTPStep = () => {
        setPasswordChangeStep('form');
        setOtp('');
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <p className="text-neutral-600 text-lg font-medium">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                {/* Header */}
                <div className="mb-8 sm:mb-12">
                    {/* Top bar with logo and logout */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2 group">
                            <div className="bg-linear-to-r from-primary-500 to-secondary-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
                                <MapPinned className="w-6 h-6 text-white" />
                            </div>
                            <div className='flex flex-col'>
                                <span className="text-xl sm:text-2xl font-display font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                    YatraMate
                                </span>
                                <p className='text-xs text-gray-500 font-medium -mt-1'>
                                    Travel made effortless <span className='text-red-500 font-bold'>~</span>
                                </p>
                            </div>

                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 sm:px-4 sm:py-2 bg-primary-500 text-white rounded-lg hover:bg-secondary-500 transition-colors text-xs sm:text-sm font-medium flex items-center"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>

                    {/* Dashboard title and vendor info */}
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Vendor <span className='text-red-600'>Dashboard</span></h1>
                        <p className="mt-1 md:mt-2 text-base sm:text-lg text-gray-600">Manage, add and delete your listed vehicles.</p>
                    </div>
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Tab Navigation */}
                <div className="mb-6 flex justify-center gap-2 sm:gap-4 flex-wrap">
                    <button
                        onClick={() => setActiveTab('vehicles')}
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base flex items-center gap-2 ${
                            activeTab === 'vehicles'
                                ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                                : 'bg-white text-neutral-700 hover:bg-neutral-100'
                        }`}
                        data-testid="vehicles-tab"
                    >
                        <Car className='w-5 h-5'/>
                        Vehicles
                    </button>
                    <button
                        onClick={() => setActiveTab('earnings')}
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base flex items-center gap-2 ${
                            activeTab === 'earnings'
                                ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                                : 'bg-white text-neutral-700 hover:bg-neutral-100'
                        }`}
                        data-testid="earnings-tab"
                    >
                        <PiggyBank className='w-5 h-5'/>
                        Earnings
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base flex items-center gap-2 ${
                            activeTab === 'settings'
                                ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                                : 'bg-white text-neutral-700 hover:bg-neutral-100'
                        }`}
                        data-testid="settings-tab"
                    >
                        <Settings className="w-5 h-5" />
                        Settings
                    </button>
                </div>

                {/* Vehicles Tab */}
                {activeTab === 'vehicles' && (
                    <>
                        {/* Actions */}
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">My <span className='text-red-600'>Vehicles</span></h2>
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
                                data-testid="add-vehicle-btn"
                            >
                                {showAddForm ? 'Cancel' : '+ Add Vehicle'}
                            </button>
                        </div>

                        {/* Add Vehicle Form */}
                        {showAddForm && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 animate-fade-in">
                        <h3 className="text-2xl sm:text-3xl text-center font-bold text-neutral-900 p-6">Vehicle <span className='text-red-500'>Request</span></h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Vehicle Name <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Model Name <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    name="model_name"
                                    value={formData.model_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <CustomDropdown
                                label={<span>Type <span className='text-red-500'>*</span></span>}
                                options={[
                                    { value: 'bike', label: 'Bike' },
                                    { value: 'car', label: 'Car' }
                                ]}
                                value={formData.type}
                                onChange={(val) => handleChange({ target: { name: 'type', value: val } })}
                            />

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Brand <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Honda, Toyota, Yamaha"
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Location <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Kolkata, Delhi, Mumbai"
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Registration Number <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    name="registration_number"
                                    value={formData.registration_number}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Engine Number <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    name="engine_number"
                                    value={formData.engine_number}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Chassis Number (VIN) <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    name="chassis_number"
                                    value={formData.chassis_number}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Engine CC <span className='text-red-500'>*</span></label>
                                <input
                                    type="number"
                                    name="cc_engine"
                                    value={formData.cc_engine}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            {/* Package Info Display */}
                            {packageInfo && (
                                <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-900 mb-2">Package Details</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <p><span className="font-medium">Package:</span> {packageInfo.name}</p>
                                        <p><span className="font-medium">Type:</span> {packageInfo.vehicle_type}</p>
                                        <p><span className="font-medium">Price/Hour:</span> ₹{packageInfo.price_per_hour}</p>
                                        <p><span className="font-medium">Price/KM:</span> ₹{packageInfo.price_per_km}</p>
                                    </div>
                                </div>
                            )}

                            {/* File Uploads */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    RC Document <span className='text-red-500'>*</span> <span className="text-xs text-gray-500">(Max 1MB)</span>
                                </label>
                                <input
                                    type="file"
                                    name="rc_document"
                                    accept="image/*,application/pdf"
                                    onChange={handleFileChange}
                                    required
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    Insurance Document <span className='text-red-500'>*</span> <span className="text-xs text-gray-500">(Max 1MB)</span>
                                </label>
                                <input
                                    type="file"
                                    name="insurance_document"
                                    accept="image/*,application/pdf"
                                    onChange={handleFileChange}
                                    required
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    Vehicle Images <span className='text-red-500'>*</span> <span className="text-xs text-gray-500">(5 images: 4 sides + interior, each max 1MB)</span>
                                </label>
                                <input
                                    type="file"
                                    name="vehicle_images"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    required
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                                {files.vehicle_images.length > 0 && (
                                    <p className="text-xs text-gray-600 mt-1">{files.vehicle_images.length} file(s) selected</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? 'Submitting Request...' : 'Submit Vehicle Request'}
                                </button>
                            </div>
                        </form>
                        </div>
                        )}

                        {/* Vehicles List */}
                        {loading ? (
                            <div className="text-center py-8 sm:py-12">
                                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600 mx-auto"></div>
                                <p className="mt-4 text-neutral-600 text-sm sm:text-base">Loading vehicles...</p>
                            </div>
                        ) : vehicles.length === 0 ? (
                            <div className="text-center py-8 sm:py-12 bg-white rounded-2xl shadow-lg px-4">
                                <p className="text-neutral-600 text-base sm:text-lg">No vehicles added yet. Start by adding your first vehicle!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {vehicles.map((vehicle) => (
                                    <div key={vehicle._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                                        <div className="bg-linear-to-r from-primary-500 to-secondary-500 text-white p-3 sm:p-4">
                                            <h3 className="text-lg sm:text-xl font-bold truncate">{vehicle.name}</h3>
                                            <p className="text-white/90 text-sm sm:text-base truncate">{vehicle.brand} - {vehicle.model_name}</p>
                                        </div>

                                        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs sm:text-sm text-neutral-600">Registration:</span>
                                                <span className="font-semibold text-neutral-900 text-xs sm:text-sm">{vehicle.registration_number}</span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-xs sm:text-sm text-neutral-600">Status:</span>
                                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${vehicle.availability_status === 'available' ? 'bg-green-100 text-green-700' :
                                                    vehicle.availability_status === 'booked' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {vehicle.availability_status}
                                                </span>
                                            </div>

                                            <div className="border-t pt-2 sm:pt-3 mt-2 sm:mt-3">
                                                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                                                    <div>
                                                        <p className="text-neutral-600">Total Distance</p>
                                                        <p className="font-bold text-neutral-900">{vehicle.total_distance_travelled || 0} km</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-neutral-600">Total Hours</p>
                                                        <p className="font-bold text-neutral-900">{vehicle.total_hours_booked || 0} hrs</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-neutral-600">Total Bookings</p>
                                                        <p className="font-bold text-neutral-900">{vehicle.total_bookings || 0}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-neutral-600">Total Earnings</p>
                                                        <p className="font-bold text-green-600">₹{vehicle.total_earnings?.toLocaleString('en-IN') || 0}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(vehicle._id)}
                                                className="w-full mt-3 sm:mt-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200 text-sm sm:text-base"
                                                data-testid={`delete-vehicle-${vehicle._id}`}
                                            >
                                                Delete Vehicle
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Earnings Tab */}
                {activeTab === 'earnings' && (
                    <>
                        {/* Filter buttons */}
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                                My <span className='text-red-600'>Earnings</span>
                            </h2>
                            <div className="flex gap-2 flex-wrap justify-center">
                                <button
                                    onClick={() => setEarningsFilter('all')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        earningsFilter === 'all'
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-white text-neutral-700 hover:bg-neutral-100'
                                    }`}
                                    data-testid="filter-all"
                                >
                                    All Time
                                </button>
                                <button
                                    onClick={() => setEarningsFilter('day')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        earningsFilter === 'day'
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-white text-neutral-700 hover:bg-neutral-100'
                                    }`}
                                    data-testid="filter-day"
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => setEarningsFilter('week')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        earningsFilter === 'week'
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-white text-neutral-700 hover:bg-neutral-100'
                                    }`}
                                    data-testid="filter-week"
                                >
                                    This Week
                                </button>
                                <button
                                    onClick={() => setEarningsFilter('month')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        earningsFilter === 'month'
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-white text-neutral-700 hover:bg-neutral-100'
                                    }`}
                                    data-testid="filter-month"
                                >
                                    This Month
                                </button>
                                <button
                                    onClick={() => setEarningsFilter('year')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        earningsFilter === 'year'
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-white text-neutral-700 hover:bg-neutral-100'
                                    }`}
                                    data-testid="filter-year"
                                >
                                    This Year
                                </button>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Total Earnings Card */}
                            <div className="bg-linear-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/80 text-sm font-medium">Total Earnings</p>
                                        <p className="text-3xl font-bold mt-1" data-testid="total-earnings">₹{totalEarnings.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="bg-white/20 p-4 rounded-xl">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-white/80 text-sm mt-2">{earnings.length} completed booking{earnings.length !== 1 ? 's' : ''}</p>
                            </div>

                            {/* Currently Booked Vehicles Card */}
                            <div className="bg-linear-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/80 text-sm font-medium">Currently Booked</p>
                                        <p className="text-3xl font-bold mt-1" data-testid="booked-vehicles">
                                            {vehicles.filter(v => v.availability_status === 'booked').length}
                                        </p>
                                    </div>
                                    <div className="bg-white/20 p-4 rounded-xl">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-white/80 text-sm mt-2">Vehicle{vehicles.filter(v => v.availability_status === 'booked').length !== 1 ? 's' : ''} on rent</p>
                            </div>

                            {/* Total Listed Vehicles Card */}
                            <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/80 text-sm font-medium">Total Listed Vehicles</p>
                                        <p className="text-3xl font-bold mt-1" data-testid="total-vehicles">
                                            {vehicles.length}
                                        </p>
                                    </div>
                                    <div className="bg-white/20 p-4 rounded-xl">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-white/80 text-sm mt-2">Active vehicle{vehicles.length !== 1 ? 's' : ''} in fleet</p>
                            </div>
                        </div>

                        {/* Earnings Table */}
                        {earningsLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                                <p className="mt-4 text-neutral-600">Loading earnings...</p>
                            </div>
                        ) : earnings.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                                <p className="text-neutral-600 text-lg">No earnings found for the selected period.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full" data-testid="earnings-table">
                                        <thead className="bg-linear-to-r from-primary-500 to-secondary-500 text-white">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Vehicle Info</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Pickup Date & Time</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Return Date & Time</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Distance (km)</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Payment Mode</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Damage Cost</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Total Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-200">
                                            {earnings.map((earning, index) => (
                                                <tr key={earning._id} className="hover:bg-neutral-50 transition-colors" data-testid={`earning-row-${index}`}>
                                                    <td className="px-4 py-4">
                                                        <div>
                                                            <p className="font-semibold text-neutral-900">{earning.vehicle_id?.name || 'N/A'}</p>
                                                            <p className="text-sm text-neutral-600">{earning.vehicle_id?.brand} {earning.vehicle_id?.model_name}</p>
                                                            <p className="text-xs text-neutral-500">{earning.vehicle_id?.registration_number}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div>
                                                            <p className="text-sm text-neutral-900">
                                                                {earning.pickup_details?.actual_pickup_date 
                                                                    ? new Date(earning.pickup_details.actual_pickup_date).toLocaleDateString('en-IN')
                                                                    : 'N/A'}
                                                            </p>
                                                            <p className="text-xs text-neutral-600">
                                                                {earning.pickup_details?.actual_pickup_time || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div>
                                                            <p className="text-sm text-neutral-900">
                                                                {earning.return_details?.actual_return_date 
                                                                    ? new Date(earning.return_details.actual_return_date).toLocaleDateString('en-IN')
                                                                    : 'N/A'}
                                                            </p>
                                                            <p className="text-xs text-neutral-600">
                                                                {earning.return_details?.actual_return_time || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="text-sm font-medium text-neutral-900">
                                                            {earning.distance_traveled_km || 0}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            earning.final_payment?.method === 'online' 
                                                                ? 'bg-blue-100 text-blue-800' 
                                                                : 'bg-green-100 text-green-800'
                                                        }`}>
                                                            {earning.final_payment?.method === 'online' ? 'Online' : 'Cash'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className={`text-sm font-medium ${earning.damage_cost > 0 ? 'text-red-600' : 'text-neutral-900'}`}>
                                                            ₹{(earning.damage_cost || 0).toLocaleString('en-IN')}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="text-sm font-bold text-green-600">
                                                            ₹{(earning.final_cost || 0).toLocaleString('en-IN')}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <LockKeyhole className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-neutral-900">Change Password</h2>
                                    <p className="text-sm text-neutral-600">Secure your account with a new password</p>
                                </div>
                            </div>

                            {passwordChangeStep === 'form' ? (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter current password"
                                            data-testid="vendor-current-password-input"
                                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter new password (min. 6 characters)"
                                            data-testid="vendor-new-password-input"
                                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Confirm new password"
                                            data-testid="vendor-confirm-password-input"
                                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200"
                                        />
                                    </div>

                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                        <div className="flex items-start space-x-3">
                                            <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-amber-800">Email Verification Required</p>
                                                <p className="text-xs text-amber-700 mt-1">A verification OTP will be sent to your registered email address to confirm the password change.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleRequestPasswordChangeOTP}
                                        disabled={isRequestingOTP}
                                        data-testid="vendor-request-otp-btn"
                                        className="w-full px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        {isRequestingOTP ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Sending OTP...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="w-5 h-5" />
                                                <span>Send Verification OTP</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {/* OTP Verification Step */}
                                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center">
                                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Mail className="w-8 h-8 text-primary-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-neutral-900 mb-2">Verify Your Email</h3>
                                        <p className="text-sm text-neutral-600 mb-4">
                                            We've sent a 6-digit verification code to <span className="font-semibold">{user?.email}</span>
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                            Enter OTP Code
                                        </label>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="Enter 6-digit OTP"
                                            maxLength={6}
                                            data-testid="vendor-otp-input"
                                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200 text-center text-2xl tracking-[0.5em] font-mono"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleVerifyOTPAndChangePassword}
                                            disabled={isVerifyingOTP || otp.length !== 6}
                                            data-testid="vendor-verify-otp-btn"
                                            className="flex-1 px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        >
                                            {isVerifyingOTP ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                    <span>Verifying...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Shield className="w-5 h-5" />
                                                    <span>Verify & Change Password</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleCancelOTPStep}
                                            data-testid="vendor-cancel-otp-btn"
                                            className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                    <div className="text-center pt-2">
                                        <button
                                            onClick={handleResendOTP}
                                            disabled={isResendingOTP || resendCooldown > 0}
                                            data-testid="vendor-resend-otp-btn"
                                            className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:text-neutral-400 disabled:cursor-not-allowed"
                                        >
                                            {isResendingOTP ? (
                                                'Sending...'
                                            ) : resendCooldown > 0 ? (
                                                `Resend OTP in ${resendCooldown}s`
                                            ) : (
                                                'Resend OTP'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorDashboard;
