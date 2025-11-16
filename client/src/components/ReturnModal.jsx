import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

const ReturnModal = ({ booking, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        staff_id: JSON.parse(localStorage.getItem('user'))?.id || '',
        actual_return_date: new Date().toISOString().split('T')[0],
        actual_return_time: new Date().toTimeString().slice(0, 5),
        odometer_reading_end: '',
        vehicle_plate_number: booking.vehicle_id.registration_number,
        engine_number: booking.vehicle_id.engine_number || '',
        chassis_number: booking.vehicle_id.chassis_number || '',
        vehicle_condition: 'perfect',
        damage_cost: 0,
        damage_description: '',
        return_notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [costBreakdown, setCostBreakdown] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Calculate cost preview when odometer reading, return date, or return time changes
        if (name === 'odometer_reading_end' && value && booking.pickup_details) {
            calculateCostPreview(value);
        } else if ((name === 'actual_return_date' || name === 'actual_return_time') && formData.odometer_reading_end) {
            // Recalculate with updated date/time
            const updatedFormData = { ...formData, [name]: value };
            calculateCostPreviewWithFormData(formData.odometer_reading_end, updatedFormData);
        } else if (name === 'damage_cost' && formData.odometer_reading_end) {
            // Recalculate when damage cost changes
            const updatedFormData = { ...formData, [name]: value };
            calculateCostPreviewWithFormData(formData.odometer_reading_end, updatedFormData);
        }
    };

    const calculateCostPreviewWithFormData = (odometerEndParam, currentFormData) => {
        const odometerEnd = Number(odometerEndParam);
        const odometerStart = Number(booking.pickup_details.odometer_reading_start);
        if (Number.isNaN(odometerEnd) || Number.isNaN(odometerStart)) {
            console.error('Invalid odometer values', { odometerEndParam, start: booking.pickup_details.odometer_reading_start });
            return;
        }
        const distanceTraveled = odometerEnd - odometerStart;
        if (distanceTraveled < 0) {
            console.error('End odometer less than start', { odometerEnd, odometerStart });
            return;
        }

        const rawPickupDateISO = booking.pickup_details.actual_pickup_date || booking.requested_pickup_date;
        const rawPickupTime = booking.pickup_details.actual_pickup_time || booking.requested_pickup_time || '';

        const pickupDateObj = new Date(rawPickupDateISO);
        if (isNaN(pickupDateObj.getTime())) {
            console.error('Invalid pickup date ISO', rawPickupDateISO);
            return;
        }

        const parseTimeString = (t) => {
            if (!t || typeof t !== 'string') return null;
            const s = t.trim().toUpperCase();
            // If contains AM/PM
            const ampmMatch = s.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
            if (ampmMatch) {
                let h = parseInt(ampmMatch[1], 10);
                const m = parseInt(ampmMatch[2], 10);
                const mod = ampmMatch[3];
                if (mod === 'PM' && h !== 12) h += 12;
                if (mod === 'AM' && h === 12) h = 0;
                return { hours: h, minutes: m };
            }
            const hhmm = s.match(/(\d{1,2}):(\d{2})(?::\d{2})?/);
            if (hhmm) return { hours: parseInt(hhmm[1], 10), minutes: parseInt(hhmm[2], 10) };
            return null;
        };

        const pickupTimeParts = parseTimeString(rawPickupTime);
        if (pickupTimeParts) {
            pickupDateObj.setHours(pickupTimeParts.hours, pickupTimeParts.minutes, 0, 0);
        } else {
            console.warn('Could not parse pickup time; using time present in pickup ISO', rawPickupTime);
        }

        const returnDateStr = currentFormData.actual_return_date;
        const returnTimeStr = currentFormData.actual_return_time;

        let returnDateObj;
        if (returnDateStr && returnTimeStr) {
            returnDateObj = new Date(`${returnDateStr}T${returnTimeStr}:00`);
        } else if (returnDateStr) {
            returnDateObj = new Date(returnDateStr);
        } else {
            returnDateObj = new Date();    // fallback to now
        }
        if (isNaN(returnDateObj.getTime())) {
            console.error('Invalid return date/time', { returnDateStr, returnTimeStr });
            return;
        }

        const msDiff = returnDateObj.getTime() - pickupDateObj.getTime();
        if (msDiff < 0) {
            console.warn('Return time is before pickup time; duration negative', { msDiff });
        }
        const durationHours = Math.ceil(msDiff / (1000 * 60 * 60));

        const pricePerKm = parseFloat(booking.package_id.price_per_km) || 0;
        const pricePerHour = parseFloat(booking.package_id.price_per_hour) || 0;
        const costPerDistance = distanceTraveled * pricePerKm;
        const costPerTime = durationHours * pricePerHour;
        const maxCost = Math.max(costPerDistance, costPerTime);
        const damageCost = parseFloat(currentFormData.damage_cost || 0) || 0;
        const totalCost = maxCost + damageCost;

        setCostBreakdown({
            distanceTraveled,
            durationHours,
            costPerDistance,
            costPerTime,
            maxCost,
            damageCost,
            totalCost
        });
    };

    const calculateCostPreview = (odometerEndParam) => {
        calculateCostPreviewWithFormData(odometerEndParam, formData);
    };


    const validateForm = () => {
        const newErrors = {};

        if (!formData.odometer_reading_end) {
            newErrors.odometer_reading_end = 'Odometer reading is required';
        } else if (isNaN(formData.odometer_reading_end) || formData.odometer_reading_end < booking.pickup_details.odometer_reading_start) {
            newErrors.odometer_reading_end = 'End reading must be greater than start reading';
        }

        if (!formData.vehicle_plate_number) {
            newErrors.vehicle_plate_number = 'Vehicle plate number is required';
        }

        if (!formData.engine_number) {
            newErrors.engine_number = 'Engine number is required';
        }

        if (!formData.chassis_number) {
            newErrors.chassis_number = 'Chassis number is required';
        }

        if (formData.vehicle_condition === 'damaged' && !formData.damage_description) {
            newErrors.damage_description = 'Damage description is required';
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

            const response = await fetch(API_ENDPOINTS.confirmReturn(booking._id), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert(`Vehicle return confirmed! Final cost: ₹${data.data.booking.final_cost.toFixed(2)}`);
                onSuccess();
            } else {
                alert(data.message || 'Failed to confirm return');
            }
        } catch (error) {
            console.error('Error confirming return:', error);
            alert('Failed to confirm return. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Confirm Vehicle Return</h2>
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
                    {/* Booking & Pickup Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Booking Information</h3>
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
                                <span className="text-gray-500">Pickup Odometer:</span>
                                <span className="ml-2 font-medium">{booking.pickup_details.odometer_reading_start} km</span>
                            </div>
                            <div>
                                <span className="text-gray-500">ID Proof:</span>
                                <span className="ml-2 font-medium">{booking.pickup_details.id_proof_type}</span>
                            </div>
                        </div>
                    </div>

                    {/* Return Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Return Date
                            </label>
                            <input
                                type="date"
                                name="actual_return_date"
                                value={formData.actual_return_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Return Time
                            </label>
                            <input
                                type="time"
                                name="actual_return_time"
                                value={formData.actual_return_time}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    {/* Odometer Reading */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Odometer Reading (End) *
                        </label>
                        <input
                            type="number"
                            name="odometer_reading_end"
                            value={formData.odometer_reading_end}
                            onChange={handleChange}
                            placeholder="Enter current odometer reading in km"
                            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.odometer_reading_end ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                                }`}
                        />
                        {errors.odometer_reading_end && (
                            <p className="mt-1 text-sm text-red-600">{errors.odometer_reading_end}</p>
                        )}
                    </div>

                    {/* Vehicle Verification */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Vehicle Verification</h3>

                        <div className="grid grid-cols-1 gap-4">
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

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Engine Number *
                                </label>
                                <input
                                    type="text"
                                    name="engine_number"
                                    value={formData.engine_number}
                                    onChange={handleChange}
                                    placeholder="Enter engine number"
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.engine_number ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                                        }`}
                                />
                                {errors.engine_number && (
                                    <p className="mt-1 text-sm text-red-600">{errors.engine_number}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Chassis Number *
                                </label>
                                <input
                                    type="text"
                                    name="chassis_number"
                                    value={formData.chassis_number}
                                    onChange={handleChange}
                                    placeholder="Enter chassis number"
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.chassis_number ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                                        }`}
                                />
                                {errors.chassis_number && (
                                    <p className="mt-1 text-sm text-red-600">{errors.chassis_number}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Condition */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Vehicle Condition *
                        </label>
                        <select
                            name="vehicle_condition"
                            value={formData.vehicle_condition}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="perfect">Perfect - No Damage</option>
                            <option value="damaged">Damaged</option>
                        </select>
                    </div>

                    {/* Damage Details (conditional) */}
                    {formData.vehicle_condition === 'damaged' && (
                        <div className="space-y-4 bg-red-50 p-4 rounded-lg">
                            <div>
                                <label className="block text-sm font-semibold text-red-700 mb-2">
                                    Damage Cost (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="damage_cost"
                                    value={formData.damage_cost}
                                    onChange={handleChange}
                                    placeholder="Enter damage cost"
                                    className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-red-700 mb-2">
                                    Damage Description *
                                </label>
                                <textarea
                                    name="damage_description"
                                    value={formData.damage_description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Describe the damage in detail..."
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.damage_description ? 'border-red-500' : 'border-red-300 focus:border-red-500'
                                        }`}
                                />
                                {errors.damage_description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.damage_description}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Return Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Return Notes (Optional)
                        </label>
                        <textarea
                            name="return_notes"
                            value={formData.return_notes}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Any additional notes about the return..."
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    {/* Cost Breakdown */}
                    {costBreakdown && (
                        <div className="bg-green-50 rounded-lg p-4">
                            <h3 className="font-semibold text-green-900 mb-3">Cost Breakdown</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-green-700">Distance Traveled:</span>
                                    <span className="font-medium">{costBreakdown.distanceTraveled} km</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">Duration:</span>
                                    <span className="font-medium">{costBreakdown.durationHours} hours</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">Cost (Distance-based):</span>
                                    <span className="font-medium">₹{costBreakdown.costPerDistance.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">Cost (Time-based):</span>
                                    <span className="font-medium">₹{costBreakdown.costPerTime.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">Max Cost (Charged):</span>
                                    <span className="font-medium">₹{costBreakdown.maxCost.toFixed(2)}</span>
                                </div>
                                {costBreakdown.damageCost > 0 && (
                                    <div className="flex justify-between text-red-600">
                                        <span>Damage Cost:</span>
                                        <span className="font-medium">₹{costBreakdown.damageCost.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold text-green-900 pt-2 border-t-2 border-green-200">
                                    <span>Total Amount:</span>
                                    <span>₹{costBreakdown.totalCost.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

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
                            disabled={loading || !costBreakdown}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Confirming...' : 'Confirm Return & Calculate Cost'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReturnModal;
