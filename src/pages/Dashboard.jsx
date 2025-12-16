// study-sync/src/pages/Dashboard.jsx - FINAL DEFINITIVE FIX APPLIED

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { createSyncSpace, getSyncSpaces, deleteSyncSpace } from '../services/firestore'; 
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx'; 
import SpaceForm from '../components/SpaceForm.jsx'; 

function Dashboard() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    // --- STATE MANAGEMENT ---
    const [newSpaceName, setNewSpaceName] = useState('');
    const [spaces, setSpaces] = useState([]);
    const [loadingSpaces, setLoadingSpaces] = useState(true);
    const [error, setError] = useState('');
    const [isCreatingSpace, setIsCreatingSpace] = useState(false);
    const [deletingId, setDeletingId] = useState(null); 
    const [activeTab, setActiveTab] = useState('view_spaces'); 

    // 🛑 CRITICAL HISTORY CLEANUP FIX
    useEffect(() => {
        // This aggressively cleans the history stack on mount.
        navigate('/', { replace: true });
    }, [navigate]); 
    // ----------------------------
    
    // --- DATA LOADING LOGIC ---
    const loadSpaces = useCallback(async () => {
        if (!currentUser) {
            setLoadingSpaces(false); return;
        }
        setLoadingSpaces(true);
        setError('');
        try {
            const userSpaces = await getSyncSpaces(currentUser.uid);
            setSpaces(userSpaces);
        } catch (err) {
            setError('Failed to fetch Sync Spaces.');
        } finally {
            setLoadingSpaces(false);
        }
    }, [currentUser]);

    useEffect(() => {
        loadSpaces();
    }, [loadSpaces]);

    // --- HANDLERS ---
    
    const handleCreateSpace = async (e) => {
        e.preventDefault();
        if (!newSpaceName.trim() || !currentUser) return;
        setIsCreatingSpace(true);
        setError('');
        try {
            await createSyncSpace(currentUser.uid, newSpaceName.trim());
            setNewSpaceName('');
            await loadSpaces(); 
            setActiveTab('view_spaces'); 
        } catch (err) {
            setError('Failed to create new Sync Space.');
        } finally {
            setIsCreatingSpace(false); 
        }
    };
    
    const handleOpenSpace = (spaceId) => {
        navigate(`/dashboard/${spaceId}`, { replace: true });
    };

    const handleDeleteSpace = async (spaceId, spaceName) => {
        if (!window.confirm(`Are you absolutely sure you want to delete the Sync Space: "${spaceName}"?`)) {
            return;
        }
        setDeletingId(spaceId);
        setError('');
        try {
            await deleteSyncSpace(spaceId); 
            await loadSpaces(); 
        } catch (err) {
            setError('Failed to delete space. Check console for details.');
        } finally {
            setDeletingId(null);
        }
    };

    const displayIdentity = currentUser?.displayName || currentUser?.email || 'USER';

    // --- RENDERING SUB-COMPONENTS (With Animation) ---
    
    const renderSpaceList = () => (
        <>
            {loadingSpaces && <p className="text-cyan-400 mt-6 text-center">Loading notes...</p>}
            
            {!loadingSpaces && spaces.length === 0 && (
                <div className="text-gray-400 p-8 border border-gray-700 rounded-md bg-gray-900/40 shadow-md mt-6 text-center">
                    You don't have any Study Groups yet. Click the **"CREATE A NEW GROUP"** tab to start!
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {spaces.map((space, index) => { // 🛑 NOTE: Added index here for animation delay
                    const isBeingDeleted = deletingId === space.id;
                    return (
                        <div 
                            key={space.id} 
                            // 🛑 ANIMATION CLASSES ADDED HERE: opacity-0 and animate-fade-in-up
                            // Make sure to add the 'fadeInUp' keyframes to tailwind.config.js for this to work!
                            className={`
                                p-5 bg-gray-900/60 border border-gray-800 rounded-lg shadow-xl transition duration-200 
                                opacity-0 animate-fade-in-up
                                ${isBeingDeleted 
                                    ? 'opacity-30' 
                                    : 'hover:border-indigo-500 hover:shadow-cyan-900/30 cursor-pointer'
                                }
                            `}
                            // 🛑 STAGGERED ANIMATION DELAY
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex justify-between items-start">
                                <h3 
                                    onClick={() => !isBeingDeleted && handleOpenSpace(space.id)}
                                    className={`text-lg font-semibold tracking-wide text-cyan-400 mb-2 uppercase truncate 
                                        ${isBeingDeleted ? 'cursor-default' : 'hover:text-cyan-300'}`}
                                >
                                    {space.title || space.name}
                                </h3>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteSpace(space.id, space.name); }}
                                    disabled={isBeingDeleted}
                                    className="text-red-500 hover:text-red-400 text-xl p-1 transition duration-150 disabled:opacity-30"
                                    title={`Delete ${space.name}`}
                                >
                                    &times;
                                </button>
                            </div>
                            <p 
                                onClick={() => !isBeingDeleted && handleOpenSpace(space.id)}
                                className={`text-xs font-light text-gray-400 mt-1 tracking-wider ${isBeingDeleted ? 'cursor-default' : 'hover:text-gray-300'}`}
                            >
                                OPEN GROUP →
                            </p>
                        </div>
                    );
                })}
            </div>
        </>
    );

    // --- Main Component Render ---
    return (
        <div className="min-h-screen text-white font-sans bg-[#0a0a25] [background-image:radial-gradient(ellipse_at_center,_#1f1a33_0%,_#0a0a25_70%)]"> 
            
            <AppHeader
                title="WELCOME BACK"
                subTitle={displayIdentity.toUpperCase()}
                showBackButton={false}
            />
            
            <div className="max-w-7xl mx-auto px-12 py-10">

                {/* Error Banner */}
                {error && (<div className="bg-red-900/70 border border-red-500 text-red-300 px-6 py-4 rounded-sm shadow-md mb-8">{error}</div>)}
                
                {/* Tab Navigation */}
                <div className="flex border-b border-indigo-700/50 mb-10">
                    <button
                        onClick={() => setActiveTab('view_spaces')}
                        className={`px-6 py-3 font-bold tracking-wider text-base transition duration-300 ${
                            activeTab === 'view_spaces'
                                ? 'text-cyan-400 border-b-2 border-cyan-400'
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        YOUR ÉTUDE GROUPS
                    </button>
                    <button
                        onClick={() => setActiveTab('create_space')}
                        className={`px-6 py-3 font-bold tracking-wider text-base transition duration-300 ${
                            activeTab === 'create_space'
                                ? 'text-cyan-400 border-b-2 border-cyan-400'
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        CREATE A NEW GROUP
                    </button>
                </div>
                
                {/* Tab Content */}
                {activeTab === 'view_spaces' && renderSpaceList()}
                
                {activeTab === 'create_space' && (
                    <SpaceForm
                        newSpaceName={newSpaceName}
                        setNewSpaceName={setNewSpaceName}
                        handleCreateSpace={handleCreateSpace}
                        isCreatingSpace={isCreatingSpace}
                    />
                )}

            </div>
        </div>
    );
}

export default Dashboard;