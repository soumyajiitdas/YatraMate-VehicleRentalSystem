import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { Mail, ShieldCheck } from 'lucide-react';
import axios from '../../config/api';

const OtpVerificationPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const location = useLocation();
    const email = location.state?.email || ''; // Get email from registration page state

    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60); // 60 seconds
    const otpInputs = useRef([]);

    // Start cooldown timer on component mount if email is present
    useState(() => {
        if (email) {
            const timer = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev === 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [email]);


    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            otpInputs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/api/v1/auth/verify-otp', {
                email,
                otp: otp.join(''),
            });

            if (response.data.status === 'success') {
                toast.success('Account verified successfully! You can now log in.');
                navigate('/login');
            } else {
                toast.error(response.data.message || 'OTP verification failed.');
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                'Error verifying OTP. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return; // Prevent resending if cooldown is active

        setResendLoading(true);
        try {
            const response = await axios.post('/api/v1/auth/resend-otp', { email });

            if (response.data.status === 'success') {
                toast.success('New OTP sent to your email!');
                setResendCooldown(60); // Reset cooldown
                const timer = setInterval(() => {
                    setResendCooldown((prev) => {
                        if (prev === 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                toast.error(response.data.message || 'Failed to resend OTP.');
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'Error resending OTP. Please try again.';
            toast.error(errorMessage);
        } finally {
            setResendLoading(false);
        }
    };

    if (!email) {
        toast.error('Email not found. Please register again.');
        navigate('/register');
        return null;
    }

    return (
        <div className="min-h-screen bg-linear-to-r from-primary-600 via-secondary-600 to-primary-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
                    <div className="text-center p-3 sm:p-2">
                        <ShieldCheck className="mx-auto h-16 w-16 text-primary-600" />
                        <h2 className="text-4xl font-display font-bold text-neutral-900 mb-2 mt-4">
                            Verify Your Account
                        </h2>
                        <p className="text-neutral-600 text-md">
                            A 6-digit OTP has been sent to <span className="font-semibold text-primary-600">{email}</span>.
                            Please enter it below to verify your email address.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-semibold text-neutral-700 mb-2">
                                Enter OTP
                            </label>
                            <div className="flex justify-center space-x-2">
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        name="otp"
                                        maxLength="1"
                                        className="w-12 h-12 text-center text-2xl font-bold border-2 border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                                        value={data}
                                        onChange={(e) => handleChange(e.target, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onFocus={(e) => e.target.select()}
                                        ref={(el) => (otpInputs.current[index] = el)}
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-lg hover:shadow-glow transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <span>Verify Account</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-neutral-600">
                            Didn't receive the OTP?{' '}
                            <button
                                onClick={handleResendOtp}
                                disabled={resendLoading || resendCooldown > 0}
                                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {resendCooldown > 0
                                    ? `Resend OTP in ${resendCooldown}s`
                                    : 'Resend OTP'}
                            </button>
                        </p>
                    </div>

                    <div className="text-center mt-6">
                        <Link to="/login" className="text-neutral-600 hover:text-primary-600 transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Login</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerificationPage;
