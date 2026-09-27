import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // When the app starts, check if a user is already saved in localStorage
    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('devflow_token');
            const savedUser = localStorage.getItem('devflow_user');

            if (token && savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                    // Verify with backend
                    const res = await API.get('/auth/me');
                    if (res.data.success) {
                        setUser(res.data.data);
                        localStorage.setItem('devflow_user', JSON.stringify(res.data.data));
                    }
                } catch (error) {
                    console.error('Session expired:', error.message);
                    logout();
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    // Register Function
    const register = async (name, email, password, role) => {
        const res = await API.post('/auth/register', { name, email, password, role });
        if (res.data.success) {
            const { token, ...userData } = res.data.data;
            localStorage.setItem('devflow_token', token);
            localStorage.setItem('devflow_user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        }
    };

    // Login Function
    const login = async (email, password) => {
        const res = await API.post('/auth/login', { email, password });
        if (res.data.success) {
            const { token, ...userData } = res.data.data;
            localStorage.setItem('devflow_token', token);
            localStorage.setItem('devflow_user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        }
    };

    // Logout Function
    const logout = () => {
        localStorage.removeItem('devflow_token');
        localStorage.removeItem('devflow_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook for easy access to AuthContext
export const useAuth = () => useContext(AuthContext);
