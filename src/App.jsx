// THE STUDY SYNC/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 

// Components (All local imports now include the .jsx extension)
import Login from './pages/Login.jsx'; 
import Dashboard from './pages/Dashboard.jsx'; 
import PrivateRoute from './components/PrivateRoute.jsx'; 
import SpaceDetail from './pages/SpaceDetail.jsx'; 
import NoteEditor from './pages/NoteEditor.jsx';

function App() {
  // const { currentUser } = useAuth(); // Not strictly needed here, but doesn't hurt.

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />

      {/* Private Route Wrapper (All nested routes are protected) */}
      <Route path="/" element={<PrivateRoute />}>
        
        {/* PATH: / (Index route points to the Dashboard) */}
        <Route index element={<Dashboard />} /> 
        
        {/* PATH: /dashboard (Explicit route, though index often suffices) */}
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* PATH: /dashboard/:spaceId (Space Detail page) */}
        <Route path="dashboard/:spaceId" element={<SpaceDetail />} /> 
        
        {/* PATH: /editor/:noteId (Note Editor page) */}
        <Route path="editor/:noteId" element={<NoteEditor />} />
        
      </Route>
      
      {/* Fallback route: Redirects unauthorized attempts to the Login screen */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;