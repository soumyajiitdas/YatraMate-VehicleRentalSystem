import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle, Loader2, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import authService from '../../services/authService';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);

    // Password strength indicators
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        hasNumber: false,
        hasLetter: false,
        hasSpecial: false
    });

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            setError('Invalid reset link. Please request a new password reset.');
        }
    }, [token]);

    useEffect(() => {
        setPasswordStrength({
            length: password.length >= 8,
            hasNumber: /\d/.test(password),
            hasLetter: /[a-zA-Z]/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    }, [password]);

    const isPasswordValid = () => {
        return passwordStrength.length && passwordStrength.hasNumber && passwordStrength.hasLetter;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation
        if (!password || !confirmPassword) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (!isPasswordValid()) {
            setError('Please ensure your password meets the requirements');
            setIsLoading(false);
            return;
        }

        try {
            const result = await authService.resetPassword(token, password);

            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.message || 'Failed to reset password. The link may have expired.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Success State
    if (success) {
        return (
            <div className="min-h-screen bg-linear-to-br from-primary-600 via-secondary-600 to-primary-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
                        {/* Success Icon */}
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-green-100 rounded-full p-4">
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                                Password <span className='text-green-500'>Reset!</span>
                            </h2>
                            <p className="text-neutral-600 text-sm mb-4">
                                Your password has been successfully updated
                            </p>
                        </div>

                        {/* Success Message */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-3">
                            <div className="flex items-center space-x-3">
                                <ShieldCheck className="w-6 h-6 text-green-600" />
                                <h3 className="text-lg font-bold text-green-900">
                                    All Set!
                                </h3>
                            </div>
                            <p className="text-sm text-green-800">
                                You can now log in with your new password. We recommend using a unique password that you don't use for other accounts.
                            </p>
                        </div>

                        {/* Login Button */}
                        <Link
                            to="/login"
                            className="w-full py-3.5 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/30"
                            data-testid="go-to-login-btn"
                        >
                            <span>Go to Login</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Invalid Token State
    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-linear-to-br from-primary-600 via-secondary-600 to-primary-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
                        {/* Error Icon */}
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-red-100 rounded-full p-4">
                                    <AlertCircle className="w-12 h-12 text-red-600" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                                Invalid <span className='text-red-500'>Link</span>
                            </h2>
                            <p className="text-neutral-600 text-sm">
                                This password reset link is invalid or has expired
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <Link
                                to="/forgot-password"
                                className="w-full py-3.5 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/30"
                            >
                                <span>Request New Link</span>
                            </Link>
                            <Link
                                to="/login"
                                className="w-full py-3 border-2 border-neutral-300 text-neutral-700 rounded-xl font-bold text-center block hover:bg-neutral-50 transition-colors duration-200"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-primary-600 via-secondary-600 to-primary-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
                    {/* Back to Login */}
                    <Link
                        to="/login"
                        className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200 mb-4"
                        data-testid="back-to-login-link"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Login
                    </Link>

                    {/* Icon and Title */}
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-linear-to-br from-primary-100 to-secondary-100 rounded-full p-4">
                                <Lock className="w-12 h-12 text-primary-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                            Reset <span className='text-primary-500'>Password</span>
                        </h2>
                        <p className="text-neutral-600 text-sm">
                            Create a new secure password for your account
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center space-x-2" data-testid="error-message">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                    <Lock className="w-5 h-5" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full pl-11 pr-12 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                                    placeholder="Enter new password"
                                    data-testid="password-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                    data-testid="toggle-password-btn"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Indicators */}
                        {password && (
                            <div className="bg-neutral-50 rounded-lg p-3 space-y-2">
                                <p className="text-xs font-semibold text-neutral-600 mb-2">Password Requirements:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className={`flex items-center space-x-2 text-xs ${passwordStrength.length ? 'text-green-600' : 'text-neutral-400'}`}>
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordStrength.length ? 'bg-green-100' : 'bg-neutral-200'}`}>
                                            {passwordStrength.length ? '✓' : '○'}
                                        </div>
                                        <span>8+ characters</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 text-xs ${passwordStrength.hasLetter ? 'text-green-600' : 'text-neutral-400'}`}>
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordStrength.hasLetter ? 'bg-green-100' : 'bg-neutral-200'}`}>
                                            {passwordStrength.hasLetter ? '✓' : '○'}
                                        </div>
                                        <span>Contains letter</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 text-xs ${passwordStrength.hasNumber ? 'text-green-600' : 'text-neutral-400'}`}>
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordStrength.hasNumber ? 'bg-green-100' : 'bg-neutral-200'}`}>
                                            {passwordStrength.hasNumber ? '✓' : '○'}
                                        </div>
                                        <span>Contains number</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 text-xs ${passwordStrength.hasSpecial ? 'text-green-600' : 'text-neutral-400'}`}>
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordStrength.hasSpecial ? 'bg-green-100' : 'bg-neutral-200'}`}>
                                            {passwordStrength.hasSpecial ? '✓' : '○'}
                                        </div>
                                        <span>Special char (optional)</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-neutral-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                    <Lock className="w-5 h-5" />
                                </span>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    className={`w-full pl-11 pr-12 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all duration-200 disabled:bg-neutral-100 disabled:cursor-not-allowed ${
                                        confirmPassword && password !== confirmPassword
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                            : confirmPassword && password === confirmPassword
                                            ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                            : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-200'
                                    }`}
                                    placeholder="Confirm your new password"
                                    data-testid="confirm-password-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                    data-testid="toggle-confirm-password-btn"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                            )}
                            {confirmPassword && password === confirmPassword && (
                                <p className="text-xs text-green-500 mt-1">Passwords match!</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isPasswordValid() || password !== confirmPassword}
                            className="w-full py-3.5 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary-500/30"
                            data-testid="reset-password-btn"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Resetting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Reset Password</span>
                                    <ShieldCheck className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Alternative Actions */}
                    <div className="pt-4 border-t border-neutral-200">
                        <div className="text-center space-y-3">
                            <p className="text-sm text-neutral-600">
                                Remember your password?{' '}
                                <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-6">
                    <p className="text-sm text-white/80">
                        Link expired?{' '}
                        <Link to="/forgot-password" className="font-semibold text-white hover:text-white/90 underline transition-colors duration-200">
                            Request New Link
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
