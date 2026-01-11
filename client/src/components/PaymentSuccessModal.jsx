import { useEffect, useState } from 'react';

const PaymentSuccessModal = ({ paymentDetails, onClose, autoCloseDelay = 3000 }) => {
    const [countdown, setCountdown] = useState(Math.ceil(autoCloseDelay / 1000));

    useEffect(() => {
        // Countdown timer
        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Auto close after delay
        const timer = setTimeout(() => {
            onClose();
        }, autoCloseDelay);

        return () => {
            clearTimeout(timer);
            clearInterval(countdownInterval);
        };
    }, [autoCloseDelay, onClose]);

    return (
        <div className="fixed inset-0 backdrop-blur-md bg-black/50 z-[200] flex items-center justify-center p-4" data-testid="payment-success-modal-overlay">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-bounce-in" data-testid="payment-success-modal">
                {/* Success Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center">
                    {/* Animated Checkmark */}
                    <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <svg 
                            className="w-12 h-12 text-green-500 animate-check" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={3} 
                                d="M5 13l4 4L19 7" 
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                    <p className="text-green-100">Transaction completed successfully</p>
                </div>

                {/* Payment Details */}
                <div className="px-6 py-6 space-y-4">
                    {paymentDetails?.amount > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                            <p className="text-3xl font-bold text-gray-900" data-testid="payment-amount">
                                ₹{paymentDetails.amount.toFixed ? paymentDetails.amount.toFixed(2) : paymentDetails.amount}
                            </p>
                        </div>
                    )}

                    {paymentDetails?.paymentId && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Payment ID</span>
                            <span className="text-sm font-medium text-gray-900 font-mono" data-testid="payment-id">
                                {paymentDetails.paymentId}
                            </span>
                        </div>
                    )}

                    {paymentDetails?.message && (
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <p className="text-sm text-blue-700">{paymentDetails.message}</p>
                        </div>
                    )}

                    {/* Auto-close notice */}
                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-500">
                            Closing automatically in <span className="font-semibold text-green-600">{countdown}</span> seconds...
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        data-testid="payment-success-close-button"
                    >
                        Continue
                    </button>
                </div>
            </div>

            {/* Add custom animation styles */}
            <style>{`
                @keyframes bounce-in {
                    0% {
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                    70% {
                        transform: scale(0.9);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                
                @keyframes check {
                    0% {
                        stroke-dashoffset: 100;
                    }
                    100% {
                        stroke-dashoffset: 0;
                    }
                }
                
                .animate-bounce-in {
                    animation: bounce-in 0.5s ease-out;
                }
                
                .animate-check path {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: check 0.5s ease-out 0.3s forwards;
                }
            `}</style>
        </div>
    );
};

export default PaymentSuccessModal;
