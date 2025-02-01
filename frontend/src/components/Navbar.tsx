import React from 'react';
import { Zap } from 'lucide-react';

interface NavbarProps {
  token: string;
  setToken: (token: string) => void;
  generateToken: () => void;
  validateToken: () => void;
}

const Navbar = ({ token, setToken, generateToken, validateToken }: NavbarProps) => {
  return (
    <nav className="bg-gradient-to-r from-black to-gray-900 backdrop-blur-md shadow-lg border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="text-purple-400" size={24} />
            <span className="text-white text-xl font-bold">Text Tools</span>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter token"
              className="px-4 py-2 rounded bg-black/60 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-900"
            />
            <button
              onClick={generateToken}
              className="px-4 py-2 bg-gradient-to-r from-gray-900 to-black text-white rounded hover:from-black hover:to-purple-900 transition-all duration-200 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 border border-gray-800"
            >
              Generate Token
            </button>
            <button
              onClick={validateToken}
              className="px-4 py-2 bg-gradient-to-r from-gray-900 to-black text-white rounded hover:from-black hover:to-purple-900 transition-all duration-200 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 border border-gray-800"
            >
              Validate Token
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;