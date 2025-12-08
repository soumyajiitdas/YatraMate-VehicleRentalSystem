import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { Motorbike, Car, Sparkles } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  const fetchVehicleDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.vehicleById(id));
      const data = await response.json();

      if (data.status === 'success') {
        setVehicle(data.data.vehicle);
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (bookingData) => {
    try {
      // Parse datetime fields to separate date and time
      const pickupDate = new Date(bookingData.pickup_datetime);
      const pickupTime = pickupDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const payload = {
        vehicle_id: bookingData.vehicle_id,
        start_location: bookingData.pickup_location,
        end_location: bookingData.dropoff_location,
        requested_pickup_date: pickupDate.toISOString(),
        requested_pickup_time: pickupTime
      };

      const response = await fetch(API_ENDPOINTS.bookingRequest, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        alert('Booking request submitted successfully! You will be redirected to your bookings page.');
        navigate('/bookings');
      } else {
        alert(data.message || 'Failed to submit booking request. Please make sure you are logged in.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Vehicle not found</h2>
          <button
            onClick={() => navigate('/vehicles')}
            className="px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold"
          >
            Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  const features = [
    { icon: '⚡', label: 'Performance', value: 'Smooth and reliable ride' },
    { icon: '⛽', label: 'Mileage', value: 'High fuel efficiency' },
    { icon: '❤️‍🩹', label: 'Insurance', value: 'Full insurance Coverage' },
    { icon: '🛡️', label: 'Safety', value: 'Regularly serviced and well-maintained' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center space-x-2 text-sm">
          <button onClick={() => navigate('/vehicles')} className="text-neutral-600 hover:text-primary-600 transition-colors duration-200">
            Vehicles
          </button>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-900 font-medium">{vehicle.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={vehicle.images[selectedImage]}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                {/* Featured Badge and Availability Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  {vehicle.is_featured && (
                    <span className="flex items-center gap-1 px-3.5 py-2 rounded-full text-sm bg-amber-500 text-white backdrop-blur-lg">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span className='font-semibold'>Featured</span>
                    </span>
                  )}
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ml-auto ${vehicle.is_available_for_booking
                    ? 'bg-green-500/90 text-white'
                    : 'bg-neutral-500/90 text-white'
                    }`}>
                    {vehicle.is_available_for_booking ? '✓ Available' : '‼ Not Available'}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {vehicle.images.length > 1 && (
                <div className="p-4 flex space-x-2 sm:space-x-3 overflow-x-auto">
                  {vehicle.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === index
                        ? 'border-primary-500 ring-2 ring-primary-200'
                        : 'border-neutral-200 hover:border-primary-300'
                        }`}
                    >
                      <img
                        src={image}
                        alt={`${vehicle.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                    {vehicle.name}
                  </h1>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-lg text-neutral-600 font-medium">
                      {vehicle.brand} <span className='text-primary-500'>•</span> {vehicle.model_name}
                    </p>
                    {vehicle.cc_engine && (
                      <span className="inline-flex items-center px-3 py-1.5 bg-linear-to-r from-neutral-100 to-neutral-200 text-neutral-700 text-sm font-bold rounded-full">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {vehicle.cc_engine}cc
                      </span>
                    )}
                  </div>
                </div>
                <span className="flex items-center gap-2 px-3.5 py-2 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-full text-sm font-semibold shadow-md capitalize">
                  {vehicle.type === 'car' ? (
                    <Car className="w-6 h-6" />
                  ) : (
                    <Motorbike className="w-6 h-6" />
                  )}
                  {vehicle.type}
                </span>
              </div>

              {/* Location */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-primary-50 to-secondary-50 text-primary-500 rounded-full font-medium mb-5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {vehicle.location}
              </div>

              {/* Pricing */}
              <div className="relative overflow-hidden rounded-2xl p-5 sm:p-7 mb-8 bg-linear-to-r from-primary-50 to-secondary-50 border border-primary-200 shadow-sm hover:shadow-lg transition-shadow">
                <div class="absolute inset-0 pointer-events-none bg-white/40 opacity-40"></div>

                <div class="relative">
                  <h3 class="text-lg sm:text-xl font-semibold text-neutral-900 mb-4">
                    Rental Pricing <span className='text-primary-500'>:</span>
                  </h3>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div class="flex flex-col">
                      <span class="text-sm text-neutral-600">Per Day</span>
                      <span class="text-2xl sm:text-3xl font-extrabold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent tracking-tight">
                        ₹{vehicle.price_per_day}
                      </span>
                    </div>

                    {vehicle.price_per_km && (
                      <div class="flex flex-col">
                        <span class="text-sm text-neutral-600">Per Kilometer</span>
                        <span class="text-2xl sm:text-3xl font-extrabold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent tracking-tight">
                          ₹{vehicle.price_per_km}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>


              {/* Description */}
              <div className="mb-8 pb-8 border-b border-neutral-200">
                <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  About This Vehicle <span className='text-primary-500'>:</span>
                </h3>
                <p className="text-neutral-600 leading-relaxed text-base">
                  This vehicle is maintained to ensure a smooth, reliable, and comfortable riding experience. It undergoes regular servicing, safety checks, and quality inspections before every rental. Designed to deliver dependable performance on city roads as well as longer trips, it offers stable handling, efficient fuel usage, and a user-friendly ride experience. Clean interiors/exteriors, well-kept mechanical components, and a focus on safety make it suitable for both daily commuting and travel needs. Ideal for riders/drivers looking for a trustworthy and hassle-free rental option.
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Features & Amenities <span className='text-primary-500'>:</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-linear-to-br from-white to-neutral-50 rounded-2xl border-2 border-neutral-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
                      <span className="text-xl sm:text-2xl">{feature.icon}</span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-neutral-900">{feature.label}</div>
                        <div className="text-xs text-neutral-600">{feature.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingForm vehicle={vehicle} onSubmit={handleBooking} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
