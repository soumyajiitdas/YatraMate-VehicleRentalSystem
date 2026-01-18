import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AboutUsPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const developers = [
    {
      name: 'Soumyajit Das',
      role: 'Project Lead, Full Stack Developer',
      github: 'soumyajiitdas',
      linkedin: 'soumyajiitdas',
      email: 'soumyajit302@gmail.com',
      avatar: 'https://avatars.githubusercontent.com/u/116360739?v=4'
    },
    {
      name: 'Indrajit Ghosh',
      role: 'Frontend Developer',
      github: 'indrajit5000q-lets',
      linkedin: 'indrajit-ghosh-a53291390',
      email: 'indrajit5000q@yatramate.com',
      avatar: 'https://avatars.githubusercontent.com/u/231863193?v=4'
    },
    {
      name: 'Animesh Nandy',
      role: 'Backend Engineer',
      github: 'ani-11-pro',
      linkedin: 'contact-ani',
      email: 'animesh.nandy.04@gmail.com',
      avatar: 'https://avatars.githubusercontent.com/u/217081798?v=4'
    },
    {
      name: 'Joy Bhowmik',
      role: 'Designer, Researcher',
      github: 'joybhowmik_07',
      linkedin: 'joybhowmik_07',
      email: 'joybhowmik07@yatramate.com',
      avatar: 'https://avatars.githubusercontent.com/u/231863193?v=4'
    }
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Trust & Safety',
      description: 'All vehicles are verified with proper documentation. Comprehensive insurance coverage on every rental.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Innovation',
      description: 'Modern tech stack with real-time booking, automated billing, and seamless payment integration.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Customer First',
      description: '24/7 support, transparent pricing with no hidden fees, and hassle-free cancellation policies.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Sustainability',
      description: 'Promoting shared mobility to reduce carbon footprint and supporting local vendors across India.'
    }
  ];

  const milestones = [
    { year: '2025', title: 'Foundation Stage', description: 'Started with a vision to revolutionize vehicle rentals in India' },
    { year: '2026', title: 'Growth Phase', description: 'Expanding to multiple cities with thousands of satisfied customers' },
  ];

  const stats = [
    { number: '1000+', label: 'Registered Users' },
    { number: '15+', label: 'Vehicles Listed' },
    { number: '5+', label: 'Verified Vendors' },
    { number: '3+', label: 'Cities Covered' }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Browse & Select',
      description: 'Search for cars or bikes based on your location, dates, and preferences. Filter by type, price, and availability.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      step: '2',
      title: 'Book Online',
      description: 'Choose your pickup date, time, and location. Complete the booking with your details - no advance payment required!',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      step: '3',
      title: 'Pickup Vehicle',
      description: 'Visit the pickup location with your ID and driving license. Our staff will verify your documents and hand over the vehicle.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      step: '4',
      title: 'Enjoy Your Ride',
      description: 'Hit the road! Use the vehicle for your trip. All vehicles come with comprehensive insurance coverage.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      step: '5',
      title: 'Return & Pay',
      description: 'Return the vehicle at the designated location. Pay based on actual usage (distance or time, whichever is higher).',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  const forWhom = [
    {
      title: 'For Customers',
      description: 'Book cars and bikes hassle-free for daily commute, weekend getaways, or special occasions.',
      features: ['Wide range of vehicles', 'Transparent pricing', 'Easy booking process', 'Small advance payment', '24/7 support'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'For Vendors',
      description: 'List your vehicles and earn money. Reach thousands of customers without marketing hassle.',
      features: ['Easy vehicle listing', 'Earnings dashboard', 'Secure payments', 'Admin support', 'Fleet management'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'For Office Staff',
      description: 'Manage bookings efficiently with our intuitive dashboard designed for smooth operations.',
      features: ['Booking management', 'Pickup/Return processing', 'Document verification', 'Billing system', 'Refund handling'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1
              data-testid="about-page-title"
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-6"
            >
              About <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-secondary-600">YatraMate</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 leading-relaxed">
              Your trusted companion for seamless vehicle rentals. We connect customers with verified vehicles and empower vendors to grow their business - all on one platform.
            </p>
          </div>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-6 w-32 h-32 bg-red-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-6 -left-12 w-20 h-20 bg-blue-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-20 left-4 w-14 h-14 bg-yellow-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-16 right-24 w-28 h-28 bg-pink-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-32 right-10 w-16 h-16 bg-purple-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-44 right-16 w-12 h-12 bg-green-300 rounded-full opacity-50 blur-md" />
          <div className="absolute -bottom-10 right-8 w-24 h-24 bg-red-300 rounded-full opacity-50 blur-md" />
          <div className="absolute -bottom-4 right-24 w-16 h-16 bg-blue-300 rounded-full opacity-50 blur-md" />
          <div className="absolute -bottom-20 right-16 w-12 h-12 bg-yellow-300 rounded-full opacity-50 blur-md" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-secondary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-neutral-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-linear-to-br from-primary-50 to-white p-8 md:p-10 rounded-2xl shadow-lg border border-primary-100">
              <div className="w-16 h-16 bg-linear-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-4">Our Mission <span className='text-red-500'>:</span></h2>
              <p className="text-neutral-700 leading-relaxed">
                To democratize transportation by providing easy access to quality vehicles at affordable prices. We connect vehicle owners with customers, creating a win-win ecosystem where vendors earn and customers travel freely without the burden of ownership.
              </p>
            </div>

            <div className="bg-linear-to-br from-secondary-50 to-white p-8 md:p-10 rounded-2xl shadow-lg border border-secondary-100">
              <div className="w-16 h-16 bg-linear-to-br from-secondary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-4">Our Vision <span className='text-red-500'>:</span></h2>
              <p className="text-neutral-700 leading-relaxed">
                To become India's most trusted vehicle rental platform, setting new standards in customer service, vendor empowerment, and operational excellence. We envision a future where mobility is accessible, affordable, and sustainable for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">How YatraMate Works <span className='text-red-500'>:</span></h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">Simple, transparent, and hassle-free - from booking to return</p>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md border border-neutral-100 hover:shadow-xl transition-all duration-300 relative"
              >
                <div className="absolute -top-4 left-6 w-10 h-10 bg-linear-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {step.step}
                </div>
                <div className="mt-4 mb-4 text-primary-600">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is YatraMate For Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">Who Is YatraMate For <span className='text-red-500'>?</span></h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">Built for everyone in the vehicle rental ecosystem</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {forWhom.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className={`bg-linear-to-r ${item.color} p-6 text-white`}>
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/90 text-sm">{item.description}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-neutral-700">
                        <svg className="w-5 h-5 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">Our Core Values <span className='text-red-500'>:</span></h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-100 hover:border-primary-200 group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">{value.title}</h3>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">What Makes Us Different <span className='text-red-500'>?</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-xl border border-emerald-100">
              <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pay-Per-Use Pricing
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                Only a small advance payment is required! Pay full only after you use the vehicle. Final cost is calculated based on actual distance traveled OR duration. Completely transparent, no hidden charges.
              </p>
            </div>
            <div className="bg-linear-to-br from-blue-50 to-white p-8 rounded-xl border border-blue-100">
              <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                100% Verified
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                Every vehicle on our platform is verified with proper documentation including RC, insurance, and fitness certificates. All vendors go through a thorough verification process before approval.
              </p>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-white p-8 rounded-xl border border-purple-100">
              <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                24/7 Support
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                Round-the-clock customer support via phone, email, and live chat. Our dedicated team is always ready to help you with bookings, issues, or queries.
              </p>
            </div>
            <div className="bg-linear-to-br from-orange-50 to-white p-8 rounded-xl border border-orange-100">
              <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Comprehensive Insurance
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                All vehicles come with comprehensive insurance coverage as per government regulations. Third-party liability and own damage coverage included for your peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-20 bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">Our Journey <span className='text-red-500'>:</span></h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">Key milestones in our growth story</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-linear-to-b from-primary-500 to-secondary-500 hidden md:block" />
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                    <div className="bg-red-50 p-6 rounded-xl shadow-lg border border-neutral-200 inline-block">
                      <div className="text-3xl font-bold text-primary-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{milestone.title}</h3>
                      <p className="text-neutral-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-linear-to-br from-primary-500 to-secondary-600 rounded-full border-4 border-white shadow-lg z-10 my-4 md:my-0" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Developers Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">Meet the Developers <span className='text-red-500'>:</span></h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">The minds behind this application development and implementation</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {developers.map((dev, index) => (
              <div
                key={index}
                data-testid={`developer-card-${index}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="bg-linear-to-br from-primary-500 to-secondary-600 p-6 text-center">
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="w-20 h-20 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">{dev.name}</h3>
                  <p className="text-primary-100 text-xs sm:text-sm">{dev.role}</p>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-center space-x-2 sm:space-x-4">
                    <a
                      href={`https://github.com/${dev.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`developer-github-${index}`}
                      className="w-10 h-10 bg-neutral-100 hover:bg-neutral-900 text-neutral-700 hover:text-white border-2 border-red-100 rounded-lg flex items-center justify-center transition-all duration-200"
                      aria-label={`${dev.name}'s GitHub`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                    </a>
                    <a
                      href={`https://linkedin.com/in/${dev.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`developer-linkedin-${index}`}
                      className="w-10 h-10 bg-neutral-100 hover:bg-blue-600 text-neutral-700 hover:text-white border-2 border-red-100 rounded-lg flex items-center justify-center transition-all duration-200"
                      aria-label={`${dev.name}'s LinkedIn`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href={`mailto:${dev.email}`}
                      data-testid={`developer-email-${index}`}
                      className="w-10 h-10 bg-neutral-100 hover:bg-primary-600 text-neutral-700 hover:text-white border-2 border-red-100 rounded-lg flex items-center justify-center transition-all duration-200"
                      aria-label={`Email ${dev.name}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-linear-to-r from-primary-600 via-secondary-600 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-primary-100 mb-8">Join thousands of happy customers who trust YatraMate for their travel needs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/vehicles"
              data-testid="about-browse-vehicles-btn"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-50 transition-colors duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Browse Vehicles
            </Link>
            <Link
              to="/vendor"
              className="inline-block bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary-700 transition-colors duration-200 border-2 border-white"
            >
              Become a Vendor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
