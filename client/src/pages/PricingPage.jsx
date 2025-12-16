import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { Link } from 'react-router-dom';
import { PackageSearch, Motorbike, Car } from 'lucide-react';

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
        ? packages.filter(pkg => pkg.is_active)
        : packages.filter(pkg => pkg.vehicle_type === selectedType && pkg.is_active);

    const getVehicleIcon = (type) => {
        if (type === 'bike') {
            return (
                <Motorbike className="w-10 h-10" />
            );
        }
        return (
            <Car className="w-10 h-10" />
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-lg text-neutral-600 font-medium">Loading pricing packages...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50 flex items-center justify-center py-20">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="inline-block p-10 bg-linear-to-br from-neutral-100 to-neutral-200 rounded-full mb-6">
                        <svg className="w-20 h-20 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-neutral-900 mb-3">Oops! Something went wrong</h3>
                    <p className="text-neutral-600 mb-8 text-lg">We couldn't load the packages. Please try again later.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
            {/* Hero Section */}
            <div className="relative bg-linear-to-r from-primary-600 via-secondary-600 to-primary-700 text-white py-20 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-40 hidden sm:block">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-5">
                            Simple, Transparent Pricing
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                            Choose the perfect package for your journey. No hidden fees, no surprises.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-3 inline-flex gap-2 mx-auto">
                    <button
                        onClick={() => setSelectedType('all')}
                        className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${
                            selectedType === 'all'
                                ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-glow transform scale-105'
                                : 'bg-transparent underline underline-offset-2 decoration-4 decoration-red-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                    >
                        <PackageSearch className="w-5 h-5" />
                        All <span className='hidden sm:inline'>Pricing</span>
                    </button>
                    <button
                        onClick={() => setSelectedType('bike')}
                        className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${
                            selectedType === 'bike'
                                ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-glow transform scale-105'
                                : 'bg-transparent underline underline-offset-2 decoration-4 decoration-red-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                    >
                        <Motorbike className="w-5 h-5" />
                        Bikes
                    </button>
                    <button
                        onClick={() => setSelectedType('car')}
                        className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${
                            selectedType === 'car'
                                ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-glow transform scale-105'
                                : 'bg-transparent underline underline-offset-2 decoration-4 decoration-red-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                    >
                        <Car className="w-5 h-5" />
                        Cars
                    </button>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {filteredPackages.map((pkg) => (
                        <div
                            key={pkg._id}
                            className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-2"
                        >

                            {/* Header */}
                            <div className="relative bg-linear-to-br from-primary-500 via-secondary-500 to-primary-600 text-white p-8">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                                </div>
                                <div className="relative">
                                    <div className="flex justify-center mb-5">
                                        <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                            {getVehicleIcon(pkg.vehicle_type)}
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-center mb-2">{pkg.name}</h3>
                                    <div className="flex items-center justify-center gap-2 text-white/90 text-sm font-semibold">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span>{pkg.cc_range_min} - {pkg.cc_range_max} CC</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Details */}
                            <div className="p-8">
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-linear-to-br from-primary-50 to-primary-100 rounded-2xl p-5 text-center">
                                        <p className="text-xs text-neutral-600 font-bold uppercase tracking-wide mb-2">Per Hour</p>
                                        <p className="text-3xl font-bold text-primary-600">
                                            ₹{pkg.price_per_hour}
                                        </p>
                                    </div>
                                    <div className="bg-linear-to-br from-secondary-50 to-secondary-100 rounded-2xl p-5 text-center">
                                        <p className="text-xs text-neutral-600 font-bold uppercase tracking-wide mb-2">Per KM</p>
                                        <p className="text-3xl font-bold text-secondary-600">
                                            ₹{pkg.price_per_km}
                                        </p>
                                    </div>
                                </div>

                                {pkg.description && (
                                    <p className="text-neutral-600 text-sm mb-6 text-center leading-relaxed px-2">
                                        {pkg.description}
                                    </p>
                                )}

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center text-sm text-neutral-700">
                                        <div className="shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="font-medium">24/7 Customer Support</span>
                                    </div>
                                    <div className="flex items-center text-sm text-neutral-700">
                                        <div className="shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="font-medium">Free Cancellation</span>
                                    </div>
                                    <div className="flex items-center text-sm text-neutral-700">
                                        <div className="shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="font-medium">Insurance Included</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <Link to={`/vehicles?package=${pkg._id}`}>
                                    <button className="w-full py-4 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold hover:shadow-glow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2">
                                        View Vehicles
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </Link>
                            </div>

                            {/* Hover Effect Border */}
                            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary-200 transition-all duration-500 pointer-events-none" />
                        </div>
                    ))}
                </div>

                {filteredPackages.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-xl border border-neutral-100">
                        <div className="inline-block p-10 bg-linear-to-br from-neutral-100 to-neutral-200 rounded-full mb-6">
                            <svg className="w-20 h-20 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-neutral-900 mb-3">No packages available</h3>
                        <p className="text-neutral-600 text-lg">There are no packages listed for this selected category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PricingPage;