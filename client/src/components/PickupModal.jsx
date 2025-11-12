import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

const PickupModal = ({ booking, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        staff_id: JSON.parse(localStorage.getItem('user'))?.id || '',
        actual_pickup_date: new Date(booking.requested_pickup_date).toISOString().split('T')[0],
        actual_pickup_time: booking.requested_pickup_time,
        odometer_reading_start: '',
        vehicle_plate_number: booking.vehicle_id.registration_number,
        id_proof_type: 'aadhar_card',
        pickup_notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.odometer_reading_start) {
            newErrors.odometer_reading_start = 'Odometer reading is required';
        } else if (isNaN(formData.odometer_reading_start) || formData.odometer_reading_start < 0) {
            newErrors.odometer_reading_start = 'Please enter a valid odometer reading';
        }

        if (!formData.vehicle_plate_number) {
            newErrors.vehicle_plate_number = 'Vehicle plate number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const payload = {
                ...formData,
                staff_id: user._id || user.id
            };

            const response = await fetch(API_ENDPOINTS.confirmPickup(booking._id), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert('Vehicle pickup confirmed successfully!');
                onSuccess();
            } else {
                alert(data.message || 'Failed to confirm pickup');
            }
        } catch (error) {
            console.error('Error confirming pickup:', error);
            alert('Failed to confirm pickup. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Confirm Vehicle Pickup</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Booking Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Booking Details</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-500">Customer:</span>
                                <span className="ml-2 font-medium">{booking.user_id.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Vehicle:</span>
                                <span className="ml-2 font-medium">{booking.vehicle_id.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Package:</span>
                                <span className="ml-2 font-medium">{booking.package_id?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Rates:</span>
                                <span className="ml-2 font-medium">
                                    ₹{booking.package_id?.price_per_hour}/hr | ₹{booking.package_id?.price_per_km}/km
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pickup Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Pickup Date
                            </label>
                            <input
                                type="date"
                                name="actual_pickup_date"
                                value={formData.actual_pickup_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Pickup Time
                            </label>
                            <input
                                type="time"
                                name="actual_pickup_time"
                                value={formData.actual_pickup_time}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    {/* Odometer Reading */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Odometer Reading (Start) *
                        </label>
                        <input
                            type="number"
                            name="odometer_reading_start"
                            value={formData.odometer_reading_start}
                            onChange={handleChange}
                            placeholder="Enter current odometer reading in km"
                            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.odometer_reading_start ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                                }`}
                        />
                        {errors.odometer_reading_start && (
                            <p className="mt-1 text-sm text-red-600">{errors.odometer_reading_start}</p>
                        )}
                    </div>

                    {/* Vehicle Plate Number */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Vehicle Plate Number *
                        </label>
                        <input
                            type="text"
                            name="vehicle_plate_number"
                            value={formData.vehicle_plate_number}
                            onChange={handleChange}
                            placeholder="Enter vehicle plate number"
                            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.vehicle_plate_number ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                                }`}
                        />
                        {errors.vehicle_plate_number && (
                            <p className="mt-1 text-sm text-red-600">{errors.vehicle_plate_number}</p>
                        )}
                    </div>

                    {/* ID Proof Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Government ID Proof Type *
                        </label>
                        <select
                            name="id_proof_type"
                            value={formData.id_proof_type}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="aadhar_card">Aadhar Card</option>
                            <option value="pan_card">PAN Card</option>
                            <option value="voter_card">Voter Card</option>
                            <option value="driving_license">Driving License</option>
                            <option value="passport">Passport</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Pickup Notes (Optional)
                        </label>
                        <textarea
                            name="pickup_notes"
                            value={formData.pickup_notes}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Any additional notes about the pickup..."
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Confirming...' : 'Confirm Pickup'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PickupModal;
