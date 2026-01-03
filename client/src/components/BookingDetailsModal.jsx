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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 rounded-t-2xl flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">Booking <span className='text-red-500'>Details</span></h2>
                        <p className="text-neutral-500 text-sm mt-1">ID: {booking._id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 rounded-full transition-all"
                        data-testid="close-details-modal"
                    >
                        <X className="w-6 h-6 text-neutral-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Vehicle Information */}
                    <div className="border border-neutral-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3 text-neutral-700">
                            <Car className="w-5 h-5 text-red-500" />
                            <h3 className="font-semibold">Vehicle</h3>
                        </div>
                        <div className="flex gap-4">
                            {booking.vehicle.images && booking.vehicle.images[0] && (
                                <img
                                    src={booking.vehicle.images[0]}
                                    alt={booking.vehicle.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                            )}
                            <div className="flex-1">
                                <p className="text-xl font-bold text-red-500">{booking.vehicle.name}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full font-medium capitalize">
                                        {booking.vehicle.type}
                                    </span>
                                    {booking.vehicle.registration_number && booking.status === 'confirmed' && (
                                        <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full font-medium">
                                            {booking.vehicle.registration_number}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-neutral-600 mb-2">Booking Status</p>
                            <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold capitalize ${getStatusColor(booking.status)}`}>
                                {booking.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-neutral-600 mb-2">Payment Status</p>
                            <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold capitalize ${getPaymentStatusColor(booking.payment_status)}`}>
                                {booking.payment_status}
                            </span>
                        </div>
                    </div>

                    {/* View Bill Button - Only for completed bookings */}
                    {booking.status === 'completed' && (
                        <div className="border border-green-200 bg-green-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="font-semibold text-green-800">Final Bill Available</p>
                                        <p className="text-sm text-green-600">View and download your trip invoice</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowBillModal(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
                                    data-testid="view-bill-button"
                                >
                                    <FileText className="w-4 h-4" />
                                    View Bill
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Pickup Details */}
                    <div className="border border-neutral-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3 text-neutral-700">
                            <MapPin className="w-5 h-5 text-red-500" />
                            <h3 className="font-semibold">Pickup Details</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between py-2 border-b border-neutral-100">
                                <span className="text-neutral-600">Location</span>
                                <span className="text-neutral-900 font-medium text-right">{booking.pickup_location}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-neutral-100">
                                <span className="text-neutral-600">Date</span>
                                <span className="text-neutral-900 font-medium">{new Date(booking.pickup_datetime).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-neutral-600">Time</span>
                                <span className="text-neutral-900 font-medium">{booking.pickup_time}</span>
                            </div>
                            {booking.pickup_details && (
                                <>
                                    {booking.pickup_details.actual_pickup_date && (
                                        <div className="flex justify-between py-2 border-t border-neutral-100">
                                            <span className="text-neutral-600">Actual Pickup</span>
                                            <span className="text-neutral-900 font-medium text-sm">{formatDate(booking.pickup_details.actual_pickup_date)}</span>
                                        </div>
                                    )}
                                    {booking.pickup_details.km_reading_at_pickup && (
                                        <div className="flex justify-between py-2">
                                            <span className="text-neutral-600">KM Reading</span>
                                            <span className="text-neutral-900 font-medium">{booking.pickup_details.km_reading_at_pickup} km</span>
                                        </div>
                                    )}
                                    {booking.pickup_details.id_proof_type && (
                                        <div className="flex justify-between py-2 border-t border-neutral-100">
                                            <span className="text-neutral-600">Govt. ID Proof</span>
                                            <span className="text-neutral-900 font-medium">{booking.pickup_details.id_proof_type.replace('_', ' ').toUpperCase()}</span>
                                        </div>
                                    )}
                                    {booking.pickup_details.id_number && (
                                        <div className="flex justify-between py-2">
                                            <span className="text-neutral-600">ID Number</span>
                                            <span className="text-neutral-900 font-medium">{booking.pickup_details.id_number}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Return Details */}
                    {(booking.return_datetime || booking.return_details) && (
                        <div className="border border-neutral-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3 text-neutral-700">
                                <Calendar className="w-5 h-5 text-red-500" />
                                <h3 className="font-semibold">Return Details</h3>
                            </div>
                            <div className="space-y-2">
                                {booking.return_datetime ? (
                                    <div className="flex justify-between py-2 border-b border-neutral-100">
                                        <span className="text-neutral-600">Return Date</span>
                                        <span className="text-neutral-900 font-medium text-sm">{formatDate(booking.return_datetime)}</span>
                                    </div>
                                ) : (
                                    <p className="text-neutral-500 italic text-sm">Not returned yet</p>
                                )}
                                {booking.return_details && (
                                    <>
                                        {booking.return_details.km_reading_at_return && (
                                            <div className="flex justify-between py-2 border-b border-neutral-100">
                                                <span className="text-neutral-600">KM at Return</span>
                                                <span className="text-neutral-900 font-medium">{booking.return_details.km_reading_at_return} km</span>
                                            </div>
                                        )}
                                        {booking.return_details.total_distance && (
                                            <div className="flex justify-between py-2 border-b border-neutral-100">
                                                <span className="text-neutral-600">Total Distance</span>
                                                <span className="text-neutral-900 font-medium">{booking.return_details.total_distance} km</span>
                                            </div>
                                        )}
                                        {booking.return_details.total_hours && (
                                            <div className="flex justify-between py-2">
                                                <span className="text-neutral-600">Total Hours</span>
                                                <span className="text-neutral-900 font-medium">{booking.return_details.total_hours} hrs</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Cost */}
                    <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
                        <div className="flex items-center gap-2 mb-3 text-neutral-700">
                            <CreditCard className="w-5 h-5 text-red-500" />
                            <h3 className="font-semibold">Cost Breakdown</h3>
                        </div>
                        <div className="space-y-2">
                            {booking.return_details && (
                                <>
                                    {booking.return_details.distance_cost && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-neutral-600 text-sm">Distance Cost</span>
                                            <span className="text-neutral-900 font-medium">₹{booking.return_details.distance_cost}</span>
                                        </div>
                                    )}
                                    {booking.return_details.time_cost && (
                                        <div className="flex justify-between py-1">
                                            <span className="text-neutral-600 text-sm">Time Cost</span>
                                            <span className="text-neutral-900 font-medium">₹{booking.return_details.time_cost}</span>
                                        </div>
                                    )}
                                    {booking.return_details.gst && (
                                        <div className="flex justify-between py-1 border-b border-neutral-200 pb-2">
                                            <span className="text-neutral-600 text-sm">GST</span>
                                            <span className="text-neutral-900 font-medium">₹{booking.return_details.gst}</span>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-neutral-700 font-semibold">Total Cost</span>
                                <span className="text-2xl font-bold text-green-600">₹{booking.total_cost || 'TBD'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Rejection Reason */}
                    {booking.status === 'cancelled' && booking.rejection_reason && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <h3 className="font-semibold text-red-900 mb-2">Cancellation Reason</h3>
                            <p className="text-red-700 text-sm">{booking.rejection_reason}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-neutral-50 border-t border-neutral-200 p-4 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all"
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
