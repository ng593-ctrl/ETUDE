// study-sync/src/pages/SpaceEditor.jsx - FINAL VERSION WITH MINIMALIST MOBILE HEADER

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function SpaceEditor() {
    const { spaceId } = useParams();
    const navigate = useNavigate();
    
    // --- STATE MANAGEMENT ---
    const [noteTitle, setNoteTitle] = useState('Developing a Cloud-Based Web Application'); 
    const [noteContent, setNoteContent] = useState('**hihihihihih**');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    // --- HANDLERS ---
    const handleSaveNote = async () => {
        setIsSaving(true);
        setError('');
        try {
            console.log('Saving note:', { id: spaceId, title: noteTitle, content: noteContent });
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
            setError('Failed to save note.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteNote = async () => {
        if (!window.confirm("Are you sure you want to delete this note? This action is irreversible.")) return;
        
        console.log('Deleting note:', spaceId);
        await new Promise(resolve => setTimeout(resolve, 500)); 
        navigate('/', { replace: true }); 
    };
    
    const handleGoBack = () => {
        navigate('/', { replace: true }); 
    };

    // Use smallest font size for actions
    const baseActionButtonClasses = "text-xs font-semibold tracking-wide transition duration-300";
    const deleteClasses = `${baseActionButtonClasses} text-red-500 hover:text-red-400`;
    const saveClasses = `${baseActionButtonClasses} text-cyan-400 hover:text-cyan-300 disabled:opacity-50`;
    const backClasses = `${baseActionButtonClasses} text-gray-400 hover:text-cyan-400`;


    return (
        <div className="min-h-screen text-white font-sans bg-[#0a0a25] [background-image:radial-gradient(ellipse_at_center,_#1f1a33_0%,_#0a0a25_70%)]">
            
            <header className="w-full bg-[#0a0a25] border-b border-gray-700/50 shadow-lg">
                {/* px-2 on mobile (0.5rem padding) */}
                <div className="flex justify-between items-center max-w-7xl mx-auto px-2 py-3 sm:px-6 sm:py-4">

                    {/* 1. LEFT: Back and Preview */}
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handleGoBack} 
                            className={`${backClasses} text-sm`} 
                            title="Go back to the Space Detail page"
                        >
                            {/* 🛑 MOBILE: Only show arrow ← on small screens, show "← BACK" on larger screens */}
                            <span className="sm:hidden">←</span>
                            <span className="hidden sm:inline">← BACK</span>
                        </button>
                        {/* PREVIEW/HELP text removed from header entirely on mobile */}
                        <span className="hidden sm:inline text-gray-400 text-xs font-light tracking-wider">
                            ⊙ PREVIEW
                        </span>
                    </div>

                    {/* 2. CENTER: Title/Key Note - HIDDEN ON MOBILE */}
                    <div className="hidden sm:flex flex-col items-center justify-center min-w-0 flex-grow">
                        <span className="text-xs font-light uppercase tracking-wider text-white/80">
                            KEY NOTE
                        </span>
                        <input
                            type="text"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            className="w-full text-center text-xl sm:text-4xl font-bold text-cyan-400 bg-transparent focus:outline-none transition duration-200 truncate"
                            style={{ maxWidth: '100%' }}
                        />
                    </div>
                    
                    {/* 3. RIGHT: Save Note and Delete (Buttons simplified for mobile) */}
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handleSaveNote}
                            disabled={isSaving}
                            className={saveClasses}
                        >
                            {/* 🛑 MOBILE: Use SAVE or 💾 on small screens, SAVE NOTE on large screens */}
                            <span className="sm:hidden">💾 SAVE</span>
                            <span className="hidden sm:inline">SAVE NOTE</span>
                        </button>
                        <button 
                            onClick={handleDeleteNote}
                            className={deleteClasses}
                        >
                            {/* 🛑 MOBILE: Use 🗑️ or DELETE on small screens, DELETE on large screens */}
                            <span className="sm:hidden">🗑️</span>
                            <span className="hidden sm:inline">DELETE</span>
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-2 sm:px-12 py-4 sm:py-8">
                
                {/* Title Input Visible Here (and editable) on Mobile/Desktop */}
                <div className="mb-4 sm:hidden">
                    <span className="text-xs font-light uppercase tracking-wider text-white/80 block mb-1">
                        NOTE TITLE
                    </span>
                    <input
                        type="text"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        placeholder="Enter Note Title"
                        className="w-full text-lg font-bold text-cyan-400 bg-gray-900/50 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>

                {error && (<div className="bg-red-900/70 border border-red-500 text-red-300 px-4 py-3 rounded-sm shadow-md mb-4">
                    {error}
                </div>)}

                <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Start writing your notes here..."
                    // Adjusted height and padding for mobile
                    className="w-full h-[60vh] sm:h-[70vh] p-4 sm:p-8 text-base sm:text-lg bg-gray-900/50 border border-gray-700 rounded-xl shadow-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none transition duration-200 leading-relaxed custom-scrollbar"
                />
                
            </main>
        </div>
    );
}

export default SpaceEditor;