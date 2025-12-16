// study-sync/src/components/SpaceForm.jsx

import React from 'react';

const SpaceForm = ({ newSpaceName, setNewSpaceName, handleCreateSpace, isCreatingSpace }) => {
    return (
        <div className="max-w-md mx-auto p-8 bg-gray-900/50 border border-gray-700 rounded-lg shadow-2xl mt-10">
            <h2 className="text-xl font-light mb-8 uppercase tracking-wider text-cyan-400 text-center">CREATE A NEW GROUP</h2>
            
            <form onSubmit={handleCreateSpace} className="space-y-6">
                <input
                    type="text"
                    placeholder="Group Name..."
                    value={newSpaceName}
                    onChange={(e) => setNewSpaceName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-900/70 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition duration-200"
                    disabled={isCreatingSpace}
                />
                <button
                    type="submit"
                    // Transparent button styling
                    className="w-full py-3 text-cyan-400 border border-cyan-700/50 rounded-md font-bold tracking-wider shadow-lg transition duration-300 hover:text-cyan-300 hover:bg-cyan-900/20 disabled:opacity-50"
                    disabled={isCreatingSpace}
                >
                    {isCreatingSpace ? 'CREATING...' : 'CREATE GROUP'}
                </button>
            </form>
        </div>
    );
};

export default SpaceForm;