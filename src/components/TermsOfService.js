import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

function TermsOfService() {
    return (
        <div className="legal-page terms-of-service">
            <h1>Terms of Service</h1>
            <p className="last-updated">Last updated: 08/24/2024</p>
            <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using GranTurisbro website and services.</p>
            
            <h2>1. Agreement to Terms</h2>
            <p>By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>

            <h2>2. Use of Our Service</h2>
            <p>You agree to use our service only for lawful purposes and in accordance with these Terms.</p>

            <h2>3. Accounts</h2>
            <p>When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account.</p>

            <h2>4. Links To Other Web Sites</h2>
            <p>Our service may contain links to third-party web sites or services that are not owned or controlled by Gran Turisbro.</p>

            <h2>5. Termination</h2>
            <p>We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.</p>

            <h2>6. Limitation of Liability</h2>
            <p>In no event shall JG Softworks be liable for any indirect, incidental, special, consequential or punitive damages.</p>

            <h2>7. Changes</h2>
            <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes.</p>

            <h2>8. Disclaimer of Affiliation</h2>
            <p>GranTurisbro is an independent application developed by Joel Guerra. Gran Turisbro is not affiliated with, endorsed by, or in any way officially connected with Sony Interactive Entertainment Inc., Polyphony Digital Inc., or the Gran Turismo franchise.</p>
            <p>All product and company names are trademarks™ or registered® trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.</p>
            <p>Gran Turismo and all related titles, logos, and characters are trademarks of Sony Interactive Entertainment Inc. This application is for informational purposes only and is not endorsed by or affiliated with Sony Interactive Entertainment Inc. or Polyphony Digital Inc.</p>

            <h2>9. User-Generated Content</h2>
            <p>Any data or information provided by users regarding in-game content (such as car statistics, availability, or rewards) is based on user input and does not represent official information from Sony Interactive Entertainment Inc. or Polyphony Digital Inc.</p>

            <h2>10. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at help@granturisbro.com</p>

            <Link to="/" className="return-home">Return to Home</Link>
        </div>
    );
}

export default TermsOfService;