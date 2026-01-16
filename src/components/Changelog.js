import React, { useState } from 'react';
import './Changelog.css';


const changelogData = [
    {
        date: '2024-09-28',
        changes: [
            'Beta users can add and remove cars from their collection and filter by collection status',
            'Beta users can now log in and out with Google',]
    },
    {
        date: '2024-08-27',
        changes: [
            'Added dark mode support',
            'Improved reward indicators on car list (gold/bronze medals)',
            'Added changelog to keep users informed about updates'
        ]
    },
    {
        date: '2024-08-24',
        changes: [
            'Added sorting by reward type and reward details (Menu, Mission, License, etc.)',
            'Added high resolution images on car details pages.',
        ]
    },
    {
        date: '2024-08-22',
        changes: [
            'Filtered lists are now preserved when navigating back to the car list and sharing links.',
        ]
    },
    {
        date: '2024-08-15',
        changes: [
            'Initial release of GT7 Car List app',
            'Added car filtering and sorting functionality',
        ]
    }
    // Add more changelog entries as needed
];


function Changelog() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="changelog">
            <button onClick={() => setIsOpen(!isOpen)} className="changelog-toggle">
                {isOpen ? 'Hide Changelog' : 'Show Changelog'}
            </button>
            {isOpen && (
                <div className="changelog-content">
                    <h2>Recent Updates</h2>
                    {changelogData.map((entry) => (
                        <div key={entry.date} className="changelog-entry">
                            <h3>{entry.date}</h3>
                            <ul>
                                {entry.changes.map((change) => (
                                    <li key={`${entry.date}-${change.slice(0, 20)}`}>{change}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Changelog;