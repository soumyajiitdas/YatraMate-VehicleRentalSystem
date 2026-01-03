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
            marginBottom: '20px',
        },
        companyName: {
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 0 5px 0',
            color: '#000',
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
            flex: '0 0 180px',
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
        costRow: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: '1px solid #eee',
        },
        totalRow: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 0',
            borderTop: '2px solid #000',
            marginTop: '10px',
            fontSize: '18px',
            fontWeight: 'bold',
        },
        footer: {
            marginTop: '30px',
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
        }} data-testid="final-bill-modal-overlay">
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
                        Final <span style={{ color: '#16a34a' }}>Bill</span>
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
                        data-testid="final-bill-modal-close-btn"
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
                        <p style={{ fontSize: '14px', margin: '5px 0 0', color: '#16a34a', fontWeight: 'bold' }}>RETURN INVOICE</p>
                    </div>

                    {/* Bill ID and Date */}
                    <div style={billStyles.billInfo}>
                        <div style={billStyles.infoBlock}>
                            <div style={billStyles.label}>Bill ID</div>
                            <div style={billStyles.value} data-testid="final-bill-id">{booking.bill_id || 'N/A'}</div>
                        </div>
                        <div style={{ ...billStyles.infoBlock, textAlign: 'center' }}>
                            <div style={billStyles.label}>Booking ID</div>
                            <div style={{ ...billStyles.value, fontSize: '12px' }}>{booking._id}</div>
                        </div>
                        <div style={{ ...billStyles.infoBlock, textAlign: 'right' }}>
                            <div style={billStyles.label}>Return Date</div>
                            <div style={billStyles.value}>{formatDate(returnDetails.actual_return_date)}</div>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div style={billStyles.section}>
                        <div style={billStyles.sectionTitle}>Customer Details</div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Name:</div>
                            <div style={billStyles.rowValue}>{userData.name || 'N/A'}</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Email:</div>
                            <div style={billStyles.rowValue}>{userData.email || 'N/A'}</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Phone:</div>
                            <div style={billStyles.rowValue}>{userData.phone || 'N/A'}</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Govt. ID Proof:</div>
                            <div style={billStyles.rowValue}>
                                {pickupDetails.id_proof_type?.replace('_', ' ').toUpperCase() || 'N/A'} - {pickupDetails.id_number || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div style={billStyles.section}>
                        <div style={billStyles.sectionTitle}>Vehicle Details</div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Vehicle:</div>
                            <div style={billStyles.rowValue}>
                                {vehicleData.name || 'N/A'} - {vehicleData.model_name || 'N/A'}
                            </div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Type:</div>
                            <div style={billStyles.rowValue}>{vehicleData.type || 'N/A'}</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Registration No:</div>
                            <div style={billStyles.rowValue}>{vehicleData.registration_number || 'N/A'}</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Engine CC:</div>
                            <div style={billStyles.rowValue}>{vehicleData.cc_engine || 'N/A'}cc</div>
                        </div>
                    </div>

                    {/* Trip Summary */}
                    <div style={billStyles.section}>
                        <div style={billStyles.sectionTitle}>Trip Summary</div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Pickup Date & Time:</div>
                            <div style={billStyles.rowValue}>
                                {formatDate(pickupDetails.actual_pickup_date)} at {pickupDetails.actual_pickup_time || 'N/A'}
                            </div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Return Date & Time:</div>
                            <div style={billStyles.rowValue}>
                                {formatDate(returnDetails.actual_return_date)} at {returnDetails.actual_return_time || 'N/A'}
                            </div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Pickup Location:</div>
                            <div style={billStyles.rowValue}>{booking.start_location || 'N/A'}</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Total Distance:</div>
                            <div style={{ ...billStyles.rowValue, fontWeight: 'bold' }}>{booking.distance_traveled_km || 'N/A'} km</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Total Duration:</div>
                            <div style={{ ...billStyles.rowValue, fontWeight: 'bold' }}>{booking.duration_hours || 'N/A'} hours</div>
                        </div>
                        <div style={billStyles.row}>
                            <div style={billStyles.rowLabel}>Vehicle Condition:</div>
                            <div style={{ 
                                ...billStyles.rowValue, 
                                color: returnDetails.vehicle_condition === 'damaged' ? '#dc2626' : '#16a34a',
                                fontWeight: 'bold'
                            }}>
                                {returnDetails.vehicle_condition?.toUpperCase() || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div style={{ ...billStyles.section, backgroundColor: '#f9fafb' }}>
                        <div style={billStyles.sectionTitle}>Cost Breakdown</div>
                        <div style={billStyles.costRow}>
                            <span>Distance Cost ({booking.distance_traveled_km || 0} km)</span>
                            <span>₹{booking.cost_per_distance?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div style={billStyles.costRow}>
                            <span>Time Cost ({booking.duration_hours || 0} hours)</span>
                            <span>₹{booking.cost_per_time?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div style={{ ...billStyles.costRow, color: '#666', fontStyle: 'italic' }}>
                            <span>Applicable Cost (Higher of Distance/Time)</span>
                            <span>₹{Math.max(booking.cost_per_distance || 0, booking.cost_per_time || 0).toFixed(2)}</span>
                        </div>
                        {(booking.damage_cost > 0 || returnDetails.damage_cost > 0) && (
                            <div style={{ ...billStyles.costRow, color: '#dc2626' }}>
                                <span>Damage Cost</span>
                                <span>₹{(booking.damage_cost || returnDetails.damage_cost || 0).toFixed(2)}</span>
                            </div>
                        )}
                        <div style={billStyles.totalRow}>
                            <span>TOTAL AMOUNT</span>
                            <span style={{ color: '#16a34a' }}>₹{booking.final_cost?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>

                    {/* Damage Notes (if any) */}
                    {returnDetails.damage_description && (
                        <div style={{ ...billStyles.section, borderColor: '#dc2626' }}>
                            <div style={{ ...billStyles.sectionTitle, color: '#dc2626' }}>Damage Notes</div>
                            <p style={{ fontSize: '13px', color: '#dc2626', margin: 0 }}>
                                {returnDetails.damage_description}
                            </p>
                        </div>
                    )}

                    {/* Return Notes (if any) */}
                    {returnDetails.return_notes && (
                        <div style={billStyles.section}>
                            <div style={billStyles.sectionTitle}>Return Notes</div>
                            <p style={{ fontSize: '13px', color: '#333', margin: 0 }}>
                                {returnDetails.return_notes}
                            </p>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={billStyles.footer}>
                        <p style={billStyles.footerText}>
                            Thank you for choosing YatraMate! We hope you had a great journey.
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
                            backgroundColor: '#16a34a',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '15px',
                        }}
                        data-testid="download-final-bill-pdf-btn"
                    >
                        Download Bill PDF
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            backgroundColor: '#fff',
                            color: '#16a34a',
                            border: '2px solid #16a34a',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '15px',
                        }}
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
