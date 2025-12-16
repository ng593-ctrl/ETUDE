// study-sync/src/services/firestore.js - CONSOLIDATED & FIXED
import { db } from '../firebase';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    addDoc,
    doc,        
    getDoc,     
    updateDoc,  
    deleteDoc,  
    serverTimestamp 
} from 'firebase/firestore'; // 🛑 FIXED: Consolidated all necessary Firebase imports here

// Collection references
// 🛑 IMPORTANT: Assuming your Firestore collection names are 'syncSpaces' and 'notes'
const syncSpacesCollection = collection(db, 'syncSpaces');
const notesCollection = collection(db, 'notes'); 


// -------------------------------------------------------------
// --- Sync Space (Folder) Management ---
// -------------------------------------------------------------

export const createSyncSpace = async (userId, name) => {
    if (!userId) {
        throw new Error("User must be logged in to create a Sync Space.");
    }
    return await addDoc(syncSpacesCollection, { 
        userId: userId,
        name: name,
        createdAt: serverTimestamp(),
    });
};

export const getSyncSpaces = async (userId) => {
    if (!userId) {
        return []; 
    }
    const q = query(syncSpacesCollection, where('userId', '==', userId), orderBy('createdAt', 'asc')); 
    const querySnapshot = await getDocs(q);
    
    const spaces = [];
    querySnapshot.forEach((doc) => {
        spaces.push({ id: doc.id, ...doc.data() });
    });
    return spaces;
};

/**
 * ✅ CONSOLIDATED FUNCTION: Fetches the details for a specific Sync Space.
 * Used by SpaceDetail.jsx and NoteEditor.jsx.
 */
export const getSpaceById = async (spaceId) => {
    if (!spaceId) return null;
    
    try {
        const spaceDocRef = doc(db, 'syncSpaces', spaceId); 
        const spaceDoc = await getDoc(spaceDocRef);

        if (spaceDoc.exists()) {
            return {
                id: spaceDoc.id,
                ...spaceDoc.data()
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching space by ID:", error);
        throw new Error("Failed to fetch space details.");
    }
};


/**
 * EXPORTED FUNCTION: Deletes a Sync Space document by its ID AND all associated notes.
 */
export const deleteSyncSpace = async (spaceId) => { 
    if (!spaceId) {
        throw new Error("Space ID is required for deletion.");
    }
    try {
        const spaceDocRef = doc(db, 'syncSpaces', spaceId);
        
        // 1. Find all associated notes
        const notesQuery = query(notesCollection, where('spaceId', '==', spaceId));
        const notesSnapshot = await getDocs(notesQuery);

        // 2. Create deletion promises for all notes
        const deletePromises = [];
        notesSnapshot.forEach((noteDoc) => {
            deletePromises.push(deleteDoc(noteDoc.ref));
        });
        
        // Wait for all notes to be deleted
        await Promise.all(deletePromises);

        // 3. Delete the Sync Space itself
        await deleteDoc(spaceDocRef);
        
    } catch (error) {
        console.error("Error deleting space and notes:", error);
        throw new Error("Failed to delete Sync Space and its contents.");
    }
};


// -------------------------------------------------------------
// --- Notes (Content) Management ---
// -------------------------------------------------------------

export const createNote = async (spaceId, userId, title) => {
    return await addDoc(notesCollection, {
        spaceId: spaceId,
        userId: userId,
        title: title,
        content: '', // Initialize content as empty string
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

export const getNotes = async (spaceId) => {
    if (!spaceId) {
        return []; 
    }
    const q = query(notesCollection, where('spaceId', '==', spaceId), orderBy('updatedAt', 'desc')); 
    const querySnapshot = await getDocs(q);
    
    const notes = [];
    querySnapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() });
    });
    return notes;
};


/**
 * Fetches all details (including content) of a single note.
 */
export const getNoteDetails = async (noteId) => {
    if (!noteId) return null;
    
    const noteRef = doc(db, 'notes', noteId);
    const docSnap = await getDoc(noteRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
};


/**
 * Saves/updates the content, title, and timestamp of a note.
 */
export const saveNoteContent = async (noteId, updates) => {
    if (!noteId) {
        throw new Error("Note ID is required to save content.");
    }
    const noteRef = doc(db, 'notes', noteId);

    // Ensure we always update the timestamp and merge any additional updates
    await updateDoc(noteRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
};


export const deleteNote = async (noteId) => {
    const noteRef = doc(db, 'notes', noteId);
    await deleteDoc(noteRef);
};