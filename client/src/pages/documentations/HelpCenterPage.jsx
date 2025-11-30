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
      value: '+91-1800-123-4567',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      link: 'tel:+911800123456'
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
            Get the support you need, whenever you need it
          </p>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top-left cluster */}
          <div className="absolute -top-10 -left-6 w-32 h-32 bg-red-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-6 -left-12 w-20 h-20 bg-blue-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-20 left-4 w-14 h-14 bg-yellow-300 rounded-full opacity-50 blur-md" />

          {/* Center-right floating grouping */}
          <div className="absolute top-16 right-24 w-28 h-28 bg-pink-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-32 right-10 w-16 h-16 bg-purple-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-44 right-16 w-12 h-12 bg-green-300 rounded-full opacity-50 blur-md" />

          {/* Bottom-right anchor cluster */}
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
                    placeholder="+91 ***** *****"
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
