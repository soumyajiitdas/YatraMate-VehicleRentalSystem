import { Link } from 'react-router-dom';

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
    <div className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
            isAvailable 
              ? 'bg-green-500/90 text-white' 
              : 'bg-neutral-500/90 text-white'
          }`}>
            {isAvailable ? 'Available' : 'Not Available'}
          </span>
        </div>
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-linear-to-r from-primary-500 to-secondary-500 text-white backdrop-blur-sm capitalize">
            {type}
          </span>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">
              {name}
            </h3>
            <p className="text-sm text-neutral-600 mt-0.5">
              {brand} • {model_name}
            </p>
            {cc_engine && (
              <p className="text-xs text-neutral-500 mt-1 flex items-center">
                <span className="font-semibold">Engine:</span>&nbsp;{cc_engine}cc
              </p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-neutral-600 mb-4">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{location}</span>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-primary-600">₹{price_per_day}</span>
              <span className="text-sm text-neutral-500">/day</span>
            </div>
            {price_per_km && (
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-sm text-neutral-600">₹{price_per_km}</span>
                <span className="text-xs text-neutral-500">/km</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/vehicles/${_id}`}
          className={`block w-full py-3 px-4 rounded-xl font-semibold text-center transition-all duration-200 ${
            isAvailable
              ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white hover:shadow-glow transform hover:scale-105'
              : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
          }`}
        >
          {isAvailable ? 'Book Now' : 'Not Available'}
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;
