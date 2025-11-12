import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
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
    { icon: '🚗', label: 'Automatic', value: 'Transmission' },
    { icon: '❄️', label: 'Air Conditioning', value: 'Climate Control' },
    { icon: '🛡️', label: 'Insurance', value: 'Full Coverage' },
    { icon: '⚡', label: 'Fuel Type', value: 'Petrol' },
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
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/90 text-white backdrop-blur-sm">
                      Featured
                    </span>
                  )}
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ml-auto ${
                    vehicle.is_available_for_booking
                      ? 'bg-green-500/90 text-white'
                      : 'bg-neutral-500/90 text-white'
                  }`}>
                    {vehicle.is_available_for_booking ? 'Available' : 'Not Available'}
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
                      className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index
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
                  <p className="text-lg text-neutral-600">
                    {vehicle.brand} • {vehicle.model_name}
                  </p>
                  {vehicle.cc_engine && (
                    <p className="text-sm text-neutral-500 mt-2">
                      <span className="font-semibold">Engine Capacity:</span> {vehicle.cc_engine}cc
                    </p>
                  )}
                </div>
                <span className="px-4 py-2 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-full text-sm font-semibold capitalize">
                  {vehicle.type}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center text-neutral-600 mb-6">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{vehicle.location}</span>
              </div>

              {/* Pricing */}
              <div className="bg-linear-to-r from-primary-50 to-secondary-50 rounded-xl p-4 sm:p-6 mb-6 border-2 border-primary-200">
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">Rental Pricing</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Per Day</div>
                    <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                      ₹{vehicle.price_per_day}
                    </div>
                  </div>
                  {vehicle.price_per_km && (
                    <div>
                      <div className="text-sm text-neutral-600 mb-1">Per Kilometer</div>
                      <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        ₹{vehicle.price_per_km}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Description</h3>
                <p className="text-neutral-600 leading-relaxed">{vehicle.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4">Features & Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-xl">
                      <span className="text-xl sm:text-2xl">{feature.icon}</span>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-neutral-900">{feature.label}</div>
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
