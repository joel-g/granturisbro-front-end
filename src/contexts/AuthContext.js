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
            }
        } catch (error) {
            console.error('Error syncing user with backend:', error);
        } finally {
            setLoading(false);
        }
    }, [isSignedIn, clerkUser, getToken]);

    useEffect(() => {
        if (clerkLoaded) {
            syncUserWithBackend();
        }
    }, [clerkLoaded, isSignedIn, syncUserWithBackend]);

    const fetchUserCars = async (token) => {
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
            }
        } catch (error) {
            console.error('Error fetching user cars:', error);
        }
    };

    const addCarToCollection = async (carId) => {
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
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/api/user/cars/${carId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
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
            loading: !clerkLoaded || loading,
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
