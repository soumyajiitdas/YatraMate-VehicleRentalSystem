import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import authService from '../../services/authService';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email) {
            setError('Please enter your email address');
            setIsLoading(false);
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            const result = await authService.forgotPassword(email);

            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.message || 'Failed to send reset link. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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
                                Check Your <span className='text-primary-500'>Email</span>
                            </h2>
                            <p className="text-neutral-600 text-sm mb-4">
                                We've sent a password reset link to
                            </p>
                            <p className="text-primary-600 font-semibold mb-4">
                                {email}
                            </p>
                        </div>

                        {/* Instructions */}
                        <div className="bg-linear-to-br from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-6 space-y-3">
                            <h3 className="text-lg font-bold text-primary-900">
                                What's next?
                            </h3>
                            <ul className="text-sm text-primary-800 space-y-2">
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">1.</span>
                                    Check your email inbox (and spam folder)
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">2.</span>
                                    Click the reset link in the email
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">3.</span>
                                    Create your new password
                                </li>
                            </ul>
                            <p className="text-xs text-primary-700 mt-3">
                                The link will expire in 10 minutes for security reasons.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-4">
                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    setEmail('');
                                }}
                                className="w-full py-3 border-2 border-primary-500 text-primary-600 rounded-xl font-bold hover:bg-primary-50 transition-colors duration-200"
                            >
                                Send Another Link
                            </button>
                            <Link
                                to="/login"
                                className="w-full py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-center block hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
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
                                <Mail className="w-12 h-12 text-primary-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                            Forgot <span className='text-primary-500'>Password?</span>
                        </h2>
                        <p className="text-neutral-600 text-sm">
                            No worries, we'll send you reset instructions
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm" data-testid="error-message">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                    <Mail className="w-5 h-5" />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                                    placeholder="Enter your registered email"
                                    data-testid="email-input"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary-500/30"
                            data-testid="submit-btn"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <span>Send Reset Link</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
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
                            <p className="text-sm text-neutral-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-6">
                    <p className="text-sm text-white/80">
                        Need immediate help?{' '}
                        <Link to="/help" className="font-semibold text-white hover:text-white/90 underline transition-colors duration-200">
                            Contact Support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
