const API_BASE_URL = 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
    // User endpoints
    users: `${API_BASE_URL}/users`,
    login: `${API_BASE_URL}/users/login`,
    register: `${API_BASE_URL}/users/register`,

    // Vehicle endpoints
    vehicles: `${API_BASE_URL}/vehicles`,
    vehicleById: (id) => `${API_BASE_URL}/vehicles/${id}`,
    vehiclesByVendor: (vendorId) => `${API_BASE_URL}/vehicles/vendor/${vendorId}`,

    // Booking endpoints
    bookings: `${API_BASE_URL}/bookings`,
    bookingById: (id) => `${API_BASE_URL}/bookings/${id}`,
    bookingRequest: `${API_BASE_URL}/bookings/request`,
    userBookings: (userId) => `${API_BASE_URL}/bookings/user/${userId}`,
    officeStaffRequests: `${API_BASE_URL}/bookings/office-staff/requests`,
    confirmPickup: (bookingId) => `${API_BASE_URL}/bookings/${bookingId}/pickup`,
    confirmReturn: (bookingId) => `${API_BASE_URL}/bookings/${bookingId}/return`,

    // Package endpoints
    packages: `${API_BASE_URL}/packages`,
    packageById: (id) => `${API_BASE_URL}/packages/${id}`,
    packageForVehicle: `${API_BASE_URL}/packages/for-vehicle`,

    // Vendor endpoints
    vendors: `${API_BASE_URL}/vendors`,
    vendorById: (id) => `${API_BASE_URL}/vendors/${id}`,
    vendorByEmail: (email) => `${API_BASE_URL}/vendors/email/${email}`,

    // Payment endpoints
    payments: `${API_BASE_URL}/payments`,
    paymentById: (id) => `${API_BASE_URL}/payments/${id}`,

    // Upload endpoints
    uploadAuth: `${API_BASE_URL}/upload/auth`,
    uploadFile: `${API_BASE_URL}/upload/file`,
};

export default API_BASE_URL;
