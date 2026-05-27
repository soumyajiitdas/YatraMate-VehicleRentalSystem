import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { Link } from 'react-router-dom';
import { PackageSearch, Motorbike, Car, ArrowUpRight, Zap, CheckCircle2 } from 'lucide-react';

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
            <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-base text-ink-600 font-medium tracking-wider uppercase">Loading pricing packages...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center py-20">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="inline-block p-8 bg-ink-50 rounded-full mb-6 border border-ink-100">
                        <svg className="w-16 h-16 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="font-display text-4xl font-bold text-ink-900 mb-3 tracking-tight">Oops! Something went wrong</h3>
                    <p className="text-ink-600 mb-8 text-lg">We couldn't load the packages. Please try again later.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-ink-900 text-white rounded-full font-bold magnetic shine"
                    >
                        <ArrowUpRight className="w-5 h-5 rotate-[-135deg]" />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafaf7] overflow-hidden">
            {/* Hero Section */}
            <section className="relative bg-[#fafaf7] pt-20 pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[160px] pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-100 text-primary-700 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        Transparent Pricing
                    </div>
                    <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-ink-900 leading-[0.95] tracking-tight mb-6">
                        Choose your<br />
                        <em className="not-italic text-primary-500">perfect plan.</em>
                    </h1>
                    <p className="text-ink-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        No hidden fees, no surprises. Just straightforward pricing for your next journey.
                    </p>
                </div>
            </section>

            {/* Filter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-10 flex justify-center">
                <div className="bg-white/95 backdrop-blur-md rounded-full shadow-card border border-ink-100 p-1.5 inline-flex gap-1.5">
                    <button
                        onClick={() => setSelectedType('all')}
                        className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                            selectedType === 'all'
                                ? 'bg-ink-900 text-white shadow-lg'
                                : 'bg-transparent text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                        }`}
                    >
                        <PackageSearch className="w-4 h-4" />
                        All <span className='hidden sm:inline'>Pricing</span>
                    </button>
                    <button
                        onClick={() => setSelectedType('bike')}
                        className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                            selectedType === 'bike'
                                ? 'bg-ink-900 text-white shadow-lg'
                                : 'bg-transparent text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                        }`}
                    >
                        <Motorbike className="w-4 h-4" />
                        Bikes
                    </button>
                    <button
                        onClick={() => setSelectedType('car')}
                        className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                            selectedType === 'car'
                                ? 'bg-ink-900 text-white shadow-lg'
                                : 'bg-transparent text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                        }`}
                    >
                        <Car className="w-4 h-4" />
                        Cars
                    </button>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {filteredPackages.map((pkg) => (
                        <div
                            key={pkg._id}
                            className="group relative bg-white rounded-[32px] border border-ink-100 hover:border-primary-200 transition-all duration-500 shadow-card hover:shadow-card-hover overflow-hidden transform hover:-translate-y-2 flex flex-col"
                        >

                            {/* Header */}
                            <div className="relative bg-primary-50/50 p-8 overflow-hidden border-b border-ink-100">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl opacity-40"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-ink-100 shadow-sm group-hover:scale-110 group-hover:rotate-[-5deg] transition-transform duration-500 text-primary-500">
                                            {getVehicleIcon(pkg.vehicle_type)}
                                        </div>
                                    </div>
                                    <h3 className="font-display text-3xl font-bold text-center mb-2 tracking-tight text-ink-900">{pkg.name}</h3>
                                    <div className="flex items-center justify-center gap-2 text-primary-600 text-[11px] uppercase tracking-wider font-bold">
                                        <Zap className="w-3.5 h-3.5" />
                                        <span>{pkg.cc_range_min} - {pkg.cc_range_max} CC</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Details */}
                            <div className="p-8 flex flex-col flex-1">
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 text-center transition-colors group-hover:bg-primary-100/50">
                                        <p className="text-[10px] text-primary-600 font-bold uppercase tracking-[0.2em] mb-1">Per Hour</p>
                                        <p className="font-display text-3xl font-bold text-primary-700">
                                            ₹{pkg.price_per_hour}
                                        </p>
                                    </div>
                                    <div className="bg-ink-50 border border-ink-100 rounded-2xl p-5 text-center transition-colors group-hover:bg-ink-100/50">
                                        <p className="text-[10px] text-ink-500 font-bold uppercase tracking-[0.2em] mb-1">Per KM</p>
                                        <p className="font-display text-3xl font-bold text-ink-900">
                                            ₹{pkg.price_per_km}
                                        </p>
                                    </div>
                                </div>

                                {pkg.description && (
                                    <p className="text-ink-600 text-sm mb-8 text-center leading-relaxed">
                                        {pkg.description}
                                    </p>
                                )}

                                <div className="space-y-4 mb-8 mt-auto">
                                    {['24/7 Customer Support', 'Free Cancellation', 'Insurance Included'].map((feature, idx) => (
                                        <div key={idx} className="flex items-center text-sm text-ink-700">
                                            <div className="shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                <CheckCircle2 className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                                            </div>
                                            <span className="font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <Link to={`/vehicles?package=${pkg._id}`} className="mt-auto block">
                                    <button className="group/btn relative w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold text-sm magnetic shine overflow-hidden transition-colors flex items-center justify-center gap-2">
                                        <span>View Vehicles</span>
                                        <span className="w-6 h-6 bg-white text-primary-600 rounded-full flex items-center justify-center group-hover/btn:rotate-45 transition-transform duration-300">
                                            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                                        </span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPackages.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-card border border-ink-100 max-w-2xl mx-auto">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-ink-50 rounded-full mb-6 border border-ink-100">
                            <PackageSearch className="w-8 h-8 text-ink-400" />
                        </div>
                        <h3 className="font-display text-3xl font-bold text-ink-900 mb-3 tracking-tight">No packages available</h3>
                        <p className="text-ink-500 text-lg">There are no packages listed for this selected category right now.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PricingPage;