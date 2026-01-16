import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useUser();
    const { getToken } = useClerkAuth();

    const [user, setUser] = useState(null);
    const [userCars, setUserCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const clearError = useCallback(() => setError(null), []);

    const fetchUserCars = useCallback(async (token) => {
        try {
            const authToken = token || await getToken();
            const response = await fetch(`${API_BASE_URL}/api/user/cars`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            if (response.ok) {
                const cars = await response.json();
                setUserCars(cars);
            } else {
                setError('Failed to load your car collection');
            }
        } catch (err) {
            console.error('Error fetching user cars:', err);
            setError('Failed to load your car collection');
        }
    }, [getToken]);

    // Sync Clerk user with backend and get app-specific data
    const syncUserWithBackend = useCallback(async () => {
        if (!isSignedIn || !clerkUser) {
            setUser(null);
            setUserCars([]);
            setLoading(false);
            return;
        }

        try {
            const token = await getToken();

            // Sync user to backend (creates/updates user in D1)
            const syncResponse = await fetch(`${API_BASE_URL}/api/auth/sync`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (syncResponse.ok) {
                const userData = await syncResponse.json();
                setUser({
                    id: userData.id,
                    email: clerkUser.primaryEmailAddress?.emailAddress,
                    name: clerkUser.fullName || clerkUser.firstName,
                    google_picture: clerkUser.imageUrl,
                    role: userData.role,
                });
                await fetchUserCars(token);
            } else {
                setError('Failed to sync your account');
            }
        } catch (err) {
            console.error('Error syncing user with backend:', err);
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    }, [isSignedIn, clerkUser, getToken, fetchUserCars]);

    useEffect(() => {
        if (clerkLoaded) {
            syncUserWithBackend();
        }
    }, [clerkLoaded, isSignedIn, syncUserWithBackend]);

    const addCarToCollection = async (carId) => {
        setError(null);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/user/cars`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ carId }),
            });

            if (response.ok) {
                await fetchUserCars(token);
            } else {
                const msg = 'Failed to add car to collection';
                setError(msg);
                throw new Error(msg);
            }
        } catch (err) {
            console.error('Error adding car to collection:', err);
            if (!error) setError('Failed to add car to collection');
            throw err;
        }
    };

    const removeCarFromCollection = async (carId) => {
        setError(null);
        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/user/cars/${carId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                await fetchUserCars(token);
            } else {
                const msg = 'Failed to remove car from collection';
                setError(msg);
                throw new Error(msg);
            }
        } catch (err) {
            console.error('Error removing car from collection:', err);
            if (!error) setError('Failed to remove car from collection');
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            userCars,
            loading: !clerkLoaded || loading,
            error,
            clearError,
            fetchUserCars,
            addCarToCollection,
            removeCarFromCollection,
            isSignedIn,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
