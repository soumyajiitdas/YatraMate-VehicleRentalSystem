import { AlertTriangle, X } from 'lucide-react';

const CancelConfirmationModal = ({ booking, onConfirm, onClose, loading }) => {
    if (!booking) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-slideUp" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="border-b border-neutral-200 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-full">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900">Cancel <span className='text-red-500'>Booking</span></h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 rounded-full transition-all"
                        disabled={loading}
                        data-testid="close-cancel-modal"
                    >
                        <X className="w-5 h-5 text-neutral-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-neutral-700">
                        Are you sure you want to cancel this booking?
                    </p>

                    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                        <p className="text-xs text-neutral-500 mb-2 uppercase tracking-wide">Booking Details</p>
                        <p className="font-semibold text-neutral-900 mb-2">{booking.vehicle.name}</p>
                        <p className="text-sm text-neutral-600">
                            {new Date(booking.pickup_datetime).toLocaleDateString('en-IN')} at {booking.pickup_time}
                        </p>
                        <p className="text-sm text-neutral-600">
                            {booking.pickup_location}
                        </p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
                            <p className="text-sm text-yellow-800">
                                This action cannot be undone. Your booking will be permanently cancelled.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-neutral-200 p-4">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            data-testid="cancel-modal-no-button"
                        >
                            Keep Booking
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            data-testid="cancel-modal-yes-button"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Cancelling...
                                </span>
                            ) : (
                                'Yes, Cancel'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelConfirmationModal;
