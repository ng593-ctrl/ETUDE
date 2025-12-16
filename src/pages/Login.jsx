// study-sync/src/pages/Login.jsx - WITH RECENT ACCOUNTS FEATURE

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { auth } from '../firebase'; 

// Custom font style for the title
const TITLE_STYLE = { fontFamily: "'Didot', recoleta" };

// --- LOCAL STORAGE HELPERS for Recent Logins ---
const MAX_RECENT_ACCOUNTS = 3; 
const LS_KEY = 'recentLogins';

// Function to retrieve the list of recent email addresses
const getRecentEmails = () => {
    try {
        const stored = localStorage.getItem(LS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Could not read recent logins:", e);
        return [];
    }
};

// Function to save a successful email login
const addRecentEmail = (email) => {
    try {
        let emails = getRecentEmails().filter(e => e !== email);
        emails.unshift(email); // Add new email to the start
        emails = emails.slice(0, MAX_RECENT_ACCOUNTS); // Keep only the max number
        localStorage.setItem(LS_KEY, JSON.stringify(emails));
    } catch (e) {
        console.error("Could not save recent login:", e);
    }
};

function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); 
  const [error, setError] = useState('');
  const [recentEmails, setRecentEmails] = useState([]); // State to hold recent emails
  const navigate = useNavigate(); 

  // Load recent emails on component mount and set the last one as default
  useEffect(() => {
    const emails = getRecentEmails();
    setRecentEmails(emails);
    if (emails.length > 0) {
        setEmail(emails[0]); // Autofill with the most recent email
    }
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    
    if (!isLogin && (!username.trim() || username.trim().length < 3)) {
      setError("Please provide a username of at least 3 characters.");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: username.trim()
        });
      }
      
      // 🛑 Success Action: Save the successful email to local storage
      addRecentEmail(email); 
      navigate('/dashboard'); 

    } catch (err) {
      console.error(err);
      let errorMessage = "Failed to " + (isLogin ? "log in" : "sign up") + ". Please check your credentials.";
      if (err.code === 'auth/weak-password') {
        errorMessage = "Password must be at least 6 characters long.";
      } else if (err.code === 'auth/invalid-email' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = isLogin 
          ? "Invalid email or password." 
          : "Invalid email format or already in use.";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "Access temporarily blocked due to too many failed attempts.";
      }
      setError(errorMessage);
    }
  };

  // Renders either a standard input or a select/dropdown if multiple accounts exist
  const renderEmailInput = () => {
    // Only show the select dropdown if logging in AND there are multiple recent emails
    if (recentEmails.length > 1 && isLogin) {
      return (
        <div className="relative">
          <select
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            // Apply your input styling to the select element
            className="w-full px-5 py-3 border border-gray-600 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition duration-200 appearance-none pr-10"
          >
            {recentEmails.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow to maintain aesthetic */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.516 7.548c.436-.446 1.043-.483 1.404-.008l4.48 4.606 4.48-4.606c.36-.31.968-.31 1.393.008.425.31.439.75.035 1.053l-5.12 5.25a1.114 1.114 0 01-1.61 0l-5.12-5.25c-.404-.303-.39-.743.035-1.053z"/>
            </svg>
          </div>
        </div>
      );
    }
    
    // Standard input for sign up or if one or zero recent accounts
    return (
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-5 py-3 border border-gray-600 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition duration-200"
      />
    );
  };
  
  return (
    // Full Screen Container: Using the deep color background
    <div 
        className="min-h-screen flex flex-col items-center justify-center p-8 text-white font-sans 
                   bg-[#0a0a25] 
                   [background-image:radial-gradient(ellipse_at_center,_#1f1a33_0%,_#0a0a25_70%)]"
    >
      
      {/* 2. Top Branding Section (Centered and Dramatically Prominent) */}
      <div className="text-center mb-10">
        
        {/* Title and Emojis */}
        <h1 
          className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-2 leading-none"
          style={TITLE_STYLE} // Apply the custom font here
        >
          
          ÉTUDE
        </h1>
        
        {/* Tagline */}
        <p className="text-3xl font-light text-indigo-300/80 tracking-wide mt-2">
         Where Study Becomes Art.
        </p>
      </div>

      {/* 3. Form Card (Dark, Elevated, Centered) */}
      <div className="w-full max-w-sm p-10 bg-gray-900/50 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-sm">
        
        <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-widest text-gray-400">
          {isLogin ? 'LOG IN' : 'CREATE ACCOUNT'}
        </h2>
        
        {error && (<div className="bg-red-900/70 p-3 rounded-md text-sm text-center border border-red-500 mb-6">{error}</div>)}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
            {/* Username Input (Conditional) */}
            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
                className="w-full px-5 py-3 border border-gray-600 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition duration-200"
              />
            )}
            
            {/* 🛑 Dynamic Email Input/Select Field 🛑 */}
            {renderEmailInput()}
            
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 border border-gray-600 rounded-md bg-gray-800/70 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition duration-200"
            />
            
            <button
              type="submit"
              className="w-full py-3.5 mt-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-md text-xl font-extrabold tracking-wider shadow-lg hover:opacity-90 transition duration-300"
            >
              {isLogin ? 'BEGIN' : 'CREATE ACCOUNT'}
            </button>
        </form>
        
        <p className="text-center text-gray-400 pt-6 text-sm">
          {isLogin ? "Need an account?" : "Already have an account?"}
          <button
            onClick={() => { setIsLogin(!isLogin); setEmail(''); setPassword(''); setError(''); }} // Reset email and password when switching mode
            type="button" 
            className="text-cyan-400 ml-2 font-medium hover:text-cyan-300 transition duration-200 uppercase"
          >
            {isLogin ? 'SIGN UP' : 'LOG IN'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;