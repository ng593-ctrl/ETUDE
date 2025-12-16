// study-sync/src/pages/NoteEditor.jsx - FINAL STABLE CODE: Preview Re-enabled

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNoteDetails, saveNoteContent, deleteNote, getSpaceById } from '../services/firestore';

import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css"; 
import "codemirror/lib/codemirror.css"; 
import './NoteEditor.css'; 

import NoteHeader from '../components/NoteHeader.jsx'; 

function NoteEditor() {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    // --- STATE MANAGEMENT ---
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); 
    const [spaceName, setSpaceName] = useState('...');
    const [loading, setLoading] = useState(true);
    // 🛑 Re-adding isPreviewing state
    const [isPreviewing, setIsPreviewing] = useState(false); 
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [error, setError] = useState('');
    
    const mdeRef = useRef(null); 
    const spaceIdRef = useRef(null); 

    // 🛑 Re-adding HANDLER: Toggles the Preview mode using the MDE API
    const togglePreview = useCallback(() => {
        if (mdeRef.current && mdeRef.current.togglePreview) {
            mdeRef.current.togglePreview();
            setIsPreviewing(prev => !prev);
        }
    }, []);

    // 🛑 STABLE OPTIONS: Removing hideIcons to allow the Preview button to show/function
    const mdeOptions = useMemo(() => { 
        return {
            spellChecker: false,
            autofocus: true,
            // 🛑 REMOVED: hideIcons: ["preview"]
            status: ["lines", "words"],
            // STABILITY: Use a large minimum height for the CodeMirror area
            minHeight: "70vh", 
            renderingConfig: {
                singleLineBreaks: false,
                codeSyntaxHighlighting: true,
            },
        };
    }, []);

    // --- DATA LOADING (Same logic as before the preview removal) ---
    const loadNote = useCallback(async () => {
        if (!noteId) {
            setError('No Note ID provided.');
            setLoading(false);
            return;
        }
        try {
            const noteData = await getNoteDetails(noteId);
            if (!noteData || noteData.userId !== currentUser?.uid) {
                setError('Note not found or Access denied.');
                setLoading(false);
                return;
            }
            setTitle(noteData.title || 'Untitled Note');
            setContent(noteData.content || '');
            spaceIdRef.current = noteData.spaceId; 
            if (noteData.spaceId) {
                const spaceData = await getSpaceById(noteData.spaceId);
                setSpaceName(spaceData?.name || 'Unknown Space');
            } else {
                setSpaceName('No Parent Space');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load note data.');
        } finally {
            setLoading(false);
        }
    }, [noteId, currentUser?.uid]);

    useEffect(() => {
        loadNote();
    }, [loadNote]);


    // --- HANDLERS (Same) ---
    const handleSaveNote = useCallback(async () => {
        if (isSaving || !content) return; 
        setIsSaving(true);
        setSaveMessage('Saving...');
        try {
            const payload = { title, content, spaceId: spaceIdRef.current, userId: currentUser.uid, lastModified: new Date() };
            await saveNoteContent(noteId, payload);
            setSaveMessage('Saved!');
            setTimeout(() => setSaveMessage(''), 2000); 
        } catch (error) {
            setSaveMessage('Save Failed!');
        } finally {
            setIsSaving(false);
        }
    }, [noteId, title, content, currentUser?.uid]);

    const handleDeleteNote = useCallback(async () => {
        if (window.confirm(`Are you sure you want to delete the note: "${title}"?`)) {
            try {
                await deleteNote(noteId);
                const destination = spaceIdRef.current ? `/dashboard/${spaceIdRef.current}` : '/dashboard';
                navigate(destination);
            } catch (error) {
                setError('Failed to delete note.');
            }
        }
    }, [noteId, title, navigate]); 

    const handleGoBack = useCallback(() => {
        const destination = spaceIdRef.current ? `/dashboard/${spaceIdRef.current}` : '/dashboard';
        navigate(destination);
    }, [navigate]); 


    // --- RENDER LOGIC ---
    if (loading) { 
        return <div className="min-h-screen flex items-center justify-center text-white bg-[#0a0a25]">Loading Note...</div>;
    }
    if (error && error !== 'Access denied.') { 
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-[#0a0a25]">
                <div className="bg-red-900/70 border border-red-500 text-red-300 px-6 py-4 rounded-sm shadow-md">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white font-sans bg-[#0a0a25] [background-image:radial-gradient(ellipse_at_center,_#1f1a33_0%,_#0a0a25_70%)]">
            
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                <NoteHeader
                    title={title}
                    setTitle={setTitle}
                    spaceName={spaceName}
                    isSaving={isSaving}
                    saveMessage={saveMessage}
                    handleGoBack={handleGoBack}
                    handleSaveNote={handleSaveNote}
                    handleDeleteNote={handleDeleteNote}
                    // 🛑 Re-adding preview props for NoteHeader
                    handleTogglePreview={togglePreview}
                    isPreviewing={isPreviewing} 
                />
            </div>

            {/* CRITICAL FIX: Defines the vertical space below the header (~80px) and adds padding */}
            <div className="max-w-7xl mx-auto px-4 sm:px-12 w-full h-[calc(100vh-80px)] pt-8 pb-8 flex flex-col"> 
                
                {error && (<div className="bg-red-900/70 border border-red-500 text-red-300 px-6 py-4 rounded-sm shadow-md mb-8">{error}</div>)}

                <div 
                    id="editor-wrapper" 
                    // Use h-full to fill the space provided by the parent div
                    className="markdown-editor-container opacity-0 animate-fade-in-up w-full h-full" 
                    style={{ animationDelay: '150ms' }}
                >
                    <SimpleMDE
                        value={content}
                        onChange={setContent} 
                        options={mdeOptions}
                        getMdeInstance={instance => { mdeRef.current = instance; }}
                    />
                </div>
            </div>
        </div>
    );
}

export default NoteEditor;