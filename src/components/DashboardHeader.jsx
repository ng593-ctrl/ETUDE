// src/components/DashboardHeader.jsx

import React from 'react';

function DashboardHeader({ spaceName, handleGoBack, handleLogout }) {
    // Define the style used by the LOGOUT button for consistency
    const buttonStyle = "px-3 py-1 text-sm font-bold tracking-wide rounded-md transition duration-300";
    
    // Style for the LOGOUT button (Red border/text)
    const logoutClasses = `${buttonStyle} text-red-500 border border-red-700/50 hover:text-red-400 hover:bg-red-900/20`;
    
    // Style for the BACK button (Neutral border/text, same size)
    const backClasses = `${buttonStyle} text-gray-400 border border-gray-700/50 hover:text-cyan-400 hover:border-cyan-500/50`;

    return (
        <header className="w-full bg-[#0a0a25] border-b border-gray-700/50 shadow-lg">
            <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-3 sm:px-6 sm:py-4">
                
                {/* Left Side: Back Button */}
                <div className="flex-shrink-0">
                    <button 
                        onClick={handleGoBack} 
                        className={backClasses}
                    >
                        ← BACK
                    </button>
                </div>

                {/* Center: Space Name/Title */}
                <div className="flex flex-col items-center justify-center flex-grow min-w-0 mx-4">
                    <span className="text-sm font-light uppercase tracking-wider text-white">
                        KEY NOTE
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-cyan-400 truncate max-w-full">
                        {spaceName}
                    </h1>
                </div>

                {/* Right Side: Logout Button */}
                <div className="flex-shrink-0">
                    <button 
                        onClick={handleLogout}
                        className={logoutClasses}
                    >
                        LOGOUT
                    </button>
                </div>
            </div>
        </header>
    );
}

export default DashboardHeader;