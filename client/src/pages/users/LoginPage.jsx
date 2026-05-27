import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Mail, Lock, ArrowLeft, ArrowUpRight, AlertCircle, ShieldCheck, Star, MapPinned } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const result = await login({ email: formData.email, password: formData.password });
        setLoading(false);
        if (result.success) {
          toast.success('Login successful!');
          const userRole = result.data.user.role;
          if (userRole === 'vendor') navigate('/vendor-dashboard');
          else if (userRole === 'office_staff') navigate('/office-staff');
          else if (userRole === 'admin') navigate('/admin');
          else navigate('/');
        } else {
          if (result.requiresVerification && result.email) {
            toast.error(result.message || 'Please verify your email first.');
            navigate('/verify-otp', { state: { email: result.email, userType: result.userType || 'user' } });
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
          if (userRole === 'vendor') navigate('/vendor-dashboard');
          else if (userRole === 'office_staff') navigate('/office-staff');
          else if (userRole === 'admin') navigate('/admin');
          else navigate('/');
        } else {
          if (result.requiresVerification && result.email) {
            toast.error(result.message || 'Please verify your email first.');
            navigate('/verify-otp', { state: { email: result.email, userType: result.userType || 'user' } });
          } else {
            toast.error(result.message || 'Google login failed.');
          }
        }
      } catch (error) {
        setLoading(false);
        toast.error('Error during Google login: ' + error.message);
      }
    },
    onError: () => toast.error('Google login failed'),
  });

  return (
    <div className="min-h-screen flex bg-[#fafaf7]" data-testid="login-page">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-ink-950 text-white p-12 flex-col justify-between">
        {/* background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1600&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-950/85 to-ink-900/60" />
        <div className="absolute inset-0 dot-grid-light opacity-40" />
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-500/30 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/25 rounded-full blur-[120px] animate-float-delay" />

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
            data-testid="brand-back-home"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back home
          </Link>
        </div>

        {/* Middle */}
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-primary-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-primary-500" />
            </span>
            Welcome back
          </div>
          <h1 className="font-display font-bold text-5xl xl:text-7xl leading-[0.9] tracking-[-0.04em] mb-5">
            Your road
            <br />
            <em className="not-italic text-gradient-sunset">awaits.</em>
          </h1>
          <p className="text-ink-200 text-lg leading-relaxed max-w-sm">
            Sign in to continue your journey across India's most curated rental fleet.
          </p>

          {/* Mini stats */}
          <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
            {[
              { v: '1000+', l: 'Riders' },
              { v: '4.9', l: 'Rating' },
              { v: '24/7', l: 'Support' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5">
                <div className="font-display text-2xl font-bold text-white">{s.v}</div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-ink-300 font-semibold mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center gap-4 text-xs text-ink-300">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary-400" />
            <span>Secure login</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-ink-500" />
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-accent-400 fill-current" />
            <span>Loved by 1k+ travelers</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#fafaf7] relative">
        {/* mobile bg flair */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-primary-100/40 to-transparent lg:hidden pointer-events-none" />

        <div className="w-full max-w-md space-y-7 animate-fade-in-up relative">
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
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-ink-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Link>
          </div>

          {/* Heading */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              Sign In
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink-900 leading-[0.95] tracking-tight">
              Welcome back<span className="text-primary-500">.</span>
            </h2>
            <p className="text-ink-500 mt-2 text-base">Drop in your credentials and let's get you rolling.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em] mb-2">
                Email Address
              </label>
              <div
                className={`relative group rounded-2xl bg-white border-2 transition-all duration-200 ${errors.email ? 'border-secondary-500' : 'border-ink-100 focus-within:border-ink-900'
                  }`}
              >
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  data-testid="login-email-input"
                  className="w-full bg-transparent pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none text-ink-900 placeholder:text-ink-400"
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-[11px] font-bold text-ink-700 uppercase tracking-[0.15em]">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[11px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider">
                  Forgot?
                </Link>
              </div>
              <div
                className={`relative group rounded-2xl bg-white border-2 transition-all duration-200 ${errors.password ? 'border-secondary-500' : 'border-ink-100 focus-within:border-ink-900'
                  }`}
              >
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  data-testid="login-password-input"
                  className="w-full bg-transparent pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none text-ink-900 placeholder:text-ink-400"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-secondary-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 pt-1 cursor-pointer w-fit group">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-primary-600 cursor-pointer"
              />
              <span className="text-sm text-ink-600 font-medium group-hover:text-ink-900">
                Keep me signed in
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              data-testid="login-submit-btn"
              className="group relative w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold text-base magnetic shine overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2 transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
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
                or continue with
              </span>
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            data-testid="login-google-btn"
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

          {/* Sign Up */}
          <p className="text-center text-sm text-ink-600">
            New to YatraMate?{' '}
            <Link to="/register" className="font-bold text-ink-900 link-underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;