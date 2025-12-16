// study-sync/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth'; // Import functions from Firebase Auth
import { auth } from '../firebase'; // Import the initialized auth object

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Authentication Functions ---
  
  // 1. Signup Function
  function signup(email, password) {
    // This function calls the Firebase service with the imported 'auth' object
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // 2. Login Function
  function login(email, password) {
    // This function calls the Firebase service with the imported 'auth' object
    return signInWithEmailAndPassword(auth, email, password);
  }

  // 3. Logout Function
  function logout() {
    return signOut(auth);
  }
  
  // --- Effect to Track User State ---
  useEffect(() => {
    // This listener checks for auth state changes (login, logout, refresh)
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    // Cleanup function runs when the component unmounts
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
  };

  // Only render the children if the loading is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
// Save this file.