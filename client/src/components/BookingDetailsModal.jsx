import { useState, useRef } from 'react';
import { X, MapPin, Calendar, Clock, CreditCard, Car, FileText } from 'lucide-react';
import FinalBillModal from './FinalBillModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '../contexts/ToastContext';

const BookingDetailsModal = ({ booking, onClose }) => {
    const [showBillModal, setShowBillModal] = useState(false);
    const billRef = useRef(null);
    const { toast } = useToast();

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

    const downloadBillDirectly = async () => {
        try {
            // Show loading state
            toast.info('Generating PDF, please wait...');

            // Wait for rendering
            await new Promise((resolve) => setTimeout(resolve, 500));

            const element = billRef.current;
            if (!element) {
                toast.error('Bill content not found. Please try again.');
                return;
            }

            const canvas = await html2canvas(element, {
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: element.scrollWidth,
                height: element.scrollHeight,
                scrollX: 0,
                scrollY: 0,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`YM-FINAL-${booking.bill_id || booking._id || 'bill'}.pdf`);
            toast.success('Final bill downloaded successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF: ' + (error.message || 'Unknown error'));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-150 flex items-center justify-center p-2 sm:p-4 animate-fadeIn" onClick={onClose}>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-slideUp" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-linear-to-r from-red-500 to-red-600 p-3 sm:p-4 md:p-6 z-10">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0 text-white">
                            <h2 className="text-base sm:text-xl md:text-2xl font-bold">Booking Details</h2>
                            <p className="text-red-100 text-xs sm:text-sm mt-0.5 sm:mt-1 truncate">ID: {booking._id}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 sm:p-2 hover:bg-red-400 rounded-full transition-all shrink-0"
                            data-testid="close-details-modal"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                    {/* Vehicle Information */}
                    <div className="bg-linear-to-br from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 sm:mb-3 text-red-700">
                            <Car className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                            <h3 className="font-bold text-sm sm:text-base">Vehicle Information</h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            {booking.vehicle.images && booking.vehicle.images[0] && (
                                <img
                                    src={booking.vehicle.images[0]}
                                    alt={booking.vehicle.name}
                                    className="w-full sm:w-24 md:w-28 h-32 sm:h-24 md:h-28 object-cover rounded-lg shadow-md"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm sm:text-base md:text-lg font-bold text-red-600 wrap-break-words">{booking.vehicle.name}</p>
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-red-500 text-white text-xs rounded-full font-semibold capitalize shadow-sm">
                                        {booking.vehicle.type}
                                    </span>
                                    {booking.vehicle.registration_number && booking.status === 'confirmed' && (
                                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white border border-red-300 text-red-700 text-xs rounded-full font-semibold shadow-sm">
                                            {booking.vehicle.registration_number}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="bg-white border border-gray-200 rounded-lg p-2.5 sm:p-3 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1 sm:mb-1.5 font-medium">Booking Status</p>
                            <span className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold capitalize shadow-sm ${getStatusColor(booking.status)}`}>
                                {booking.status}
                            </span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-2.5 sm:p-3 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1 sm:mb-1.5 font-medium">Payment Status</p>
                            <span className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold capitalize shadow-sm ${getPaymentStatusColor(booking.payment_status)}`}>
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
                                        <p className="text-xs sm:text-sm text-green-600">Download invoice PDF</p>
                                    </div>
                                </div>
                                <button
                                    onClick={downloadBillDirectly}
                                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2 text-sm shadow-md"
                                    data-testid="download-bill-button"
                                >
                                    <FileText className="w-4 h-4" />
                                    Download Bill
                                </button>
                            </div>
                        </div>
                    )}

                    {booking?.status === "confirmed" && (
                        <div className="mt-4 rounded-xl border border-yellow-400 bg-yellow-50 p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-white font-bold">
                                    !
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-yellow-800">
                                        Important Notice
                                    </p>
                                    <p className="mt-1 text-sm text-yellow-700">
                                        Please carry your <span className="font-semibold">original ID proof</span> during the pickup of the vehicle.
                                    </p>
                                </div>
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
                                {booking.status === 'cancelled' ? (
                                    <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-gray-100 gap-1 sm:gap-0">
                                        <span className="text-gray-600 text-xs sm:text-sm font-medium">Return Date</span>
                                        <span className="text-gray-900 font-semibold text-xs sm:text-sm">Cancelled</span>
                                    </div>
                                ) : booking.return_datetime ? (
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
                            {/* Show Advance Payment when pickup is confirmed or completed */}
                            {(booking.status === 'confirmed' || booking.status === 'completed') && booking.advance_payment && booking.advance_payment.amount > 0 && (
                                <div className="bg-green-100 border border-green-300 rounded-lg p-2.5 mb-2">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                                        <span className="text-green-800 font-bold text-xs sm:text-sm flex items-center gap-1">
                                            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="wrap-break-words">Advance Paid</span>
                                        </span>
                                        <span className="text-green-900 font-bold text-sm sm:text-base">₹{booking.advance_payment.amount.toFixed(2)}</span>
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
                                <span className="text-blue-900 font-bold text-sm sm:text-base">
                                    {booking.status === 'completed' ? 'Final Amount' : 'Advance Payment'}
                                </span>
                                <span className="text-lg sm:text-2xl font-bold text-blue-600">
                                    {booking.status === 'completed' ? `₹${booking.final_cost}` : `₹${booking.advance_payment?.amount || 0}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Refund Status Display */}
                    {booking.status === 'cancelled' && booking.refund_status !== 'not_applicable' && booking.refund_amount > 0 && (
                        <div className={`mt-4 p-4 rounded-lg border ${booking.refund_status === 'completed'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-yellow-50 border-yellow-200'
                            }`}>
                            <div className="flex items-start space-x-2">
                                <svg className={`w-5 h-5 shrink-0 mt-0.5 ${booking.refund_status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="flex-1">
                                    <p className={`text-sm font-semibold mb-1 ${booking.refund_status === 'completed' ? 'text-green-900' : 'text-yellow-900'
                                        }`}>
                                        Refund Status: {booking.refund_status === 'completed' ? '✅ Completed' : '⏳ Pending'}
                                    </p>
                                    <p className={`text-sm ${booking.refund_status === 'completed' ? 'text-green-700' : 'text-yellow-700'
                                        }`} data-testid="refund-amount-text">
                                        Amount: ₹{booking.refund_amount.toFixed(2)}
                                    </p>
                                    {booking.refund_status === 'pending' && (
                                            <p className="text-xs text-yellow-600 mt-1">
                                                Your refund will be processed within 7 working days.
                                            </p>
                                    )}
                                    {booking.refund_status === 'completed' && booking.refund_marked_at && (
                                        <p className="text-xs text-green-600 mt-1">
                                            Refund processed on {new Date(booking.refund_marked_at).toLocaleDateString('en-IN')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

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

            {/* Hidden Bill Content for PDF Generation */}
            {booking.status === 'completed' && (
                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                    <div
                        ref={billRef}
                        className="max-w-[800px] mx-auto p-8 font-sans"
                        style={{ backgroundColor: '#ffffff', width: '800px' }}
                    >
                        {/* Bill content from FinalBillModal - same structure */}
                        <div className="text-center pb-5 mb-5" style={{ borderBottom: '3px solid #000' }}>
                            <h1 className="text-[32px] font-bold m-0 mb-1" style={{ color: '#000' }}>YatraMate Rental Services</h1>
                            <p className="text-base my-1" style={{ color: '#6B7280' }}>Travel made effortless ~</p>
                            <p className="text-sm font-bold mt-1" style={{ color: '#16A34A' }}>RETURN INVOICE</p>
                        </div>

                        {/* Bill ID, Booking ID, and Date */}
                        <div className="flex justify-between gap-4 mb-8">
                            <div className="flex-1">
                                <div className="text-xs mb-1" style={{ color: '#6B7280' }}>Bill ID</div>
                                <div className="text-base font-bold" style={{ color: '#000' }}>{booking.bill_id || 'N/A'}</div>
                            </div>
                            <div className="flex-1 text-center">
                                <div className="text-xs mb-1" style={{ color: '#6B7280' }}>Booking ID</div>
                                <div className="text-xs font-bold break-all" style={{ color: '#000' }}>{booking._id}</div>
                            </div>
                            <div className="flex-1 text-right">
                                <div className="text-xs mb-1" style={{ color: '#6B7280' }}>Return Date</div>
                                <div className="text-base font-bold" style={{ color: '#000' }}>{formatDate(booking.return_details?.actual_return_date)}</div>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="mb-6 border p-4" style={{ borderColor: '#000' }}>
                            <div className="text-base font-bold mb-4 uppercase pb-2" style={{ color: '#000', borderBottom: '2px solid #000' }}>Customer Details</div>
                            <div className="space-y-2">
                                <div className="flex items-start">
                                    <div className="text-sm font-medium w-[180px] shrink-0" style={{ color: '#4B5563' }}>Name:</div>
                                    <div className="text-sm" style={{ color: '#000' }}>{booking.user_id?.name || 'N/A'}</div>
                                </div>
                                <div className="flex items-start">
                                    <div className="text-sm font-medium w-[180px] shrink-0" style={{ color: '#4B5563' }}>Contact Details:</div>
                                    <div className="text-sm break-all" style={{ color: '#000' }}>{booking.user_id?.phone || 'N/A'}, {booking.user_id?.email || 'N/A'}</div>
                                </div>
                                <div className="flex items-start">
                                    <div className="text-sm font-medium w-[180px] shrink-0" style={{ color: '#4B5563' }}>Govt. ID Proof:</div>
                                    <div className="text-sm" style={{ color: '#000' }}>
                                        {booking.pickup_details?.id_proof_type?.replace('_', ' ').toUpperCase() || 'N/A'} - {booking.pickup_details?.id_number || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Details */}
                        <div className="mb-6 border p-4" style={{ borderColor: '#000' }}>
                            <div className="text-base font-bold mb-4 uppercase pb-2" style={{ color: '#000', borderBottom: '2px solid #000' }}>Vehicle Details</div>
                            <div className="space-y-2">
                                <div className="flex items-start">
                                    <div className="text-sm font-medium w-[180px] shrink-0" style={{ color: '#4B5563' }}>Vehicle ({booking.vehicle?.type || 'N/A'}):</div>
                                    <div className="text-sm" style={{ color: '#000' }}>
                                        {booking.vehicle?.name || 'N/A'} - {booking.vehicle?.model_name || 'N/A'}, {booking.vehicle?.cc_engine || 'N/A'}cc
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="text-sm font-medium w-[180px] shrink-0" style={{ color: '#4B5563' }}>Registration No:</div>
                                    <div className="text-sm" style={{ color: '#000' }}>{booking.vehicle?.registration_number || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Trip Summary */}
                        <div className="mb-6 border p-4" style={{ borderColor: '#000' }}>
                            <div className="text-base font-bold mb-4 uppercase pb-2" style={{ color: '#000', borderBottom: '2px solid #000' }}>Trip Summary</div>
                            <div className="space-y-2">
                                <div className="flex items-start">
                                    <div className="text-sm font-medium w-[180px] shrink-0" style={{ color: '#4B5563' }}>Pickup Details:</div>
                                    <div className="text-sm" style={{ color: '#000' }}>
                                        {formatDate(booking.pickup_details?.actual_pickup_date)} at {booking.pickup_details?.actual_pickup_time || 'N/A'} from {booking.start_location || 'N/A'}
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="text-sm font-medium w-[180px] shrink-0" style={{ color: '#4B5563' }}>Return Date & Time:</div>
                                    <div className="text-sm" style={{ color: '#000' }}>
                                        {formatDate(booking.return_details?.actual_return_date)} at {booking.return_details?.actual_return_time || 'N/A'}
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="text-sm font-medium w-[180px] shrink-0" style={{ color: '#4B5563' }}>Distance & Duration:</div>
                                    <div className="text-sm font-bold" style={{ color: '#000' }}>{booking.distance_traveled_km || 'N/A'} km, {booking.duration_hours || 'N/A'} hours</div>
                                </div>
                                <div className="flex items-start">
                                    <div className="text-sm font-medium w-[180px] shrink-0" style={{ color: '#4B5563' }}>Vehicle Condition:</div>
                                    <div
                                        className="text-sm font-bold"
                                        style={{ color: booking.return_details?.vehicle_condition === 'damaged' ? '#DC2626' : '#16A34A' }}
                                    >
                                        {booking.return_details?.vehicle_condition?.toUpperCase() || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="mb-6 border p-4" style={{ borderColor: '#000', backgroundColor: '#F9FAFB' }}>
                            <div className="text-base font-bold mb-4 uppercase pb-2" style={{ color: '#000', borderBottom: '2px solid #000' }}>Cost Breakdown</div>
                            <div className="space-y-2">
                                <div className="flex justify-between py-2 border-b text-sm" style={{ borderColor: '#E5E7EB' }}>
                                    <span>Distance Cost ({booking.distance_traveled_km || 0} km)</span>
                                    <span>₹{booking.cost_per_distance?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b text-sm" style={{ borderColor: '#E5E7EB' }}>
                                    <span>Time Cost ({booking.duration_hours || 0} hours)</span>
                                    <span>₹{booking.cost_per_time?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b text-sm italic" style={{ borderColor: '#E5E7EB', color: '#6B7280' }}>
                                    <span>Applicable Cost (Higher of Distance/Time)</span>
                                    <span>₹{Math.max(booking.cost_per_distance || 0, booking.cost_per_time || 0).toFixed(2)}</span>
                                </div>
                                {(booking.damage_cost > 0 || booking.return_details?.damage_cost > 0) && (
                                    <div className="flex justify-between py-2 border-b text-sm" style={{ borderColor: '#E5E7EB', color: '#DC2626' }}>
                                        <span>Damage Cost</span>
                                        <span>₹{(booking.damage_cost || booking.return_details?.damage_cost || 0).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-3 mt-3 text-lg font-bold" style={{ borderTop: '2px solid #000' }}>
                                    <span>TOTAL AMOUNT</span>
                                    <span style={{ color: '#16A34A' }}>₹{booking.final_cost?.toFixed(2) || '0.00'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="mb-6 border p-4" style={{ borderColor: '#000', backgroundColor: '#F0FDF4' }}>
                            <div className="text-base font-bold mb-4 uppercase pb-2" style={{ color: '#166534', borderBottom: '2px solid #16A34A' }}>Payment Summary</div>
                            <div className="space-y-2">
                                {booking.advance_payment?.amount > 0 && (
                                    <div className="flex justify-between py-2 border-b text-sm" style={{ borderColor: '#BBF7D0' }}>
                                        <span style={{ color: '#15803D' }}>
                                            Advance Payment (at booking)
                                            {booking.advance_payment?.razorpay_payment_id && (
                                                <span className="text-xs block" style={{ color: '#6B7280' }}>ID: {booking.advance_payment.razorpay_payment_id}</span>
                                            )}
                                        </span>
                                        <span className="font-medium" style={{ color: '#16A34A' }}>₹{booking.advance_payment.amount?.toFixed(2) || '0.00'}</span>
                                    </div>
                                )}
                                {booking.final_payment?.amount > 0 && (
                                    <div className="flex justify-between py-2 border-b text-sm" style={{ borderColor: '#BBF7D0' }}>
                                        <span style={{ color: '#15803D' }}>
                                            Final Payment ({booking.final_payment?.method === 'online' ? 'Online' : 'Cash'})
                                            {booking.final_payment?.razorpay_payment_id && (
                                                <span className="text-xs block" style={{ color: '#6B7280' }}>ID: {booking.final_payment.razorpay_payment_id}</span>
                                            )}
                                        </span>
                                        <span className="font-medium" style={{ color: '#16A34A' }}>₹{booking.final_payment.amount?.toFixed(2) || '0.00'}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-3 mt-3 text-lg font-bold -mx-3 px-3 rounded" style={{ borderTop: '2px solid #16A34A', backgroundColor: '#DCFCE7' }}>
                                    <span style={{ color: '#166534' }}>TOTAL PAID</span>
                                    <span style={{ color: '#16A34A' }}>
                                        ₹{(
                                            (booking.advance_payment?.amount || 0) +
                                            (booking.final_payment?.amount || 0)
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-5 text-center" style={{ borderTop: '3px solid #000' }}>
                            <p className="text-xs mb-12" style={{ color: '#6B7280' }}>
                                Thank you for choosing YatraMate! We hope you had a great journey.
                            </p>
                        </div>
                    </div>
                </div>
            )}

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
