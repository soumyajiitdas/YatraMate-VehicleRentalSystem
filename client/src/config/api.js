const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const API_ENDPOINTS = {
    // Auth endpoints
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    registerVendor: `${API_BASE_URL}/auth/register-vendor`,
    currentUser: `${API_BASE_URL}/auth/me`,
    updatePassword: `${API_BASE_URL}/auth/update-password`,
    updateProfile: `${API_BASE_URL}/auth/update-profile`,

    // User endpoints
    users: `${API_BASE_URL}/users`,

    // Vehicle endpoints
    vehicles: `${API_BASE_URL}/vehicles`,
    vehiclesGrouped: `${API_BASE_URL}/vehicles/grouped`,
    vehiclesFeatured: `${API_BASE_URL}/vehicles/featured`,
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
    uploadFiles: `${API_BASE_URL}/upload/files`,

    // Vehicle Request endpoints
    vehicleRequests: `${API_BASE_URL}/vehicle-requests`,
    vehicleRequestById: (id) => `${API_BASE_URL}/vehicle-requests/${id}`,
    approveVehicleRequest: (id) => `${API_BASE_URL}/vehicle-requests/${id}/approve`,
    rejectVehicleRequest: (id) => `${API_BASE_URL}/vehicle-requests/${id}/reject`,
    vehicleRequestsByVendor: (vendorId) => `${API_BASE_URL}/vehicle-requests/vendor/${vendorId}`,
    verifyVendor: (id) => `${API_BASE_URL}/vendors/${id}/verify`,
};

export default API_BASE_URL;
