import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

function Header() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user, loading, login, logout, checkAuthStatus } = useAuth();

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    return (
        <header className="app-header">
            <Link to="/" className="home-link">GT7 Car List</Link>
            <div className="header-right">
                <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                {!loading && (
                    user ? (
                        <div className="user-info">
                            {user.google_picture && (
                                <img src={user.google_picture} alt={user.name} className="user-avatar" />
                            )}
                            <span className="user-name">{user.name}</span>
                            <button onClick={logout} className="logout-button">Log Out</button>
                        </div>
                    ) : (
                        <button onClick={login} className="login-button">Login with Google</button>
                    )
                )}
                <a 
                    href="https://x.com/joelatwar" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="twitter-link"
                    title="Follow for updates and to submit corrections"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                </a>
            </div>
        </header>
    );
}

export default Header;