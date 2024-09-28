import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
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
                } else {
                    localStorage.removeItem('auth_token');
                    setUser(null);
                }
            } else {
                localStorage.removeItem('auth_token');
                setUser(null);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            localStorage.removeItem('auth_token');
            setUser(null);
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
            localStorage.removeItem('auth_token');
            setAuthChecked(false);
          } else {
            console.error('Logout failed:', await response.text());
          }
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);