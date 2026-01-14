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

    // Inline styles for PDF generation (using standard hex colors instead of oklch)
    const styles = {
        billContainer: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '32px',
            backgroundColor: '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#000000',
        },
        header: {
            textAlign: 'center',
            borderBottom: '3px solid #000000',
            paddingBottom: '20px',
            marginBottom: '32px',
        },
        companyName: {
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 4px 0',
            color: '#000000',
        },
        tagline: {
            fontSize: '14px',
            color: '#6b7280',
            margin: '4px 0',
        },
        row: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '32px',
        },
        label: {
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '4px',
        },
        value: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#000000',
        },
        section: {
            marginBottom: '24px',
            border: '1px solid #000000',
            padding: '16px',
        },
        sectionTitle: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#000000',
            textTransform: 'uppercase',
            borderBottom: '2px solid #000000',
            paddingBottom: '8px',
            marginBottom: '16px',
        },
        detailRow: {
            display: 'flex',
            marginBottom: '8px',
        },
        detailLabel: {
            fontSize: '13px',
            color: '#4b5563',
            fontWeight: '500',
            width: '150px',
            flexShrink: 0,
        },
        detailValue: {
            fontSize: '13px',
            color: '#000000',
        },
        footer: {
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '3px solid #000000',
            textAlign: 'center',
        },
        footerText: {
            fontSize: '11px',
            color: '#6b7280',
            marginBottom: '48px',
        },
    };

    const downloadPDF = async () => {
        try {
            const element = billRef.current;
            if (!element) {
                toast.error('Bill content not found. Please try again.');
                return;
            }

            toast.info('Generating PDF, please wait...');

            await new Promise((resolve) => setTimeout(resolve, 500));

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
            pdf.save(`YM-${booking.bill_id || 'bill'}.pdf`);
            toast.success('Bill downloaded successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF: ' + (error.message || 'Unknown error'));
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

                {/* Bill Content - Using inline styles for PDF compatibility */}
                <div ref={billRef} style={styles.billContainer}>
                    {/* Company Header */}
                    <div style={styles.header}>
                        <h1 style={styles.companyName}>YatraMate Rental Services</h1>
                        <p style={styles.tagline}>Travel made effortless ~</p>
                    </div>

                    {/* Bill ID and Date */}
                    <div style={styles.row}>
                        <div>
                            <div style={styles.label}>Bill ID</div>
                            <div style={styles.value} data-testid="bill-id">{booking.bill_id}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={styles.label}>Date</div>
                            <div style={styles.value}>{formatDate(booking.pickup_details?.actual_pickup_date)}</div>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div style={styles.section}>
                        <div style={styles.sectionTitle}>Customer Details</div>
                        <div style={styles.detailRow}>
                            <div style={styles.detailLabel}>Name:</div>
                            <div style={styles.detailValue}>{booking.user_id?.name || 'N/A'}</div>
                        </div>
                        <div style={styles.detailRow}>
                            <div style={styles.detailLabel}>Contact Details:</div>
                            <div style={styles.detailValue}>{booking.user_id?.phone || 'N/A'}, {booking.user_id?.email || 'N/A'}</div>
                        </div>
                        <div style={styles.detailRow}>
                            <div style={styles.detailLabel}>Govt. ID Proof:</div>
                            <div style={styles.detailValue}>
                                {booking.pickup_details?.id_proof_type?.replace('_', ' ').toUpperCase() || 'N/A'} - {booking.pickup_details?.id_number || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div style={styles.section}>
                        <div style={styles.sectionTitle}>Vehicle Details</div>
                        <div style={styles.detailRow}>
                            <div style={styles.detailLabel}>Vehicle ({booking.vehicle_id?.type || 'N/A'}):</div>
                            <div style={styles.detailValue}>
                                {booking.vehicle_id?.name || 'N/A'} - {booking.vehicle_id?.model_name || 'N/A'}, {booking.vehicle_id?.cc_engine || 'N/A'}cc
                            </div>
                        </div>
                        <div style={styles.detailRow}>
                            <div style={styles.detailLabel}>Registration No:</div>
                            <div style={styles.detailValue}>{booking.vehicle_id?.registration_number || 'N/A'}</div>
                        </div>
                    </div>

                    {/* Pickup Details */}
                    <div style={styles.section}>
                        <div style={styles.sectionTitle}>Pickup Details</div>
                        <div style={styles.detailRow}>
                            <div style={styles.detailLabel}>Pickup Date & Time:</div>
                            <div style={styles.detailValue}>
                                {formatDate(booking.pickup_details?.actual_pickup_date)} at {booking.pickup_details?.actual_pickup_time || 'N/A'}
                            </div>
                        </div>
                        <div style={styles.detailRow}>
                            <div style={styles.detailLabel}>Pickup Location:</div>
                            <div style={styles.detailValue}>{booking.start_location || 'N/A'}</div>
                        </div>
                    </div>

                    {/* Notes */}
                    {booking.pickup_details?.pickup_notes && (
                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>Notes</div>
                            <p style={{ fontSize: '13px', color: '#4b5563', margin: 0 }}>
                                {booking.pickup_details.pickup_notes}
                            </p>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={styles.footer}>
                        <p style={styles.footerText}>
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
