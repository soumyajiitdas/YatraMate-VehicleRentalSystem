import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const BookingsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Get user ID from AuthContext
      const userId = user?._id || user?.id;

      if (!userId) {
        console.log('No user ID found');
        setLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.userBookings(userId), {
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('Failed to fetch bookings:', response.status, response.statusText);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Bookings data:', data);

      if (data.status === 'success') {
        // Transform backend data to match frontend structure
        const transformedBookings = data.data.bookings.map(booking => ({
          _id: booking._id,
          vehicle: {
            _id: booking.vehicle_id._id,
            name: booking.vehicle_id.name,
            type: booking.vehicle_id.type,
            images: booking.vehicle_id.images,
            registration_number: booking.vehicle_id.registration_number
          },
          pickup_location: booking.start_location,
          pickup_datetime: booking.requested_pickup_date,
          pickup_time: booking.requested_pickup_time,
          return_datetime: booking.return_details?.actual_return_date || null,
          total_cost: booking.final_cost || 0,
          status: mapBackendStatus(booking.status),
          payment_status: booking.payment_status,
          pickup_details: booking.pickup_details,
          return_details: booking.return_details,
          rejection_reason: booking.rejection_reason || null
        }));

        setBookings(transformedBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map backend status to frontend status
  const mapBackendStatus = (backendStatus) => {
    const statusMap = {
      'booking_requested': 'pending',
      'picked_up': 'confirmed',
      'returned': 'completed',
      'cancelled': 'cancelled'
    };
    return statusMap[backendStatus] || backendStatus;
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
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-2">
            My <span className='text-red-500'>Bookings</span>
          </h1>
          <p className="text-lg text-neutral-600">
            Track and manage your vehicle bookings
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white border border-primary-200 rounded-2xl shadow-card p-2 mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max sm:min-w-0">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl font-medium text-sm sm:text-base capitalize transition-all duration-200 whitespace-nowrap ${filter === status
                  ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                  : 'text-neutral-700 sm:underline underline-offset-2 decoration-4 decoration-red-200 hover:bg-neutral-100 no-underline'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
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
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2 truncate">
                            {booking.vehicle.name}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-block px-3 py-1 bg-linear-to-r from-primary-500 to-secondary-500 text-white text-xs rounded-full font-semibold capitalize">
                              {booking.vehicle.type}
                            </span>
                            {booking.vehicle.registration_number && booking.status === 'confirmed' && (
                              <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full font-semibold">
                                RC: {booking.vehicle.registration_number}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <div className="text-sm text-neutral-600 mb-1">Total Cost</div>
                          <div className="text-xl sm:text-2xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            ₹{booking.total_cost || 'TBD'}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-semibold text-neutral-700 mb-1">Pickup Location</div>
                          <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <div>
                              <div className="text-neutral-900 font-medium">{booking.pickup_location}</div>
                              <div className="text-sm text-neutral-600">
                                {new Date(booking.pickup_datetime).toLocaleDateString()} {booking.pickup_time}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-neutral-700 mb-1">Return Date</div>
                          <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-secondary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                              {booking.return_datetime ? (
                                <div className="text-sm text-neutral-600">{formatDate(booking.return_datetime)}</div>
                              ) : (
                                <div className="text-sm text-neutral-600">Pending</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      {/* Rejection Reason Display */}
                      {booking.status === 'cancelled' && booking.rejection_reason && (
                        <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-sm text-red-700" data-testid="rejection-reason-text"><span className='font-semibold text-red-900'>Rejection Reason: </span>{booking.rejection_reason}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-2">
                        <Link to="/vehicles/" >
                          <button className="px-5 py-2 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-200">
                            View Details
                          </button>
                        </Link>
                        {booking.status === 'pending' && (
                          <button className="px-5 py-2 border-2 border-secondary-500 text-secondary-600 rounded-lg font-semibold hover:bg-secondary-50 transition-all duration-200">
                            Cancel Booking
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <Link to={`/vehicles/${booking.vehicle._id}`}>
                            <button className="px-5 py-2 border-2 border-primary-500 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-200">
                              Book Again
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-30 bg-white rounded-2xl shadow-card">
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
