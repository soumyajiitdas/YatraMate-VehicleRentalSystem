import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { API_ENDPOINTS } from '../config/api';
import CustomDropdown from '../components/common/CustomDropdown';
import { Briefcase, TrendingUp, ShieldCheck, Settings, ArrowUpRight, CheckCircle2, User, Building, Phone, Mail, FileText, MapPin, Lock, FileUp } from 'lucide-react';

const VendorPage = () => {
  const navigate = useNavigate();
  const { registerVendor } = useAuth();
  const { toast } = useToast();
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
    let finalValue = type === 'checkbox' ? checked : value;
    
    // Handle contact_number with automatic +91 prefix
    if (name === 'contact_number') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/[^\d]/g, '');
      if (digitsOnly.length <= 10) {
        finalValue = digitsOnly ? `+91${digitsOnly}` : '';
      } else {
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
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
      toast.warning('File size must be less than 2MB');
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
        toast.success('Document uploaded successfully!');
      } else {
        toast.error('Error uploading document');
      }
    } catch (error) {
      toast.error('Error uploading document: ' + error.message);
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
    if (!formData.contact_number) {
      newErrors.contact_number = 'Contact number is required';
    } else if (!/^\+91[0-9]{10}$/.test(formData.contact_number)) {
      newErrors.contact_number = 'Contact number must be 10 digits';
    }
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
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
          if (result.requiresVerification) {
            toast.success(result.message || 'Please verify your email with the OTP sent.');
            navigate('/verify-otp', { 
              state: { 
                email: formData.email,
                userType: 'vendor'
              } 
            });
          } else {
            toast.success(result.message || 'Vendor registration successful!');
            navigate('/login');
          }
        } else {
          toast.error(result.message || 'Error registering vendor. Please try again.');
        }
      } catch (error) {
        setLoading(false);
        toast.error('Error registering vendor: ' + error.message);
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
      icon: <Briefcase className="w-8 h-8" strokeWidth={2} />,
      title: 'Earn More',
      description: 'Increase your income by renting out your vehicles',
    },
    {
      icon: <TrendingUp className="w-8 h-8" strokeWidth={2} />,
      title: 'Grow Business',
      description: 'Reach thousands of customers across India',
    },
    {
      icon: <ShieldCheck className="w-8 h-8" strokeWidth={2} />,
      title: 'Secure Platform',
      description: 'Safe and secure transactions with insurance',
    },
    {
      icon: <Settings className="w-8 h-8" strokeWidth={2} />,
      title: 'Easy Management',
      description: 'Manage your fleet with our intuitive dashboard',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf7] overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-[#fafaf7] pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-100 text-primary-700 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              Vendor Program
            </div>
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-ink-900 leading-[0.95] tracking-tight mb-6">
              Become a<br />
              <em className="not-italic text-primary-500">Vendor Partner.</em>
            </h1>
            <p className="text-ink-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Join YatraMate and start earning by listing your vehicles. Reach millions of customers and grow your business with us.
            </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 bg-[#fafaf7] -mt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink-900 leading-[0.95] tracking-tight mb-4">
              Why Partner With <em className="not-italic text-primary-500">Us?</em>
            </h2>
            <p className="text-lg text-ink-600 max-w-2xl mx-auto">
              Join thousands of successful vendors and unlock exclusive benefits.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-7 border border-ink-100 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 text-center"
              >
                <div className="w-16 h-16 mx-auto bg-ink-900 text-primary-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-500 group-hover:text-white group-hover:rotate-[-8deg] transition-all duration-500 shadow-lg">
                  {benefit.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-ink-900 mb-2 leading-tight">{benefit.title}</h3>
                <p className="text-ink-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-20 mb-16 bg-[#fafaf7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[40px] shadow-card-hover p-8 md:p-12 border border-ink-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="text-center mb-10 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Get Started
              </div>
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink-900 mb-3 tracking-tight">
                Vendor Registration
              </h2>
              <p className="text-base text-ink-500 max-w-2xl mx-auto">
                Fill out the form below to register as a vendor and start your journey with us.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {/* Name */}
              <div>
                <label className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                  Full Name
                </label>
                <div className={`relative group rounded-2xl bg-white border-2 transition-all duration-200 ${errors.name ? 'border-secondary-500' : 'border-ink-100 focus-within:border-ink-900'}`}>
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-primary-500 transition-colors">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none text-ink-900 placeholder:text-ink-400"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="mt-1.5 text-xs text-secondary-600 font-medium">{errors.name}</p>}
              </div>

              {/* Register as Organization Checkbox */}
              <div className="bg-ink-50 rounded-2xl p-4 border border-ink-100 mt-2">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    name="is_organization"
                    id="is_organization"
                    checked={formData.is_organization}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 border-ink-300 rounded focus:ring-primary-500 cursor-pointer accent-primary-600"
                  />
                  <div className="ml-3 flex items-center gap-2">
                    <Building className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-bold text-ink-900 group-hover:text-primary-600 transition-colors">Register as a Company/Organization</span>
                  </div>
                </label>
              </div>

              {/* Company Name (conditional) */}
              {formData.is_organization && (
                <div className="animate-slide-in">
                  <label className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                    Company/Organization Name
                  </label>
                  <div className={`relative group rounded-2xl bg-white border-2 transition-all duration-200 ${errors.company_name ? 'border-secondary-500' : 'border-ink-100 focus-within:border-ink-900'}`}>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-primary-500 transition-colors">
                      <Briefcase className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="w-full bg-transparent pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none text-ink-900 placeholder:text-ink-400"
                      placeholder="Enter company/organization name"
                    />
                  </div>
                  {errors.company_name && <p className="mt-1.5 text-xs text-secondary-600 font-medium">{errors.company_name}</p>}
                </div>
              )}

              {/* Contact Number and Email */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                    Contact Number
                  </label>
                  <div className={`relative group rounded-2xl bg-white border-2 transition-all duration-200 ${errors.contact_number ? 'border-secondary-500' : 'border-ink-100 focus-within:border-ink-900'}`}>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Phone className="w-4 h-4 text-ink-400 group-focus-within:text-primary-500 transition-colors" />
                      <span className="ml-1.5 text-ink-700 font-semibold text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      name="contact_number"
                      value={formData.contact_number.replace('+91', '')}
                      onChange={handleChange}
                      className="w-full bg-transparent pl-[4.5rem] pr-4 py-3.5 rounded-2xl focus:outline-none text-ink-900 placeholder:text-ink-400"
                      placeholder="0000000000"
                      maxLength="10"
                    />
                  </div>
                  {errors.contact_number && <p className="mt-1.5 text-xs text-secondary-600 font-medium">{errors.contact_number}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                    Email Address
                  </label>
                  <div className={`relative group rounded-2xl bg-white border-2 transition-all duration-200 ${errors.email ? 'border-secondary-500' : 'border-ink-100 focus-within:border-ink-900'}`}>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-primary-500 transition-colors">
                      <Mail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none text-ink-900 placeholder:text-ink-400"
                      placeholder="your.mail@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-secondary-600 font-medium">{errors.email}</p>}
                </div>
              </div>

              {/* ID Type */}
              <div>
                <label className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                  ID Type
                </label>
                <div className={`relative ${errors.id_type ? 'border-secondary-500' : ''}`}>
                  <CustomDropdown
                    options={getIdTypeOptions().filter(opt => opt.value !== '')}
                    value={formData.id_type}
                    onChange={(val) => handleChange({ target: { name: 'id_type', value: val } })}
                    placeholder="Select ID Type"
                  />
                </div>
                {errors.id_type && <p className="mt-1.5 text-xs text-secondary-600 font-medium">{errors.id_type}</p>}
              </div>

              {/* Document Upload */}
              {formData.id_type && (
                <div className="animate-slide-in">
                  <label className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                    Upload Document
                  </label>
                  <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 ${uploadingDoc ? 'border-primary-300 bg-primary-50' : documentUrl ? 'border-green-300 bg-green-50' : 'border-ink-200 hover:border-ink-900 bg-ink-50'
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
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-3"></div>
                          <p className="text-sm font-semibold text-primary-600">Uploading document...</p>
                        </div>
                      ) : documentUrl ? (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          </div>
                          <p className="text-sm font-semibold text-green-600">Document uploaded successfully!</p>
                          <p className="text-xs text-ink-500 mt-1">Click to replace</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-ink-100">
                            <FileUp className="w-5 h-5 text-ink-400" />
                          </div>
                          <p className="text-sm font-semibold text-ink-900 mb-1">Click to upload or drag and drop</p>
                          <p className="text-[10px] text-ink-500 uppercase tracking-wider font-semibold">PDF or Image (Max 2MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.document && <p className="mt-1.5 text-xs text-secondary-600 font-medium">{errors.document}</p>}
                </div>
              )}

              {/* Address */}
              <div>
                <label className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                  Personal/Business Address
                </label>
                <div className={`relative group rounded-2xl bg-white border-2 transition-all duration-200 ${errors.address ? 'border-secondary-500' : 'border-ink-100 focus-within:border-ink-900'}`}>
                  <span className="absolute left-4 top-4 text-ink-400 group-focus-within:text-primary-500 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-transparent pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none text-ink-900 placeholder:text-ink-400 resize-none"
                    placeholder="Enter your complete address"
                  />
                </div>
                {errors.address && <p className="mt-1.5 text-xs text-secondary-600 font-medium">{errors.address}</p>}
              </div>

              {/* Password */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                    Password
                  </label>
                  <div className={`relative group rounded-2xl bg-white border-2 transition-all duration-200 ${errors.password ? 'border-secondary-500' : 'border-ink-100 focus-within:border-ink-900'}`}>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-primary-500 transition-colors">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-transparent pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none text-ink-900 placeholder:text-ink-400"
                      placeholder="Create a strong password"
                    />
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-secondary-600 font-medium">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                    Confirm Password
                  </label>
                  <div className={`relative group rounded-2xl bg-white border-2 transition-all duration-200 ${errors.confirm_password ? 'border-secondary-500' : 'border-ink-100 focus-within:border-ink-900'}`}>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-primary-500 transition-colors">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="w-full bg-transparent pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none text-ink-900 placeholder:text-ink-400"
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirm_password && <p className="mt-1.5 text-xs text-secondary-600 font-medium">{errors.confirm_password}</p>}
                </div>
              </div>

              {/* Terms */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 accent-primary-600 cursor-pointer"
                  />
                  <span className="text-sm text-ink-600 leading-snug">
                    I agree to the{' '}
                    <Link to="/terms" className="font-bold text-ink-900 link-underline">
                      Terms
                    </Link>{' '}
                    &{' '}
                    <Link to="/privacy" className="font-bold text-ink-900 link-underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && <p className="mt-1.5 text-xs text-secondary-600 font-medium">{errors.agreeToTerms}</p>}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || uploadingDoc}
                  className="group relative w-full py-4 bg-ink-900 text-white rounded-full font-bold text-base magnetic shine overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Register as Vendor</span>
                      <span className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                        <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                      </span>
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