// src/components/AppHeader.jsx - FIXED TO UNIFY BACK/LOGOUT BUTTON STYLES

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AppHeader({ title, subTitle, showBackButton = true }) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Define the uniform size/shape for all border-based buttons
    const baseButtonStyle = "px-3 py-1 text-sm font-bold tracking-wide rounded-md transition duration-300";

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login'); 
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };
    
    const handleGoBack = () => {
        navigate(-1); // Navigate one step back in history
    };

    return (
        <header className="w-full bg-[#0a0a25] border-b border-gray-700/50 shadow-lg">
            <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-3 sm:px-6 sm:py-4">
                
                {/* Left Side: Back Button (Matching Style) */}
                <div className="flex-shrink-0">
                    {showBackButton ? (
                        <button 
                            onClick={handleGoBack} 
                            // 🛑 MODIFIED: Match LOGOUT style/size, but use neutral gray colors
                            className={`${baseButtonStyle} text-gray-400 border border-gray-700/50 hover:text-cyan-400 hover:border-cyan-500/50`}
                        >
                            ← BACK
                        </button>
                    ) : (
                        // Placeholder to maintain spacing if no back button is shown
                        <div className="w-20" /> 
                    )}
                </div>

                {/* Center: Title/Subtitle */}
                <div className="flex flex-col items-center justify-center flex-grow min-w-0 mx-4">
                    <span className="text-sm font-light uppercase tracking-wider text-white">
                        {title}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-cyan-400 truncate max-w-full">
                        {subTitle}
                    </h1>
                </div>

                {/* Right Side: Logout Button */}
                <div className="flex-shrink-0">
                    <button 
                        onClick={handleLogout}
                        // 🛑 MODIFIED: Match BACK button size/shape, using red border/text
                        className={`${baseButtonStyle} text-red-500 border border-red-700/50 hover:text-red-400 hover:bg-red-900/20`}
                    >
                        LOGOUT
                    </button>
                </div>
            </div>
        </header>
    );
}

export default AppHeader;