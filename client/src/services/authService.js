import { API_ENDPOINTS } from '../config/api';

class AuthService {
    // Register new customer
    async register(userData) {
        try {
            const response = await fetch(API_ENDPOINTS.register, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { 
                    success: true, 
                    data: data.data, 
                    message: data.message,
                    requiresVerification: data.data?.requiresVerification 
                };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Verify OTP
    async verifyOtp(email, otp) {
        try {
            const response = await fetch(API_ENDPOINTS.verifyOtp, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { success: true, data: data.data };
            } else {
                return { success: false, message: data.message || 'OTP verification failed' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Resend OTP
    async resendOtp(email) {
        try {
            const response = await fetch(API_ENDPOINTS.resendOtp, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Failed to resend OTP' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Register new vendor
    async registerVendor(vendorData) {
        try {
            const response = await fetch(API_ENDPOINTS.registerVendor, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(vendorData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Vendor registration failed' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Login user
    async login(credentials) {
        try {
            const response = await fetch(API_ENDPOINTS.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { success: true, data: data.data };
            } else {
                return { 
                    success: false, 
                    message: data.message || 'Login failed',
                    requiresVerification: data.requiresVerification,
                    email: data.email
                };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Logout user
    async logout() {
        try {
            const response = await fetch(API_ENDPOINTS.logout, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Logout failed' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Get current user from API
    async getCurrentUser() {
        try {
            const response = await fetch(API_ENDPOINTS.currentUser, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { success: true, data: data.data.user };
            } else {
                return { success: false, message: data.message || 'Failed to fetch user' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Update password
    async updatePassword(passwordData) {
        try {
            const response = await fetch(API_ENDPOINTS.updatePassword, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(passwordData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { success: true, message: 'Password updated successfully' };
            } else {
                return { success: false, message: data.message || 'Password update failed' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Update profile
    async updateProfile(profileData) {
        try {
            const response = await fetch(API_ENDPOINTS.updateProfile, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { success: true, data: data.data.user };
            } else {
                return { success: false, message: data.message || 'Profile update failed' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Forgot Password - Request reset link
    async forgotPassword(email) {
        try {
            const response = await fetch(API_ENDPOINTS.forgotPassword, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Failed to send reset link' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Reset Password - Set new password with token
    async resetPassword(token, password) {
        try {
            const response = await fetch(API_ENDPOINTS.resetPassword, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ token, password })
            });

            const data = await response.json();

            if (data.status === 'success') {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Failed to reset password' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

export default new AuthService();
