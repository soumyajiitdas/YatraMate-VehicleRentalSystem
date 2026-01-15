import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const VerifyOtpPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyOtp, resendOtp, verifyVendorOtp, resendVendorOtp } = useAuth();
    const { toast } = useToast();
    
    const email = location.state?.email || '';
    const userType = location.state?.userType || 'user'; // 'user' or 'vendor'
    
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    
    const inputRefs = useRef([]);

    // Redirect if no email in state
    useEffect(() => {
        if (!email) {
            navigate(userType === 'vendor' ? '/vendor' : '/register');
        }
    }, [email, navigate, userType]);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        
        // Handle paste
        if (value.length > 1) {
            const pastedValues = value.slice(0, 6).split('');
            pastedValues.forEach((char, i) => {
                if (index + i < 6) {
                    newOtp[index + i] = char;
                }
            });
            setOtp(newOtp);
            // Focus on the next empty input or the last one
            const nextIndex = Math.min(index + pastedValues.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        
        try {
            let result;
            
            if (userType === 'vendor') {
                result = await verifyVendorOtp(email, otpString);
            } else {
                result = await verifyOtp(email, otpString);
            }
            
            if (result.success) {
                if (userType === 'vendor') {
                    toast.success(result.message || 'Email verified successfully! Your account is pending admin verification.');
                    navigate('/login');
                } else {
                    toast.success('Email verified successfully!');
                    navigate('/');
                }
            } else {
                toast.error(result.message || 'OTP verification failed');
                // Clear OTP on error
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (error) {
            toast.error('Error during verification: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        
        setResendLoading(true);
        
        try {
            let result;
            
            if (userType === 'vendor') {
                result = await resendVendorOtp(email);
            } else {
                result = await resendOtp(email);
            }
            
            if (result.success) {
                toast.success('New OTP sent successfully!');
                setCountdown(60);
                setCanResend(false);
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            } else {
                toast.error(result.message || 'Failed to resend OTP');
            }
        } catch (error) {
            toast.error('Error resending OTP: ' + error.message);
        } finally {
            setResendLoading(false);
        }
    };

    const getBackLink = () => {
        return userType === 'vendor' ? '/vendor' : '/register';
    };

    const getBackLinkText = () => {
        return userType === 'vendor' ? 'Go back to vendor registration' : 'Go back to registration';
    };

    return (
        <div className="min-h-screen bg-linear-to-r from-primary-600 via-secondary-600 to-primary-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-linear-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                            Verify Your <span className='text-red-500'>Email</span>
                        </h2>
                        {userType === 'vendor' && (
                            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold mb-2">
                                Vendor Registration
                            </span>
                        )}
                        <p className="text-neutral-600 text-sm">
                            We've sent a 6-digit OTP to
                        </p>
                        <p className="text-primary-600 font-semibold mt-1">{email}</p>
                    </div>

                    {/* OTP Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* OTP Input */}
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-4 text-center">
                                Enter OTP
                            </label>
                            <div className="flex justify-center gap-2 sm:gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 border-neutral-200"
                                        data-testid={`otp-input-${index}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Timer and Resend */}
                        <div className="text-center">
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendLoading}
                                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 disabled:opacity-50"
                                    data-testid="resend-otp-btn"
                                >
                                    {resendLoading ? 'Sending...' : 'Resend OTP'}
                                </button>
                            ) : (
                                <p className="text-neutral-500 text-sm">
                                    Resend OTP in <span className="font-semibold text-primary-600">{countdown}s</span>
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || otp.join('').length !== 6}
                            className="w-full py-3.5 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-lg hover:shadow-glow transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                            data-testid="verify-otp-btn"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <span>Verify Email</span>
                            )}
                        </button>
                    </form>

                    {/* Vendor Info Box */}
                    {userType === 'vendor' && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <div className="flex items-start space-x-3">
                                <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-amber-800">
                                        <span className="font-semibold">Note:</span> After email verification, your vendor account will be reviewed by our admin team before activation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                            <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-sm text-blue-800">
                                    <span className="font-semibold">Didn't receive the email?</span>
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                    Check your spam folder or wait for the timer to resend.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Change Email Link */}
                    <div className="text-center">
                        <p className="text-sm text-neutral-600">
                            Wrong email?{' '}
                            <Link to={getBackLink()} className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200">
                                {getBackLinkText()}
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <Link to="/" className="text-white hover:text-white/80 transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
