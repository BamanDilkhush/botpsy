import React, { createContext, useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            toast.success('Logged in successfully!');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed.';
            toast.error(message);
            throw new Error(message);
        }
    };

    // --- THIS FUNCTION IS NOW CORRECTED ---
    const register = async (name, email, password) => {
        try {
            // The backend now only sends back a message
            const { data } = await api.post('/auth/register', { name, email, password });
            
            // We REMOVE the lines that automatically log the user in
            // localStorage.setItem('user', JSON.stringify(data));

            // Return the success message to be used in the Register.jsx component
            return data.message;
            
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed.';
            toast.error(message);
            throw new Error(message);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out.');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
