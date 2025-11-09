import { useState, useEffect } from 'react';
import VehicleCard from '../components/VehicleCard';
import { API_ENDPOINTS } from '../config/api';

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
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-2">
            Explore Vehicles
          </h1>
          <p className="text-lg text-neutral-600">
            Find the perfect ride for your journey
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Vehicle, brand, location..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Vehicle Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200"
              >
                <option value="all">All Types</option>
                <option value="car">Cars</option>
                <option value="bike">Bikes</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200"
              >
                <option value="all">All Prices</option>
                <option value="low">Under ₹1,500/day</option>
                <option value="medium">₹1,500 - ₹3,000/day</option>
                <option value="high">Above ₹3,000/day</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200"
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.type !== 'all' || filters.search || filters.priceRange !== 'all' || filters.availability !== 'all') && (
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-neutral-600">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {filters.type !== 'all' && (
                  <span className="px-3 py-1 bg-linear-to-r from-primary-500 to-secondary-500 text-white text-xs rounded-full font-semibold capitalize">
                    {filters.type}
                  </span>
                )}
                {filters.search && (
                  <span className="px-3 py-1 bg-linear-to-r from-primary-500 to-secondary-500 text-white text-xs rounded-full font-semibold">
                    "{filters.search}"
                  </span>
                )}
                {filters.priceRange !== 'all' && (
                  <span className="px-3 py-1 bg-linear-to-r from-primary-500 to-secondary-500 text-white text-xs rounded-full font-semibold capitalize">
                    {filters.priceRange} price
                  </span>
                )}
                {filters.availability !== 'all' && (
                  <span className="px-3 py-1 bg-linear-to-r from-primary-500 to-secondary-500 text-white text-xs rounded-full font-semibold capitalize">
                    {filters.availability}
                  </span>
                )}
              </div>
              <button
                onClick={() => setFilters({ type: 'all', search: '', priceRange: 'all', availability: 'all' })}
                className="text-sm text-secondary-600 hover:text-secondary-700 font-medium underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-neutral-600">
            Showing <span className="font-bold text-neutral-900">{filteredVehicles.length}</span> of{' '}
            <span className="font-bold text-neutral-900">{vehicles.length}</span> vehicles
          </p>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
          </div>
        ) : filteredVehicles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-neutral-100 rounded-full mb-4">
              <svg className="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No vehicles found</h3>
            <p className="text-neutral-600 mb-6">Try adjusting your filters to find more vehicles</p>
            <button
              onClick={() => setFilters({ type: 'all', search: '', priceRange: 'all', availability: 'all' })}
              className="px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesPage;
