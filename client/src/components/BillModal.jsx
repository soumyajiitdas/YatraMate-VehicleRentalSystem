import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BillModal = ({ booking, onClose }) => {
    const billRef = useRef(null);

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

            // Wait for images to load properly (if any)
            await new Promise((resolve) => setTimeout(resolve, 500));

            const canvas = await html2canvas(element, {
                scale: 2,
                logging: false,
                useCORS: true,
                backgroundColor: '#ffffff', // Ensure white background
                allowTaint: true,
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
            pdf.save(`Bill-${booking.bill_id}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    if (!booking) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-200 flex items-center justify-center p-4" data-testid="bill-modal-overlay">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-gray-900">Vehicle <span className='text-red-600'>Pickup Bill</span></h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        data-testid="bill-modal-close-btn"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Bill Content */}
                <div ref={billRef} className="p-8 bg-white">
                    {/* Company Header */}
                    <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
                        <h1 className="text-3xl font-bold text-primary-600">YatraMate</h1>
                        <p className="text-sm text-gray-600">Vehicle Rental Services</p>
                        <p className="text-xs text-gray-500 mt-1">Travel made effortless</p>
                    </div>

                    {/* Bill ID and Date */}
                    <div className="flex justify-between mb-6">
                        <div>
                            <p className="text-sm text-gray-600">Bill ID</p>
                            <p className="text-lg font-bold text-gray-900" data-testid="bill-id">{booking.bill_id}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="text-lg font-semibold text-gray-900">{formatDate(booking.pickup_details?.actual_pickup_date)}</p>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Details</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-600">Name:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.user_id?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Email:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.user_id?.email}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Phone:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.user_id?.phone}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">ID Proof:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.pickup_details?.id_proof_type?.replace('_', ' ').toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Details</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-600">Vehicle:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.vehicle_id?.name} - {booking.vehicle_id?.model_name}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Type:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.vehicle_id?.type}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Registration No:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.vehicle_id?.registration_number}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Engine CC:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.vehicle_id?.cc_engine}cc</span>
                            </div>
                        </div>
                    </div>

                    {/* Pickup Details */}
                    <div className="mb-6 bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Pickup Details</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-600">Pickup Date:</span>
                                <span className="ml-2 font-medium text-gray-900">{formatDate(booking.pickup_details?.actual_pickup_date)}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Pickup Time:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.pickup_details?.actual_pickup_time}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">From:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.start_location}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">To:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.end_location}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Odometer Start:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.pickup_details?.odometer_reading_start} km</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Vehicle Plate:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.pickup_details?.vehicle_plate_number}</span>
                            </div>
                        </div>
                    </div>

                    {/* Package & Pricing */}
                    <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Package & Pricing</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-600">Package:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.package_id?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Rate per Hour:</span>
                                <span className="ml-2 font-medium text-gray-900">₹{booking.package_id?.price_per_hour}/hr</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Rate per KM:</span>
                                <span className="ml-2 font-medium text-gray-900">₹{booking.package_id?.price_per_km}/km</span>
                            </div>
                        </div>
                    </div>

                    {/* Staff Details */}
                    <div className="mb-6 bg-purple-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Staff Details</h3>
                        <div className="text-sm">
                            <span className="text-gray-600">Confirmed By:</span>
                            <span className="ml-2 font-medium text-gray-900">{booking.pickup_details?.staff_id?.name || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Notes */}
                    {booking.pickup_details?.pickup_notes && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{booking.pickup_details.pickup_notes}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="border-t-2 border-gray-300 pt-4 mt-6">
                        <p className="text-xs text-gray-500 text-center">
                            This is a computer-generated bill. Final charges will be calculated upon vehicle return.
                        </p>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Thank you for choosing YatraMate!
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex space-x-4">
                    <button
                        onClick={downloadPDF}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        data-testid="download-pdf-btn"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download PDF</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
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
