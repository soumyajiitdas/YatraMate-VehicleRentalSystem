import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const result = await login({
          email: formData.email,
          password: formData.password
        });
        setLoading(false);

        if (result.success) {
          toast.success('Login successful!');
          const userRole = result.data.user.role;
          if (userRole === 'vendor') {
            navigate('/vendor-dashboard');
          } else if (userRole === 'office_staff') {
            navigate('/office-staff');
          } else if (userRole === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          if (result.requiresVerification && result.email) {
            toast.error(result.message || 'Please verify your email first.');
            navigate('/verify-otp', { 
              state: { 
                email: result.email,
                userType: result.userType || 'user'
              } 
            });
          } else {
            toast.error(result.message || 'Login failed. Please check your credentials.');
          }
        }
      } catch (error) {
        setLoading(false);
        toast.error('Error during login: ' + error.message);
      }
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const result = await googleLogin(tokenResponse.access_token);
        setLoading(false);

        if (result.success) {
          toast.success('Google login successful!');
          const userRole = result.data.role || result.data?.user?.role;
          if (userRole === 'vendor') {
            navigate('/vendor-dashboard');
          } else if (userRole === 'office_staff') {
            navigate('/office-staff');
          } else if (userRole === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          if (result.requiresVerification && result.email) {
            toast.error(result.message || 'Please verify your email first.');
            navigate('/verify-otp', { 
              state: { 
                email: result.email,
                userType: result.userType || 'user'
              } 
            });
          } else {
            toast.error(result.message || 'Google login failed.');
          }
        }
      } catch (error) {
        setLoading(false);
        toast.error('Error during Google login: ' + error.message);
      }
    },
    onError: () => {
      toast.error('Google login failed');
    }
  });

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Left Column - Branding/Image */}
      <div 
        className="hidden lg:flex w-1/2 text-white p-12 relative flex-col justify-between overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop")' }}
      >
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-neutral-900/90 z-0"></div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-12 group">
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="mt-8">
            <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Welcome back to<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-300">
                YatraMate
              </span>
            </h1>
            <p className="text-xl text-primary-100 max-w-md leading-relaxed">
              Sign in to continue your journey. Rent the perfect vehicle for your next adventure with our premium fleet and seamless booking experience.
            </p>
          </div>
        </div>
        
        <div className="relative z-10 text-sm text-primary-200">
          © {new Date().getFullYear()} YatraMate. All rights reserved.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white relative">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Header (only visible on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900">Welcome <span className='text-red-600'>Back!</span></h2>
            <p className="text-neutral-600 mt-1">Sign in to continue your journey</p>
          </div>

          <div className="hidden lg:block text-left mb-8">
            <h2 className="text-4xl font-display font-bold text-neutral-900">Sign <span className='text-red-600'>In</span> </h2>
            <p className="text-neutral-600 mt-2">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
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
                  className={`w-full pl-12 pr-4 py-3.5 bg-neutral-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 ${
                    errors.email ? 'border-secondary-500 bg-secondary-50' : 'border-neutral-200 focus:border-primary-500 focus:bg-white'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm text-secondary-600 flex items-center"><span className="mr-1">⚠️</span>{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-2">
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
                  className={`w-full pl-12 pr-4 py-3.5 bg-neutral-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 ${
                    errors.password ? 'border-secondary-500 bg-secondary-50' : 'border-neutral-200 focus:border-primary-500 focus:bg-white'
                  }`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-secondary-600 flex items-center"><span className="mr-1">⚠️</span>{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4.5 h-4.5 text-primary-600 border-2 border-neutral-300 rounded focus:ring-primary-500 transition-colors cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 text-sm font-medium text-neutral-700 cursor-pointer select-none">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors duration-200">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 bg-linear-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5.5 w-5.5 border-t-2 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
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

          {/* Sign Up Link */}
          <div className="text-center pt-2">
            <p className="text-neutral-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 transition-colors duration-200">
                Sign up now
              </Link>
            </p>
          </div>
          
          <div className="lg:hidden text-center mt-8">
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

export default LoginPage;
