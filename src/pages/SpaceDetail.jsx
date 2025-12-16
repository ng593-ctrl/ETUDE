// study-sync/src/pages/SpaceDetail.jsx - FINAL CODE: BACK button border removed, LOGOUT button removed

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    getSpaceById, 
    getNotes, 
    createNote,
} from '../services/firestore';

// Helper function to create a clean preview snippet
const getPreviewSnippet = (content) => {
    if (!content) return 'No content in this note.';
    let text = content.replace(/#+\s?|[\*\_`\[\]\(\)]/g, '').trim(); 
    
    const maxLength = 60; 
    if (text.length > maxLength) {
        text = text.substring(0, maxLength) + '...';
    }
    return text || 'No content in this note.';
};


function SpaceDetail() {
    const { spaceId } = useParams();
    const navigate = useNavigate();
    // 🛑 Removing 'logout' from useAuth destructuring since it's no longer used in this file
    const { currentUser } = useAuth(); 
    
    // --- STATE MANAGEMENT ---
    const [space, setSpace] = useState(null);
    const [notes, setNotes] = useState([]);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreatingNote, setIsCreatingNote] = useState(false);

    // 🛑 BUTTON STYLING DEFINITION
    const baseButtonStyle = "px-3 py-1 text-sm font-bold tracking-wide rounded-md transition duration-300";
    // 🛑 REMOVED: logoutClasses is no longer needed

    // 🛑 UPDATED: Removed 'border' and associated 'border-gray-700/50' from backClasses
    const backClasses = `${baseButtonStyle} text-gray-400 hover:text-cyan-400`; 
    // ----------------------------

    // ... (DATA LOADING remains the same) ...
    const loadSpaceDetails = useCallback(async () => {
        if (!spaceId || !currentUser?.uid) {
            setLoading(false); 
            return;
        }
        setError(null);
        
        try {
            const spaceData = await getSpaceById(spaceId);

            if (spaceData) {
                if (spaceData.userId !== currentUser.uid) {
                    setError('Access denied to this space.');
                    setLoading(false);
                    return;
                }
                setSpace(spaceData);
            } else {
                setError('Space not found.');
                setLoading(false);
                return;
            }

            const notesList = await getNotes(spaceId);
            setNotes(notesList);

        } catch (err) {
            console.error("Error loading space details and notes:", err);
            setError('Failed to load data for this Sync Space.');
        } finally {
            setLoading(false);
        }
    }, [spaceId, currentUser?.uid]);

    useEffect(() => {
        loadSpaceDetails();
    }, [loadSpaceDetails]);


    // --- HANDLERS (handleLogout is removed, others remain the same) ---
    
    const handleCreateNote = async (e) => {
        e.preventDefault();
        if (!newNoteTitle.trim()) return;

        setIsCreatingNote(true);
        setError(null);

        try {
            const newNoteRef = await createNote(spaceId, currentUser.uid, newNoteTitle.trim());
            navigate(`/editor/${newNoteRef.id}`); 
        } catch (error) {
            console.error("Error creating new note:", error);
            setError('Failed to create note.');
        } finally {
            setIsCreatingNote(false);
        }
    };

    const handleOpenNote = (noteId) => {
        navigate(`/editor/${noteId}`);
    };
    
    const handleGoBack = () => {
        navigate('/dashboard', { replace: true });
    };

    // 🛑 Removed handleLogout function

    // --- RENDER LOGIC ---

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-cyan-400 bg-[#0a0a25]">
                <p className="text-xl">Loading space details...</p>
            </div>
        );
    }
    
    const spaceTitle = space?.name || 'ERROR';

    return (
        <div className="min-h-screen text-white font-sans bg-[#0a0a25] [background-image:radial-gradient(ellipse_at_center,_#1f1a33_0%,_#0a0a25_70%)]">
            
            {/* HEADER (Layout is stable) */}
            <header className="w-full bg-[#0a0a25] border-b border-gray-700/50 shadow-lg">
                <div className="flex flex-nowrap justify-between items-center max-w-7xl mx-auto px-4 py-3 sm:px-6 sm:py-4">
                    
                    {/* LEFT SIDE: BACK Button */}
                    <div className="flex-shrink-0">
                        <button 
                            onClick={handleGoBack} 
                            className={backClasses}
                            title="Go back to the main dashboard"
                        >
                            ← BACK
                        </button>
                    </div>

                    {/* CENTER: Title */}
                    <div className="flex flex-col items-center justify-center flex-grow min-w-0 mx-2 sm:mx-4">
                        <span className="text-xs sm:text-sm font-light uppercase tracking-wider text-white truncate max-w-full">
                            ÉTUDE
                        </span>
                        <h1 className="text-xl sm:text-3xl font-bold uppercase tracking-widest text-cyan-400 text-center truncate max-w-full">
                            {spaceTitle}
                        </h1>
                    </div>
                    
                    {/* 🛑 RIGHT SIDE: Logout button removed. Leaving an empty div to maintain spacing. */}
                    <div className="flex-shrink-0">
                        {/* Empty space where LOGOUT button was */}
                    </div>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-12 py-8">
                
                {error && (
                    <div className="bg-red-900/70 border border-red-500 text-red-300 px-6 py-4 rounded-sm shadow-md mb-8">
                        {error}
                    </div>
                )}
                
                {/* 🛑 NEW: ANIMATED CONTAINER for Create Note Section */}
                <div 
                    className="opacity-0 animate-fade-in-up" 
                    style={{ animationDelay: '50ms' }}
                >
                    {/* --- 1. CREATE A NEW NOTE SECTION --- */}
                    <h2 className="text-xl font-light uppercase tracking-widest text-white/80 mb-4 border-b border-cyan-800/50 pb-2">
                        Create a New Note
                    </h2>
                    <form onSubmit={handleCreateNote} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                        <input
                            type="text"
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            placeholder="Note Title (e.g., 'Chapter 5 Summary')"
                            disabled={isCreatingNote}
                            className="w-full sm:flex-grow p-4 text-lg text-white bg-gray-900/40 border border-gray-800 rounded-lg shadow-inner placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition duration-200"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isCreatingNote || !newNoteTitle.trim()}
                            className={`
                                w-full sm:w-auto px-4 py-2 text-sm font-bold tracking-wide rounded-md shadow-lg transition duration-300
                                ${(isCreatingNote || !newNoteTitle.trim())
                                    ? 'bg-indigo-900/40 text-indigo-400 opacity-60 cursor-not-allowed border border-indigo-900/20'
                                    : 'bg-indigo-700/60 text-white hover:bg-indigo-500/80 border border-indigo-500/50'
                                }
                            `}
                        >
                            {isCreatingNote ? 'CREATING...' : 'CREATE NOTE'}
                        </button>
                    </form>
                </div>

                {/* 🛑 NEW: ANIMATED CONTAINER for Existing Notes Section */}
                <div 
                    className="opacity-0 animate-fade-in-up" 
                    style={{ animationDelay: '150ms' }} // Slightly later delay for a staggered effect
                >
                    {/* --- 2. EXISTING NOTES SECTION --- */}
                    <div className="mt-8">
                        <h2 className="text-xl font-light uppercase tracking-widest text-white/80 mb-6 border-b border-cyan-800/50 pb-2">
                            Existing Notes ({notes.length})
                        </h2>
                        
                        {notes.length === 0 ? (
                            <p className="text-lg text-gray-500 italic mt-6">
                                No notes found in this space. Start by creating one above!
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {notes.map((note, index) => (
                                    <div 
                                        key={note.id} 
                                        className={`
                                            p-4 bg-gray-900/50 border border-cyan-800/50 rounded-lg shadow-xl cursor-pointer 
                                            hover:border-cyan-500/70 transition duration-200 
                                            // Animation applied to each card for a beautiful waterfall effect
                                            opacity-0 animate-fade-in-up
                                        `}
                                        style={{ animationDelay: `${250 + index * 50}ms` }}
                                        onClick={() => handleOpenNote(note.id)}
                                    >
                                        <h3 className="text-lg font-semibold text-white truncate mb-2">
                                            {note.title}
                                        </h3>
                                        
                                        <p className="text-sm text-gray-400 mb-2 truncate h-6 overflow-hidden">
                                            {getPreviewSnippet(note.content)}
                                        </p>
                                        
                                        <p className="text-sm text-cyan-400 font-medium">
                                            Open Note →
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Last Updated: {note.updatedAt ? new Date(note.updatedAt.toDate()).toLocaleTimeString() : 'N/A'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}

export default SpaceDetail;