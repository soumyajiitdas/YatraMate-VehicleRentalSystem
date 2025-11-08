import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { Link } from 'react-router-dom';

const PricingPage = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState('all');

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_ENDPOINTS.packages);
            const data = await response.json();

            if (data.status === 'success') {
                setPackages(data.data.packages);
            } else {
                setError('Failed to fetch packages');
            }
        } catch (err) {
            setError('Error fetching packages: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredPackages = selectedType === 'all'
        ? packages
        : packages.filter(pkg => pkg.vehicle_type === selectedType);

    const getVehicleIcon = (type) => {
        if (type === 'bike') {
            return (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
            );
        }
        return (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-neutral-600">Loading pricing packages...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <div className="inline-block p-8 bg-neutral-100 rounded-full mb-4">
                    <svg className="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">No packages found</h3>
                <p className="text-neutral-600 mb-10">Something went wrong at our end, try again after sometime...</p>
                <Link
                    to="/"
                    className="px-6 py-4 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200"
                >
                    Back to home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <div className="bg-linear-to-r from-primary-600 via-secondary-600 to-primary-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            Simple, Transparent Pricing
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Choose the perfect package for your journey. No hidden fees, no surprises.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setSelectedType('all')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${selectedType === 'all'
                            ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                            : 'bg-white text-neutral-700 hover:bg-neutral-100'
                            }`}
                    >
                        All Packages
                    </button>
                    <button
                        onClick={() => setSelectedType('bike')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${selectedType === 'bike'
                            ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                            : 'bg-white text-neutral-700 hover:bg-neutral-100'
                            }`}
                    >
                        Bikes
                    </button>
                    <button
                        onClick={() => setSelectedType('car')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${selectedType === 'car'
                            ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                            : 'bg-white text-neutral-700 hover:bg-neutral-100'
                            }`}
                    >
                        Cars
                    </button>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPackages.map((pkg) => (
                        <div
                            key={pkg._id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                        >
                            {/* Header */}
                            <div className="bg-linear-to-r from-primary-500 to-secondary-500 text-white p-6">
                                <div className="flex justify-center mb-4">
                                    {getVehicleIcon(pkg.vehicle_type)}
                                </div>
                                <h3 className="text-2xl font-bold text-center mb-2">{pkg.name}</h3>
                                <p className="text-center text-white/90 text-sm">
                                    {pkg.cc_range_min} - {pkg.cc_range_max} CC
                                </p>
                            </div>

                            {/* Pricing Details */}
                            <div className="p-6">
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-600">Per Hour</span>
                                        <span className="text-2xl font-bold text-primary-600">
                                            ₹{pkg.price_per_hour}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral-600">Per Kilometer</span>
                                        <span className="text-2xl font-bold text-secondary-600">
                                            ₹{pkg.price_per_km}
                                        </span>
                                    </div>
                                </div>

                                {pkg.description && (
                                    <p className="text-neutral-600 text-sm mb-6 text-center">
                                        {pkg.description}
                                    </p>
                                )}

                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-neutral-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>24/7 Support</span>
                                    </div>
                                    <div className="flex items-center text-sm text-neutral-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Free Cancellation</span>
                                    </div>
                                    <div className="flex items-center text-sm text-neutral-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Insurance Included</span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="px-6 pb-6">
                                <button className="w-full py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200">
                                    View Vehicles
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPackages.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-block p-8 bg-neutral-100 rounded-full mb-4">
                            <svg className="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 mb-2">No packages found</h3>
                        <p className="text-neutral-600 mb-6">There are no packages listed for this selected category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PricingPage;
