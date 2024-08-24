import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

function PrivacyPolicy() {
    return (
        <div className="legal-page privacy-policy">
            <h1>Privacy Policy</h1>
            <p className="last-updated">Last updated: 08/24/2024</p>
            <p>This Privacy Policy describes how GranTurisbro ("we", "us", or "our") collects, uses, and discloses your personal information when you use our website and services.</p>
            
            <h2>Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include:</p>
            <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>PlayStation Network ID (if provided)</li>
                <li>Information about the cars you own in Gran Turismo 7</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Communicate with you about our services</li>
                <li>Personalize your experience</li>
                <li>Analyze how you use our services</li>
            </ul>

            <h2>Information Sharing and Disclosure</h2>
            <p>We do not share your personal information with third parties except as described in this policy.</p>

            <h2>Data Security</h2>
            <p>We implement reasonable security measures to protect your personal information.</p>

            <h2>Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information.</p>

            <h2>Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at help@granturisbro.com.</p>

            <Link to="/" className="return-home">Return to Home</Link>
        </div>
    );
}

export default PrivacyPolicy;