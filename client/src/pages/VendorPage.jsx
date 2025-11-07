import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VendorPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    vendor_name: '',
    contact_number: '',
    email: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.company_name) newErrors.company_name = 'Company name is required';
    if (!formData.vendor_name) newErrors.vendor_name = 'Your name is required';
    if (!formData.contact_number) newErrors.contact_number = 'Contact number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.address) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      // TODO: API call
      setTimeout(() => {
        setLoading(false);
        alert('Vendor application submitted successfully! We will review and get back to you.');
        navigate('/');
      }, 1000);
    }
  };

  const benefits = [
    { icon: '💰', title: 'Earn More', description: 'Increase your income by renting out your vehicles' },
    { icon: '📊', title: 'Grow Business', description: 'Reach thousands of customers across India' },
    { icon: '🔒', title: 'Secure Platform', description: 'Safe and secure transactions with insurance' },
    { icon: '📱', title: 'Easy Management', description: 'Manage your fleet with our intuitive dashboard' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary-600 via-secondary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Become a Vendor Partner
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Join YatraMate and start earning by listing your vehicles. Reach millions of customers and grow your business with us.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center text-neutral-900 mb-12">
            Why Partner With Us?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{benefit.title}</h3>
                <p className="text-neutral-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-card p-8">
            <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
              Apply Now
            </h2>
            <p className="text-neutral-600 mb-8">
              Fill out the form below and our team will get back to you within 24-48 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Company/Business Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    errors.company_name ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                  }`}
                  placeholder="Enter your company name"
                />
                {errors.company_name && <p className="mt-1 text-sm text-secondary-600">{errors.company_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="vendor_name"
                  value={formData.vendor_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    errors.vendor_name ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                  }`}
                  placeholder="Enter your name"
                />
                {errors.vendor_name && <p className="mt-1 text-sm text-secondary-600">{errors.vendor_name}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                      errors.contact_number ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                    }`}
                    placeholder="+91 XXXXXXXXXX"
                  />
                  {errors.contact_number && <p className="mt-1 text-sm text-secondary-600">{errors.contact_number}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                      errors.email ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-secondary-600">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Business Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    errors.address ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                  }`}
                  placeholder="Enter your business address"
                />
                {errors.address && <p className="mt-1 text-sm text-secondary-600">{errors.address}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-lg hover:shadow-glow transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VendorPage;
