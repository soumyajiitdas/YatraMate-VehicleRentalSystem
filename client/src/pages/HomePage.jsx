import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import VehicleCard from '../components/VehicleCard';

const HomePage = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock featured vehicles - Replace with API call
  useEffect(() => {
    // This would be an API call to fetch featured vehicles
    const mockVehicles = [
      {
        _id: '1',
        name: 'Honda City',
        model_name: '2023',
        type: 'car',
        brand: 'Honda',
        price_per_day: 2500,
        price_per_hour: 150,
        images: ['https://images.unsplash.com/photo-1760976396211-5546ce83a400?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjByZW50YWx8ZW58MHx8fHwxNzYyNDkyNDI0fDA&ixlib=rb-4.1.0&q=85'],
        availability_status: 'available',
        location: 'Mumbai',
      },
      {
        _id: '2',
        name: 'Royal Enfield Classic',
        model_name: '350',
        type: 'bike',
        brand: 'Royal Enfield',
        price_per_day: 800,
        price_per_hour: 50,
        images: ['https://images.unsplash.com/photo-1738576377901-bf5175eefec1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxiaWtlJTIwcmVudGFsJTIwbW90b3JjeWNsZXxlbnwwfHx8fDE3NjI0OTI0Mjl8MA&ixlib=rb-4.1.0&q=85'],
        availability_status: 'available',
        location: 'Delhi',
      },
      {
        _id: '3',
        name: 'Maruti Swift',
        model_name: 'VXI 2023',
        type: 'car',
        brand: 'Maruti',
        price_per_day: 2000,
        price_per_hour: 120,
        images: ['https://images.unsplash.com/photo-1761320296536-38a4e068b37d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBjYXIlMjByZW50YWx8ZW58MHx8fHwxNzYyNDkyNDI0fDA&ixlib=rb-4.1.0&q=85'],
        availability_status: 'available',
        location: 'Bangalore',
      },
    ];
    setFeaturedVehicles(mockVehicles);
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Instant Booking',
      description: 'Book your vehicle in seconds with our quick and easy process',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Best Prices',
      description: 'Competitive rates with no hidden charges. Pay only for what you use',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Safe & Secure',
      description: 'All vehicles are regularly maintained and insured for your safety',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your queries and concerns',
    },
  ];

  const stats = [
    { label: 'Happy Customers', value: '10,000+' },
    { label: 'Vehicles Available', value: '500+' },
    { label: 'Cities Covered', value: '50+' },
    { label: 'Years Experience', value: '5+' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-primary-600 via-secondary-600 to-primary-700 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-bounce-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl animate-bounce-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-slide-in">
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                🚗 Your Journey Starts Here
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
                Rent Cars & Bikes
                <span className="block mt-2 bg-linear-to-r from-accent-300 to-accent-100 bg-clip-text text-transparent">
                  Anytime, Anywhere
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
                Experience the freedom of the road with YatraMate. Choose from our wide range of cars and bikes at affordable prices.
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-xl">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search for cars or bikes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-neutral-900 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none transition-all duration-200"
                    />
                  </div>
                  <Link
                    to="/vehicles"
                    className="px-8 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200 text-center"
                  >
                    Search
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-white/80 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:block animate-slide-up">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1758411898310-ada9284a3086?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjYXIlMjByZW50YWx8ZW58MHx8fHwxNzYyNDkyNDI0fDA&ixlib=rb-4.1.0&q=85"
                  alt="Vehicle"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white text-neutral-900 rounded-xl shadow-xl p-4 animate-bounce-slow">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-linear-to-br from-primary-500 to-secondary-500 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-600">Verified & Insured</div>
                      <div className="font-bold">All Vehicles</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
              Why Choose YatraMate?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We provide the best vehicle rental experience with unmatched service and quality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary-200"
              >
                <div className="w-16 h-16 bg-linear-to-br from-primary-500 to-secondary-500 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-2">
                Featured Vehicles
              </h2>
              <p className="text-lg text-neutral-600">
                Explore our most popular vehicles
              </p>
            </div>
            <Link
              to="/vehicles"
              className="hidden sm:flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200"
            >
              <span>View All</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Link
              to="/vehicles"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200"
            >
              <span>View All Vehicles</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-primary-600 via-secondary-600 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            Ready to Hit the Road?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and experience the freedom of renting with YatraMate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/vehicles"
              className="px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Browse Vehicles
            </Link>
            <Link
              to="/vendor"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/30 transition-all duration-200"
            >
              Become a Vendor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
