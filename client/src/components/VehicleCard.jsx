import { Link } from 'react-router-dom';
import { Car, Motorbike, MapPin } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
  const {
    _id,
    name,
    model_name,
    type,
    brand,
    price_per_day,
    price_per_km,
    cc_engine,
    images,
    availability_status,
    location,
  } = vehicle;

  const isAvailable = availability_status === 'available';
  const imageUrl = images && images.length > 0 ? images[0] : 'https://via.placeholder.com/400x300';

  return (
    <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-3">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-linear-to-br from-neutral-100 to-neutral-200">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
          {/* Type Badge */}
          <span className="p-2 rounded-full text-xs font-bold bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-lg backdrop-blur-sm">
            {type === 'car' ? (
              <Car className="w-4 h-4 group-hover:animate-bounce" />
            ) : (
              <Motorbike className="w-4 h-4 group-hover:animate-bounce" />
            )}
          </span>
          
          {/* Availability Badge */}
          <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-md ${
            isAvailable 
              ? 'bg-green-500/90 text-white' 
              : 'bg-neutral-500/90 text-white'
          }`}>
            {isAvailable ? '✓ Available' : 'Booked'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title Section */}
        <div className="mb-2">
          <h3 className="text-2xl font-bold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600 font-medium">
              {brand} <span className="text-primary-500" >•</span> {model_name}
            </p>
            {cc_engine && (
              <span className="inline-flex items-center px-3 py-1 bg-neutral-100 text-neutral-700 group-hover:bg-primary-100 group-hover:text-primary-600 text-xs font-bold rounded-full">
                {cc_engine}cc
              </span>
            )}
          </div>
        </div>

        {/* Location Section */}
        <div className='mb-4'>
          <div className="flex items-center text-neutral-800 text-xs font-medium">
            <MapPin className="w-4 h-4 mr-2 text-primary-500" />
            <span className="drop-shadow-lg">{location}</span>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-linear-to-br from-primary-50 to-secondary-50 rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-600 font-semibold uppercase tracking-wide mb-1">Daily Rate</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary-600">₹{price_per_day}</span>
                <span className="text-sm text-neutral-500 font-medium">/day</span>
              </div>
            </div>
            {price_per_km && (
              <div className="text-right">
                <p className="text-xs text-neutral-600 font-semibold uppercase tracking-wide mb-1">Per KM</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-secondary-600">₹{price_per_km}</span>
                  <span className="text-xs text-neutral-500 font-medium">/km</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/vehicles/${_id}`}
          className={`block w-full py-3.5 px-4 rounded-xl font-bold text-center transition-all duration-300 ${
            isAvailable
              ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white hover:shadow-glow-lg transform hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
          }`}
        >
          {isAvailable ? (
            <span className="flex items-center justify-center gap-2">
              Book Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          ) : (
            'Not Available'
          )}
        </Link>
      </div>

      {/* Hover Accent Border */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary-200 transition-all duration-500 pointer-events-none" />
    </div>
  );
};

export default VehicleCard;