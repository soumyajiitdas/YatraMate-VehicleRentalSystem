import { useState, useEffect } from 'react';
import VehicleCard from '../components/VehicleCard';
import { API_ENDPOINTS } from '../config/api';
import { Search, CarFront, BadgeIndianRupee, CircleCheckBig, ClipboardCheck } from 'lucide-react';

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    search: '',
    priceRange: 'all',
    availability: 'all',
  });

  // Fetch vehicles data from API
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.vehiclesGrouped);
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

  const filteredVehicles = vehicles.filter((vehicle) => {
    // Type filter
    if (filters.type !== 'all' && vehicle.type !== filters.type) return false;
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !vehicle.name.toLowerCase().includes(searchLower) &&
        !vehicle.brand.toLowerCase().includes(searchLower) &&
        !vehicle.location.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    
    // Price range filter
    if (filters.priceRange !== 'all') {
      if (filters.priceRange === 'low' && vehicle.price_per_day > 1500) return false;
      if (filters.priceRange === 'medium' && (vehicle.price_per_day <= 1500 || vehicle.price_per_day > 3000)) return false;
      if (filters.priceRange === 'high' && vehicle.price_per_day <= 3000) return false;
    }
    
    // Availability filter
    if (filters.availability !== 'all') {
      if (filters.availability === 'available' && vehicle.availability_status !== 'available') return false;
      if (filters.availability === 'booked' && vehicle.availability_status === 'available') return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-3 text-neutral-800">
            Explore <span className='text-red-500'>Our Fleet</span>
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover the perfect vehicle for your journey from our premium collection
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-xl border border-primary-200 p-6 sm:p-8 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Search */}
            <div>
              <label className="flex items-center text-sm font-bold text-neutral-700 mb-3">
                <Search className="w-4 h-4 mr-2 text-primary-500" />
                Search
              </label>
              <input
                type="text"
                placeholder="Vehicle, brand, location..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all duration-200 text-sm"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="flex items-center text-sm font-bold text-neutral-700 mb-3">
                <CarFront className="w-4 h-4 mr-2 text-primary-500" />
                Vehicle Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all duration-200 text-sm font-medium"
              >
                <option value="all">All Types</option>
                <option value="car">Cars</option>
                <option value="bike">Bikes</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="flex items-center text-sm font-bold text-neutral-700 mb-3">
                <BadgeIndianRupee className="w-4 h-4 mr-2 text-primary-500" />
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all duration-200 text-sm font-medium"
              >
                <option value="all">All Prices</option>
                <option value="low">Under ₹1,500/day</option>
                <option value="medium">₹1,500 - ₹3,000/day</option>
                <option value="high">Above ₹3,000/day</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="flex items-center text-sm font-bold text-neutral-700 mb-3">
                <CircleCheckBig className="w-4 h-4 mr-2 text-primary-500" />
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all duration-200 text-sm font-medium"
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.type !== 'all' || filters.search || filters.priceRange !== 'all' || filters.availability !== 'all') && (
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-neutral-600">Active filters:</span>
                {filters.type !== 'all' && (
                  <span className="px-4 py-2 bg-linear-to-r from-primary-500 to-secondary-500 text-white text-xs rounded-full font-bold capitalize shadow-md">
                    {filters.type}
                  </span>
                )}
                {filters.search && (
                  <span className="px-4 py-2 bg-linear-to-r from-primary-500 to-secondary-500 text-white text-xs rounded-full font-bold shadow-md">
                    "{filters.search}"
                  </span>
                )}
                {filters.priceRange !== 'all' && (
                  <span className="px-4 py-2 bg-linear-to-r from-primary-500 to-secondary-500 text-white text-xs rounded-full font-bold capitalize shadow-md">
                    {filters.priceRange} price
                  </span>
                )}
                {filters.availability !== 'all' && (
                  <span className="px-4 py-2 bg-linear-to-r from-primary-500 to-secondary-500 text-white text-xs rounded-full font-bold capitalize shadow-md">
                    {filters.availability}
                  </span>
                )}
                <button
                  onClick={() => setFilters({ type: 'all', search: '', priceRange: 'all', availability: 'all' })}
                  className="ml-auto px-4 py-2 text-sm text-secondary-600 hover:text-secondary-700 font-bold underline hover:no-underline transition-all duration-200"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 bg-linear-to-br from-primary-50 to-secondary-50 px-6 py-3 rounded-full shadow-md border border-neutral-100">
            <ClipboardCheck className="w-5 h-5 text-primary-600" />
            <p className="text-neutral-700 font-medium">
              Showing <span className="font-bold text-primary-600">{filteredVehicles.length}</span> of{' '}
              <span className="font-bold text-neutral-900">{vehicles.length}</span> vehicles
            </p>
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-600 mx-auto mb-4"></div>
              <p className="text-neutral-600 font-medium">Loading vehicles...</p>
            </div>
          </div>
        ) : filteredVehicles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl shadow-xl border border-neutral-100">
            <div className="inline-block p-10 bg-linear-to-br from-neutral-100 to-neutral-200 rounded-full mb-6">
              <svg className="w-20 h-20 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-neutral-900 mb-3">No vehicles found</h3>
            <p className="text-neutral-600 mb-8 text-lg">Try adjusting your filters to discover more vehicles</p>
            <button
              onClick={() => setFilters({ type: 'all', search: '', priceRange: 'all', availability: 'all' })}
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
          </div>
        )}
      </div>
      {/* Background Decorative Elements */}
      <div className="hidden absolute inset-0 pointer-events-none sm:block">
          {/* Top-left cluster */}
          <div className="absolute -top-10 -left-6 w-32 h-32 bg-red-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-6 -left-12 w-20 h-20 bg-blue-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-20 left-4 w-14 h-14 bg-yellow-300 rounded-full opacity-50 blur-md" />

          {/* Center-right floating grouping */}
          <div className="absolute top-16 right-24 w-28 h-28 bg-pink-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-32 right-10 w-16 h-16 bg-purple-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-44 right-16 w-12 h-12 bg-green-300 rounded-full opacity-50 blur-md" />

          {/* Bottom-right anchor cluster */}
          <div className="absolute -bottom-20 right-8 w-24 h-24 bg-red-300 rounded-full opacity-50 blur-md" />
          <div className="absolute -bottom-14 right-24 w-16 h-16 bg-blue-300 rounded-full opacity-50 blur-md" />
          <div className="absolute -bottom-30 right-16 w-12 h-12 bg-yellow-300 rounded-full opacity-50 blur-md" />
        </div>
    </div>
  );
};

export default VehiclesPage;