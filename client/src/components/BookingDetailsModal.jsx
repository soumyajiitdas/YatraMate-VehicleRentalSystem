import { useState } from 'react';
import { X, MapPin, Calendar, Clock, CreditCard, Car, FileText } from 'lucide-react';
import FinalBillModal from './FinalBillModal';

const BookingDetailsModal = ({ booking, onClose }) => {
    const [showBillModal, setShowBillModal] = useState(false);

    if (!booking) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-500 text-white';
            case 'completed': return 'bg-blue-500 text-white';
            case 'pending': return 'bg-yellow-500 text-white';
            case 'cancelled': return 'bg-red-500 text-white';
            default: return 'bg-neutral-500 text-white';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-500 text-white';
            case 'unpaid': return 'bg-orange-500 text-white';
            case 'refunded': return 'bg-blue-500 text-white';
            default: return 'bg-neutral-500 text-white';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-150 flex items-center justify-center p-2 sm:p-4 animate-fadeIn" onClick={onClose}>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-linear-to-r from-red-500 to-red-600 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 text-white">
                            <h2 className="text-lg sm:text-2xl font-bold">Booking Details</h2>
                            <p className="text-red-100 text-xs sm:text-sm mt-1 truncate">ID: {booking._id}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 sm:p-2 hover:bg-red-400 rounded-full transition-all shrink-0 ml-2"
                            data-testid="close-details-modal"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    {/* Vehicle Information */}
                    <div className="bg-linear-to-br from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-red-700">
                            <Car className="w-4 h-4 sm:w-5 sm:h-5" />
                            <h3 className="font-bold text-sm sm:text-base">Vehicle Information</h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            {booking.vehicle.images && booking.vehicle.images[0] && (
                                <img
                                    src={booking.vehicle.images[0]}
                                    alt={booking.vehicle.name}
                                    className="w-full sm:w-28 h-32 sm:h-28 object-cover rounded-lg shadow-md"
                                />
                            )}
                            <div className="flex-1">
                                <p className="text-base sm:text-lg font-bold text-red-600">{booking.vehicle.name}</p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className="px-2 sm:px-3 py-1 bg-red-500 text-white text-xs rounded-full font-semibold capitalize shadow-sm">
                                        {booking.vehicle.type}
                                    </span>
                                    {booking.vehicle.registration_number && booking.status === 'confirmed' && (
                                        <span className="px-2 sm:px-3 py-1 bg-white border border-red-300 text-red-700 text-xs rounded-full font-semibold shadow-sm">
                                            {booking.vehicle.registration_number}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1.5 font-medium">Booking Status</p>
                            <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold capitalize shadow-sm ${getStatusColor(booking.status)}`}>
                                {booking.status}
                            </span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1.5 font-medium">Payment Status</p>
                            <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold capitalize shadow-sm ${getPaymentStatusColor(booking.payment_status)}`}>
                                {booking.payment_status}
                            </span>
                        </div>
                    </div>

                    {/* View Bill Button - Only for completed bookings */}
                    {booking.status === 'completed' && (
                        <div className="bg-linear-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-3 sm:p-4 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                                    <div>
                                        <p className="font-bold text-green-800 text-sm sm:text-base">Final Bill Available</p>
                                        <p className="text-xs sm:text-sm text-green-600">View and download invoice</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowBillModal(true)}
                                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2 text-sm shadow-md"
                                    data-testid="view-bill-button"
                                >
                                    <FileText className="w-4 h-4" />
                                    View Bill
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Pickup Details */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2 sm:mb-3 text-gray-700">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                            <h3 className="font-bold text-sm sm:text-base">Pickup Details</h3>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-gray-100 gap-1 sm:gap-0">
                                <span className="text-gray-600 text-xs sm:text-sm font-medium">Location</span>
                                <span className="text-gray-900 font-semibold text-xs sm:text-sm sm:text-right">{booking.pickup_location}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-gray-100 gap-1 sm:gap-0">
                                <span className="text-gray-600 text-xs sm:text-sm font-medium">Date</span>
                                <span className="text-gray-900 font-semibold text-xs sm:text-sm">{new Date(booking.pickup_datetime).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 gap-1 sm:gap-0">
                                <span className="text-gray-600 text-xs sm:text-sm font-medium">Time</span>
                                <span className="text-gray-900 font-semibold text-xs sm:text-sm">{booking.pickup_time}</span>
                            </div>
                            {booking.pickup_details && (
                                <>
                                    {booking.pickup_details.actual_pickup_date && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-t border-gray-100 gap-1 sm:gap-0">
                                            <span className="text-gray-600 text-xs sm:text-sm font-medium">Actual Pickup</span>
                                            <span className="text-gray-900 font-semibold text-xs sm:text-sm">{formatDate(booking.pickup_details.actual_pickup_date)}</span>
                                        </div>
                                    )}
                                    {booking.pickup_details.km_reading_at_pickup && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 gap-1 sm:gap-0">
                                            <span className="text-gray-600 text-xs sm:text-sm font-medium">KM Reading</span>
                                            <span className="text-gray-900 font-semibold text-xs sm:text-sm">{booking.pickup_details.km_reading_at_pickup} km</span>
                                        </div>
                                    )}
                                    {booking.pickup_details.id_proof_type && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-t border-gray-100 gap-1 sm:gap-0">
                                            <span className="text-gray-600 text-xs sm:text-sm font-medium">Govt. ID Proof</span>
                                            <span className="text-gray-900 font-semibold text-xs sm:text-sm uppercase">{booking.pickup_details.id_proof_type.replace('_', ' ')}</span>
                                        </div>
                                    )}
                                    {booking.pickup_details.id_number && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 gap-1 sm:gap-0">
                                            <span className="text-gray-600 text-xs sm:text-sm font-medium">ID Number</span>
                                            <span className="text-gray-900 font-semibold text-xs sm:text-sm">{booking.pickup_details.id_number}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Return Details */}
                    {(booking.return_datetime || booking.return_details) && (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-4">
                            <div className="flex items-center gap-2 mb-2 sm:mb-3 text-gray-700">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                                <h3 className="font-bold text-sm sm:text-base">Return Details</h3>
                            </div>
                            <div className="space-y-1.5">
                                {booking.return_datetime ? (
                                    <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-gray-100 gap-1 sm:gap-0">
                                        <span className="text-gray-600 text-xs sm:text-sm font-medium">Return Date</span>
                                        <span className="text-gray-900 font-semibold text-xs sm:text-sm">{formatDate(booking.return_datetime)}</span>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic text-xs sm:text-sm">Not returned yet</p>
                                )}
                                {booking.return_details && (
                                    <>
                                        {booking.return_details.km_reading_at_return && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-gray-100 gap-1 sm:gap-0">
                                                <span className="text-gray-600 text-xs sm:text-sm font-medium">KM at Return</span>
                                                <span className="text-gray-900 font-semibold text-xs sm:text-sm">{booking.return_details.km_reading_at_return} km</span>
                                            </div>
                                        )}
                                        {booking.return_details.total_distance && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-gray-100 gap-1 sm:gap-0">
                                                <span className="text-gray-600 text-xs sm:text-sm font-medium">Total Distance</span>
                                                <span className="text-gray-900 font-semibold text-xs sm:text-sm">{booking.return_details.total_distance} km</span>
                                            </div>
                                        )}
                                        {booking.return_details.total_hours && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 gap-1 sm:gap-0">
                                                <span className="text-gray-600 text-xs sm:text-sm font-medium">Total Hours</span>
                                                <span className="text-gray-900 font-semibold text-xs sm:text-sm">{booking.return_details.total_hours} hrs</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Cost */}
                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 sm:mb-3 text-blue-700">
                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                            <h3 className="font-bold text-sm sm:text-base">Cost Breakdown</h3>
                        </div>
                        <div className="space-y-1.5">
                            {/* Show Advance Payment when pickup is confirmed */}
                            {booking.status === 'confirmed' && booking.advance_payment && booking.advance_payment.amount > 0 && (
                                <div className="bg-green-100 border border-green-300 rounded-lg p-2.5 mb-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-green-800 font-bold text-xs sm:text-sm flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Advance Paid
                                        </span>
                                        <span className="text-green-900 font-bold text-sm sm:text-base">₹{booking.advance_payment.amount}</span>
                                    </div>
                                    <p className="text-xs text-green-700 mt-1">40% advance payment received</p>
                                </div>
                            )}
                            
                            {booking.return_details && (
                                <>
                                    {booking.return_details.distance_cost && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-gray-600 text-xs sm:text-sm font-medium">Distance Cost</span>
                                            <span className="text-gray-900 font-semibold text-xs sm:text-sm">₹{booking.return_details.distance_cost}</span>
                                        </div>
                                    )}
                                    {booking.return_details.time_cost && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-gray-600 text-xs sm:text-sm font-medium">Time Cost</span>
                                            <span className="text-gray-900 font-semibold text-xs sm:text-sm">₹{booking.return_details.time_cost}</span>
                                        </div>
                                    )}
                                    {booking.return_details.gst && (
                                        <div className="flex justify-between py-1 border-b border-blue-200 pb-2">
                                            <span className="text-gray-600 text-xs sm:text-sm font-medium">GST</span>
                                            <span className="text-gray-900 font-semibold text-xs sm:text-sm">₹{booking.return_details.gst}</span>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t-2 border-blue-300">
                                <span className="text-blue-900 font-bold text-sm sm:text-base">Total Cost</span>
                                <span className="text-lg sm:text-2xl font-bold text-blue-600">₹{booking.total_cost || 'TBD'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Rejection Reason */}
                    {booking.status === 'cancelled' && booking.rejection_reason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <h3 className="font-semibold text-red-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Cancellation Reason</h3>
                            <p className="text-red-700 text-xs sm:text-sm">{booking.rejection_reason}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-neutral-50 border-t border-neutral-200 p-3 sm:p-4 rounded-b-xl sm:rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 sm:py-3 bg-red-500 text-white rounded-lg sm:rounded-xl font-semibold hover:bg-red-600 transition-all text-sm sm:text-base"
                        data-testid="close-details-button"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Final Bill Modal */}
            {showBillModal && (
                <FinalBillModal
                    booking={booking}
                    onClose={() => setShowBillModal(false)}
                />
            )}
        </div>
    );
};

export default BookingDetailsModal;
