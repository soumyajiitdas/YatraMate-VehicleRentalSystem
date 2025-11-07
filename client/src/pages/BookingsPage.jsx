import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    // TODO: Replace with actual API call
    setTimeout(() => {
      const mockBookings = [
        {
          _id: '1',
          vehicle: {
            name: 'Honda City',
            type: 'car',
            images: ['https://images.unsplash.com/photo-1760976396211-5546ce83a400?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjByZW50YWx8ZW58MHx8fHwxNzYyNDkyNDI0fDA&ixlib=rb-4.1.0&q=85'],
          },
          pickup_location: 'Kolkata Airport',
          dropoff_location: 'DumDum',
          pickup_datetime: '2026-01-20T10:00:00',
          dropoff_datetime: '2026-01-22T18:00:00',
          total_cost: 5500,
          status: 'confirmed',
          payment_status: 'paid',
        },
        {
          _id: '2',
          vehicle: {
            name: 'Royal Enfield Classic',
            type: 'bike',
            images: ['https://images.unsplash.com/photo-1738576377901-bf5175eefec1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxiaWtlJTIwcmVudGFsJTIwbW90b3JjeWNsZXxlbnwwfHx8fDE3NjI0OTI0Mjl8MA&ixlib=rb-4.1.0&q=85'],
          },
          pickup_location: 'Kolkata',
          dropoff_location: 'Berhampore',
          pickup_datetime: '2026-01-15T09:00:00',
          dropoff_datetime: '2026-01-17T20:00:00',
          total_cost: 2400,
          status: 'completed',
          payment_status: 'paid',
        },
        {
          _id: '3',
          vehicle: {
            name: 'Maruti Swift',
            type: 'car',
            images: ['https://images.unsplash.com/photo-1761320296536-38a4e068b37d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBjYXIlMjByZW50YWx8ZW58MHx8fHwxNzYyNDkyNDI0fDA&ixlib=rb-4.1.0&q=85'],
          },
          pickup_location: 'Berhampore',
          dropoff_location: 'Darjeeling',
          pickup_datetime: '2026-01-25T12:00:00',
          dropoff_datetime: '2026-01-26T12:00:00',
          total_cost: 2000,
          status: 'pending',
          payment_status: 'unpaid',
        },
      ];
      setBookings(mockBookings);
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-accent-100 text-accent-700';
      case 'cancelled': return 'bg-neutral-100 text-neutral-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'unpaid': return 'bg-secondary-100 text-secondary-700';
      case 'refunded': return 'bg-blue-100 text-blue-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-2">
            My Bookings
          </h1>
          <p className="text-lg text-neutral-600">
            Track and manage your vehicle bookings
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-card p-2 mb-8 inline-flex space-x-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2.5 rounded-xl font-medium capitalize transition-all duration-200 ${
                filter === status
                  ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Vehicle Image */}
                    <div className="lg:w-64 h-48 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={booking.vehicle.images[0]}
                        alt={booking.vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                            {booking.vehicle.name}
                          </h3>
                          <span className="inline-block px-3 py-1 bg-linear-to-r from-primary-500 to-secondary-500 text-white text-xs rounded-full font-semibold capitalize">
                            {booking.vehicle.type}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-neutral-600 mb-1">Total Cost</div>
                          <div className="text-2xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            ₹{booking.total_cost}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-semibold text-neutral-700 mb-1">Pickup</div>
                          <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <div>
                              <div className="text-neutral-900 font-medium">{booking.pickup_location}</div>
                              <div className="text-sm text-neutral-600">{formatDate(booking.pickup_datetime)}</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-neutral-700 mb-1">Dropoff</div>
                          <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-secondary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <div>
                              <div className="text-neutral-900 font-medium">{booking.dropoff_location}</div>
                              <div className="text-sm text-neutral-600">{formatDate(booking.dropoff_datetime)}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${getPaymentStatusColor(booking.payment_status)}`}>
                          {booking.payment_status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <button className="px-5 py-2 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-200">
                          View Details
                        </button>
                        {booking.status === 'pending' && (
                          <button className="px-5 py-2 border-2 border-secondary-500 text-secondary-600 rounded-lg font-semibold hover:bg-secondary-50 transition-all duration-200">
                            Cancel Booking
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <button className="px-5 py-2 border-2 border-primary-500 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-200">
                            Book Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-card">
            <div className="inline-block p-8 bg-neutral-100 rounded-full mb-4">
              <svg className="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No bookings found</h3>
            <p className="text-neutral-600 mb-6">
              {filter === 'all' 
                ? "You haven't made any bookings yet. Start exploring vehicles!" 
                : `No ${filter} bookings found.`}
            </p>
            <Link
              to="/vehicles"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200"
            >
              <span>Browse Vehicles</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
