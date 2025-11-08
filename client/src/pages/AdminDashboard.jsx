import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('customers');
    const [users, setUsers] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'user', 'vendor', 'package'
    const [editingItem, setEditingItem] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        // Check if user is admin
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, [activeTab, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);

            if (activeTab === 'customers' || activeTab === 'office-staff') {
                const response = await fetch(API_ENDPOINTS.users);
                const data = await response.json();
                if (data.status === 'success') {
                    setUsers(data.data.users);
                }
            } else if (activeTab === 'vendors') {
                const [usersRes, vendorsRes] = await Promise.all([
                    fetch(API_ENDPOINTS.users),
                    fetch(API_ENDPOINTS.vendors)
                ]);
                const usersData = await usersRes.json();
                const vendorsData = await vendorsRes.json();

                if (usersData.status === 'success' && vendorsData.status === 'success') {
                    setUsers(usersData.data.users);
                    setVendors(vendorsData.data.vendors);
                }
            } else if (activeTab === 'packages') {
                const response = await fetch(API_ENDPOINTS.packages);
                const data = await response.json();
                if (data.status === 'success') {
                    setPackages(data.data.packages);
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
                // Delete vendor first, then user
                const vendorDetails = vendors.find(v => v.user_id === deleteTarget._id);
                if (vendorDetails) {
                    await fetch(`${API_ENDPOINTS.vendorById(vendorDetails._id)}`, {
                        method: 'DELETE',
                    });
                }
                endpoint = `${API_ENDPOINTS.users}/${deleteTarget._id}`;
            } else {
                endpoint = `${API_ENDPOINTS.users}/${deleteTarget._id}`;
            }

            const response = await fetch(endpoint, {
                method: 'DELETE',
            });

            if (response.ok) {
                setShowDeleteConfirm(false);
                setDeleteTarget(null);
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Failed to delete. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        navigate('/login');
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
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="mt-2 text-gray-600">Manage users, vendors, and packages</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center"
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
                                onClick={() => setActiveTab('customers')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'customers'
                                        ? 'border-red-500 text-red-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Customers
                            </button>
                            <button
                                onClick={() => setActiveTab('office-staff')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'office-staff'
                                        ? 'border-red-500 text-red-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Office Staff
                            </button>
                            <button
                                onClick={() => setActiveTab('vendors')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'vendors'
                                        ? 'border-red-500 text-red-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Vendors
                            </button>
                            <button
                                onClick={() => setActiveTab('packages')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'packages'
                                        ? 'border-red-500 text-red-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Packages
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Action Button */}
                {(activeTab === 'office-staff' || activeTab === 'packages') && (
                    <div className="mb-6">
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
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
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Users Table (Customers, Office Staff, Vendors) */}
                        {activeTab !== 'packages' && (
                            <UsersTable
                                users={getFilteredUsers()}
                                vendors={activeTab === 'vendors' ? vendors : []}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                type={activeTab}
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
                    </>
                )}
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
        </div>
    );
};

// Users Table Component
const UsersTable = ({ users, vendors, onEdit, onDelete, type }) => {
    if (users.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500">No {type} found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                        const vendorDetails = type === 'vendors' ? vendors.find(v => v.user_id === user._id) : null;
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
    );
};

// Packages Table Component
const PackagesTable = ({ packages, onEdit, onDelete }) => {
    if (packages.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500">No packages found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
                    password_hash: formData.password_hash,
                    phone: formData.phone,
                    address: formData.address,
                    role: formData.role,
                    is_active: formData.is_active
                };
            }

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
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
                            body: JSON.stringify(vendorBody),
                        });
                    } else {
                        // Create new vendor
                        await fetch(API_ENDPOINTS.vendors, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(vendorBody),
                        });
                    }
                }
                onSuccess();
            } else {
                alert('Error: ' + (data.message || 'Failed to save'));
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                                        <select
                                            value={formData.vehicle_type}
                                            onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="bike">Bike</option>
                                            <option value="car">Car</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Min CC</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.cc_range_min}
                                            onChange={(e) => setFormData({ ...formData, cc_range_min: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Max CC</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.cc_range_max}
                                            onChange={(e) => setFormData({ ...formData, cc_range_max: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {type === 'vendor' && (
                                    <>
                                        <div className="border-t pt-4 mt-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Details</h3>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.company_name}
                                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.vendor_name}
                                                        onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={formData.contact_number}
                                                        onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                                                    <select
                                                        value={formData.is_verified}
                                                        onChange={(e) => setFormData({ ...formData, is_verified: e.target.value === 'true' })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="true">Verified</option>
                                                        <option value="false">Not Verified</option>
                                                    </select>
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
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
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

export default AdminDashboard;
