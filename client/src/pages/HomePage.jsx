import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import VehicleCard from '../components/VehicleCard';
import VehicleCardSkeleton from '../components/VehicleCardSkeleton';
import { API_ENDPOINTS } from '../config/api';
import { ChartNoAxesGantt, Motorbike, Sparkles, Star, Users } from 'lucide-react';

const HomePage = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  // Fetch featured vehicles from API
  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.vehiclesFeatured);
        const data = await response.json();
        
        if (data.status === 'success') {
          setFeaturedVehicles(data.data.vehicles);
        }
      } catch (error) {
        console.error('Error fetching featured vehicles:', error);
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchFeaturedVehicles();
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Easy Booking',
      description: 'Browse vehicles, select dates, and book instantly - no advance payment required at booking',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Pay-Per-Use Pricing',
      description: 'Pay only for actual usage after return - based on distance traveled OR time used, whichever is higher',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Verified & Insured',
      description: 'All vehicles verified with proper RC, insurance, and regular maintenance checks for your safety',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '24/7 Support',
      description: 'Round-the-clock customer support via phone, email, and live chat for assistance anytime',
    },
  ];

  const stats = [
    { label: 'Happy Customers', value: '1000+' },
    { label: 'Vehicles Available', value: '15+' },
    { label: 'Cities Covered', value: '3+' },
    { label: 'Years Experience', value: '2+' },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Browse & Select',
      description: 'Search for cars or bikes based on location, dates, and preferences. Filter by type, price, and availability',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      step: '2',
      title: 'Book & Pickup',
      description: 'Choose pickup date, time, and location. Visit our office with your ID and driving license to collect the vehicle',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      step: '3',
      title: 'Return & Pay',
      description: 'Return the vehicle at the designated location. Pay based on actual usage - distance OR time, whichever is higher',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Test Customer 1',
      image: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=FF5722&color=fff&size=128',
      rating: 5,
      comment: 'Excellent service! Booked a car for my business trip. The vehicle was in perfect condition and the process was super smooth.',
    },
    {
      name: 'Priya Sharma',
      role: 'Test Customer 2',
      image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=EF4444&color=fff&size=128',
      rating: 5,
      comment: 'Had an amazing experience renting a bike for my weekend trip. Affordable prices and great customer support. Highly recommended!',
    },
    {
      name: 'Amit Patel',
      role: 'Test Customer 3',
      image: 'https://ui-avatars.com/api/?name=Amit+Patel&background=F59E0B&color=fff&size=128',
      rating: 5,
      comment: 'I have been using YatraMate for over a year now. Always reliable, professional service and well-maintained vehicles.',
    },
  ];

  const vehicleCategories = [
    {
      name: 'Street Cars',
      image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=400&h=300&fit=crop',
      count: '5+',
      gradient: 'from-purple-500 to-pink-500',
      type: "car",
    },
    {
      name: 'SUVs',
      image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=400&h=300&fit=crop',
      count: '3+',
      gradient: 'from-blue-500 to-cyan-500',
      type: "car",
    },
    {
      name: 'Street Bikes',
      image: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?w=400&h=300&fit=crop',
      count: '5+',
      gradient: 'from-green-500 to-emerald-500',
      type: "bike",
    },
    {
      name: 'Sports Bikes',
      image: 'https://images.unsplash.com/photo-1598209279122-8541213a0387?w=400&h=300&fit=crop',
      count: '3+',
      gradient: 'from-orange-500 to-red-500',
      type: "bike",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-primary-600 via-secondary-600 to-primary-700 text-white overflow-hidden">
      {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30 hidden sm:block">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-400 rounded-full blur-3xl animate-bounce-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl animate-bounce-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 animate-slide-in">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <ChartNoAxesGantt className="w-4 h-4" />
                <span className='text-sm'>Your Journey Starts Here</span>
                <Motorbike className="w-6 h-6 animate-pulse" />
                
              </div>
              <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                Rent Cars & Bikes
                <span className="block mt-2 bg-linear-to-r from-accent-300 to-accent-100 bg-clip-text text-transparent">
                  Anytime, Anywhere
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
                Experience the freedom of the road with YatraMate. Choose from our wide range of cars and bikes at affordable prices.
              </p>


              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 sm:pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-white/80 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:block animate-slide-up">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1594486004716-7c9377490b1f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjYXIlMjByZW50YWx8ZW58MHx8fHwxNzYyNDkyNDI0fDA&ixlib=rb-4.1.0&q=85"
                  alt="Vehicle Image"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white text-neutral-900 rounded-xl shadow-xl p-3 sm:p-4 animate-bounce-slow">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 bg-linear-to-br from-primary-500 to-secondary-500 rounded-lg">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-neutral-600">Verified & Insured</div>
                      <div className="text-sm sm:text-base font-bold">All Vehicles</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Scroll Indicator */}
                <div className="hidden sm:block absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-orange-300 rounded-full mt-2"></div>
                    </div>
                </div>
          </div>
        </div>
      </section>

      {/* Vehicle Categories */}
      <section className="py-20 bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
              Browse by Category <span className='text-primary-600'>:</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Find the perfect vehicle for your journey from our diverse collection
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicleCategories.map((category, index) => (
              <Link
                key={index}
                to={`/vehicles?type=${category.type}`}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-2"
                data-testid={`category-${category.name.toLowerCase().replace(' ', '-')}`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-linear-to-br ${category.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                  <h3 className="text-2xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    {category.count} Vehicles
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-20 bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50" data-testid="featured-vehicles-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
            <div className="mb-6 sm:mb-0">
              <div className="inline-block px-4 py-2 bg-accent-100 text-accent-600 rounded-full text-sm font-semibold mb-3">
                <div className='flex items-center space-x-1'>
                  <Star className="w-4 h-4 animate-pulse" />
                  <span>Popular Choices</span>
                </div>
                
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-2">
                Featured Vehicles <span className='text-primary-500'>:</span>
              </h2>
              <p className="text-lg text-neutral-600">
                Explore our most popular and highly-rated vehicles
              </p>
            </div>
            <Link
              to="/vehicles"
              className="hidden sm:flex items-center space-x-2 px-8 py-4 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200"
              data-testid="view-all-vehicles-btn"
            >
              <span>View All</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {loadingVehicles ? (
              // Show skeleton loaders while vehicles are loading
              Array.from({ length: 3}).map((_, index) => (
                <VehicleCardSkeleton key={index} />
              ))
            ) : featuredVehicles.length > 0 ? (
              featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-neutral-500 text-lg">No featured vehicles available at the moment.</p>
              </div>
            )}
          </div>

          <div className="text-center sm:hidden">
            <Link
              to="/vehicles"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200"
            >
              <span>View All Vehicles</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4">
              🤔 Why Choose Us
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
              Why Choose YatraMate <span className='text-primary-600'>?</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We provide the best vehicle rental experience with unmatched service and quality
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-neutral-100 overflow-hidden"
                data-testid={`feature-${feature.title.toLowerCase().replace(' ', '-')}`}
              >
                {/* Decorative gradient background */}
                <div className="absolute inset-0 bg-linear-to-br from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-primary-500 to-secondary-500 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative corner element */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-linear-to-br from-primary-200 to-secondary-200 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
              How It Works <span className='text-primary-600'>:</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Rent a vehicle in three simple steps and hit the road in no time
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-13 left-1/4 right-1/4 h-1 bg-linear-to-r from-primary-200 via-secondary-200 to-primary-200" />
            
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="relative text-center group"
                data-testid={`how-it-works-step-${step.step}`}
              >
                <div className="relative inline-block mb-6">
                  {/* Icon Container */}
                  <div className="w-24 h-24 bg-linear-to-br from-primary-500 to-secondary-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-glow group-hover:scale-110 transition-all duration-300 relative z-10">
                    {step.icon}
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-accent-400 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-20">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Unique Selling Points */}
      <section className="py-20 bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image/Visual */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556740772-1a741367b93e?w=600&h=400&fit=crop"
                  alt="YatraMate App"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-linear-to-br from-primary-600/50 to-secondary-600/50" />
              </div>
              
              {/* Floating Feature Cards */}
              <div className="absolute -right-4 top-1/4 bg-white rounded-xl shadow-xl p-4 animate-bounce-slow">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">GPS Tracking</div>
                    <div className="font-bold text-neutral-900">Live Location</div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-4 bottom-1/4 bg-white rounded-xl shadow-xl p-4 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">Quick Response</div>
                    <div className="font-bold text-neutral-900">24/7 Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div>
                <div className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4">
                  <div className='flex items-center space-x-2'>
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>Premium Features</span>
                  </div>
                  
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
                  Experience Premium Features
                </h2>
                <p className="text-lg text-neutral-600">
                  Our platform offers cutting-edge features to make your rental experience seamless and hassle-free
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div className="shrink-0">
                    <div className="w-12 h-12 bg-linear-to-br from-primary-500 to-secondary-500 text-white rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Real-Time Booking System</h3>
                    <p className="text-neutral-600">Book vehicles instantly with our automated system. Track booking status from request to return in your dashboard</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="shrink-0">
                    <div className="w-12 h-12 bg-linear-to-br from-primary-500 to-secondary-500 text-white rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Document Verification</h3>
                    <p className="text-neutral-600">All vehicles verified with valid RC, insurance, and fitness certificates. Secure ID verification at pickup</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="shrink-0">
                    <div className="w-12 h-12 bg-linear-to-br from-primary-500 to-secondary-500 text-white rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Flexible Payment Options</h3>
                    <p className="text-neutral-600">Pay after usage with cash or online via Razorpay. Multiple payment options including cards, UPI, and wallets</p>
                  </div>
                </div>
              </div>

              <Link
                to="/vehicles"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200"
              >
                <span>Start Your Journey</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-secondary-100 text-secondary-600 rounded-full text-sm font-semibold mb-4">
              <div className='flex items-center space-x-2'>
              <Users className="w-4 h-4 animate-pulse" />
                <span>Customer Reviews</span>
              </div>
              
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
              What Our Customers Say <span className='text-primary-600'>:</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group bg-neutral-50 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-neutral-100"
                data-testid={`testimonial-${index}`}
              >
                {/* Rating Stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-accent-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Comment */}
                <p className="text-neutral-700 mb-6 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center space-x-4 pt-4 border-t border-neutral-200">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full ring-2 ring-primary-200"
                  />
                  <div>
                    <h4 className="font-bold text-neutral-900">{testimonial.name}</h4>
                    <p className="text-sm text-neutral-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-18 bg-linear-to-br from-primary-600 via-secondary-600 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl animate-bounce-slow" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl animate-bounce-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-secondary-300 rounded-full blur-3xl animate-bounce-slow" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
            🎉 Join 1000+ Happy Customers
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-display font-bold mb-6 leading-tight">
            Ready to Hit the Road?
          </h2>
          
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers and experience the freedom of renting with YatraMate. Your perfect ride is just a click away!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/vehicles"
              className="group px-10 py-5 bg-white text-primary-600 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
              data-testid="cta-browse-vehicles-btn"
            >
              <span>Browse Vehicles</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/vendor"
              className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-200"
              data-testid="cta-become-vendor-btn"
            >
              Become a Vendor
            </Link>
          </div>

          {/* Additional Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free Cancellation</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
