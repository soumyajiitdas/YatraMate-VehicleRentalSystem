import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '../contexts/ToastContext';

const FinalBillModal = ({ booking, onClose }) => {
    const billRef = useRef(null);
    const { toast } = useToast();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const downloadPDF = async () => {
        try {
            const element = billRef.current;
            if (!element) return;

            // Wait for any rendering to complete
            await new Promise((resolve) => setTimeout(resolve, 300));

            const canvas = await html2canvas(element, {
                scale: 2,
                logging: false,
                useCORS: true,
                backgroundColor: '#ffffff',
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
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
            pdf.save(`YM-FINAL-${booking.bill_id || booking._id}.pdf`);
            toast.success('Final bill downloaded successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF. Please try again.');
        }
    };

    if (!booking) return null;

    // Extract booking data from different possible structures
    const vehicleData = booking.vehicle_id || booking.vehicle || {};
    const userData = booking.user_id || {};
    const pickupDetails = booking.pickup_details || {};
    const returnDetails = booking.return_details || {};

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 md:p-5 z-1000"
            data-testid="final-bill-modal-overlay"
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-[900px] max-h-[90vh] overflow-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 flex items-center justify-between z-10">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black">
                        Final <span className="text-green-600">Bill</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl leading-none p-1"
                        data-testid="final-bill-modal-close-btn"
                    >
                        ×
                    </button>
                </div>

                {/* Bill Content */}
                <div ref={billRef} className="max-w-[800px] mx-auto p-4 sm:p-6 md:p-8 bg-white font-sans">
                    {/* Company Header */}
                    <div className="text-center border-b-[3px] border-black pb-4 sm:pb-5 mb-4 sm:mb-5">
                        <h1 className="text-xl sm:text-2xl md:text-[32px] font-bold m-0 mb-1 text-black">YatraMate Rental Services</h1>
                        <p className="text-sm sm:text-base text-gray-500 my-1">Travel made effortless ~</p>
                        <p className="text-xs sm:text-sm text-green-600 font-bold mt-1">RETURN INVOICE</p>
                    </div>

                    {/* Bill ID, Booking ID, and Date */}
                    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                        <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">Bill ID</div>
                            <div className="text-sm sm:text-base font-bold text-black" data-testid="final-bill-id">{booking.bill_id || 'N/A'}</div>
                        </div>
                        <div className="flex-1 sm:text-center">
                            <div className="text-xs text-gray-500 mb-1">Booking ID</div>
                            <div className="text-[10px] sm:text-xs font-bold text-black break-all">{booking._id}</div>
                        </div>
                        <div className="flex-1 sm:text-right">
                            <div className="text-xs text-gray-500 mb-1">Return Date</div>
                            <div className="text-sm sm:text-base font-bold text-black">{formatDate(returnDetails.actual_return_date)}</div>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="mb-4 sm:mb-6 border border-black p-3 sm:p-4">
                        <div className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-black uppercase border-b-2 border-black pb-2">Customer Details</div>
                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[140px] md:w-[180px] sm:shrink-0">Name:</div>
                                <div className="text-xs sm:text-sm text-black">{userData.name || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[140px] md:w-[180px] sm:shrink-0">Email:</div>
                                <div className="text-xs sm:text-sm text-black break-all">{userData.email || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[140px] md:w-[180px] sm:shrink-0">Phone:</div>
                                <div className="text-xs sm:text-sm text-black">{userData.phone || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[140px] md:w-[180px] sm:shrink-0">Govt. ID Proof:</div>
                                <div className="text-xs sm:text-sm text-black">
                                    {pickupDetails.id_proof_type?.replace('_', ' ').toUpperCase() || 'N/A'} - {pickupDetails.id_number || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="mb-4 sm:mb-6 border border-black p-3 sm:p-4">
                        <div className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-black uppercase border-b-2 border-black pb-2">Vehicle Details</div>
                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[140px] md:w-[180px] sm:shrink-0">Vehicle:</div>
                                <div className="text-xs sm:text-sm text-black">
                                    {vehicleData.name || 'N/A'} - {vehicleData.model_name || 'N/A'}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[140px] md:w-[180px] sm:shrink-0">Type:</div>
                                <div className="text-xs sm:text-sm text-black">{vehicleData.type || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[140px] md:w-[180px] sm:shrink-0">Registration No:</div>
                                <div className="text-xs sm:text-sm text-black">{vehicleData.registration_number || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[140px] md:w-[180px] sm:shrink-0">Engine CC:</div>
                                <div className="text-xs sm:text-sm text-black">{vehicleData.cc_engine || 'N/A'}cc</div>
                            </div>
                        </div>
                    </div>

                    {/* Trip Summary */}
                    <div className="mb-4 sm:mb-6 border border-black p-3 sm:p-4">
                        <div className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-black uppercase border-b-2 border-black pb-2">Trip Summary</div>
                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[140px] md:w-[180px] sm:shrink-0">Pickup Date & Time:</div>
                                <div className="text-xs sm:text-sm text-black">
                                    {formatDate(pickupDetails.actual_pickup_date)} at {pickupDetails.actual_pickup_time || 'N/A'}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[140px] md:w-[180px] sm:shrink-0">Return Date & Time:</div>
                                <div className="text-xs sm:text-sm text-black">
                                    {formatDate(returnDetails.actual_return_date)} at {returnDetails.actual_return_time || 'N/A'}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[140px] md:w-[180px] sm:shrink-0">Pickup Location:</div>
                                <div className="text-xs sm:text-sm text-black">{booking.start_location || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[140px] md:w-[180px] sm:shrink-0">Total Distance:</div>
                                <div className="text-xs sm:text-sm text-black font-bold">{booking.distance_traveled_km || 'N/A'} km</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[140px] md:w-[180px] sm:shrink-0">Total Duration:</div>
                                <div className="text-xs sm:text-sm text-black font-bold">{booking.duration_hours || 'N/A'} hours</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[140px] md:w-[180px] sm:shrink-0">Vehicle Condition:</div>
                                <div className={`text-xs sm:text-sm font-bold ${returnDetails.vehicle_condition === 'damaged' ? 'text-red-600' : 'text-green-600'}`}>
                                    {returnDetails.vehicle_condition?.toUpperCase() || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="mb-4 sm:mb-6 border border-black p-3 sm:p-4 bg-gray-50">
                        <div className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-black uppercase border-b-2 border-black pb-2">Cost Breakdown</div>
                        <div className="space-y-2">
                            <div className="flex justify-between py-2 border-b border-gray-200 text-xs sm:text-sm">
                                <span>Distance Cost ({booking.distance_traveled_km || 0} km)</span>
                                <span>₹{booking.cost_per_distance?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200 text-xs sm:text-sm">
                                <span>Time Cost ({booking.duration_hours || 0} hours)</span>
                                <span>₹{booking.cost_per_time?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200 text-xs sm:text-sm text-gray-500 italic">
                                <span>Applicable Cost (Higher of Distance/Time)</span>
                                <span>₹{Math.max(booking.cost_per_distance || 0, booking.cost_per_time || 0).toFixed(2)}</span>
                            </div>
                            {(booking.damage_cost > 0 || returnDetails.damage_cost > 0) && (
                                <div className="flex justify-between py-2 border-b border-gray-200 text-xs sm:text-sm text-red-600">
                                    <span>Damage Cost</span>
                                    <span>₹{(booking.damage_cost || returnDetails.damage_cost || 0).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-3 border-t-2 border-black mt-3 text-base sm:text-lg font-bold">
                                <span>TOTAL AMOUNT</span>
                                <span className="text-green-600">₹{booking.final_cost?.toFixed(2) || '0.00'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Damage Notes (if any) */}
                    {returnDetails.damage_description && (
                        <div className="mb-4 sm:mb-6 border border-red-600 p-3 sm:p-4">
                            <div className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-red-600 uppercase border-b-2 border-red-600 pb-2">Damage Notes</div>
                            <p className="text-xs sm:text-sm text-red-600 m-0">
                                {returnDetails.damage_description}
                            </p>
                        </div>
                    )}

                    {/* Return Notes (if any) */}
                    {returnDetails.return_notes && (
                        <div className="mb-4 sm:mb-6 border border-black p-3 sm:p-4">
                            <div className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-black uppercase border-b-2 border-black pb-2">Return Notes</div>
                            <p className="text-xs sm:text-sm text-gray-600 m-0">
                                {returnDetails.return_notes}
                            </p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t-[3px] border-black text-center">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-8 sm:mb-12">
                            Thank you for choosing YatraMate! We hope you had a great journey.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <button
                        onClick={downloadPDF}
                        className="flex-1 py-3 sm:py-3 px-4 sm:px-6 bg-green-600 text-white border-none rounded-md font-semibold cursor-pointer text-sm sm:text-base hover:bg-green-700 transition-colors"
                        data-testid="download-final-bill-pdf-btn"
                    >
                        Download Bill PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 sm:py-3 px-4 sm:px-6 bg-white text-green-600 border-2 border-green-600 rounded-md font-semibold cursor-pointer text-sm sm:text-base hover:bg-green-50 transition-colors"
                        data-testid="close-final-bill-btn"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinalBillModal;
