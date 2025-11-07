const API_BASE_URL = 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
    // User endpoints
    users: `${API_BASE_URL}/users`,
    login: `${API_BASE_URL}/users/login`,
    register: `${API_BASE_URL}/users/register`,

    // Vehicle endpoints
    vehicles: `${API_BASE_URL}/vehicles`,
    vehicleById: (id) => `${API_BASE_URL}/vehicles/${id}`,

    // Booking endpoints
    bookings: `${API_BASE_URL}/bookings`,
    bookingById: (id) => `${API_BASE_URL}/bookings/${id}`,

    // Vendor endpoints
    vendors: `${API_BASE_URL}/vendors`,
    vendorById: (id) => `${API_BASE_URL}/vendors/${id}`,

    // Payment endpoints
    payments: `${API_BASE_URL}/payments`,
    paymentById: (id) => `${API_BASE_URL}/payments/${id}`,
};

export default API_BASE_URL;
