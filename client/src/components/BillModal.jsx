import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '../contexts/ToastContext';

const BillModal = ({ booking, onClose }) => {
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
            pdf.save(`YM-${booking.bill_id}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF. Please try again.');
        }
    };

    if (!booking) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 md:p-5 z-1000"
            data-testid="bill-modal-overlay"
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-[900px] max-h-[90vh] overflow-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 flex items-center justify-between z-10">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black">
                        Vehicle <span className='text-red-500'>Pickup Bill</span> 
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl leading-none p-1"
                        data-testid="bill-modal-close-btn"
                    >
                        ×
                    </button>
                </div>

                {/* Bill Content */}
                <div ref={billRef} className="max-w-[800px] mx-auto p-4 sm:p-6 md:p-8 bg-white font-sans">
                    {/* Company Header */}
                    <div className="text-center border-b-[3px] border-black pb-4 sm:pb-5 mb-4 sm:mb-6 md:mb-8">
                        <h1 className="text-xl sm:text-2xl md:text-[32px] font-bold m-0 mb-1 text-black">YatraMate Rental Services</h1>
                        <p className="text-sm sm:text-base text-gray-500 my-1">Travel made effortless ~</p>
                    </div>

                    {/* Bill ID and Date */}
                    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 mb-4 sm:mb-6 md:mb-8">
                        <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">Bill ID</div>
                            <div className="text-sm sm:text-base font-bold text-black" data-testid="bill-id">{booking.bill_id}</div>
                        </div>
                        <div className="flex-1 sm:text-right">
                            <div className="text-xs text-gray-500 mb-1">Date</div>
                            <div className="text-sm sm:text-base font-bold text-black">{formatDate(booking.pickup_details?.actual_pickup_date)}</div>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="mb-4 sm:mb-6 border border-black p-3 sm:p-4">
                        <div className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-black uppercase border-b-2 border-black pb-2">Customer Details</div>
                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[120px] md:w-[150px] sm:shrink-0">Name:</div>
                                <div className="text-xs sm:text-sm text-black">{booking.user_id?.name || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[120px] md:w-[150px] sm:shrink-0">Email:</div>
                                <div className="text-xs sm:text-sm text-black break-all">{booking.user_id?.email || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[120px] md:w-[150px] sm:shrink-0">Phone:</div>
                                <div className="text-xs sm:text-sm text-black">{booking.user_id?.phone || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[120px] md:w-[150px] sm:shrink-0">Govt. ID Proof:</div>
                                <div className="text-xs sm:text-sm text-black">
                                    {booking.pickup_details?.id_proof_type?.replace('_', ' ').toUpperCase() || 'N/A'}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[120px] md:w-[150px] sm:shrink-0">ID Number:</div>
                                <div className="text-xs sm:text-sm text-black">
                                    {booking.pickup_details?.id_number || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="mb-4 sm:mb-6 border border-black p-3 sm:p-4">
                        <div className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-black uppercase border-b-2 border-black pb-2">Vehicle Details</div>
                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[120px] md:w-[150px] sm:shrink-0">Vehicle:</div>
                                <div className="text-xs sm:text-sm text-black">
                                    {booking.vehicle_id?.name || 'N/A'} - {booking.vehicle_id?.model_name || 'N/A'}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[120px] md:w-[150px] sm:shrink-0">Type:</div>
                                <div className="text-xs sm:text-sm text-black">{booking.vehicle_id?.type || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[120px] md:w-[150px] sm:shrink-0">Registration No:</div>
                                <div className="text-xs sm:text-sm text-black">{booking.vehicle_id?.registration_number || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[120px] md:w-[150px] sm:shrink-0">Engine CC:</div>
                                <div className="text-xs sm:text-sm text-black">{booking.vehicle_id?.cc_engine || 'N/A'}cc</div>
                            </div>
                        </div>
                    </div>

                    {/* Pickup Details */}
                    <div className="mb-4 sm:mb-6 border border-black p-3 sm:p-4">
                        <div className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-black uppercase border-b-2 border-black pb-2">Pickup Details</div>
                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[120px] md:w-[150px] sm:shrink-0">Pickup Date:</div>
                                <div className="text-xs sm:text-sm text-black">
                                    {formatDate(booking.pickup_details?.actual_pickup_date)}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[120px] md:w-[150px] sm:shrink-0">Pickup Time:</div>
                                <div className="text-xs sm:text-sm text-black">{booking.pickup_details?.actual_pickup_time || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[120px] md:w-[150px] sm:shrink-0">Pickup Location:</div>
                                <div className="text-xs sm:text-sm text-black">{booking.start_location || 'N/A'}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium sm:w-[120px] md:w-[150px] sm:shrink-0">Odometer Start:</div>
                                <div className="text-xs sm:text-sm text-black">{booking.pickup_details?.odometer_reading_start || 'N/A'} km</div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {booking.pickup_details?.pickup_notes && (
                        <div className="mb-4 sm:mb-6 border border-black p-3 sm:p-4">
                            <div className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-black uppercase border-b-2 border-black pb-2">Notes</div>
                            <p className="text-xs sm:text-sm text-gray-600 m-0">
                                {booking.pickup_details.pickup_notes}
                            </p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 sm:mt-8 md:mt-10 pt-4 sm:pt-5 border-t-[3px] border-black text-center">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-8 sm:mb-12">
                            Final charges will be calculated upon vehicle return. Thank you for choosing YatraMate!
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <button
                        onClick={downloadPDF}
                        className="flex-1 py-3 sm:py-3 px-4 sm:px-6 bg-red-500 text-white border-none rounded-md font-semibold cursor-pointer text-sm sm:text-base hover:bg-red-600 transition-colors"
                        data-testid="download-pdf-btn"
                    >
                        Download PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 sm:py-3 px-4 sm:px-6 bg-white text-red-500 border-2 border-red-500 rounded-md font-semibold cursor-pointer text-sm sm:text-base hover:bg-red-50 transition-colors"
                        data-testid="close-bill-btn"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillModal;
