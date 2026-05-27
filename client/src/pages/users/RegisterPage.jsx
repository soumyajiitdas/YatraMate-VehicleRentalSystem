import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import {
  Mail,
  Lock,
  Phone,
  User,
  ArrowLeft,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Sparkles,
  Headset,
  MapPinned,
} from 'lucide-react';
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

    if (name === 'phone') {
      const digitsOnly = value.replace(/[^\d]/g, '');
      if (digitsOnly.length <= 10) {
        finalValue = digitsOnly ? `+91${digitsOnly}` : '';
      } else {
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\+91[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
          password: formData.password,
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
    onError: () => toast.error('Google registration failed'),
  });

  const inputCls = (hasError) =>
    `relative group rounded-2xl bg-white border-2 transition-all duration-200 ${hasError ? 'border-secondary-500' : 'border-ink-100 focus-within:border-ink-900'
    }`;

  const benefits = [
    { icon: Zap, text: 'Lightning-fast bookings' },
    { icon: ShieldCheck, text: 'Verified & insured fleet' },
    { icon: Sparkles, text: 'Exclusive launch perks' },
    { icon: Headset, text: '24/7 human support' },
  ];

  return (
    <div className="min-h-screen flex bg-[#fafaf7]" data-testid="register-page">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-ink-950 text-white p-12 flex-col justify-between">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-950/85 to-secondary-900/40" />
        <div className="absolute inset-0 dot-grid-light opacity-40" />
        <div className="absolute -top-20 -right-10 w-96 h-96 bg-secondary-500/30 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/30 rounded-full blur-[120px] animate-float-delay" />

        {/* Top */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 rounded-xl blur-md opacity-60 group-hover:opacity-90 transition-opacity" />
              <div className="relative bg-ink-900 p-2 rounded-xl group-hover:rotate-[-8deg] transition-transform duration-500 shadow-lg">
                <MapPinned className="w-6 h-6 text-primary-500" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-display font-bold tracking-tight text-white">
                Yatra<span className="text-primary-400">Mate</span>
              </span>
              <span className="text-[10px] font-display tracking-[0.1em] text-ink-400 font-medium mt-0.4">
                <span className='text-primary-500 font-bold'>~</span> Travel made effortless
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="hidden xl:inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full text-sm font-medium hover:bg-white/20 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back home
          </Link>
        </div>

        {/* Middle */}
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary-400" />
            Join the ride
          </div>
          <h1 className="font-display font-bold text-5xl xl:text-7xl leading-[0.9] tracking-[-0.04em] mb-5">
            Adventure
            <br />
            <em className="not-italic text-gradient-sunset">starts here.</em>
          </h1>
          <p className="text-ink-200 text-lg leading-relaxed max-w-sm mb-8">
            Create your account in under a minute and unlock instant access to India's most curated rental fleet.
          </p>

          {/* Benefit chips */}
          <div className="grid grid-cols-1 gap-3 max-w-md">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="group flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 hover:border-primary-500/50 transition-all"
                >
                  <div className="w-10 h-10 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center group-hover:bg-primary-500 group-hover:rotate-[-8deg] transition-all duration-500">
                    <Icon className="w-4.5 h-4.5 text-primary-400 group-hover:text-white" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-medium text-ink-100">{b.text}</span>
                  <CheckCircle2 className="ml-auto w-4 h-4 text-green-400/70" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-xs text-ink-400">
          © {new Date().getFullYear()} YatraMate. All rights reserved.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#fafaf7] relative overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-secondary-100/40 to-transparent lg:hidden pointer-events-none" />

        <div className="w-full max-w-md space-y-6 animate-fade-in-up relative py-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-ink-900 p-2 rounded-xl">
                <MapPinned className="w-5 h-5 text-primary-500" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-ink-900">
                Yatra<span className="text-primary-600">Mate</span>
              </span>
            </Link>
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-ink-900">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Link>
          </div>

          {/* Heading */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
              Create Account
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink-900 leading-[0.95] tracking-tight">
              Let's get you <em className="not-italic text-gradient-warm">moving.</em>
            </h2>
            <p className="text-ink-500 mt-2 text-base">A few details and you'll be on the road.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                Full Name
              </label>
              <div className={inputCls(errors.name)}>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-primary-500 transition-colors">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  data-testid="register-name-input"
                  className="w-full bg-transparent pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none text-ink-900 placeholder:text-ink-400"
                  placeholder="Your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-secondary-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                  Email
                </label>
                <div className={inputCls(errors.email)}>
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-primary-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    data-testid="register-email-input"
                    className="w-full bg-transparent pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none text-ink-900 placeholder:text-ink-400 text-sm"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-secondary-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                  Phone
                </label>
                <div className={inputCls(errors.phone)}>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Phone className="w-4 h-4 text-ink-400 group-focus-within:text-primary-500 transition-colors" />
                    <span className="ml-1.5 text-ink-700 font-semibold text-sm">+91</span>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone.replace('+91', '')}
                    onChange={handleChange}
                    data-testid="register-phone-input"
                    className="w-full bg-transparent pl-[4.5rem] pr-4 py-3.5 rounded-2xl focus:outline-none text-ink-900 placeholder:text-ink-400 text-sm"
                    placeholder="0000000000"
                    maxLength="10"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-secondary-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                Password
              </label>
              <div className={inputCls(errors.password)}>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  data-testid="register-password-input"
                  className="w-full bg-transparent pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none text-ink-900 placeholder:text-ink-400"
                  placeholder="Create a strong password"
                />
              </div>

              {/* Strength meter */}
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 gap-1 h-1.5 rounded-full overflow-hidden bg-ink-100">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 h-full transition-colors duration-300 ${passwordStrength >= level ? strengthColors[passwordStrength] : 'bg-transparent'
                          }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${passwordStrength <= 1 ? 'text-red-500' : passwordStrength === 2 ? 'text-yellow-600' : 'text-green-600'
                      }`}
                  >
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
              {errors.password && (
                <p className="mt-1.5 text-xs text-secondary-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label htmlFor="confirmPassword" className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                Confirm Password
              </label>
              <div className={inputCls(errors.confirmPassword)}>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  data-testid="register-confirm-password-input"
                  className="w-full bg-transparent pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none text-ink-900 placeholder:text-ink-400"
                  placeholder="Re-enter your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-secondary-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  data-testid="register-terms-checkbox"
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
              {errors.agreeToTerms && (
                <p className="mt-1.5 text-xs text-secondary-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              data-testid="register-submit-btn"
              className="group relative w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold text-base magnetic shine overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2 transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <span className="w-7 h-7 bg-white text-primary-600 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-ink-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-[#fafaf7] text-[10px] uppercase tracking-[0.2em] text-ink-400 font-bold">
                or sign up with
              </span>
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            data-testid="register-google-btn"
            className="group w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-ink-100 rounded-2xl hover:border-ink-900 hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-bold text-ink-900">Continue with Google</span>
          </button>

          {/* Sign In */}
          <p className="text-center text-sm text-ink-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-ink-900 link-underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;