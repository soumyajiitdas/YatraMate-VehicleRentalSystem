import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Mail, Lock, Phone, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

const getPasswordStrength = (password) => {
  let strength = 0;
  if (!password) return strength;
  if (password.length >= 6) strength += 1;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return Math.min(strength, 4);
};

const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;
    
    // Handle phone number with automatic +91 prefix
    if (name === 'phone') {
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+91[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        const result = await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
        setLoading(false);

        if (result.success) {
          if (result.requiresVerification || result.data?.requiresVerification) {
            toast.success(result.message || 'Registration successful! Please verify your email.');
            navigate('/verify-otp', { state: { email: formData.email } });
          } else {
            toast.success('Registration successful!');
            navigate('/');
          }
        } else {
          toast.error(result.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        setLoading(false);
        toast.error('Error during registration: ' + error.message);
      }
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const result = await googleLogin(tokenResponse.access_token, 'user');
        setLoading(false);

        if (result.success) {
          toast.success('Registration/Login successful!');
          navigate('/');
        } else {
          toast.error(result.message || 'Google registration failed.');
        }
      } catch (error) {
        setLoading(false);
        toast.error('Error during Google registration: ' + error.message);
      }
    },
    onError: () => {
      toast.error('Google registration failed');
    }
  });

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Left Column - Branding/Image */}
      <div 
        className="hidden lg:flex w-1/2 text-white p-12 relative flex-col justify-between overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop")' }}
      >
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/80 to-neutral-900/90 z-0"></div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-12 group">
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="mt-8">
            <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Join the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-300">
                YatraMate
              </span> family
            </h1>
            <p className="text-xl text-primary-100 max-w-md leading-relaxed mb-8">
              Create an account and get exclusive access to premium vehicles, special discounts, and a seamless booking experience.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center text-white/90">
                <CheckCircle2 className="w-6 h-6 mr-3 text-green-400" />
                <span>Fast and secure bookings</span>
              </div>
              <div className="flex items-center text-white/90">
                <CheckCircle2 className="w-6 h-6 mr-3 text-green-400" />
                <span>Wide range of premium vehicles</span>
              </div>
              <div className="flex items-center text-white/90">
                <CheckCircle2 className="w-6 h-6 mr-3 text-green-400" />
                <span>24/7 customer support</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-sm text-primary-200">
          © {new Date().getFullYear()} YatraMate. All rights reserved.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative overflow-y-auto">
        <div className="w-full max-w-md space-y-6 animate-fade-in py-8">
          
          <div className="lg:hidden text-center mb-6">
            <h2 className="text-3xl font-bold text-neutral-900">Create <span className='text-red-600'>Account</span> </h2>
            <p className="text-neutral-600 mt-2">Enter your details to create your account</p> 
          </div>

          <div className="hidden lg:block text-left mb-6">
            <h2 className="text-4xl font-display font-bold text-neutral-900">Sign <span className='text-red-600'>Up</span> </h2>
            <p className="text-neutral-600 mt-2">Enter your details to create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Full Name
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-neutral-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 ${
                    errors.name ? 'border-secondary-500 bg-secondary-50' : 'border-neutral-200 focus:border-primary-500 focus:bg-white'
                  }`}
                  placeholder="Your Name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-secondary-600 flex items-center"><span className="mr-1">⚠️</span>{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-neutral-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 ${
                    errors.email ? 'border-secondary-500 bg-secondary-50' : 'border-neutral-200 focus:border-primary-500 focus:bg-white'
                  }`}
                  placeholder="yourname@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-secondary-600 flex items-center"><span className="mr-1">⚠️</span>{errors.email}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Phone className="w-4.5 h-4.5 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                  <span className="ml-1.5 text-neutral-600 font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone.replace('+91', '')}
                  onChange={handleChange}
                  className={`w-full pl-20 pr-4 py-3 bg-neutral-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 ${
                    errors.phone ? 'border-secondary-500 bg-secondary-50' : 'border-neutral-200 focus:border-primary-500 focus:bg-white'
                  }`}
                  placeholder="0000000000"
                  maxLength="10"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-secondary-600 flex items-center"><span className="mr-1">⚠️</span>{errors.phone}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-neutral-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 ${
                    errors.password ? 'border-secondary-500 bg-secondary-50' : 'border-neutral-200 focus:border-primary-500 focus:bg-white'
                  }`}
                  placeholder="Create a strong password"
                />
              </div>
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex flex-1 space-x-1 h-1.5 rounded-full overflow-hidden bg-neutral-200">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 h-full transition-colors duration-300 ${
                          passwordStrength >= level ? strengthColors[passwordStrength] : 'bg-transparent'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <span className={`text-xs font-semibold ${
                    passwordStrength <= 1 ? 'text-red-500' : 
                    passwordStrength === 2 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
              {errors.password && <p className="mt-1 text-sm text-secondary-600 flex items-center"><span className="mr-1">⚠️</span>{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-neutral-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 ${
                    errors.confirmPassword ? 'border-secondary-500 bg-secondary-50' : 'border-neutral-200 focus:border-primary-500 focus:bg-white'
                  }`}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-secondary-600 flex items-center"><span className="mr-1">⚠️</span>{errors.confirmPassword}</p>}
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 w-4.5 h-4.5 text-primary-600 border-2 border-neutral-300 rounded focus:ring-primary-500 transition-colors cursor-pointer"
                />
                <span className="ml-3 text-sm text-neutral-600 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="font-bold text-primary-600 hover:text-primary-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-bold text-primary-600 hover:text-primary-700">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && <p className="mt-1 text-sm text-secondary-600 flex items-center"><span className="mr-1">⚠️</span>{errors.agreeToTerms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 bg-linear-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5.5 w-5.5 border-t-2 border-b-2 border-white"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500 font-medium">Or sign up with</span>
            </div>
          </div>

          {/* Google Button */}
          <button 
            type="button"
            onClick={() => handleGoogleLogin()}
            className="w-full flex items-center justify-center px-4 py-3.5 border-2 border-neutral-200 rounded-xl hover:border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 transition-all duration-200 group"
          >
            <svg className="w-5.5 h-5.5 mr-3 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-base font-bold text-neutral-700">Google</span>
          </button>

          {/* Sign In Link */}
          <div className="text-center pt-2">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors duration-200">
                Sign in
              </Link>
            </p>
          </div>
          
          <div className="lg:hidden text-center mt-4 pb-4">
            <Link to="/" className="inline-flex items-center text-neutral-500 hover:text-neutral-800 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
