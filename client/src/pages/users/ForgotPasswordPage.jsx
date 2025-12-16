import { Link } from 'react-router-dom';
import { Mail, AlertCircle, ArrowLeft, Clock } from 'lucide-react';

const ForgotPasswordPage = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-primary-600 via-secondary-600 to-primary-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
                    {/* Back to Login */}
                    <Link
                        to="/login"
                        className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200 mb-4"
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
                            Don't worry, we'll help you reset it
                        </p>
                    </div>

                    {/* Coming Soon Notice */}
                    <div className="bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="shrink-0">
                                <div className="bg-amber-100 rounded-full p-2">
                                    <Clock className="w-6 h-6 text-amber-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-amber-900 mb-2">
                                    Feature Coming Soon
                                </h3>
                                <p className="text-sm text-amber-800 leading-relaxed mb-3">
                                    The password reset functionality is currently under development. We're working hard to bring you a secure and seamless experience.
                                </p>
                                <div className="bg-white/60 rounded-lg p-3 border border-amber-200">
                                    <p className="text-xs text-amber-900 font-medium">
                                        📧 In the meantime, please contact our support team at{' '}
                                        <a href="mailto:support@example.com" className="text-primary-600 hover:text-primary-700 underline">
                                            support@yatramate.com
                                        </a>
                                        {' '}for password assistance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Disabled Form - Visual Only */}
                    <div className="space-y-4 opacity-60 pointer-events-none">
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
                                    disabled
                                    className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 rounded-xl bg-neutral-50 cursor-not-allowed"
                                    placeholder="Enter your registered email"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled
                            className="w-full py-3.5 bg-neutral-300 text-neutral-500 rounded-xl font-bold text-lg cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            <span>Send Reset Link</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>

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
