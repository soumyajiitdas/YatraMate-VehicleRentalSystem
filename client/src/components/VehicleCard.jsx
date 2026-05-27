import { Link } from 'react-router-dom';
import { Car, Bike, MapPin, ArrowUpRight, Fuel, Gauge } from 'lucide-react';

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
  const TypeIcon = type === 'car' ? Car : Bike;

  return (
    <article
      className="group relative bg-white rounded-[28px] overflow-hidden border border-ink-100 hover:border-ink-900 transition-all duration-500 shadow-card hover:shadow-card-hover transform hover:-translate-y-2"
      data-testid={`vehicle-card-${_id}`}
    >
      {/* Image */}
      <div className="relative h-60 overflow-hidden bg-gradient-to-br from-ink-50 via-white to-primary-50">
        {/* Decorative grid */}
        <div className="absolute inset-0 dot-grid opacity-40" />

        <img
          src={imageUrl}
          alt={name}
          className="relative w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-[1200ms] ease-out"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Top row */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md text-ink-900 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
            <TypeIcon className="w-3.5 h-3.5 text-primary-500" />
            <span>{type}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md ${isAvailable
                ? 'bg-green-500 text-white'
                : 'bg-white/95 text-ink-500'
              }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-white animate-pulse' : 'bg-ink-200'}`} />
            <span>{isAvailable ? 'Available' : 'Booked'}</span>
          </div>
        </div>

        {/* Brand watermark */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/80 bg-ink-900/70 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">
            {brand}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-xl font-display font-bold text-ink-900 leading-tight truncate group-hover:text-primary-600 transition-colors duration-300">
              {name}
            </h3>
            <p className="text-xs text-ink-500 font-medium mt-0.5 truncate">{model_name}</p>
          </div>
          {cc_engine && (
            <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-ink-50 group-hover:bg-primary-50 text-ink-700 group-hover:text-primary-700 text-[11px] font-bold rounded-md transition-colors duration-300">
              <Gauge className="w-3 h-3" />
              {cc_engine}cc
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-ink-500 text-xs font-medium mb-5">
          <MapPin className="w-3.5 h-3.5 text-primary-500" />
          <span className="truncate">{location}</span>
        </div>

        {/* Pricing */}
        <div className="relative bg-primary-50 border border-primary-100 rounded-2xl p-4 mb-4 overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl" />

          <div className="relative flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary-600 font-semibold mb-1">Per Day</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-display font-bold text-primary-700">₹{price_per_day}</span>
              </div>
            </div>
            {price_per_km && (
              <div className="text-right pl-3 border-l border-primary-200">
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary-600 font-semibold mb-1">Per KM</p>
                <span className="text-xl font-display font-bold text-primary-600">₹{price_per_km}</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/vehicles/${_id}`}
          aria-disabled={!isAvailable}
          onClick={(e) => !isAvailable && e.preventDefault()}
          data-testid={`vehicle-book-btn-${_id}`}
          className={`group/cta relative flex items-center justify-between px-5 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 overflow-hidden ${isAvailable
              ? 'bg-primary-500 text-white hover:bg-primary-600 cursor-pointer shadow-lg hover:shadow-xl'
              : 'bg-ink-100 text-ink-400 cursor-not-allowed'
            }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isAvailable ? (
              <>
                <Fuel className="w-4 h-4" />
                Reserve Now
              </>
            ) : (
              'Unavailable'
            )}
          </span>
          {isAvailable && (
            <span className="relative z-10 w-8 h-8 bg-white text-primary-600 rounded-full flex items-center justify-center group-hover/cta:rotate-45 transition-all duration-300">
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            </span>
          )}
        </Link>
      </div>
    </article>
  );
};

export default VehicleCard;