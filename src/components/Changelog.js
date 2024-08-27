import React, { useState } from 'react';
import './Changelog.css';


const changelogData = [
    {
        date: '2024-08-27',
        changes: [
            'Added dark mode support',
            'Improved reward indicators on car list (gold/bronze medals)',
            'Fixed background color issues in dark mode',
            'Added changelog to keep users informed about updates'
        ]
    },
    {
        date: '2024-08-19',
        changes: [
            'Initial release of GT7 Car List app',
            'Added car filtering and sorting functionality',
            'Implemented responsive design for mobile devices'
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
                    {changelogData.map((entry, index) => (
                        <div key={index} className="changelog-entry">
                            <h3>{entry.date}</h3>
                            <ul>
                                {entry.changes.map((change, changeIndex) => (
                                    <li key={changeIndex}>{change}</li>
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