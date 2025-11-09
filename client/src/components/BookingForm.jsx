import { useState } from 'react';

const BookingForm = ({ vehicle, onSubmit }) => {
  const [formData, setFormData] = useState({
    pickup_location: vehicle?.location || '',
    dropoff_location: '',
    pickup_datetime: '',
    dropoff_datetime: '',
  });

  const [errors, setErrors] = useState({});
  const [totalCost, setTotalCost] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate duration and cost when dates change
    if (name === 'pickup_datetime' || name === 'dropoff_datetime') {
      calculateCost({ ...formData, [name]: value });
    }
  };

  const calculateCost = (data) => {
    if (data.pickup_datetime && data.dropoff_datetime && vehicle) {
      const pickup = new Date(data.pickup_datetime);
      const dropoff = new Date(data.dropoff_datetime);
      const hours = Math.abs(dropoff - pickup) / 36e5;
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;

      const cost = (days * vehicle.price_per_day) + (remainingHours * vehicle.price_per_hour);
      setTotalCost(Math.round(cost));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.pickup_location) newErrors.pickup_location = 'Pickup location is required';
    if (!formData.dropoff_location) newErrors.dropoff_location = 'Dropoff location is required';
    if (!formData.pickup_datetime) newErrors.pickup_datetime = 'Pickup date & time is required';
    if (!formData.dropoff_datetime) newErrors.dropoff_datetime = 'Dropoff date & time is required';
    
    if (formData.pickup_datetime && formData.dropoff_datetime) {
      const pickup = new Date(formData.pickup_datetime);
      const dropoff = new Date(formData.dropoff_datetime);
      const now = new Date();
      
      if (pickup < now) {
        newErrors.pickup_datetime = 'Pickup date must be in the future';
      }
      if (dropoff <= pickup) {
        newErrors.dropoff_datetime = 'Dropoff date must be after pickup date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        total_cost: totalCost,
        vehicle_id: vehicle._id,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-linear-to-r from-primary-500 to-secondary-500 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">Book Your Ride</h2>
      </div>

      {/* Pickup Location */}
      <div>
        <label htmlFor="pickup_location" className="block text-sm font-semibold text-neutral-700 mb-2">
          Pickup Location
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </span>
          <input
            type="text"
            id="pickup_location"
            name="pickup_location"
            value={formData.pickup_location}
            onChange={handleChange}
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
              errors.pickup_location ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
            }`}
            placeholder="Enter pickup location"
          />
        </div>
        {errors.pickup_location && (
          <p className="mt-1 text-sm text-secondary-600">{errors.pickup_location}</p>
        )}
      </div>

      {/* Dropoff Location */}
      <div>
        <label htmlFor="dropoff_location" className="block text-sm font-semibold text-neutral-700 mb-2">
          Dropoff Location
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </span>
          <input
            type="text"
            id="dropoff_location"
            name="dropoff_location"
            value={formData.dropoff_location}
            onChange={handleChange}
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
              errors.dropoff_location ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
            }`}
            placeholder="Enter dropoff location"
          />
        </div>
        {errors.dropoff_location && (
          <p className="mt-1 text-sm text-secondary-600">{errors.dropoff_location}</p>
        )}
      </div>

      {/* Pickup Date & Time */}
      <div>
        <label htmlFor="pickup_datetime" className="block text-sm font-semibold text-neutral-700 mb-2">
          Pickup Date & Time
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            type="datetime-local"
            id="pickup_datetime"
            name="pickup_datetime"
            value={formData.pickup_datetime}
            onChange={handleChange}
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
              errors.pickup_datetime ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
            }`}
          />
        </div>
        {errors.pickup_datetime && (
          <p className="mt-1 text-sm text-secondary-600">{errors.pickup_datetime}</p>
        )}
      </div>

      {/* Dropoff Date & Time */}
      <div>
        <label htmlFor="dropoff_datetime" className="block text-sm font-semibold text-neutral-700 mb-2">
          Dropoff Date & Time
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            type="datetime-local"
            id="dropoff_datetime"
            name="dropoff_datetime"
            value={formData.dropoff_datetime}
            onChange={handleChange}
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
              errors.dropoff_datetime ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
            }`}
          />
        </div>
        {errors.dropoff_datetime && (
          <p className="mt-1 text-sm text-secondary-600">{errors.dropoff_datetime}</p>
        )}
      </div>

      {/* Total Cost Display */}
      {totalCost > 0 && (
        <div className="bg-linear-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border-2 border-primary-200">
          <div className="flex items-center justify-between">
            <span className="text-neutral-700 font-medium">Estimated Total:</span>
            <span className="text-3xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ₹{totalCost}
            </span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!vehicle?.is_available_for_booking}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
          vehicle?.is_available_for_booking
            ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white hover:shadow-glow transform hover:scale-105 cursor-pointer'
            : 'border-2 border-neutral-300 text-neutral-400 cursor-not-allowed'
        }`}
      >
        <span>{vehicle?.is_available_for_booking ? 'Confirm Booking' : 'Not Available'}</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </form>
  );
};

export default BookingForm;
