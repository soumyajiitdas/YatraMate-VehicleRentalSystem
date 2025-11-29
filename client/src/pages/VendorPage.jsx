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
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
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
    {
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Earn More',
      description: 'Increase your income by renting out your vehicles',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Grow Business',
      description: 'Reach thousands of customers across India',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Secure Platform',
      description: 'Safe and secure transactions with insurance',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Easy Management',
      description: 'Manage your fleet with our intuitive dashboard',
      gradient: 'from-orange-500 to-red-500'
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-primary-600 via-secondary-600 to-primary-700 text-white py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-40 hidden sm:block">
          <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Become a Vendor Partner
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Join YatraMate and start earning by listing your vehicles. Reach millions of customers and grow your business with us.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-linear-to-b from-white to-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
              Why Partner With Us <span className='text-primary-600'>?</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Join thousands of successful vendors and unlock exclusive benefits
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50 border-2 border-primary-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-5 sm:p-8 text-center transform hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 sm:h-20 sm:w-20 bg-linear-to-br ${benefit.gradient} rounded-2xl text-white mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  {benefit.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-3">{benefit.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-20 mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-red-200">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-4 bg-linear-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-3">
                Vendor Registration
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Fill out the form below to register as a vendor and start your journey with us.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center text-sm font-bold text-neutral-700 mb-3">
                  <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-5 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-sm ${errors.name ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                    }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-2 text-sm text-secondary-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>}
              </div>

              {/* Register as Organization Checkbox */}
              <div className="bg-linear-to-br from-primary-50 to-secondary-50 rounded-xl p-5 border-2 border-primary-100">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_organization"
                    id="is_organization"
                    checked={formData.is_organization}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <label htmlFor="is_organization" className="ml-3 text-sm font-bold text-neutral-800 cursor-pointer flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Register as a Company/Organization
                  </label>
                </div>
              </div>

              {/* Company Name (conditional) */}
              {formData.is_organization && (
                <div className="animate-slide-in">
                  <label className="flex items-center text-sm font-bold text-neutral-700 mb-3">
                    <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Company/Organization Name *
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className={`w-full px-5 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-sm ${errors.company_name ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                      }`}
                    placeholder="Enter company/organization name"
                  />
                  {errors.company_name && <p className="mt-2 text-sm text-secondary-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.company_name}
                  </p>}
                </div>
              )}

              {/* Contact Number and Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-bold text-neutral-700 mb-3">
                    <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    className={`w-full px-5 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-sm ${errors.contact_number ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                      }`}
                    placeholder="+91 XXXXXXXXXX"
                  />
                  {errors.contact_number && <p className="mt-2 text-sm text-secondary-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.contact_number}
                  </p>}
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-neutral-700 mb-3">
                    <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-5 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-sm ${errors.email ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                      }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="mt-2 text-sm text-secondary-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>}
                </div>
              </div>

              {/* ID Type */}
              <div>
                <label className="flex items-center text-sm font-bold text-neutral-700 mb-3">
                  <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  ID Type *
                </label>
                <select
                  name="id_type"
                  value={formData.id_type}
                  onChange={handleChange}
                  className={`w-full px-5 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-sm font-medium ${errors.id_type ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                    }`}
                >
                  {getIdTypeOptions().map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.id_type && <p className="mt-2 text-sm text-secondary-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.id_type}
                </p>}
              </div>

              {/* Document Upload (conditional on id_type) */}
              {formData.id_type && (
                <div className="animate-slide-in">
                  <label className="flex items-center text-sm font-bold text-neutral-700 mb-3">
                    <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Document *
                  </label>
                  <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${uploadingDoc ? 'border-primary-300 bg-primary-50' : documentUrl ? 'border-green-300 bg-green-50' : 'border-neutral-300 hover:border-primary-400 bg-neutral-50'
                    }`}>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingDoc}
                    />
                    <div className="text-center">
                      {uploadingDoc ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-3"></div>
                          <p className="text-sm font-semibold text-primary-600">Uploading document...</p>
                        </div>
                      ) : documentUrl ? (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-green-600">Document uploaded successfully!</p>
                          <p className="text-xs text-neutral-500 mt-1">Click to replace</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-neutral-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm font-semibold text-neutral-700 mb-1">Click to upload or drag and drop</p>
                          <p className="text-xs text-neutral-500">PDF or Image (Max 2MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.document && <p className="mt-2 text-sm text-secondary-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.document}
                  </p>}
                </div>
              )}

              {/* Address */}
              <div>
                <label className="flex items-center text-sm font-bold text-neutral-700 mb-3">
                  <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Personal/Business Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-5 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-sm resize-none ${errors.address ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                    }`}
                  placeholder="Enter your complete address"
                />
                {errors.address && <p className="mt-2 text-sm text-secondary-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.address}
                </p>}
              </div>

              {/* Password */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-bold text-neutral-700 mb-3">
                    <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-5 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-sm ${errors.password ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                      }`}
                    placeholder="Create a strong password"
                  />
                  {errors.password && <p className="mt-2 text-sm text-secondary-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>}
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-neutral-700 mb-3">
                    <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={`w-full px-5 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-sm ${errors.confirm_password ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
                      }`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirm_password && <p className="mt-2 text-sm text-secondary-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.confirm_password}
                  </p>}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || uploadingDoc}
                  className="w-full py-4 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-lg hover:shadow-glow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Register as Vendor
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VendorPage;