import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const VendorPage = () => {
  const navigate = useNavigate();
  const { registerVendor } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    is_organization: false,
    company_name: '',
    contact_number: '',
    email: '',
    id_type: '',
    document: null,
    address: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadingDoc(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch(API_ENDPOINTS.uploadFile, {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();

      if (data.status === 'success') {
        setDocumentUrl(data.data.url);
        alert('Document uploaded successfully!');
      } else {
        alert('Error uploading document');
      }
    } catch (error) {
      alert('Error uploading document: ' + error.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (formData.is_organization && !formData.company_name) {
      newErrors.company_name = 'Company/Organization name is required';
    }
    if (!formData.contact_number) newErrors.contact_number = 'Contact number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.id_type) newErrors.id_type = 'ID type is required';
    if (!documentUrl) newErrors.document = 'Document upload is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const result = await registerVendor({
          name: formData.name,
          is_organization: formData.is_organization,
          company_name: formData.company_name || undefined,
          contact_number: formData.contact_number,
          email: formData.email,
          id_type: formData.id_type,
          document_url: documentUrl,
          address: formData.address,
          password: formData.password
        });

        setLoading(false);

        if (result.success) {
          alert(result.message || 'Vendor registration successful! Your account is pending verification. Please login after verification.');
          navigate('/login');
        } else {
          alert(result.message || 'Error registering vendor. Please try again.');
        }
      } catch (error) {
        setLoading(false);
        alert('Error registering vendor: ' + error.message);
      }
    }
  };

  const getIdTypeOptions = () => {
    if (formData.is_organization) {
      return [
        { value: '', label: 'Select ID Type' },
        { value: 'business_reg_certificate', label: 'Business Registration Certificate' },
        { value: 'business_tax_id', label: 'Business Tax ID' },
      ];
    } else {
      return [
        { value: '', label: 'Select ID Type' },
        { value: 'pan', label: 'PAN Card' },
        { value: 'license', label: 'Driving License' },
        { value: 'passport', label: 'Passport' },
        { value: 'adhaar', label: 'Aadhaar Card' },
      ];
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

      {/* Registration Form */}
      <section className="mb-16 mt-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-card p-8 border border-primary-200">
            <h2 className="text-3xl text-center font-display font-bold text-primary-500 mb-2">
              Vendor Registration
            </h2>
            <p className="text-center text-neutral-600 mb-8">
              Fill out the form below to register as a vendor.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    errors.name ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                  }`}
                  placeholder="Enter your name"
                />
                {errors.name && <p className="mt-1 text-sm text-secondary-600">{errors.name}</p>}
              </div>

              {/* Register as Organization Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_organization"
                  id="is_organization"
                  checked={formData.is_organization}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_organization" className="ml-2 text-sm font-semibold text-neutral-700">
                  Register as a Company/Organization
                </label>
              </div>

              {/* Company Name (conditional) */}
              {formData.is_organization && (
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Company/Organization Name *
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                      errors.company_name ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                    }`}
                    placeholder="Enter company/organization name"
                  />
                  {errors.company_name && <p className="mt-1 text-sm text-secondary-600">{errors.company_name}</p>}
                </div>
              )}

              {/* Contact Number and Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Contact Number *
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
                    Email Address *
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

              {/* ID Type */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  ID Type *
                </label>
                <select
                  name="id_type"
                  value={formData.id_type}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    errors.id_type ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                  }`}
                >
                  {getIdTypeOptions().map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.id_type && <p className="mt-1 text-sm text-secondary-600">{errors.id_type}</p>}
              </div>

              {/* Document Upload (conditional on id_type) */}
              {formData.id_type && (
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Upload Document *
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    disabled={uploadingDoc}
                  />
                  {uploadingDoc && <p className="mt-1 text-sm text-primary-600">Uploading...</p>}
                  {documentUrl && <p className="mt-1 text-sm text-green-600">✓ Document uploaded successfully</p>}
                  {errors.document && <p className="mt-1 text-sm text-secondary-600">{errors.document}</p>}
                </div>
              )}

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Personal/Business Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    errors.address ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                  }`}
                  placeholder="Enter your address"
                />
                {errors.address && <p className="mt-1 text-sm text-secondary-600">{errors.address}</p>}
              </div>

              {/* Password */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                      errors.password ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                    }`}
                    placeholder="Enter password"
                  />
                  {errors.password && <p className="mt-1 text-sm text-secondary-600">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                      errors.confirm_password ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                    }`}
                    placeholder="Confirm password"
                  />
                  {errors.confirm_password && <p className="mt-1 text-sm text-secondary-600">{errors.confirm_password}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || uploadingDoc}
                className="w-full py-4 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-lg hover:shadow-glow transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Submitting...' : 'Register as Vendor'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VendorPage;