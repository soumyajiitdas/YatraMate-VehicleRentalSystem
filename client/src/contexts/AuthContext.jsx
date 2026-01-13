import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const result = await authService.getCurrentUser();
            if (result.success) {
                setUser(result.data);
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const register = async (userData) => {
        const result = await authService.register(userData);
        return result;
    };

    const verifyOtp = async (email, otp) => {
        const result = await authService.verifyOtp(email, otp);
        if (result.success) {
            setUser(result.data.user);
        }
        return result;
    };

    const resendOtp = async (email) => {
        const result = await authService.resendOtp(email);
        return result;
    };

    const registerVendor = async (vendorData) => {
        const result = await authService.registerVendor(vendorData);
        return result;
    };

    const login = async (credentials) => {
        const result = await authService.login(credentials);
        if (result.success) {
            setUser(result.data.user);
        }
        return result;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const updatePassword = async (passwordData) => {
        const result = await authService.updatePassword(passwordData);
        return result;
    };

    const updateProfile = async (profileData) => {
        const result = await authService.updateProfile(profileData);
        if (result.success) {
            setUser(result.data);
        }
        return result;
    };

    const refreshUser = async () => {
        const result = await authService.getCurrentUser();
        if (result.success) {
            setUser(result.data);
        }
        return result;
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        register,
        verifyOtp,
        resendOtp,
        registerVendor,
        login,
        logout,
        updatePassword,
        updateProfile,
        refreshUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
