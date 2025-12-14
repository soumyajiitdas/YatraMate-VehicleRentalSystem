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
            alert('Failed to generate PDF. Please try again.');
        }
    };

    if (!booking) return null;

    const billStyles = {
        container: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '30px',
            backgroundColor: '#ffffff',
            fontFamily: 'Arial, sans-serif',
        },
        header: {
            textAlign: 'center',
            borderBottom: '3px solid #000',
            paddingBottom: '20px',
            marginBottom: '30px',
        },
        companyName: {
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 0 5px 0',
            color: '#000',
        },
        companyTagline: {
            fontSize: '14px',
            margin: '5px 0',
            color: '#333',
        },
        billInfo: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '30px',
        },
        infoBlock: {
            flex: 1,
        },
        label: {
            fontSize: '12px',
            color: '#666',
            marginBottom: '5px',
        },
        value: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000',
        },
        section: {
            marginBottom: '25px',
            border: '1px solid #000',
            padding: '15px',
        },
        sectionTitle: {
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#000',
            textTransform: 'uppercase',
            borderBottom: '2px solid #000',
            paddingBottom: '8px',
        },
        row: {
            display: 'flex',
            marginBottom: '10px',
        },
        rowLabel: {
            flex: '0 0 150px',
            fontSize: '13px',
            color: '#333',
            fontWeight: '500',
        },
        rowValue: {
            flex: 1,
            fontSize: '13px',
            color: '#000',
            fontWeight: '400',
        },
        footer: {
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '3px solid #000',
            textAlign: 'center',
        },
        footerText: {
            fontSize: '11px',
            marginBottom: '50px',
            color: '#666',
            margin: '5px 0',
        },
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000,
        }} data-testid="bill-modal-overlay">
            <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
            }}>
                {/* Modal Header */}
                <div style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #ddd',
                    padding: '20px 30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 10,
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#000', margin: 0 }}>
                        Vehicle <span className='text-red-500'>Pickup Bill</span> 
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#666',
                        }}
                        data-testid="bill-modal-close-btn"
                    >
                        ×
                    </button>
                </div>

                {/* Bill Content */}
                <div ref={billRef} style={billStyles.container}>
                    {/* Company Header */}
                    <div style={billStyles.header}>
                        <h1 style={billStyles.companyName}>YatraMate Rental Services</h1>
                        <p style={{ fontSize: '16px', margin: '5px 0', color: '#666' }}>Travel made effortless ~</p>
                    </div>

                    {/* Bill ID and Date */}
                    <div style={billStyles.billInfo}>
                        <div style={billStyles.infoBlock}>
                            <div style={billStyles.label}>Bill ID</div>
                            <div style={billStyles.value} data-testid="bill-id">{booking.bill_id}</div>
                        </div>
                        <div style={{ ...billStyles.infoBlock, textAlign: 'right' }}>
                            <div style={billStyles.label}>Date</div>
                            <div style={billStyles.value}>{formatDate(booking.pickup_details?.actual_pickup_date)}</div>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div style={billStyles.section}>
                        <div style={billStyles.sectionTitle}>Customer Details</div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Name:</div>
                            <div style={billStyles.rowValue}>{booking.user_id?.name || 'N/A'}</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Email:</div>
                            <div style={billStyles.rowValue}>{booking.user_id?.email || 'N/A'}</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Phone:</div>
                            <div style={billStyles.rowValue}>{booking.user_id?.phone || 'N/A'}</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>ID Proof:</div>
                            <div style={billStyles.rowValue}>
                                {booking.pickup_details?.id_proof_type?.replace('_', ' ').toUpperCase() || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div style={billStyles.section}>
                        <div style={billStyles.sectionTitle}>Vehicle Details</div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Vehicle:</div>
                            <div style={billStyles.rowValue}>
                                {booking.vehicle_id?.name || 'N/A'} - {booking.vehicle_id?.model_name || 'N/A'}
                            </div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Type:</div>
                            <div style={billStyles.rowValue}>{booking.vehicle_id?.type || 'N/A'}</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Registration No:</div>
                            <div style={billStyles.rowValue}>{booking.vehicle_id?.registration_number || 'N/A'}</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Engine CC:</div>
                            <div style={billStyles.rowValue}>{booking.vehicle_id?.cc_engine || 'N/A'}cc</div>
                        </div>
                    </div>

                    {/* Pickup Details */}
                    <div style={billStyles.section}>
                        <div style={billStyles.sectionTitle}>Pickup Details</div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Pickup Date:</div>
                            <div style={billStyles.rowValue}>
                                {formatDate(booking.pickup_details?.actual_pickup_date)}
                            </div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Pickup Time:</div>
                            <div style={billStyles.rowValue}>{booking.pickup_details?.actual_pickup_time || 'N/A'}</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>From:</div>
                            <div style={billStyles.rowValue}>{booking.start_location || 'N/A'}</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>To:</div>
                            <div style={billStyles.rowValue}>{booking.end_location || 'N/A'}</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Odometer Start:</div>
                            <div style={billStyles.rowValue}>{booking.pickup_details?.odometer_reading_start || 'N/A'} km</div>
                        </div>
                    </div>

                    {/* Notes */}
                    {booking.pickup_details?.pickup_notes && (
                        <div style={billStyles.section}>
                            <div style={billStyles.sectionTitle}>Notes</div>
                            <p style={{ fontSize: '13px', color: '#333', margin: 0 }}>
                                {booking.pickup_details.pickup_notes}
                            </p>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={billStyles.footer}>
                        <p style={billStyles.footerText}>
                            Final charges will be calculated upon vehicle return. Thank you for choosing YatraMate!
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                    position: 'sticky',
                    bottom: 0,
                    backgroundColor: '#ffffff',
                    borderTop: '1px solid #ddd',
                    padding: '20px 30px',
                    display: 'flex',
                    gap: '15px',
                }}>
                    <button
                        onClick={downloadPDF}
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            backgroundColor: '#f00',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '15px',
                        }}
                        data-testid="download-pdf-btn"
                    >
                        Download PDF
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            backgroundColor: '#fff',
                            color: '#f00',
                            border: '2px solid #f00',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '15px',
                        }}
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