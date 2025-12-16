// study-sync/src/components/NoteHeader.jsx - FINAL RESPONSIVE & UNIFORM STYLE

import React from 'react';

// Define the component and destructure all necessary props
function NoteHeader({ 
    title, 
    setTitle, 
    spaceName,
    isSaving,
    saveMessage,
    handleGoBack,
    handleSaveNote,
    handleDeleteNote,
    handleTogglePreview,
    isPreviewing
}) {

    // --- STYLING DEFINITION ---
    
    // 🛑 All action text: Non-bold, Gray color, Cyan hover
    const ACTION_TEXT_COLOR = "text-gray-400 hover:text-cyan-400 transition duration-300 font-normal"; 

    // Base button classes: No bold, transparent background, no border, and small padding.
    const BASE_BUTTON_CLASSES = "p-2 text-sm tracking-wide rounded-md bg-transparent !border-none !shadow-none flex items-center space-x-1 whitespace-nowrap";

    // BACK button style (using the base styles)
    const backClasses = `${BASE_BUTTON_CLASSES} ${ACTION_TEXT_COLOR}`;
    
    // Help/Preview button styling (No extra padding/margin to keep them snug)
    const headerLinkClasses = `text-sm ${ACTION_TEXT_COLOR} mx-1 p-0`; 

    // Save button styling
    const saveClasses = `
        ${BASE_BUTTON_CLASSES}
        ${isSaving 
            ? 'text-indigo-400 opacity-70 cursor-not-allowed font-normal' // Saving state
            : ACTION_TEXT_COLOR // Regular state
        }
    `;
    
    // Delete button styling
    const deleteClasses = `${BASE_BUTTON_CLASSES} ${ACTION_TEXT_COLOR}`;

    // --- HANDLERS ---
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleHelp = () => {
        alert('Help: Bold - (Ctrl/Cmd + B), Italic - (Ctrl/Cmd + I), Heading - (# + title), Save - (Ctrl/Cmd + S)');
    };
    
    // --- RENDER ---
    return (
        <header className="w-full bg-[#0a0a25] border-b border-gray-700/50 shadow-lg sticky top-0 z-10">
            <div className="flex flex-nowrap justify-between items-center max-w-7xl mx-auto px-4 py-3 sm:px-6 sm:py-4">
                
                {/* 1. LEFT SIDE: BACK Button, Help, Preview */}
                {/* min-w-[35%] ensures this side claims space, adjusting based on screen size */}
                <div className="flex items-center space-x-4 flex-shrink-0 min-w-[280px] justify-start">
                    
                    {/* BACK Button */}
                    <button 
                        onClick={handleGoBack} 
                        className={backClasses}
                        title="Go back to the parent space"
                    >
                        ← BACK
                    </button>

                    {/* Help Link */}
                    <button onClick={handleHelp} className={headerLinkClasses}>
                       ? HELP 
                    </button>
                    
                    {/* Preview Button */}
                    <button onClick={handleTogglePreview} className={headerLinkClasses}>
                        {isPreviewing ? '← EDITOR' : 'PREVIEW →'}
                    </button>

                </div>


                {/* 2. CENTER: Space Name and Note Title (Ensuring centering and fit) */}
                <div className="flex flex-col items-center justify-center flex-grow min-w-0 mx-2 sm:mx-4">
                    
                    {/* TOP LINE: SPACE NAME/CONTEXT */}
                    <span className="text-xs sm:text-sm font-light uppercase tracking-wider text-white truncate max-w-full">
                        {spaceName}:
                    </span>
                    
                    {/* BOTTOM LINE: NOTE TITLE (Critical for responsiveness) */}
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        // w-full and min-w-0 ensures the title input shrinks elegantly, and truncate prevents overflow.
                        className="text-xl sm:text-3xl font-bold uppercase tracking-widest text-cyan-400 text-center bg-transparent focus:outline-none focus:border-b focus:border-cyan-500 transition duration-200 w-full min-w-0 truncate"
                        title="Note Title (Click to edit)"
                    />
                    
                </div>
                
                {/* 3. RIGHT SIDE: Save and Delete Buttons */}
                {/* min-w-[35%] ensures this side balances the left side */}
                <div className="flex items-center space-x-3 flex-shrink-0 min-w-[280px] justify-end">
                    
                    {/* Save Button */}
                    <button
                        onClick={handleSaveNote}
                        disabled={isSaving}
                        className={saveClasses}
                        title={saveMessage || "Save Note"}
                    >
                        {isSaving ? saveMessage : '💾 SAVE NOTE'}
                    </button>
                    
                    {/* Delete Button */}
                    <button
                        onClick={handleDeleteNote}
                        className={deleteClasses}
                        title="Delete Note"
                    >
                        🗑️ DELETE
                    </button>
                </div>
            </div>
        </header>
    );
}

export default NoteHeader;