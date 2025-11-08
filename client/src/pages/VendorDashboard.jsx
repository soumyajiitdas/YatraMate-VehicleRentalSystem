import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const VendorDashboard = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [vendorInfo, setVendorInfo] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        model_name: '',
        type: 'bike',
        brand: '',
        registration_number: '',
        engine_number: '',
        chassis_number: '',
        cc_engine: '',
        price_per_hour: '',
        price_per_day: '',
        location: '',
        description: ''
    });

    useEffect(() => {
        const vendorId = localStorage.getItem('vendorId');
        const user = localStorage.getItem('user');

        if (!vendorId || !user) {
            navigate('/login');
            return;
        }

        fetchVendorInfo(vendorId);
        fetchVehicles(vendorId);
    }, [navigate]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const vendorId = localStorage.getItem('vendorId');

        try {
            const response = await fetch(API_ENDPOINTS.vehicles, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    vendor_id: vendorId,
                    cc_engine: parseInt(formData.cc_engine),
                    price_per_hour: parseFloat(formData.price_per_hour),
                    price_per_day: parseFloat(formData.price_per_day)
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert('Vehicle added successfully!');
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
                    price_per_hour: '',
                    price_per_day: '',
                    location: '',
                    description: ''
                });
                fetchVehicles(vendorId);
            } else {
                alert('Error adding vehicle: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            alert('Error adding vehicle: ' + error.message);
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
                alert('Vehicle deleted successfully!');
                const vendorId = localStorage.getItem('vendorId');
                fetchVehicles(vendorId);
            } else {
                alert('Error deleting vehicle');
            }
        } catch (error) {
            alert('Error deleting vehicle: ' + error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('vendorId');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
                <div className="mb-12 flex justify-between items-center">
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
                        <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
                        {vendorInfo && (
                            <p className="mt-2 text-gray-600">Welcome, {vendorInfo.name}</p>
                        )}
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
            </div>
            

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Actions */}
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-neutral-900">My Vehicles</h2>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200"
                    >
                        {showAddForm ? 'Cancel' : '+ Add Vehicle'}
                    </button>
                </div>

                {/* Add Vehicle Form */}
                {showAddForm && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fade-in">
                        <h3 className="text-xl font-bold text-neutral-900 mb-4">Add New Vehicle</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Vehicle Name</label>
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
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Model Name</label>
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
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
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
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Registration Number</label>
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
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Engine Number</label>
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
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Chassis Number</label>
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
                                <label className="block text-sm font-medium text-neutral-700 mb-1">CC Engine</label>
                                <input
                                    type="number"
                                    name="cc_engine"
                                    value={formData.cc_engine}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Price Per Hour (₹)</label>
                                <input
                                    type="number"
                                    name="price_per_hour"
                                    value={formData.price_per_hour}
                                    onChange={handleChange}
                                    required
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Price Per Day (₹)</label>
                                <input
                                    type="number"
                                    name="price_per_day"
                                    value={formData.price_per_day}
                                    onChange={handleChange}
                                    required
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200"
                                >
                                    Add Vehicle
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Vehicles List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-neutral-600">Loading vehicles...</p>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                        <p className="text-neutral-600 text-lg">No vehicles added yet. Start by adding your first vehicle!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle) => (
                            <div key={vehicle._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                                <div className="bg-linear-to-r from-primary-500 to-secondary-500 text-white p-4">
                                    <h3 className="text-xl font-bold">{vehicle.name}</h3>
                                    <p className="text-white/90">{vehicle.brand} - {vehicle.model_name}</p>
                                </div>

                                <div className="p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-neutral-600">Registration:</span>
                                        <span className="font-semibold text-neutral-900">{vehicle.registration_number}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-neutral-600">Status:</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${vehicle.availability_status === 'available' ? 'bg-green-100 text-green-700' :
                                                vehicle.availability_status === 'booked' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {vehicle.availability_status}
                                        </span>
                                    </div>

                                    <div className="border-t pt-3 mt-3">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
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
                                        className="w-full mt-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
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
