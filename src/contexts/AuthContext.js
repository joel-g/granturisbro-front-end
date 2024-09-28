import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userCars, setUserCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    const checkAuthStatus = useCallback(async () => {
        if (authChecked) return;
        
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    setUser(data.user);
                    await fetchUserCars();
                } else {
                    localStorage.removeItem('auth_token');
                    setUser(null);
                    setUserCars([]);
                }
            } else {
                localStorage.removeItem('auth_token');
                setUser(null);
                setUserCars([]);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            localStorage.removeItem('auth_token');
            setUser(null);
            setUserCars([]);
        } finally {
            setLoading(false);
            setAuthChecked(true);
        }
    }, [authChecked]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const authError = params.get('auth_error');

        if (token) {
            localStorage.setItem('auth_token', token);
            window.history.replaceState({}, document.title, window.location.pathname);
            checkAuthStatus();
        } else if (authError) {
            console.error('Authentication error:', authError);
            window.history.replaceState({}, document.title, window.location.pathname);
            setAuthChecked(true);
            setLoading(false);
        } else {
            checkAuthStatus();
        }
    }, [checkAuthStatus]);

    const fetchUserCars = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/cars`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            if (response.ok) {
                const cars = await response.json();
                setUserCars(cars);
            }
        } catch (error) {
            console.error('Error fetching user cars:', error);
        }
    };

    const login = () => {
        window.location.href = `${API_BASE_URL}/api/auth/google/login`;
    };

    const logout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            if (response.ok) {
                setUser(null);
                setUserCars([]);
                localStorage.removeItem('auth_token');
                setAuthChecked(false);
            } else {
                console.error('Logout failed:', await response.text());
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const addCarToCollection = async (carId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/cars`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({ carId }),
                credentials: 'include'
            });

            if (response.ok) {
                await fetchUserCars();
            } else {
                throw new Error('Failed to add car to collection');
            }
        } catch (error) {
            console.error('Error adding car to collection:', error);
            throw error;
        }
    };

    const removeCarFromCollection = async (carId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/cars/${carId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                credentials: 'include'
            });

            if (response.ok) {
                await fetchUserCars();
            } else {
                throw new Error('Failed to remove car from collection');
            }
        } catch (error) {
            console.error('Error removing car from collection:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            userCars,
            loading,
            login,
            logout,
            checkAuthStatus,
            fetchUserCars,
            addCarToCollection,
            removeCarFromCollection
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);