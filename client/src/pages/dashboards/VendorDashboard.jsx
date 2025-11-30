import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { API_ENDPOINTS } from '../../config/api';
import { MapPinned } from 'lucide-react';

const VendorDashboard = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [vendorInfo, setVendorInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

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
                alert('Maximum 5 images allowed');
                return;
            }

            // Validate file sizes
            const validFiles = Array.from(selectedFiles).filter(file => {
                if (file.size > 1024 * 1024) {
                    alert(`${file.name} is larger than 1MB`);
                    return false;
                }
                return true;
            });

            setFiles(prev => ({ ...prev, vehicle_images: validFiles }));
        } else {
            // Single file validation
            const file = selectedFiles[0];
            if (file && file.size > 1024 * 1024) {
                alert('File size must be less than 1MB');
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
            alert('Please upload all required documents and at least one vehicle image');
            return;
        }

        if (files.vehicle_images.length < 5) {
            alert('Please upload exactly 5 images (4 sides + interior)');
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
                alert('Vehicle request submitted successfully! It will be reviewed by admin.');
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
                alert('Error submitting vehicle request: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            alert('Error submitting vehicle request: ' + error.message);
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
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || 'Vehicle deleted successfully!');
                fetchVehicles(user.id);
            } else {
                alert(data.message || 'Error deleting vehicle');
            }
        } catch (error) {
            alert('Error deleting vehicle: ' + error.message);
        }
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


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Actions */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-900"><span className='underline underline-offset-2 decoration-red-400 decoration-3'>My Vehicles</span> <span className='text-red-600'>:</span></h2>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
                    >
                        {showAddForm ? 'Cancel' : '+ Add Vehicle'}
                    </button>
                </div>

                {/* Add Vehicle Form */}
                {showAddForm && (
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8 animate-fade-in">
                        <h3 className="text-xl sm:text-2xl text-center font-bold text-neutral-900 mb-4">Vehicle <span className='text-red-500'>Request</span></h3>
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

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Type <span className='text-red-500'>*</span></label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="bike">Bike</option>
                                    <option value="car">Car</option>
                                </select>
                            </div>

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
                                            <div className="col-span-2">
                                                <p className="text-neutral-600">Total Bookings</p>
                                                <p className="font-bold text-neutral-900">{vehicle.total_bookings || 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(vehicle._id)}
                                        className="w-full mt-3 sm:mt-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200 text-sm sm:text-base"
                                    >
                                        Delete Vehicle
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorDashboard;
