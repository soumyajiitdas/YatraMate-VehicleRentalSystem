import { useState } from 'react';
import { Link } from 'react-router-dom';

const HelpCenterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeGuide, setActiveGuide] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    // Simulate form submission
    setTimeout(() => {
      setFormStatus({
        type: 'success',
        message: 'Thank you for contacting us! We\'ll get back to you within 24 hours.'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const quickLinks = [
    {
      title: 'FAQs',
      description: 'Find answers to frequently asked questions',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: '/faq',
      color: 'from-primary-500 to-secondary-600'
    },
    {
      title: 'Booking Help',
      description: 'Learn how to book and manage your rentals',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      path: '/faq',
      color: 'from-secondary-500 to-primary-600'
    },
    {
      title: 'Payment Issues',
      description: 'Get help with payments and refunds',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      path: '/faq',
      color: 'from-accent-500 to-primary-600'
    },
    {
      title: 'Account Support',
      description: 'Manage your account and profile settings',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      path: '/profile',
      color: 'from-primary-600 to-accent-600'
    }
  ];

  const contactMethods = [
    {
      title: 'Email Support',
      value: 'support@yatramate.com',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      link: 'mailto:support@yatramate.com'
    },
    {
      title: '24/7 Phone Support',
      value: '+91-000-000-0000',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      link: 'tel:+910000000000'
    },
    {
      title: 'Live Chat',
      value: 'Available 24/7',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      link: '#'
    },
    {
      title: 'Office Address',
      value: '123 Business Park, Tech City, India',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      link: '#'
    }
  ];

  // Comprehensive User Guides
  const userGuides = [
    {
      id: 'customer',
      title: 'Customer Guide',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-600',
      sections: [
        {
          title: 'How to Book a Vehicle',
          steps: [
            'Browse our vehicle catalog and select your preferred car or bike',
            'Click on the vehicle to view detailed specifications and pricing',
            'Select your pickup date and time using the booking form',
            'Review the cost breakdown showing hourly/daily rates',
            'Pay 40% advance amount securely via Razorpay (cards, UPI, wallets)',
            'Receive booking confirmation via email with Bill ID',
            'Visit our office at the scheduled time with valid ID proof'
          ]
        },
        {
          title: 'Document Requirements for Pickup',
          steps: [
            'Original valid driving license (two-wheeler for bikes, four-wheeler for cars)',
            'Government-issued ID proof (Aadhaar, PAN, Voter ID, or Passport)',
            'Booking confirmation email or Bill ID',
            'Payment receipt for advance amount'
          ]
        },
        {
          title: 'During Your Rental Period',
          steps: [
            'Drive safely and follow all traffic rules',
            'Do not exceed the vehicle\'s carrying capacity',
            'Maintain the fuel level as provided at pickup',
            'Report any accidents or issues immediately to our 24/7 helpline',
            'Keep the booking confirmation handy for verification'
          ]
        },
        {
          title: 'Returning the Vehicle',
          steps: [
            'Return the vehicle to the same pickup location',
            'Our staff will record the odometer reading',
            'Vehicle inspection will be conducted for any damages',
            'Final cost calculated based on distance + time used',
            'Pay remaining 60% amount (cash or online)',
            'Receive final receipt and trip summary'
          ]
        },
        {
          title: 'Cancellation & Refund Process',
          steps: [
            'Login to your account and go to "My Bookings"',
            'Select the booking you want to cancel',
            'Click "Cancel Booking" and provide a reason',
            'Refund amount depends on cancellation timing (see Terms)',
            'Refunds are processed within 7-10 business days',
            'Track refund status in your bookings page'
          ]
        }
      ]
    },
    {
      id: 'vendor',
      title: 'Vendor Guide',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-600',
      sections: [
        {
          title: 'Vendor Registration Process',
          steps: [
            'Visit the "Become a Vendor" page',
            'Fill in personal/organization details',
            'Upload valid ID proof (PAN, Aadhaar, License, or Business Certificate)',
            'Set your account password',
            'Verify your email with OTP sent to your registered email',
            'Wait for admin approval (usually within 24-48 hours)',
            'Once approved, access your Vendor Dashboard'
          ]
        },
        {
          title: 'Adding a Vehicle',
          steps: [
            'Login to your Vendor Dashboard',
            'Click "Add Vehicle" button',
            'Enter vehicle details: Name, Model, Brand, Type (Bike/Car)',
            'Provide registration, engine, and chassis numbers',
            'Enter engine CC (determines pricing package automatically)',
            'Upload RC document and valid insurance (max 1MB each)',
            'Upload 5 vehicle images (4 sides + interior, max 1MB each)',
            'Submit for admin review',
            'Once approved, your vehicle goes live for booking'
          ]
        },
        {
          title: 'Managing Your Fleet',
          steps: [
            'View all your vehicles in the "Vehicles" tab',
            'Track each vehicle\'s availability status (Available/Booked/Maintenance)',
            'Monitor total bookings, distance traveled, and earnings per vehicle',
            'Delete vehicles no longer available for rental',
            'Vehicle becomes unavailable automatically when booked'
          ]
        },
        {
          title: 'Tracking Earnings',
          steps: [
            'Access the "Earnings" tab in your dashboard',
            'Filter earnings by day, week, month, or year',
            'View detailed breakdown: pickup/return dates, distance, costs',
            'Track currently booked vehicles count',
            'Monitor total earnings across all vehicles',
            'Earnings are calculated after customer return and final payment'
          ]
        },
        {
          title: 'Commission & Payment Structure',
          steps: [
            'YatraMate charges a platform commission on each booking',
            'Earnings are credited after successful vehicle return',
            'View detailed earnings history in your dashboard',
            'Pricing is automatically set based on vehicle CC and type',
            'Price includes hourly and per-kilometer rates'
          ]
        }
      ]
    },
    {
      id: 'staff',
      title: 'Office Staff Guide',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-600',
      sections: [
        {
          title: 'Processing Vehicle Pickup',
          steps: [
            'Access "Pending Requests" tab in your dashboard',
            'Verify customer identity with valid government ID',
            'Record ID proof type and number in the system',
            'Note the starting odometer reading',
            'Verify vehicle plate number matches booking',
            'Click "Complete Pickup" to generate Bill ID',
            'Hand over vehicle keys and booking receipt to customer'
          ]
        },
        {
          title: 'Processing Vehicle Return',
          steps: [
            'Access "Active Bookings" tab',
            'Note the ending odometer reading',
            'Inspect vehicle for any damages',
            'If damaged: select "Damaged", enter cost and description',
            'System calculates final cost (distance × rate + time × rate + damages)',
            'Collect remaining payment (cash or online via Razorpay)',
            'Click "Verify Return" to complete the booking'
          ]
        },
        {
          title: 'Rejecting a Booking',
          steps: [
            'From "Pending Requests", click "Reject Booking"',
            'Provide a valid rejection reason (mandatory)',
            'Customer receives notification with reason',
            'Refund is automatically initiated for advance payment',
            'Booking moves to "Cancelled" section'
          ]
        },
        {
          title: 'Handling Refunds',
          steps: [
            'View cancelled bookings in "Cancelled" tab',
            'Check if refund is pending',
            'After processing refund manually, click "Mark Refund as Returned"',
            'Update refund status for customer visibility',
            'Keep records for accounting purposes'
          ]
        },
        {
          title: 'Best Practices',
          steps: [
            'Always verify customer ID thoroughly before vehicle handover',
            'Take photos of vehicle condition at pickup and return',
            'Document any pre-existing damages clearly',
            'Be polite and professional with all customers',
            'Report any suspicious activity to management immediately',
            'Keep login credentials secure and confidential'
          ]
        }
      ]
    }
  ];

  // Troubleshooting Guide
  const troubleshooting = [
    {
      issue: 'Payment Failed',
      solution: 'Check your card/UPI details, ensure sufficient balance, try another payment method, or contact your bank. If amount is deducted but booking failed, contact support with payment ID.'
    },
    {
      issue: 'OTP Not Received',
      solution: 'Check spam/junk folder, wait 2-3 minutes, click "Resend OTP". Ensure email address is correct. If issue persists, try a different email or contact support.'
    },
    {
      issue: 'Cannot Login',
      solution: 'Use "Forgot Password" to reset. Ensure you\'re using the correct email. Clear browser cache and try again. If account is locked, wait 30 minutes or contact support.'
    },
    {
      issue: 'Booking Not Showing',
      solution: 'Refresh the page and check "My Bookings". Verify payment was successful. Check spam folder for confirmation email. Contact support with payment ID if issue persists.'
    },
    {
      issue: 'Vehicle Not Available',
      solution: 'The vehicle might be booked by another customer. Try different dates or browse similar vehicles in the same category.'
    },
    {
      issue: 'Refund Not Received',
      solution: 'Refunds take 7-10 business days. Check your original payment method. For UPI/cards, contact your bank with refund reference ID provided in confirmation email.'
    },
    {
      issue: 'Document Upload Failed',
      solution: 'Ensure file is under 1MB. Use JPG, PNG, or PDF format. Check internet connection. Try compressing the image before uploading.'
    },
    {
      issue: 'Vendor Application Pending',
      solution: 'Applications are reviewed within 24-48 hours. Ensure all documents are clear and valid. Check email for any rejection reason or additional document requests.'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 
            data-testid="help-center-title"
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-6"
          >
            How Can We <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-secondary-600">Help You?</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600">
            Comprehensive guides for customers, vendors, and staff. Get the support you need, whenever you need it.
          </p>
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

      {/* Quick Links Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">Quick Help <span className='text-red-500'>:</span></h2>
            <p className="text-neutral-600">Browse these common topics to find quick answers</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                data-testid={`quick-link-${index}`}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-2 border-primary-100 hover:border-primary-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className={`w-16 h-16 bg-linear-to-r ${link.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {link.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">{link.title}</h3>
                <p className="text-neutral-600 text:xs sm:text-sm">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* User Guides Section */}
      <section className="py-12 md:py-16 bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">Detailed User Guides <span className='text-red-500'>:</span></h2>
            <p className="text-neutral-600">Step-by-step guides for every user type</p>
          </div>
          
          <div className="space-y-6">
            {userGuides.map((guide, index) => (
              <div 
                key={guide.id}
                data-testid={`user-guide-${guide.id}`}
                className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden"
              >
                {/* Guide Header */}
                <button
                  onClick={() => setActiveGuide(activeGuide === guide.id ? null : guide.id)}
                  className={`w-full px-6 py-5 flex items-center justify-between bg-linear-to-r ${guide.color} text-white`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      {guide.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold">{guide.title}</h3>
                      <p className="text-white/80 text-sm">Click to {activeGuide === guide.id ? 'collapse' : 'expand'} guide</p>
                    </div>
                  </div>
                  <svg 
                    className={`w-6 h-6 transition-transform duration-300 ${activeGuide === guide.id ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Guide Content */}
                <div className={`transition-all duration-300 overflow-hidden ${activeGuide === guide.id ? 'max-h-[5000px]' : 'max-h-0'}`}>
                  <div className="p-6 space-y-8">
                    {guide.sections.map((section, sIdx) => (
                      <div key={sIdx} className="border-b border-neutral-100 pb-6 last:border-b-0 last:pb-0">
                        <h4 className="text-lg font-bold text-neutral-900 mb-4 flex items-center">
                          <span className={`w-8 h-8 bg-linear-to-r ${guide.color} text-white rounded-lg flex items-center justify-center text-sm mr-3`}>
                            {sIdx + 1}
                          </span>
                          {section.title}
                        </h4>
                        <ol className="space-y-3 ml-11">
                          {section.steps.map((step, stepIdx) => (
                            <li key={stepIdx} className="flex items-start">
                              <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shrink-0">
                                {stepIdx + 1}
                              </span>
                              <span className="text-neutral-700">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Troubleshooting Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">Troubleshooting <span className='text-red-500'>:</span></h2>
            <p className="text-neutral-600">Quick solutions to common issues</p>
          </div>
          
          <div className="grid gap-4">
            {troubleshooting.map((item, index) => (
              <div 
                key={index}
                data-testid={`troubleshoot-${index}`}
                className="bg-white rounded-xl p-5 border-2 border-neutral-200 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-neutral-900 mb-2">{item.issue}</h3>
                    <p className="text-neutral-600 text-sm">{item.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-12 md:py-16 bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">Contact Us <span className='text-red-500'>:</span></h2>
            <p className="text-neutral-600">Multiple ways to reach our support team</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                data-testid={`contact-method-${index}`}
                className="bg-linear-to-br from-neutral-50 to-white p-4 sm:p-6 rounded-xl shadow-md border-2 border-neutral-200 hover:shadow-lg transition-all duration-300 hover:border-primary-300 group text-center"
              >
                <div className="w-14 h-14 bg-linear-to-r from-primary-500 to-secondary-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {method.icon}
                </div>
                <h3 className="text-md sm:text-lg font-semibold text-neutral-900 mb-2">{method.title}</h3>
                <p className="text-neutral-600 text-xs sm:text-sm">{method.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 md:py-16 bg-linear-to-b from-white to-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">Send Us a Message <span className='text-red-500'>:</span></h2>
            <p className="text-neutral-600">Fill out the form below and we'll get back to you within 24 hours</p>
          </div>

          <div className="bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50 p-8 md:p-10 rounded-2xl shadow-xl border-2 border-primary-100">
            <form onSubmit={handleSubmit} data-testid="contact-form">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-md font-semibold text-neutral-700 mb-2">
                    Full Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    data-testid="contact-form-name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-md font-semibold text-neutral-700 mb-2">
                    Email Address <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    data-testid="contact-form-email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="your.mail@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone" className="block text-md font-semibold text-neutral-700 mb-2">
                    Phone Number <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    data-testid="contact-form-phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="+91 00000 00000"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-md font-semibold text-neutral-700 mb-2">
                    Subject <span className='text-red-500'>*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    data-testid="contact-form-subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a topic</option>
                    <option value="booking">Booking Issues</option>
                    <option value="payment">Payment & Refunds</option>
                    <option value="vehicle">Vehicle Problems</option>
                    <option value="account">Account Support</option>
                    <option value="vendor">Vendor Registration</option>
                    <option value="staff">Staff Support</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-md font-semibold text-neutral-700 mb-2">
                  Message <span className='text-red-500'>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  data-testid="contact-form-message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border bg-white border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>

              {formStatus.message && (
                <div 
                  data-testid="form-status-message"
                  className={`mb-6 p-4 rounded-lg ${
                    formStatus.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <div className="flex items-center">
                    {formStatus.type === 'success' ? (
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <p>{formStatus.message}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                data-testid="contact-form-submit"
                disabled={isSubmitting}
                className="w-full bg-linear-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-linear-to-r from-primary-600 via-secondary-600 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Need More Help?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Explore our resources or visit our FAQ page for instant answers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/faq"
              data-testid="help-faq-link"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-50 transition-colors duration-200 shadow-xl"
            >
              Browse FAQs
            </Link>
            <Link
              to="/vehicles"
              data-testid="help-browse-vehicles-link"
              className="inline-block bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary-700 transition-colors duration-200 border-2 border-white"
            >
              Browse Vehicles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenterPage;
